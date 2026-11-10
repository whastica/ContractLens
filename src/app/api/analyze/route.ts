import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { catchApiError, apiError } from "@/lib/api";
import { logger } from "@/lib/logger";
import { clerkIdToUuid } from "@/lib/supabase";
import { runAnalysisPipeline } from "@/services/ai/analysis.service";
import { isValidLegalArea } from "@/services/ai/pipeline-resolver";
import {
  createContract,
  updateContractStatus,
  getContractById,
} from "@/services/db/contracts.service";
import { createAnalysis } from "@/services/db/analyses.service";
import { saveClauses } from "@/services/db/clauses.service";
import { saveFindings, saveSources } from "@/services/db/findings.service";
import { useMockDB } from "@/lib/env";
import type { LegalArea } from "@/types";

export async function POST(request: NextRequest) {
  return catchApiError(async () => {
    const { userId } = await requireAuth();
    const dbUserId = clerkIdToUuid(userId);

    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(dbUserId ?? ip);
    if (!rateLimit.allowed) {
      return apiError("RATE_LIMITED", "Límite de solicitudes alcanzado. Intenta de nuevo en un minuto.");
    }

    const body = await request.json();
    const { contractId, text, contractType, area: rawArea } = body as {
      contractId?: string;
      text?: string;
      contractType?: string;
      area?: string;
    };

    // Validate and normalize area
    const area: LegalArea = isValidLegalArea(rawArea) ? rawArea : "general";

    if (!text || typeof text !== "string" || text.length < 100) {
      return apiError("BAD_REQUEST", "El texto del contrato debe tener al menos 100 caracteres.");
    }

    // If contractId provided, verify it belongs to user
    let contract: Awaited<ReturnType<typeof getContractById>> = null;
    if (contractId) {
      contract = await getContractById(contractId, dbUserId);
      if (!contract) {
        return apiError("NOT_FOUND", "Contrato no encontrado.");
      }
    }

    const encoder = new TextEncoder();
    const startTime = Date.now();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Run the analysis pipeline with area
          const result = await runAnalysisPipeline(text, {
            onProgress: (phase, message) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "progress", phase, message })}\n\n`)
              );
            },
          }, { contractType, area });

          const latencyMs = Date.now() - startTime;

          // Persist results if not using mock DB
          if (!useMockDB) {
            // Create or update contract
            if (!contract) {
              contract = await createContract(dbUserId, {
                name: `Contrato - ${new Date().toLocaleDateString("es-CO")}`,
                fileName: "uploaded",
                fileType: "pdf",
                fileSizeBytes: text.length,
                rawText: text,
                detectedType: result.classification.type,
                confirmedType: contractType ?? undefined,
                area,
              });
            } else {
              await updateContractStatus(contract.id, dbUserId, "completed");
            }

            // Save analysis
            const analysis = await createAnalysis(
              dbUserId,
              contract.id,
              result,
              undefined,
              latencyMs,
              area
            );

            // Save clauses
            await saveClauses(dbUserId, analysis.id, contract.id, result.clauses);

            // Save findings
            const savedFindings = await saveFindings(
              dbUserId,
              analysis.id,
              contract.id,
              result.findings
            );

            // Save legal grounding sources
            for (const grounding of result.legalGrounding) {
              const relatedFindings = savedFindings.filter(
                (f) => f.category === grounding.finding_category
              );
              for (const finding of relatedFindings) {
                await saveSources(dbUserId, finding.id, grounding.sources);
              }
            }

            // Send result with full data for the frontend to display
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "result",
                  data: {
                    id: analysis.id,
                    contractId: contract.id,
                    classification: result.classification,
                    structure: result.structure,
                    clauses: result.clauses,
                    findings: result.findings,
                    legalGrounding: result.legalGrounding,
                    latencyMs,
                  },
                })}\n\n`
              )
            );
          } else {
            // Mock mode - just return the analysis result
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "result",
                  data: {
                    classification: result.classification,
                    structure: result.structure,
                    clauses: result.clauses,
                    findings: result.findings,
                    legalGrounding: result.legalGrounding,
                    latencyMs,
                  },
                })}\n\n`
              )
            );
          }

          controller.close();
        } catch (error) {
          logger.error("Analysis pipeline error", { error: String(error) });
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                code: "PIPELINE_ERROR",
                message: "Error durante el análisis del contrato.",
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  });
}

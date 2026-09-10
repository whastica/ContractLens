import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { catchApiError, apiResponse, apiError } from "@/lib/api";
import { logger } from "@/lib/logger";
import { runAnalysisPipeline } from "@/services/ai/analysis.service";
import {
  createContract,
  updateContractStatus,
  getContractById,
} from "@/services/db/contracts.service";
import { createAnalysis } from "@/services/db/analyses.service";
import { saveClauses } from "@/services/db/clauses.service";
import { saveFindings, saveSources } from "@/services/db/findings.service";
import { useMockDB } from "@/lib/env";

export async function POST(request: NextRequest) {
  return catchApiError(async () => {
    const { userId } = await requireAuth();

    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(userId ?? ip);
    if (!rateLimit.allowed) {
      return apiError("RATE_LIMITED", "Límite de solicitudes alcanzado. Intenta de nuevo en un minuto.");
    }

    const body = await request.json();
    const { contractId, text } = body as { contractId?: string; text?: string };

    if (!text || typeof text !== "string" || text.length < 100) {
      return apiError("BAD_REQUEST", "El texto del contrato debe tener al menos 100 caracteres.");
    }

    // If contractId provided, verify it belongs to user
    let contract = null;
    if (contractId) {
      contract = await getContractById(contractId, userId);
      if (!contract) {
        return apiError("NOT_FOUND", "Contrato no encontrado.");
      }
    }

    const encoder = new TextEncoder();
    const startTime = Date.now();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Run the analysis pipeline
          const result = await runAnalysisPipeline(text, {
            onProgress: (phase, message) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "progress", phase, message })}\n\n`)
              );
            },
          });

          const latencyMs = Date.now() - startTime;

          // Persist results if not using mock DB
          if (!useMockDB) {
            // Create or update contract
            if (!contract) {
              contract = await createContract(userId, {
                name: `Contrato - ${new Date().toLocaleDateString("es-CO")}`,
                fileName: "uploaded",
                fileType: "pdf",
                fileSizeBytes: text.length,
                rawText: text,
                detectedType: result.classification.type,
              });
            } else {
              await updateContractStatus(contract.id, userId, "completed");
            }

            // Save analysis
            const analysis = await createAnalysis(
              userId,
              contract.id,
              result,
              undefined,
              latencyMs
            );

            // Save clauses
            await saveClauses(userId, analysis.id, contract.id, result.clauses);

            // Save findings
            const savedFindings = await saveFindings(
              userId,
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
                await saveSources(userId, finding.id, grounding.sources);
              }
            }

            // Send result with contract and analysis IDs
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "result",
                  data: {
                    id: analysis.id,
                    contractId: contract.id,
                    classification: result.classification,
                    structure: result.structure,
                    clausesCount: result.clauses.length,
                    findingsCount: result.findings.length,
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

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  });
}

import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { catchApiError, apiResponse, apiError } from "@/lib/api";
import { getAnalysesByUser, getAnalysisById } from "@/services/db/analyses.service";
import { getClausesByAnalysis } from "@/services/db/clauses.service";
import { getFindingsByAnalysis, getSourcesByFinding } from "@/services/db/findings.service";
import { useMockDB } from "@/lib/env";

export async function GET(request: NextRequest) {
  return catchApiError(async () => {
    const { userId } = await requireAuth();

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (useMockDB) {
      return apiResponse([]);
    }

    // Get specific analysis
    if (id) {
      const analysis = await getAnalysisById(id, userId);
      if (!analysis) {
        return apiError("NOT_FOUND", "Análisis no encontrado.");
      }

      const [clauses, findings] = await Promise.all([
        getClausesByAnalysis(id, userId),
        getFindingsByAnalysis(id, userId),
      ]);

      // Get sources for each finding
      const findingsWithSources = await Promise.all(
        findings.map(async (f) => {
          const sources = await getSourcesByFinding(f.id, userId);
          return { ...f, sources };
        })
      );

      return apiResponse({
        ...analysis,
        clauses,
        findings: findingsWithSources,
      });
    }

    // List all analyses
    const analyses = await getAnalysesByUser(userId);
    return apiResponse(analyses);
  });
}

import { getSupabaseServer, type DbAnalysis } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import type { PipelineResult } from "@/services/ai/analysis.service";

export async function createAnalysis(
  userId: string,
  contractId: string,
  result: PipelineResult,
  tokensUsed?: number,
  latencyMs?: number
): Promise<DbAnalysis> {
  const stop = logger.time("createAnalysis");
  const supabase = getSupabaseServer();

  const healthCheck = countFindings(result.findings);

  const { data: analysis, error } = await supabase
    .from("analyses")
    .insert({
      user_id: userId,
      contract_id: contractId,
      status: "completed",
      contract_type: result.classification.type,
      parties: result.structure.parties,
      duration: result.structure.duration,
      total_value: result.structure.totalValue,
      payment_terms: result.structure.paymentTerms,
      renewal_terms: result.structure.renewalTerms,
      termination_terms: result.structure.terminationTerms,
      jurisdiction: result.structure.jurisdiction,
      key_obligations: result.structure.keyObligations,
      key_findings: result.findings.map((f) => ({
        severity: f.severity,
        title: f.title,
        category: f.category,
      })),
      critical_count: healthCheck.critical,
      review_count: healthCheck.review,
      ok_count: healthCheck.ok,
      undetermined_count: healthCheck.undetermined,
      tokens_used: tokensUsed ?? null,
      latency_ms: latencyMs ?? null,
    })
    .select()
    .single();

  if (error) {
    logger.error("Failed to create analysis", { error: error.message });
    throw new Error(`Failed to create analysis: ${error.message}`);
  }

  stop();
  return analysis as DbAnalysis;
}

export async function updateAnalysisStatus(
  analysisId: string,
  userId: string,
  status: DbAnalysis["status"]
): Promise<void> {
  const supabase = getSupabaseServer();

  const { error } = await supabase
    .from("analyses")
    .update({ status })
    .eq("id", analysisId)
    .eq("user_id", userId);

  if (error) {
    logger.error("Failed to update analysis status", { error: error.message });
    throw new Error(`Failed to update analysis: ${error.message}`);
  }
}

export async function getAnalysisById(
  analysisId: string,
  userId: string
): Promise<DbAnalysis | null> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    logger.error("Failed to get analysis", { error: error.message });
    throw new Error(`Failed to get analysis: ${error.message}`);
  }

  return data as DbAnalysis;
}

export async function getAnalysesByUser(
  userId: string,
  limit = 50
): Promise<DbAnalysis[]> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("analyses")
    .select("*, contracts(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    logger.error("Failed to get analyses", { error: error.message });
    throw new Error(`Failed to get analyses: ${error.message}`);
  }

  return (data ?? []) as DbAnalysis[];
}

export async function getAnalysesByContract(
  contractId: string,
  userId: string
): Promise<DbAnalysis[]> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("contract_id", contractId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Failed to get analyses by contract", { error: error.message });
    throw new Error(`Failed to get analyses: ${error.message}`);
  }

  return (data ?? []) as DbAnalysis[];
}

function countFindings(findings: Array<{ severity: string }>) {
  let critical = 0;
  let review = 0;
  let ok = 0;
  let undetermined = 0;

  for (const f of findings) {
    switch (f.severity) {
      case "critical": critical++; break;
      case "review": review++; break;
      case "ok": ok++; break;
      default: undetermined++; break;
    }
  }

  return { critical, review, ok, undetermined };
}

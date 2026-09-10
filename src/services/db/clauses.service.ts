import { getSupabaseServer, type DbClause } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export async function saveClauses(
  userId: string,
  analysisId: string,
  contractId: string,
  clauses: Array<{
    clauseNumber?: string | null;
    title: string;
    category?: string | null;
    rawText: string;
    summary?: string | null;
  }>
): Promise<DbClause[]> {
  const stop = logger.time("saveClauses");
  const supabase = getSupabaseServer();

  if (clauses.length === 0) {
    stop();
    return [];
  }

  const records = clauses.map((c) => ({
    user_id: userId,
    analysis_id: analysisId,
    contract_id: contractId,
    clause_number: c.clauseNumber ?? null,
    title: c.title,
    category: c.category ?? null,
    raw_text: c.rawText,
    summary: c.summary ?? null,
  }));

  const { data, error } = await supabase
    .from("clauses")
    .insert(records)
    .select();

  if (error) {
    logger.error("Failed to save clauses", { error: error.message });
    throw new Error(`Failed to save clauses: ${error.message}`);
  }

  stop();
  return (data ?? []) as DbClause[];
}

export async function getClausesByAnalysis(
  analysisId: string,
  userId: string
): Promise<DbClause[]> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("clauses")
    .select("*")
    .eq("analysis_id", analysisId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Failed to get clauses", { error: error.message });
    throw new Error(`Failed to get clauses: ${error.message}`);
  }

  return (data ?? []) as DbClause[];
}

export async function getClausesByContract(
  contractId: string,
  userId: string
): Promise<DbClause[]> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("clauses")
    .select("*")
    .eq("contract_id", contractId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Failed to get clauses by contract", { error: error.message });
    throw new Error(`Failed to get clauses: ${error.message}`);
  }

  return (data ?? []) as DbClause[];
}

import { getSupabaseServer, type DbFinding, type DbSource } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export async function saveFindings(
  userId: string,
  analysisId: string,
  contractId: string,
  findings: Array<{
    severity: string;
    category: string;
    title: string;
    evidenceText: string;
    pageNumber?: number | null;
    clauseReference?: string | null;
    explanation: string;
    whyItMatters?: string | null;
    possibleImpact?: string | null;
    recommendation?: string | null;
    legalReference?: string | null;
    confidence?: number | null;
  }>
): Promise<DbFinding[]> {
  const stop = logger.time("saveFindings");
  const supabase = getSupabaseServer();

  if (findings.length === 0) {
    stop();
    return [];
  }

  const records = findings.map((f) => ({
    user_id: userId,
    analysis_id: analysisId,
    contract_id: contractId,
    severity: f.severity,
    category: f.category,
    title: f.title,
    evidence_text: f.evidenceText,
    page_number: f.pageNumber ?? null,
    clause_reference: f.clauseReference ?? null,
    explanation: f.explanation,
    why_it_matters: f.whyItMatters ?? null,
    possible_impact: f.possibleImpact ?? null,
    recommendation: f.recommendation ?? null,
    legal_reference: f.legalReference ?? null,
    confidence: f.confidence ?? null,
  }));

  const { data, error } = await supabase
    .from("findings")
    .insert(records)
    .select();

  if (error) {
    logger.error("Failed to save findings", { error: error.message });
    throw new Error(`Failed to save findings: ${error.message}`);
  }

  stop();
  return (data ?? []) as DbFinding[];
}

export async function getFindingsByAnalysis(
  analysisId: string,
  userId: string
): Promise<DbFinding[]> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("findings")
    .select("*")
    .eq("analysis_id", analysisId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Failed to get findings", { error: error.message });
    throw new Error(`Failed to get findings: ${error.message}`);
  }

  return (data ?? []) as DbFinding[];
}

export async function getFindingsBySeverity(
  analysisId: string,
  userId: string,
  severity: string
): Promise<DbFinding[]> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("findings")
    .select("*")
    .eq("analysis_id", analysisId)
    .eq("user_id", userId)
    .eq("severity", severity)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Failed to get findings by severity", { error: error.message });
    throw new Error(`Failed to get findings: ${error.message}`);
  }

  return (data ?? []) as DbFinding[];
}

export async function saveSources(
  userId: string,
  findingId: string,
  sources: Array<{
    sourceType: string;
    name: string;
    description?: string | null;
    url?: string | null;
  }>
): Promise<DbSource[]> {
  const stop = logger.time("saveSources");
  const supabase = getSupabaseServer();

  if (sources.length === 0) {
    stop();
    return [];
  }

  const records = sources.map((s) => ({
    user_id: userId,
    finding_id: findingId,
    source_type: s.sourceType,
    name: s.name,
    description: s.description ?? null,
    url: s.url ?? null,
  }));

  const { data, error } = await supabase
    .from("sources")
    .insert(records)
    .select();

  if (error) {
    logger.error("Failed to save sources", { error: error.message });
    throw new Error(`Failed to save sources: ${error.message}`);
  }

  stop();
  return (data ?? []) as DbSource[];
}

export async function getSourcesByFinding(
  findingId: string,
  userId: string
): Promise<DbSource[]> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("finding_id", findingId)
    .eq("user_id", userId);

  if (error) {
    logger.error("Failed to get sources", { error: error.message });
    throw new Error(`Failed to get sources: ${error.message}`);
  }

  return (data ?? []) as DbSource[];
}

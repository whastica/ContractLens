import { getSupabaseServer, type DbFinding, type DbSource } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import type { FindingCategory, FindingSeverity } from "@/types";

// Categorías válidas en la DB (CHECK constraint)
const VALID_CATEGORIES: ReadonlySet<string> = new Set([
  "terminacion_anticipada",
  "penalidad",
  "confidencialidad",
  "propiedad_intelectual",
  "pago",
  "obligaciones",
  "responsabilidad",
  "garantia",
  "seguro",
  "ley_aplicable",
  "jurisdiccion",
  "otro",
]);

// Severidades válidas en la DB
const VALID_SEVERITIES: ReadonlySet<string> = new Set([
  "critical",
  "review",
  "ok",
  "undetermined",
]);

// Mapa de corrección para categorías inválidas que la IA suele generar
const CATEGORY_FIXES: Record<string, FindingCategory> = {
  // Variaciones en español
  penalidades: "penalidad",
  terminacion: "terminacion_anticipada",
  indemnizacion: "responsabilidad",
  garantias: "garantia",
  seguros: "seguro",
  leyes: "ley_aplicable",
  jurisdicciones: "jurisdiccion",
  obligacion: "obligaciones",
  propiedad: "propiedad_intelectual",
  confidencial: "confidencialidad",
  // Inglés
  termination: "terminacion_anticipada",
  termination_clause: "terminacion_anticipada",
  early_termination: "terminacion_anticipada",
  penalty: "penalidad",
  penalties: "penalidad",
  late_payment: "pago",
  payment: "pago",
  confidentiality: "confidencialidad",
  confidentiality_clause: "confidencialidad",
  intellectual_property: "propiedad_intelectual",
  ip: "propiedad_intelectual",
  obligations: "obligaciones",
  liability: "responsabilidad",
  indemnity: "responsabilidad",
  warranty: "garantia",
  warranties: "garantia",
  insurance: "seguro",
  governing_law: "ley_aplicable",
  applicable_law: "ley_aplicable",
  jurisdiction: "jurisdiccion",
  arbitration: "jurisdiccion",
  force_majeure: "otro",
  limitations: "responsabilidad",
  limitation_of_liability: "responsabilidad",
  // Otros patrones comunes
  pago_anticipado: "pago",
  pago_tardio: "pago",
  incumplimiento: "obligaciones",
  rescision: "terminacion_anticipada",
  resolucion: "terminacion_anticipada",
  nulidad: "otro",
};

// Mapa de corrección para severidades
const SEVERITY_FIXES: Record<string, FindingSeverity> = {
  high: "critical",
  medium: "review",
  low: "ok",
  unknown: "undetermined",
  warning: "review",
  info: "ok",
  critical_high: "critical",
  critical_medium: "review",
  critical_low: "ok",
};

function normalizeCategory(raw: string): FindingCategory {
  if (VALID_CATEGORIES.has(raw)) {
    return raw as FindingCategory;
  }

  const fixed = CATEGORY_FIXES[raw.toLowerCase()];
  if (fixed) {
    logger.warn("Normalized invalid finding category", {
      original: raw,
      normalized: fixed,
    });
    return fixed;
  }

  logger.warn("Falling back category to 'otro'", { original: raw });
  return "otro";
}

function normalizeSeverity(raw: string): FindingSeverity {
  if (VALID_SEVERITIES.has(raw)) {
    return raw as FindingSeverity;
  }

  const fixed = SEVERITY_FIXES[raw.toLowerCase()];
  if (fixed) {
    logger.warn("Normalized invalid finding severity", {
      original: raw,
      normalized: fixed,
    });
    return fixed;
  }

  logger.warn("Falling back severity to 'undetermined'", { original: raw });
  return "undetermined";
}

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
    severity: normalizeSeverity(f.severity),
    category: normalizeCategory(f.category),
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

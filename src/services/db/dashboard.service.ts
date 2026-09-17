import { getSupabaseServer, type DbContract, type DbAnalysis } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export interface DashboardData {
  totalContracts: number;
  totalAnalyses: number;
  criticalFindings: number;
  reviewFindings: number;
  okFindings: number;
  recentAnalyses: Array<{
    id: string;
    contractName: string;
    contractType: string | null;
    criticalCount: number;
    reviewCount: number;
    createdAt: string;
  }>;
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const stop = logger.time("getDashboardData");
  const supabase = getSupabaseServer();

  const [contractsResult, analysesResult, recentResult] = await Promise.all([
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("analyses")
      .select("id, critical_count, review_count, ok_count", { count: "exact" })
      .eq("user_id", userId),
    supabase
      .from("analyses")
      .select("id, contract_type, critical_count, review_count, created_at, contracts(name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (contractsResult.error) {
    logger.error("Failed to count contracts", { error: contractsResult.error.message });
  }
  if (analysesResult.error) {
    logger.error("Failed to get analyses stats", { error: analysesResult.error.message });
  }
  if (recentResult.error) {
    logger.error("Failed to get recent analyses", { error: recentResult.error.message });
  }

  const analyses = (analysesResult.data ?? []) as Array<{
    critical_count: number;
    review_count: number;
    ok_count: number;
  }>;

  let criticalFindings = 0;
  let reviewFindings = 0;
  let okFindings = 0;

  for (const a of analyses) {
    criticalFindings += a.critical_count ?? 0;
    reviewFindings += a.review_count ?? 0;
    okFindings += a.ok_count ?? 0;
  }

  const recentAnalyses = ((recentResult.data ?? []) as Array<{
    id: string;
    contract_type: string | null;
    critical_count: number;
    review_count: number;
    created_at: string;
    contracts: Array<{ name: string }> | { name: string } | null;
  }>).map((a) => ({
    id: a.id,
    contractName: (Array.isArray(a.contracts) ? a.contracts[0]?.name : a.contracts?.name) ?? "Contrato sin nombre",
    contractType: a.contract_type,
    criticalCount: a.critical_count ?? 0,
    reviewCount: a.review_count ?? 0,
    createdAt: a.created_at,
  }));

  stop();

  return {
    totalContracts: contractsResult.count ?? 0,
    totalAnalyses: analysesResult.count ?? 0,
    criticalFindings,
    reviewFindings,
    okFindings,
    recentAnalyses,
  };
}

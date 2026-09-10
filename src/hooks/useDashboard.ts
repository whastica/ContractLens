"use client";
import { useQuery } from "@tanstack/react-query";

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

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Error al obtener datos del dashboard");
  const body = await res.json() as { data: DashboardData };
  return body.data;
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn:  fetchDashboard,
    staleTime: 1000 * 60 * 2,
  });
}

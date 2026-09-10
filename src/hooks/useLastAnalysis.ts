"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AnalysisResult } from "@/hooks/useAnalysis";

const QUERY_KEY = ["lastAnalysis"];
const GC_TIME = 30 * 60 * 1000; // 30 minutes

export function useLastAnalysis() {
  const queryClient = useQueryClient();

  const { data: result } = useQuery<AnalysisResult | null>({
    queryKey: QUERY_KEY,
    queryFn: () => Promise.resolve(null),
    staleTime: Infinity,
    gcTime: GC_TIME,
    initialData: () => queryClient.getQueryData(QUERY_KEY) ?? null,
  });

  function setResult(newResult: AnalysisResult) {
    queryClient.setQueryData(QUERY_KEY, newResult);
  }

  function clearResult() {
    queryClient.setQueryData(QUERY_KEY, null);
  }

  return { result, setResult, clearResult };
}

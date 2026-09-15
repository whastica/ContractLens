"use client";

import { useState, useCallback, useRef } from "react";
import type {
  AnalysisPhase,
  PipelineStep,
  ContractType,
  SSEEvent,
} from "@/types";
import { ANALYSIS_STEPS } from "@/constants";

export type AnalysisStatus = "idle" | "uploading" | "analyzing" | "done" | "error";

export interface AnalysisResult {
  id?: string;
  contractId?: string;
  classification: {
    type: ContractType;
    confidence: number;
    reasoning: string;
  };
  structure: {
    parties: Array<{ name: string; role: string; identification?: string }>;
    duration: string | null;
    totalValue: string | null;
    paymentTerms: string | null;
    renewalTerms: string | null;
    terminationTerms: string | null;
    jurisdiction: string | null;
    keyObligations: string[];
  };
  clauses: Array<{
    clauseNumber?: string | null;
    title: string;
    category?: string | null;
    rawText: string;
    summary?: string | null;
  }>;
  findings: Array<{
    severity: string;
    category: string;
    title: string;
    evidenceText: string;
    clauseReference?: string | null;
    explanation: string;
    whyItMatters?: string | null;
    possibleImpact?: string | null;
    recommendation?: string | null;
    legalReference?: string | null;
    confidence?: number | null;
  }>;
  legalGrounding?: Array<{
    finding_category: string;
    sources: Array<{
      sourceType: string;
      name: string;
      description: string;
      url: string | null;
    }>;
  }>;
  latencyMs?: number;
}

interface UseAnalysisState {
  status: AnalysisStatus;
  steps: PipelineStep[];
  uploadProgress: number;
  result: AnalysisResult | null;
  error: string | null;
}

interface UseAnalysisReturn extends UseAnalysisState {
  analyze: (file: File | null, text: string, contractType?: ContractType | null) => Promise<void>;
  reset: () => void;
}

interface UseAnalysisOptions {
  onSuccess?: (result: AnalysisResult) => void;
}

function buildInitialSteps(): PipelineStep[] {
  return ANALYSIS_STEPS.map((s) => ({
    id: s.id,
    label: s.label,
    status: "pending" as const,
  }));
}

async function uploadFileToServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new Error(
      body?.error?.message ?? `Error al subir archivo (${res.status})`
    );
  }
  const body = (await res.json()) as { data: { text: string } };
  return body.data.text;
}

export function useAnalysis(options?: UseAnalysisOptions): UseAnalysisReturn {
  const [state, setState] = useState<UseAnalysisState>({
    status: "idle",
    steps: [],
    uploadProgress: 0,
    result: null,
    error: null,
  });

  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = false;
    setState({
      status: "idle",
      steps: [],
      uploadProgress: 0,
      result: null,
      error: null,
    });
  }, []);

  const analyze = useCallback(
    async (file: File | null, text: string, contractType?: ContractType | null) => {
      if (!file && !text.trim()) return;

      abortRef.current = false;
      setState({
        status: "uploading",
        steps: buildInitialSteps(),
        uploadProgress: 0,
        result: null,
        error: null,
      });

      try {
        let inputText = text;

        // Phase 1: Upload file if provided
        if (file) {
          const progressInterval = setInterval(() => {
            setState((prev) => ({
              ...prev,
              uploadProgress: Math.min(prev.uploadProgress + 10, 90),
            }));
          }, 200);
          try {
            inputText = await uploadFileToServer(file);
          } finally {
            clearInterval(progressInterval);
          }
          if (abortRef.current) return;
          setState((prev) => ({ ...prev, uploadProgress: 100 }));
        }

        // Phase 2: SSE Pipeline
        setState((prev) => ({ ...prev, status: "analyzing" }));

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: inputText,
            ...(contractType ? { contractType } : {}),
          }),
        });

        if (!res.ok || !res.body) {
          const errBody = (await res.json().catch(() => null)) as {
            error?: { message?: string };
          } | null;
          throw new Error(
            errBody?.error?.message ?? `Error del servidor (${res.status})`
          );
        }

        // Read SSE stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (abortRef.current) {
            reader.cancel();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const chunk of lines) {
            const line = chunk.replace(/^data: /, "").trim();
            if (!line) continue;

            let event: SSEEvent;
            try {
              event = JSON.parse(line) as SSEEvent;
            } catch {
              continue;
            }

            if (event.type === "progress") {
              const phaseOrder = [
                "classify",
                "structure",
                "clauses",
                "risk",
                "legal",
              ];
              const phaseIndex = phaseOrder.indexOf(event.phase as string);

              setState((prev) => ({
                ...prev,
                steps: prev.steps.map((s, i) => {
                  // Skip "upload" step (index 0), map pipeline phases to steps 1-5
                  if (i === 0 && phaseIndex >= 0)
                    return { ...s, status: "done" as const };
                  if (i > 0 && i <= phaseIndex)
                    return { ...s, status: "done" as const };
                  if (i === phaseIndex + 1)
                    return { ...s, status: "active" as const };
                  return s;
                }),
              }));
            }

            if (event.type === "result") {
              if (abortRef.current) return;
              const data = (event as { data: AnalysisResult }).data;
              setState((prev) => ({
                ...prev,
                status: "done",
                result: data,
                steps: prev.steps.map((s) => ({
                  ...s,
                  status: "done" as const,
                })),
              }));
              options?.onSuccess?.(data);
            }

            if (event.type === "error") {
              throw new Error(
                (event as { message: string }).message ||
                  "Error durante el analisis"
              );
            }
          }
        }
      } catch (err) {
        if (abortRef.current) return;
        setState((prev) => ({
          ...prev,
          status: "error",
          error:
            err instanceof Error ? err.message : "Error desconocido",
        }));
      }
    },
    [options]
  );

  return { ...state, analyze, reset };
}

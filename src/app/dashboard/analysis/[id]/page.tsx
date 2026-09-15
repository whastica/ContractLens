"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ContractSummary } from "@/features/analysis/ContractSummary";
import { ContractHealthCheck } from "@/features/analysis/ContractHealthCheck";
import { FindingCard } from "@/features/analysis/FindingCard";
import { ClauseCard } from "@/features/analysis/ClauseCard";
import { exportAnalysisToPDF } from "@/lib/export-analysis";
import type { AnalysisResult } from "@/hooks/useAnalysis";

interface AnalysisDetail {
  id: string;
  contract_id: string;
  status: string;
  contract_type: string | null;
  parties: Array<{ name: string; role: string }> | null;
  duration: string | null;
  total_value: string | null;
  payment_terms: string | null;
  renewal_terms: string | null;
  termination_terms: string | null;
  jurisdiction: string | null;
  key_obligations: string[] | null;
  critical_count: number;
  review_count: number;
  ok_count: number;
  latency_ms: number | null;
  created_at: string;
  contracts: { name: string } | null;
  clauses: Array<{
    clause_number: string | null;
    title: string;
    category: string | null;
    raw_text: string;
    summary: string | null;
  }> | null;
  findings: Array<{
    severity: string;
    category: string;
    title: string;
    evidence_text: string;
    clause_reference: string | null;
    explanation: string;
    why_it_matters: string | null;
    possible_impact: string | null;
    recommendation: string | null;
    legal_reference: string | null;
    confidence: number | null;
    sources: Array<{
      source_type: string;
      name: string;
      description: string | null;
      url: string | null;
    }> | null;
  }> | null;
}

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [exporting, setExporting] = useState(false);

  const { data, isLoading, error } = useQuery<AnalysisDetail>({
    queryKey: ["analysis", id],
    queryFn: async () => {
      const res = await fetch(`/api/analyses?id=${id}`);
      if (!res.ok) throw new Error("Error al cargar analisis");
      const body = await res.json();
      return body.data;
    },
  });

  const handleExportPDF = async () => {
    if (!data) return;
    setExporting(true);
    try {
      const result: AnalysisResult = {
        id: data.id,
        contractId: data.contract_id,
        classification: {
          type: (data.contract_type ?? "otro") as AnalysisResult["classification"]["type"],
          confidence: 1,
          reasoning: "",
        },
        structure: {
          parties: data.parties ?? [],
          duration: data.duration,
          totalValue: data.total_value,
          paymentTerms: data.payment_terms,
          renewalTerms: data.renewal_terms,
          terminationTerms: data.termination_terms,
          jurisdiction: data.jurisdiction,
          keyObligations: data.key_obligations ?? [],
        },
        clauses: (data.clauses ?? []).map((c) => ({
          clauseNumber: c.clause_number,
          title: c.title,
          category: c.category,
          rawText: c.raw_text,
          summary: c.summary,
        })),
        findings: (data.findings ?? []).map((f) => ({
          severity: f.severity,
          category: f.category,
          title: f.title,
          evidenceText: f.evidence_text,
          clauseReference: f.clause_reference,
          explanation: f.explanation,
          whyItMatters: f.why_it_matters,
          possibleImpact: f.possible_impact,
          recommendation: f.recommendation,
          legalReference: f.legal_reference,
          confidence: f.confidence,
        })),
        latencyMs: data.latency_ms ?? undefined,
      };
      await exportAnalysisToPDF(result, data.contracts?.name ?? undefined);
    } catch (err) {
      console.error("Error exporting PDF:", err);
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al historial
        </Link>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <p className="text-sm text-destructive">
            No se pudo cargar el analisis. Puede que no exista o haya sido eliminado.
          </p>
        </div>
      </div>
    );
  }

  const structure = {
    parties: data.parties ?? [],
    duration: data.duration,
    totalValue: data.total_value,
    paymentTerms: data.payment_terms,
    renewalTerms: data.renewal_terms,
    terminationTerms: data.termination_terms,
    jurisdiction: data.jurisdiction,
    keyObligations: data.key_obligations ?? [],
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al historial
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-700">
              {data.contracts?.name ?? "Analisis"}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>{data.contract_type?.replace(/_/g, " ") ?? "Sin tipo"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(data.created_at).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={exporting}
            className="gap-1.5"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {exporting ? "Exportando..." : "PDF"}
          </Button>
        </div>
      </div>

      <ContractHealthCheck
        critical={data.critical_count}
        review={data.review_count}
        ok={data.ok_count}
      />

      <ContractSummary structure={structure} />

      {data.findings && data.findings.length > 0 && (
        <div>
          <h3 className="text-lg font-heading font-600 mb-4">
            Hallazgos ({data.findings.length})
          </h3>
          <div className="space-y-4">
            {data.findings.map((f, i) => (
              <FindingCard
                key={i}
                finding={{
                  severity: f.severity,
                  category: f.category,
                  title: f.title,
                  evidenceText: f.evidence_text,
                  clauseReference: f.clause_reference,
                  explanation: f.explanation,
                  whyItMatters: f.why_it_matters,
                  possibleImpact: f.possible_impact,
                  recommendation: f.recommendation,
                  legalReference: f.legal_reference,
                  confidence: f.confidence,
                }}
                sources={f.sources?.map((s) => ({
                  sourceType: s.source_type,
                  name: s.name,
                  description: s.description ?? "",
                  url: s.url,
                })) ?? undefined}
                defaultOpen={i < 3}
              />
            ))}
          </div>
        </div>
      )}

      {data.clauses && data.clauses.length > 0 && (
        <div>
          <h3 className="text-lg font-heading font-600 mb-4">
            Clausulas ({data.clauses.length})
          </h3>
          <div className="space-y-3">
            {data.clauses.map((c, i) => (
              <ClauseCard
                key={i}
                clause={{
                  clauseNumber: c.clause_number,
                  title: c.title,
                  category: c.category,
                  rawText: c.raw_text,
                  summary: c.summary,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card/30 p-4 text-center">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Este analisis es preliminar y no sustituye asesoria juridica profesional.
        </p>
      </div>
    </div>
  );
}

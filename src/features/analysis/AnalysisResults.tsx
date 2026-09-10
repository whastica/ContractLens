"use client";

import { useState } from "react";
import { ArrowLeft, Download, RotateCcw, Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContractSummary } from "./ContractSummary";
import { ContractHealthCheck } from "./ContractHealthCheck";
import { FindingCard } from "./FindingCard";
import { ClauseCard } from "./ClauseCard";
import { exportAnalysisToPDF } from "@/lib/export-analysis";
import type { AnalysisResult } from "@/hooks/useAnalysis";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { classification, structure, clauses, findings } = result;

  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const reviewCount = findings.filter((f) => f.severity === "review").length;
  const okCount = findings.filter((f) => f.severity === "ok").length;

  const handleCopy = async () => {
    const text = [
      `Tipo: ${classification.type}`,
      `Confianza: ${(classification.confidence * 100).toFixed(0)}%`,
      "",
      "Partes:",
      ...structure.parties.map((p) => `- ${p.name} (${p.role})`),
      "",
      `Duracion: ${structure.duration ?? "No especificada"}`,
      `Valor: ${structure.totalValue ?? "No especificado"}`,
      `Jurisdiccion: ${structure.jurisdiction ?? "No especificada"}`,
      "",
      "Hallazgos:",
      ...findings.map(
        (f) =>
          `[${f.severity.toUpperCase()}] ${f.title}: ${f.explanation}`
      ),
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportAnalysisToPDF(result);
    } catch (err) {
      console.error("Error exporting PDF:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="mb-2 -ml-2 gap-1.5 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Nuevo analisis
          </Button>
          <h2 className="text-2xl font-heading font-700">
            Resultado del Analisis
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="default">{classification.type.replace("_", " ")}</Badge>
            <Badge variant="outline">
              {(classification.confidence * 100).toFixed(0)}% confianza
            </Badge>
            {result.latencyMs && (
              <Badge variant="outline">
                {(result.latencyMs / 1000).toFixed(1)}s
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            disabled={exporting}
            className="gap-1.5"
          >
            <FileText className="h-4 w-4" />
            {exporting ? "Exportando..." : "PDF"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copiado" : "Copiar"}
          </Button>
          <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
            <RotateCcw className="h-4 w-4" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* Health check */}
      <ContractHealthCheck
        critical={criticalCount}
        review={reviewCount}
        ok={okCount}
      />

      {/* Contract summary */}
      <ContractSummary structure={structure} />

      {/* Findings */}
      <div>
        <h3 className="text-lg font-heading font-600 mb-4">
          Hallazgos ({findings.length})
        </h3>
        <div className="space-y-4">
          {findings.map((finding, i) => (
            <FindingCard key={i} finding={finding} defaultOpen={i < 3} />
          ))}
        </div>
      </div>

      {/* Clauses */}
      {clauses.length > 0 && (
        <div>
          <h3 className="text-lg font-heading font-600 mb-4">
            Clausulas ({clauses.length})
          </h3>
          <div className="space-y-3">
            {clauses.map((clause, i) => (
              <ClauseCard key={i} clause={clause} />
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-card/30 p-4 text-center">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Este analisis es preliminar y no sustituye asesoria juridica profesional.
          Los resultados dependen de la calidad del texto proporcionado y del modelo de IA.
        </p>
      </div>
    </div>
  );
}

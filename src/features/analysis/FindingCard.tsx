"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  FileText,
  Scale,
  ExternalLink,
  Copy,
  Check,
  Pen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Source {
  sourceType: string;
  name: string;
  description: string;
  url: string | null;
}

interface FindingCardProps {
  finding: {
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
  };
  sources?: Source[];
  defaultOpen?: boolean;
}

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertTriangle,
    label: "Atencion inmediata",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    badge: "destructive" as const,
  },
  review: {
    icon: AlertCircle,
    label: "Para revision",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    badge: "warning" as const,
  },
  ok: {
    icon: CheckCircle,
    label: "Sin observaciones",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    badge: "success" as const,
  },
  undetermined: {
    icon: HelpCircle,
    label: "No determinado",
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    border: "border-border",
    badge: "secondary" as const,
  },
};

export function FindingCard({ finding, sources, defaultOpen = false }: FindingCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copiedRecommendation, setCopiedRecommendation] = useState(false);
  const config =
    SEVERITY_CONFIG[finding.severity as keyof typeof SEVERITY_CONFIG] ??
    SEVERITY_CONFIG.undetermined;
  const Icon = config.icon;

  const handleCopyRecommendation = async () => {
    if (!finding.recommendation) return;
    await navigator.clipboard.writeText(finding.recommendation);
    setCopiedRecommendation(true);
    setTimeout(() => setCopiedRecommendation(false), 2000);
  };

  const isOkFinding = finding.severity === "ok";

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        config.border,
        isOpen && "bg-card/50"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div
          className={cn(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
            config.bg
          )}
        >
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold truncate">{finding.title}</h4>
            <Badge variant={config.badge} className="flex-shrink-0 text-[10px]">
              {config.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {finding.category.replace(/_/g, " ")}
            {finding.clauseReference && ` - ${finding.clauseReference}`}
          </p>
        </div>

        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/50">

          {/* ═══ PILAR 1: CITA TEXTUAL ═══ */}
          <div className="pt-4">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground mb-2">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>Cita textual del contrato</span>
            </div>
            <blockquote className="border-l-2 border-primary/40 bg-primary/5 rounded-r-lg pl-4 pr-3 py-3 text-sm text-foreground/90 italic leading-relaxed">
              &ldquo;{finding.evidenceText}&rdquo;
            </blockquote>
            {finding.clauseReference && (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Ubicacion: {finding.clauseReference}
              </p>
            )}
          </div>

          {/* ═══ PILAR 2: FUNDAMENTO LEGAL ═══ */}
          {finding.legalReference && (
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-accent mb-1.5">
                <Scale className="h-3.5 w-3.5" />
                <span>Fundamento legal</span>
              </div>
              <p className="text-sm text-foreground/90">{finding.legalReference}</p>
            </div>
          )}

          {/* ═══ PILAR 3: REDACCION ALTERNATIVA SUGERIDA ═══ */}
          {finding.recommendation && (
            <div className={cn(
              "rounded-lg border p-3",
              isOkFinding
                ? "border-success/20 bg-success/5"
                : "border-primary/20 bg-primary/5"
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Pen className="h-3.5 w-3.5" />
                  <span>{isOkFinding ? "Evaluacion" : "Redaccion alternativa sugerida"}</span>
                </div>
                {!isOkFinding && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyRecommendation}
                    className="h-6 px-2 text-xs gap-1"
                  >
                    {copiedRecommendation ? (
                      <>
                        <Check className="h-3 w-3 text-success" />
                        <span className="text-success">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className={cn(
                "rounded-md p-3 text-sm leading-relaxed",
                isOkFinding
                  ? "bg-success/10 text-foreground/90"
                  : "bg-background text-foreground/90"
              )}>
                {isOkFinding ? (
                  <p>{finding.recommendation}</p>
                ) : (
                  <p className="whitespace-pre-line font-mono text-[13px]">{finding.recommendation}</p>
                )}
              </div>
            </div>
          )}

          {/* ═══ CONTEXTO ADICIONAL (colapsable) ═══ */}
          <div className="space-y-3">
            {/* Explanation */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Que detectamos</p>
              <p className="text-sm text-muted-foreground">{finding.explanation}</p>
            </div>

            {/* Why it matters */}
            {finding.whyItMatters && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Por que importa</p>
                <p className="text-sm text-muted-foreground">
                  {finding.whyItMatters}
                </p>
              </div>
            )}

            {/* Impact */}
            {finding.possibleImpact && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Impacto posible</p>
                <p className="text-sm text-muted-foreground">
                  {finding.possibleImpact}
                </p>
              </div>
            )}

            {/* Sources */}
            {sources && sources.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Fuentes legales</p>
                <div className="space-y-2">
                  {sources.map((source, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-card/30 p-3 text-xs"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[9px]">
                          {source.sourceType}
                        </Badge>
                        <span className="font-medium text-foreground">{source.name}</span>
                      </div>
                      {source.description && (
                        <p className="text-muted-foreground">{source.description}</p>
                      )}
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Ver fuente oficial
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confidence */}
            {finding.confidence != null && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Confianza:</span>
                <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${finding.confidence * 100}%` }}
                  />
                </div>
                <span>{(finding.confidence * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

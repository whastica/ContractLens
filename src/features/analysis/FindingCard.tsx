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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

export function FindingCard({ finding, defaultOpen = false }: FindingCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const config =
    SEVERITY_CONFIG[finding.severity as keyof typeof SEVERITY_CONFIG] ??
    SEVERITY_CONFIG.undetermined;
  const Icon = config.icon;

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
          {/* Evidence */}
          <div className="pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <FileText className="h-3.5 w-3.5" />
              <span>Evidencia del documento</span>
            </div>
            <blockquote className="border-l-2 border-primary/30 pl-3 text-sm text-muted-foreground italic">
              {finding.evidenceText}
            </blockquote>
          </div>

          {/* Explanation */}
          <div>
            <p className="text-sm font-medium mb-1">Que detectamos</p>
            <p className="text-sm text-muted-foreground">{finding.explanation}</p>
          </div>

          {/* Why it matters */}
          {finding.whyItMatters && (
            <div>
              <p className="text-sm font-medium mb-1">Por que importa</p>
              <p className="text-sm text-muted-foreground">
                {finding.whyItMatters}
              </p>
            </div>
          )}

          {/* Impact */}
          {finding.possibleImpact && (
            <div>
              <p className="text-sm font-medium mb-1">Impacto posible</p>
              <p className="text-sm text-muted-foreground">
                {finding.possibleImpact}
              </p>
            </div>
          )}

          {/* Recommendation */}
          {finding.recommendation && (
            <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
              <p className="text-sm font-medium mb-1">Recomendacion</p>
              <p className="text-sm">{finding.recommendation}</p>
            </div>
          )}

          {/* Legal reference */}
          {finding.legalReference && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Scale className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>{finding.legalReference}</span>
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
      )}
    </div>
  );
}

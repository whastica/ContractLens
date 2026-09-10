"use client";

import { FileText, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ClauseCardProps {
  clause: {
    clauseNumber?: string | null;
    title: string;
    category?: string | null;
    rawText: string;
    summary?: string | null;
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  objeto: "bg-primary/10 text-primary border-primary/20",
  obligaciones: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  duracion: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pago: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  penalidades: "bg-destructive/10 text-destructive border-destructive/20",
  terminacion: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  confidencialidad: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  propiedad_intelectual: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  responsabilidad: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  garantia: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  seguro: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  ley_aplicable: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  jurisdiccion: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export function ClauseCard({ clause }: ClauseCardProps) {
  const categoryColor =
    CATEGORY_COLORS[clause.category ?? ""] ?? "bg-muted text-muted-foreground border-border";

  return (
    <div className="rounded-xl border border-border bg-card/30 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {clause.clauseNumber && (
            <div className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium">
              <Hash className="h-3 w-3" />
              <span className="ml-0.5">{clause.clauseNumber}</span>
            </div>
          )}
          <h4 className="text-sm font-semibold">{clause.title}</h4>
        </div>

        {clause.category && (
          <Badge variant="outline" className={cn("text-[10px]", categoryColor)}>
            {clause.category.replace(/_/g, " ")}
          </Badge>
        )}
      </div>

      {clause.summary && (
        <p className="text-sm text-muted-foreground mb-2">{clause.summary}</p>
      )}

      <details className="group">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          Ver texto completo
        </summary>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {clause.rawText}
        </p>
      </details>
    </div>
  );
}

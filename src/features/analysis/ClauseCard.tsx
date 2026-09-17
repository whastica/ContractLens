"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryColor =
    CATEGORY_COLORS[clause.category ?? ""] ?? "bg-muted text-muted-foreground border-border";

  return (
    <div className="group rounded-xl border border-border/50 bg-card/50 transition-all hover:border-border hover:bg-card/80">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {clause.clauseNumber && (
              <span className="inline-flex h-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 px-2.5 text-xs font-semibold text-primary">
                {clause.clauseNumber}
              </span>
            )}
            <h4 className="text-sm font-semibold leading-snug break-words">
              {clause.title}
            </h4>
          </div>

          {clause.category && (
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 text-[10px] font-medium capitalize self-start",
                categoryColor
              )}
            >
              {clause.category.replace(/_/g, " ")}
            </Badge>
          )}
        </div>

        {clause.summary && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {clause.summary}
          </p>
        )}
      </div>

      {clause.rawText && (
        <div className="border-t border-border/50">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center gap-2 px-4 sm:px-5 py-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Texto completo</span>
            <ChevronDown
              className={cn(
                "ml-auto h-3.5 w-3.5 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </button>
          {isExpanded && (
            <div className="px-4 sm:px-5 pb-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono">
                  {clause.rawText}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

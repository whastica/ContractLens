"use client";

import { AlertTriangle, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContractHealthCheckProps {
  critical: number;
  review: number;
  ok: number;
  undetermined?: number;
}

const SEVERITIES = [
  {
    key: "critical",
    label: "Atencion inmediata",
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
  },
  {
    key: "review",
    label: "Para revision",
    icon: AlertCircle,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  {
    key: "ok",
    label: "Sin observaciones",
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
] as const;

export function ContractHealthCheck({
  critical,
  review,
  ok,
}: ContractHealthCheckProps) {
  const counts = { critical, review, ok };

  return (
    <div className="grid grid-cols-3 gap-3">
      {SEVERITIES.map((sev) => {
        const count = counts[sev.key as keyof typeof counts];
        const Icon = sev.icon;
        return (
          <div
            key={sev.key}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border p-4 text-center",
              sev.bg,
              sev.border
            )}
          >
            <Icon className={cn("h-6 w-6 mb-2", sev.color)} />
            <span className={cn("text-2xl font-heading font-700", sev.color)}>
              {count}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{sev.label}</span>
          </div>
        );
      })}
    </div>
  );
}

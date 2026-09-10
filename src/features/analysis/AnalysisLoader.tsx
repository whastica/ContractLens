"use client";

import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStep } from "@/types";

interface AnalysisLoaderProps {
  steps: PipelineStep[];
  uploadProgress: number;
  status: "uploading" | "analyzing";
}

export function AnalysisLoader({
  steps,
  uploadProgress,
  status,
}: AnalysisLoaderProps) {
  const activeSteps = steps.filter((s) => s.id !== "upload");
  const doneCount = activeSteps.filter((s) => s.status === "done").length;
  const totalSteps = activeSteps.length;
  const overallPercent =
    totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Spinner */}
      <div className="relative mb-8">
        <div className="h-20 w-20 rounded-full border-4 border-muted animate-pulse" />
        <Loader2 className="absolute inset-0 h-20 w-20 text-primary animate-spin" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-heading font-700 mb-2">
        Analizando contrato
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        {status === "uploading"
          ? "Subiendo y procesando el documento..."
          : "La IA esta analizando el contrato paso a paso..."}
      </p>

      {/* Upload progress */}
      {status === "uploading" && (
        <div className="w-full max-w-sm mb-8">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Subiendo archivo</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Pipeline steps */}
      {status === "analyzing" && (
        <div className="w-full max-w-sm space-y-3">
          {activeSteps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {step.status === "done" ? (
                  <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-success" />
                  </div>
                ) : step.status === "active" ? (
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground/30" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  step.status === "done" && "text-success",
                  step.status === "active" && "text-foreground font-medium",
                  step.status === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          ))}

          {/* Overall progress */}
          <div className="pt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progreso total</span>
              <span>{overallPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Estimated time */}
      <p className="mt-8 text-xs text-muted-foreground">
        Esto puede tomar entre 30 segundos y 2 minutos...
      </p>
    </div>
  );
}

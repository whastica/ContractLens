"use client";

import { FileSearch } from "lucide-react";

export function AnalysisEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileSearch className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-heading font-600 mb-2">
        Selecciona un contrato
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Sube un documento PDF o DOCX, o pega el texto del contrato para comenzar
        el analisis con IA.
      </p>
    </div>
  );
}

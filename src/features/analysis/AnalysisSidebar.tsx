"use client";

import { FileSearch, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadZone } from "@/features/upload/UploadZone";
import { ContractTypeSelector } from "./ContractTypeSelector";
import type { ContractType } from "@/types";

interface AnalysisSidebarProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  text: string;
  onTextChange: (value: string) => void;
  contractType: ContractType | null;
  onContractTypeChange: (type: ContractType | null) => void;
  onAnalyze: () => void;
  disabled: boolean;
}

export function AnalysisSidebar({
  selectedFile,
  onFileSelect,
  onFileClear,
  text,
  onTextChange,
  contractType,
  onContractTypeChange,
  onAnalyze,
  disabled,
}: AnalysisSidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-700">Nuevo Analisis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sube un contrato o pega el texto para analizarlo con IA.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Subir contrato
        </label>
        <UploadZone
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
          onClear={onFileClear}
        />
      </div>

      {/* Contract type selector */}
      <ContractTypeSelector value={contractType} onChange={onContractTypeChange} />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">o</span>
        </div>
      </div>

      {/* Text input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Pegar texto del contrato
        </label>
        <Textarea
          placeholder="Pega aqui el texto completo del contrato..."
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={8}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Minimo 100 caracteres.{" "}
          <span className={text.length >= 100 ? "text-success" : ""}>
            {text.length}/100
          </span>
        </p>
      </div>

      {/* Analyze button */}
      <Button
        onClick={onAnalyze}
        disabled={disabled}
        className="w-full gap-2"
        size="lg"
      >
        <FileSearch className="h-4 w-4" />
        Analizar contrato
        <ArrowRight className="h-4 w-4" />
      </Button>

      {/* Disclaimer */}
      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        El analisis es preliminar y no sustituye asesoria juridica profesional.
        Los resultados dependen de la calidad del texto proporcionado.
      </p>
    </div>
  );
}

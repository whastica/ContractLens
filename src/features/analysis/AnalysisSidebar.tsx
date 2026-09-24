"use client";

import { FileSearch, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadZone } from "@/features/upload/UploadZone";
import { AnalysisAreaSelector } from "./AnalysisAreaSelector";
import { ContractTypeSelector } from "./ContractTypeSelector";
import type { LegalArea } from "@/types";

interface AnalysisSidebarProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  text: string;
  onTextChange: (value: string) => void;
  area: LegalArea;
  onAreaChange: (area: LegalArea) => void;
  documentType: string | null;
  onDocumentTypeChange: (typeId: string | null) => void;
  onAnalyze: () => void;
  disabled: boolean;
}

export function AnalysisSidebar({
  selectedFile,
  onFileSelect,
  onFileClear,
  text,
  onTextChange,
  area,
  onAreaChange,
  documentType,
  onDocumentTypeChange,
  onAnalyze,
  disabled,
}: AnalysisSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-heading font-700 text-white">Nuevo Analisis</h2>
        <p className="mt-1 text-sm text-slate-300">
          Sube un documento legal o contrato para procesarlo con el agente experto de la especialidad correspondiente.
        </p>
      </div>

      {/* Paso 1: Area Legal */}
      <AnalysisAreaSelector value={area} onChange={onAreaChange} />

      {/* Paso 2: Zona de Carga */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">
          Subir contrato
        </label>
        <UploadZone
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
          onClear={onFileClear}
        />
      </div>

      {/* Paso 3: Tipo de Documento */}
      <ContractTypeSelector
        area={area}
        value={documentType}
        onChange={onDocumentTypeChange}
      />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-slate-400">o</span>
        </div>
      </div>

      {/* Text input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">
          Pegar texto del contrato
        </label>
        <Textarea
          placeholder="Pega aqui el texto completo del contrato..."
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={6}
          className="resize-none bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-white/20"
        />
        <p className="text-xs text-slate-400">
          Minimo 100 caracteres.{" "}
          <span className={text.length >= 100 ? "text-emerald-400" : ""}>
            {text.length}/100
          </span>
        </p>
      </div>

      {/* Analyze button */}
      <Button
        onClick={onAnalyze}
        disabled={disabled}
        className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-100"
        size="lg"
      >
        <FileSearch className="h-4 w-4" />
        Analizar contrato
        <ArrowRight className="h-4 w-4" />
      </Button>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        El analisis es preliminar y no sustituye asesoria juridica profesional.
        Los resultados dependen de la calidad del texto proporcionado.
      </p>
    </div>
  );
}

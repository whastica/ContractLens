"use client";

import { FileText, Briefcase, Lock, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTRACT_TYPES } from "@/constants";
import type { ContractType } from "@/types";

const ICON_MAP: Record<ContractType, typeof FileText> = {
  prestacion_servicios: Briefcase,
  laboral: FileText,
  nda: Lock,
  otro: HelpCircle,
};

interface ContractTypeSelectorProps {
  value: ContractType | null;
  onChange: (type: ContractType | null) => void;
}

export function ContractTypeSelector({ value, onChange }: ContractTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Tipo de contrato
      </label>
      <p className="text-xs text-muted-foreground">
        Selecciona el tipo o dejalo en automatico para que la IA lo detecte.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {CONTRACT_TYPES.map((ct) => {
          const Icon = ICON_MAP[ct.value];
          const isSelected = value === ct.value;
          return (
            <button
              key={ct.value}
              type="button"
              onClick={() => onChange(isSelected ? null : ct.value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-all",
                isSelected
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border bg-card/30 text-muted-foreground hover:border-border hover:bg-card/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{ct.label}</span>
            </button>
          );
        })}
      </div>
      {value && (
        <p className="text-xs text-primary">
          Tipo seleccionado:{" "}
          {CONTRACT_TYPES.find((ct) => ct.value === value)?.label}
        </p>
      )}
    </div>
  );
}

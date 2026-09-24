"use client";

import { cn } from "@/lib/utils";
import { DOCUMENT_TYPES_BY_AREA } from "@/constants";
import type { LegalArea } from "@/types";

interface ContractTypeSelectorProps {
  area: LegalArea;
  value: string | null;
  onChange: (typeId: string | null) => void;
}

export function ContractTypeSelector({ area, value, onChange }: ContractTypeSelectorProps) {
  const types = DOCUMENT_TYPES_BY_AREA[area];

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-white">
          Tipo de documento
        </label>
        <p className="text-xs text-slate-400 mt-0.5">
          Selecciona el tipo o dejalo en automatico para que la IA lo detecte.
        </p>
      </div>

      {/* Pills / Badges */}
      <div className="flex flex-wrap gap-2">
        {types.map((docType) => {
          const isSelected = value === docType.id;
          return (
            <button
              key={docType.id}
              type="button"
              onClick={() => onChange(isSelected ? null : docType.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                isSelected
                  ? "border-blue-400/50 bg-blue-500/20 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                {docType.category}
              </span>
              <span>{docType.label}</span>
            </button>
          );
        })}
      </div>

      {value && (
        <p className="text-xs text-blue-300/80">
          Documento seleccionado:{" "}
          {types.find((t) => t.id === value)?.label}
        </p>
      )}
    </div>
  );
}

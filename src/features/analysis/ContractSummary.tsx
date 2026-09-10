"use client";

import { Users, Clock, DollarSign, Map, Scale } from "lucide-react";

interface ContractSummaryProps {
  structure: {
    parties: Array<{ name: string; role: string; identification?: string }>;
    duration: string | null;
    totalValue: string | null;
    paymentTerms: string | null;
    renewalTerms: string | null;
    terminationTerms: string | null;
    jurisdiction: string | null;
    keyObligations: string[];
  };
}

export function ContractSummary({ structure }: ContractSummaryProps) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-6">
      <h3 className="text-lg font-heading font-600 mb-4">
        Resumen del Contrato
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Parties */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Partes</span>
          </div>
          <div className="space-y-1">
            {structure.parties.length > 0 ? (
              structure.parties.map((p, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="ml-1 text-muted-foreground">({p.role})</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No identificadas</p>
            )}
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Duracion</span>
          </div>
          <p className="text-sm font-medium">
            {structure.duration ?? "No especificada"}
          </p>
        </div>

        {/* Value */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Valor</span>
          </div>
          <p className="text-sm font-medium">
            {structure.totalValue ?? "No especificado"}
          </p>
        </div>

        {/* Payment */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Forma de pago</span>
          </div>
          <p className="text-sm font-medium">
            {structure.paymentTerms ?? "No especificada"}
          </p>
        </div>

        {/* Jurisdiction */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Map className="h-4 w-4" />
            <span>Jurisdiccion</span>
          </div>
          <p className="text-sm font-medium">
            {structure.jurisdiction ?? "No especificada"}
          </p>
        </div>

        {/* Termination */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scale className="h-4 w-4" />
            <span>Terminacion</span>
          </div>
          <p className="text-sm font-medium">
            {structure.terminationTerms ?? "No especificada"}
          </p>
        </div>
      </div>

      {/* Key obligations */}
      {structure.keyObligations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Obligaciones principales:
          </p>
          <ul className="space-y-1">
            {structure.keyObligations.map((obligation, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">-</span>
                <span>{obligation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

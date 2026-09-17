"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Clock, Plus, Loader2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

interface Contract {
  id: string;
  name: string;
  file_name: string;
  file_type: string;
  detected_type: string | null;
  status: string;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  uploaded: "bg-muted text-muted-foreground",
  processing: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  error: "bg-destructive/10 text-destructive",
};

export default function ContractsPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data, isLoading } = useQuery<Contract[]>({
    queryKey: ["contracts"],
    queryFn: async () => {
      const res = await fetch("/api/contracts");
      if (!res.ok) return [];
      const body = await res.json();
      return body.data ?? [];
    },
  });

  const visibleItems = data?.slice(0, visibleCount) ?? [];
  const hasMore = data ? visibleCount < data.length : false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-700">Contratos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contratos subidos y analizados.
            {data && data.length > 0 && (
              <span className="ml-1 text-muted-foreground/70">
                ({data.length} total)
              </span>
            )}
          </p>
        </div>
        <Button asChild className="gap-1.5">
          <Link href="/dashboard/analyze">
            <Plus className="h-4 w-4" />
            Nuevo analisis
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-heading font-600 mb-2">
            No hay contratos
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sube tu primer contrato para comenzar.
          </p>
          <Button asChild className="gap-1.5">
            <Link href="/dashboard/analyze">
              <Plus className="h-4 w-4" />
              Subir contrato
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleItems.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 hover:bg-card/80 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{contract.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{contract.file_type?.toUpperCase() ?? "N/A"}</span>
                    <span>-</span>
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(contract.created_at).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={STATUS_STYLES[contract.status] ?? ""}
                >
                  {contract.status}
                </Badge>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="gap-1.5"
              >
                Cargar mas
                <span className="text-xs text-muted-foreground">
                  ({data.length - visibleCount} restantes)
                </span>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Clock, Plus, Loader2, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

interface Analysis {
  id: string;
  contract_type: string | null;
  critical_count: number;
  review_count: number;
  ok_count: number;
  created_at: string;
  contracts: { name: string } | null;
}

export default function HistoryPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data, isLoading } = useQuery<Analysis[]>({
    queryKey: ["analyses"],
    queryFn: async () => {
      const res = await fetch("/api/analyses");
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
          <h1 className="text-2xl font-heading font-700">Historial</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analisis de contratos realizados.
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
          <HistoryIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-heading font-600 mb-2">
            Sin analisis recientes
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tus analisis apareceran aqui una vez los realices.
          </p>
          <Button asChild className="gap-1.5">
            <Link href="/dashboard/analyze">
              <Plus className="h-4 w-4" />
              Primer analisis
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {visibleItems.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/dashboard/analysis/${analysis.id}`}
                className="flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 hover:bg-card/80 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {analysis.contracts?.name ?? "Analisis"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{analysis.contract_type?.replace(/_/g, " ") ?? "Sin tipo"}</span>
                    <span>-</span>
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(analysis.created_at).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {analysis.critical_count > 0 && (
                    <Badge variant="destructive" className="text-[10px]">
                      {analysis.critical_count} critico{analysis.critical_count > 1 ? "s" : ""}
                    </Badge>
                  )}
                  {analysis.review_count > 0 && (
                    <Badge variant="warning" className="text-[10px]">
                      {analysis.review_count} revision
                    </Badge>
                  )}
                  {analysis.ok_count > 0 && (
                    <Badge variant="success" className="text-[10px]">
                      {analysis.ok_count} ok
                    </Badge>
                  )}
                </div>
              </Link>
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

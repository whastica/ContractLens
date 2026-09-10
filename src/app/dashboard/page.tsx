"use client";

import { StatCard } from "@/components/shared/StatCard";
import { useDashboard } from "@/hooks/useDashboard";
import { DashboardStatsSkeleton } from "@/components/shared/Skeletons";
import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DashboardStatsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild className="bg-brand-500 hover:bg-brand-600 text-white">
          <Link href={ROUTES.analyze}>Nuevo análisis</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Contratos analizados"
          value={data?.totalContracts ?? 0}
          icon={FileText}
        />
        <StatCard
          label="Puntos de atención"
          value={data?.criticalFindings ?? 0}
          icon={AlertTriangle}
        />
        <StatCard
          label="Sin observaciones"
          value={data?.okFindings ?? 0}
          icon={CheckCircle}
        />
        <StatCard
          label="Análisis totales"
          value={data?.totalAnalyses ?? 0}
          icon={Clock}
        />
      </div>

      {/* Análisis recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentAnalyses && data.recentAnalyses.length > 0 ? (
            <div className="space-y-3">
              {data.recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/dashboard/analysis/${analysis.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{analysis.contractName}</p>
                      <p className="text-xs text-muted-foreground">
                        {analysis.contractType ?? "Tipo no determinado"} • {formatDate(new Date(analysis.createdAt))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysis.criticalCount > 0 && (
                      <Badge variant="destructive" className="text-[10px]">
                        🔴 {analysis.criticalCount}
                      </Badge>
                    )}
                    {analysis.reviewCount > 0 && (
                      <Badge variant="warning" className="text-[10px]">
                        🟠 {analysis.reviewCount}
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay análisis recientes. Sube tu primer contrato para comenzar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

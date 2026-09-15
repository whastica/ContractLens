"use client";

import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Shield,
  FileText,
  HelpCircle,
  ExternalLink,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: dashboardData } = useDashboard();

  if (authLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-700">Configuracion</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-xl bg-muted/50" />
          <div className="h-24 rounded-xl bg-muted/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-700">Configuracion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona tu perfil y configuracion de cuenta.
        </p>
      </div>

      {/* Profile section */}
      <Card className="bg-card/50 border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <User className="h-7 w-7 text-primary" />
              )}
            </div>
            <div>
              <h2 className="font-heading text-lg font-600">{user?.name ?? "Usuario"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email ?? "Sin email"}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Correo electronico</p>
                <p className="text-sm">{user?.email ?? "No disponible"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Miembro desde</p>
                <p className="text-sm">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "No disponible"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan section */}
      <Card className="bg-card/50 border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-heading text-sm font-600">Plan actual</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Estas en la fase Beta de ContractLens. El acceso es gratuito durante el periodo de prueba.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-heading font-700 text-primary">
                {dashboardData?.totalAnalyses ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Analisis realizados</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-heading font-700 text-primary">
                {dashboardData?.totalContracts ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Contratos</p>
            </div>
            <div className="rounded-lg border border-border p-3 text-center">
              <p className="text-2xl font-heading font-700 text-primary">
                {dashboardData?.criticalFindings ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Puntos de atencion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <Card className="bg-card/50 border-border">
        <CardContent className="p-6">
          <h3 className="font-heading text-sm font-600 mb-4">Enlaces utiles</h3>
          <div className="space-y-2">
            <Link
              href="/dashboard/analyze"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-card/80 transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Nuevo analisis</p>
                <p className="text-xs text-muted-foreground">Sube un contrato para analizar</p>
              </div>
            </Link>
            <Link
              href="/terms"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-card/80 transition-colors"
            >
              <FileText className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Terminos de servicio</p>
                <p className="text-xs text-muted-foreground">Revisa los terminos de uso</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            <Link
              href="/privacy"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-card/80 transition-colors"
            >
              <Shield className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Politica de privacidad</p>
                <p className="text-xs text-muted-foreground">Conoce como protegemos tus datos</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-card/80 transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Contacto y soporte</p>
                <p className="text-xs text-muted-foreground">¿Necesitas ayuda? Escribenos</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-card/30 p-4 text-center">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          ContractLens es una herramienta de analisis preliminar asistida por IA.
          No sustituye la asesoria juridica profesional.
        </p>
      </div>
    </div>
  );
}

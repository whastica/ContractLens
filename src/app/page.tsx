import Link from "next/link";
import { ArrowRight, Shield, Clock, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { AtmosphericBackground } from "@/components/shared/AtmosphericBackground";
import { ROUTES } from "@/constants";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <AtmosphericBackground />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <Badge variant="outline" className="mb-6 text-[10px] border-accent/30 text-accent">
          Beta 0.1
        </Badge>

        <h1 className="max-w-3xl font-heading text-4xl font-700 sm:text-5xl md:text-6xl leading-tight">
          Analiza contratos en minutos,{" "}
          <span className="gradient-text">identifica puntos de atencion</span>{" "}
          y encuentra la evidencia en el documento
        </h1>

        <p className="mt-6 max-w-xl text-muted-foreground text-base sm:text-lg">
          Plataforma de analisis y preauditoria contractual asistida por IA para abogados y pymes en Colombia.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Link href={ROUTES.login}>
              Comenzar ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={ROUTES.sections.howItWorks}>
              Como funciona
            </Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-2xl font-700 mb-12">
            Como funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: FileText,
                title: "Sube tu contrato",
                description: "PDF o DOCX. El sistema extrae y limpia el texto automaticamente.",
              },
              {
                step: "2",
                icon: Search,
                title: "Analisis con IA",
                description: "Identificamos tipo, clausulas, obligaciones y posibles puntos de atencion.",
              },
              {
                step: "3",
                icon: Shield,
                title: "Revisa y decide",
                description: "Obten un resumen estructurado con evidencia del documento y recomendaciones.",
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-xl border border-border bg-card/50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-lg font-600 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-2xl font-700 mb-12">
            Caracteristicas
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Search,
                title: "Identificacion de clausulas",
                description: "Localiza automaticamente las clausulas relevantes: terminacion, penalidades, confidencialidad, propiedad intelectual.",
              },
              {
                icon: Shield,
                title: "Analisis de riesgos",
                description: "Detecta puntos que requieren atencion con evidencia directa del documento y referencias legales.",
              },
              {
                icon: Clock,
                title: "Historial de analisis",
                description: "Accede a tus analisis anteriores en cualquier momento. Organiza y compara contratos.",
              },
              {
                icon: FileText,
                title: "Informes PDF",
                description: "Genera informes profesionales de preauditoria listos para compartir con clientes.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card/50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-600 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center rounded-xl border border-border bg-card/50 p-12">
          <h2 className="font-heading text-2xl font-700 mb-4">
            Comienza a analizar tus contratos
          </h2>
          <p className="text-muted-foreground mb-6">
            La IA realiza la primera revision; el profesional toma la decision.
          </p>
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Link href={ROUTES.login}>
              Iniciar sesion
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

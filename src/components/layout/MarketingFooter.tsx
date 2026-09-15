import Link from "next/link";
import { FileSearch } from "lucide-react";
import { ROUTES } from "@/constants";

const footerLinks = [
  { label: "Como funciona", href: ROUTES.sections.howItWorks },
  { label: "Caracteristicas", href: ROUTES.sections.features },
  { label: "Terminos de Servicio", href: ROUTES.terms },
  { label: "Politica de Privacidad", href: ROUTES.privacy },
  { label: "Contacto", href: ROUTES.contact },
];

export function MarketingFooter() {
  return (
    <footer className="relative z-10 border-t border-border px-6 py-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-primary" />
            <span className="font-heading text-sm font-600">
              Contract<span className="text-accent">Lens</span>
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ContractLens
          </p>
          <p className="text-xs text-muted-foreground">
            Analisis preliminar asistido por IA. No sustituye asesoria juridica profesional.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { FileSearch } from "lucide-react";
import { ROUTES } from "@/constants";

const footerLinks = [
  { label: "Como funciona", href: ROUTES.sections.howItWorks },
  { label: "Caracteristicas", href: ROUTES.sections.features },
  { label: "Terminos", href: ROUTES.terms },
  { label: "Privacidad", href: ROUTES.privacy },
  { label: "Contacto", href: ROUTES.contact },
];

export function MarketingFooter() {
  return (
    <footer className="relative z-10 border-t border-border">
      <div className="mx-auto w-full max-w-screen-xl px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <FileSearch className="h-4 w-4 text-primary" />
            <span className="font-heading text-sm font-600">
              Contract<span className="text-accent">Lens</span>
            </span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
          <p className="text-xs text-muted-foreground shrink-0">
            &copy; {new Date().getFullYear()} WhalenSoft
          </p>
        </div>
      </div>
    </footer>
  );
}

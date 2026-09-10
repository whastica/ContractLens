"use client";

import Link from "next/link";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";

export function MarketingNav() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <FileSearch className="h-3.5 w-3.5 fill-white text-white" />
        </div>
        <span className="font-heading text-[15px] font-700">
          Contract<span className="text-accent">Lens</span>
        </span>
        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-accent/30 text-accent hidden sm:flex">
          Beta
        </Badge>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        <Link href={ROUTES.sections.howItWorks} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
          Como funciona
        </Link>
        <Link href={ROUTES.sections.features} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
          Caracteristicas
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {isSignedIn ? (
          <>
            <Button size="sm" variant="ghost" onClick={async () => { await signOut(); router.push("/"); }} className="text-muted-foreground hover:text-foreground">
              Cerrar sesion
            </Button>
            <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
              <Link href={ROUTES.dashboard}>
                Dashboard
              </Link>
            </Button>
          </>
        ) : (
          <Button size="sm" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5">
            <Link href={ROUTES.login}>
              Iniciar sesion
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}

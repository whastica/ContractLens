"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  FileSearch, LayoutDashboard, FolderOpen, History,
  Settings, ChevronRight, Search,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { label: "Dashboard",     href: ROUTES.dashboard, icon: LayoutDashboard, badge: null, strict: true },
  { label: "Nuevo Análisis", href: ROUTES.analyze,   icon: Search,        badge: null, strict: false },
  { label: "Contratos",     href: ROUTES.contracts,  icon: FolderOpen,    badge: null, strict: false },
  { label: "Historial",     href: ROUTES.history,    icon: History,       badge: null, strict: false },
  { label: "Configuración", href: ROUTES.settings,   icon: Settings,      badge: null, strict: false },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const displayName  = user?.fullName ?? user?.firstName ?? "Usuario";
  const displayEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  const initials     = getInitials(displayName);
  const avatarUrl    = user?.imageUrl;

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-border bg-card/50 backdrop-blur-sm">

        <Link href={ROUTES.dashboard} className="flex h-14 items-center gap-2.5 border-b border-border px-4 hover:bg-muted/40 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <FileSearch className="h-4 w-4 fill-white text-white" />
          </div>
          <span className="font-heading text-[15px] font-700">
            Contract<span className="text-accent">Lens</span>
          </span>
          <Badge
            variant="outline"
            className="ml-auto text-[9px] px-1.5 py-0 border-accent/30 text-accent"
          >
            Beta
          </Badge>
        </Link>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = item.strict
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="h-3 w-3 text-primary/60" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 px-1">
            {isLoaded && avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                {isLoaded ? initials : "..."}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-foreground">
                {isLoaded ? displayName : "Cargando..."}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {isLoaded ? displayEmail : ""}
              </p>
            </div>
          </div>
        </div>

      </aside>
  );
}

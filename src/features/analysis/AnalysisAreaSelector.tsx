"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Scale,
  Users,
  Briefcase,
  Gavel,
  Landmark,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LEGAL_AREAS } from "@/constants";
import type { LegalArea } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale,
  Users,
  Briefcase,
  Gavel,
  Landmark,
  FileText,
};

interface AnalysisAreaSelectorProps {
  value: LegalArea;
  onChange: (area: LegalArea) => void;
}

export function AnalysisAreaSelector({ value, onChange }: AnalysisAreaSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("[data-area-card]")?.offsetWidth ?? 200;
    el.scrollBy({ left: direction === "left" ? -(cardWidth + 12) : cardWidth + 12, behavior: "smooth" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-white">
            Area legal
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            Selecciona la especialidad para activar el agente experto
          </p>
        </div>
        {/* Mobile scroll arrows */}
        <div className="flex gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              canScrollLeft ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-600"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              canScrollRight ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-600"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Desktop: Grid 3x2 / Tablet: Grid 2x3 */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {LEGAL_AREAS.map((area) => {
          const Icon = ICON_MAP[area.icon] ?? Scale;
          const isSelected = value === area.id;
          return (
            <button
              key={area.id}
              type="button"
              onClick={() => onChange(area.id)}
              data-area-card
              className={cn(
                "group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-300",
                "backdrop-blur-md",
                isSelected
                  ? "border-blue-400/60 bg-blue-500/20 shadow-[0_0_24px_rgba(59,130,246,0.2)] ring-1 ring-blue-400/40"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 hover:scale-[1.01]"
              )}
            >
              {/* Check badge */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
              )}

              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                  isSelected
                    ? "bg-blue-500/25 text-blue-300"
                    : "bg-white/10 text-slate-400 group-hover:bg-blue-500/15 group-hover:text-blue-300"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className={cn(
                  "font-medium text-sm leading-tight transition-colors duration-300",
                  isSelected ? "text-blue-300" : "text-white group-hover:text-white"
                )}>
                  {area.label}
                </p>
                <p className="mt-1 text-xs leading-snug text-slate-400 line-clamp-2">
                  {area.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile: Horizontal scroll carousel */}
      <div className="md:hidden relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {LEGAL_AREAS.map((area) => {
            const Icon = ICON_MAP[area.icon] ?? Scale;
            const isSelected = value === area.id;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onChange(area.id)}
                data-area-card
                className={cn(
                  "snap-center shrink-0 w-[160px] flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-300",
                  "backdrop-blur-md",
                  isSelected
                    ? "border-blue-400/60 bg-blue-500/20 shadow-[0_0_24px_rgba(59,130,246,0.2)] ring-1 ring-blue-400/40"
                    : "border-white/10 bg-white/5 active:scale-95"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300",
                    isSelected
                      ? "bg-blue-500/25 text-blue-300"
                      : "bg-white/10 text-slate-400"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className={cn(
                  "text-sm font-medium leading-tight",
                  isSelected ? "text-blue-300" : "text-white"
                )}>
                  {area.shortLabel}
                </p>
              </button>
            );
          })}
        </div>

        {/* Scroll indicators */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Scroll dots - mobile only */}
      <div className="flex md:hidden justify-center gap-1.5">
        {LEGAL_AREAS.map((area) => (
          <div
            key={area.id}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              value === area.id ? "w-4 bg-blue-400" : "w-1.5 bg-white/20"
            )}
          />
        ))}
      </div>
    </div>
  );
}

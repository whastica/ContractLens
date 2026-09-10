"use client";

import { cn } from "@/lib/utils";

interface AtmosphericBackgroundProps {
  className?: string;
}

export function AtmosphericBackground({ className }: AtmosphericBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className="atmo-blob"
        style={{
          width: 650,
          height: 650,
          background: "#1e40af",
          top: -180,
          left: -160,
          animationDelay: "0s",
        }}
      />
      <div
        className="atmo-blob"
        style={{
          width: 480,
          height: 480,
          background: "#d97706",
          bottom: -130,
          right: -100,
          animationDelay: "-7s",
        }}
      />
      <div
        className="atmo-blob"
        style={{
          width: 340,
          height: 340,
          background: "#2563eb",
          top: "42%",
          left: "58%",
          animationDelay: "-13s",
        }}
      />
    </div>
  );
}

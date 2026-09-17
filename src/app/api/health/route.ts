import { NextResponse } from "next/server";
import { isDev, useMockAI, useMockDB } from "@/lib/env";

export async function GET() {
  const health: Record<string, unknown> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    flags: {
      useMockAI,
      useMockDB,
    },
    services: {
      openai: !!process.env.OPENAI_API_KEY,
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      clerk: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
  };

  if (!isDev) {
    delete health.flags;
    delete health.services;
  }

  return NextResponse.json(health);
}

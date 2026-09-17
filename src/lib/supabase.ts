import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey   = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL no está configurada");
if (!serviceKey)  throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada");

/**
 * Convierte un Clerk user ID (string) a un UUID v4 determinístico.
 * Siempre produce el mismo UUID para el mismo Clerk ID.
 */
export function clerkIdToUuid(clerkId: string): string {
  const hash = createHash("sha256").update(clerkId).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "5" + hash.slice(13, 16),
    ((parseInt(hash.charAt(16), 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

export function getSupabaseServer() {
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

export interface DbContract {
  id:            string;
  user_id:       string;
  name:          string;
  file_name:     string;
  file_type:     "pdf" | "docx";
  file_size_bytes: number;
  raw_text:      string;
  detected_type: string | null;
  confirmed_type: string | null;
  status:        "uploaded" | "processing" | "completed" | "error";
  created_at:    string;
  updated_at:    string;
}

export interface DbAnalysis {
  id:            string;
  contract_id:   string;
  user_id:       string;
  status:        "pending" | "processing" | "completed" | "error";
  contract_type: string | null;
  parties:       Record<string, unknown>[] | null;
  duration:      string | null;
  total_value:   string | null;
  payment_terms: string | null;
  renewal_terms: string | null;
  termination_terms: string | null;
  jurisdiction:  string | null;
  key_obligations: Record<string, unknown>[] | null;
  key_findings:  Record<string, unknown>[] | null;
  critical_count: number;
  review_count:  number;
  ok_count:      number;
  undetermined_count: number;
  tokens_used:   number | null;
  latency_ms:    number | null;
  pipeline_steps: Record<string, unknown>[] | null;
  created_at:    string;
  updated_at:    string;
}

export interface DbClause {
  id:            string;
  analysis_id:   string;
  user_id:       string;
  contract_id:   string;
  clause_number: string | null;
  title:         string;
  category:      string | null;
  page_number:   number | null;
  raw_text:      string;
  summary:       string | null;
  created_at:    string;
}

export interface DbFinding {
  id:            string;
  analysis_id:   string;
  clause_id:     string | null;
  user_id:       string;
  contract_id:   string;
  severity:      "critical" | "review" | "ok" | "undetermined";
  category:      string;
  title:         string;
  evidence_text: string;
  page_number:   number | null;
  clause_reference: string | null;
  explanation:   string;
  why_it_matters: string | null;
  possible_impact: string | null;
  recommendation: string | null;
  legal_reference: string | null;
  confidence:    number | null;
  created_at:    string;
}

export interface DbSource {
  id:            string;
  finding_id:    string;
  user_id:       string;
  source_type:   string;
  name:          string;
  description:   string | null;
  url:           string | null;
  created_at:    string;
}

export interface DbReport {
  id:            string;
  analysis_id:   string;
  user_id:       string;
  contract_id:   string;
  format:        "pdf" | "json";
  content:       Record<string, unknown> | null;
  file_url:      string | null;
  created_at:    string;
}

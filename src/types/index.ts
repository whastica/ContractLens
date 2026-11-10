// ─── Domain: Legal Area ─────────────────────────────────────────────────────
export type LegalArea =
  | "civil_comercial"
  | "familia"
  | "laboral"
  | "penal"
  | "publico"
  | "general";

export interface AreaTheme {
  gradient: string;
  glow: string;
  border: string;
}

// FindingCategory por rama del derecho
export type CivilCommercialFindingCategory =
  | "terminacion_anticipada"
  | "penalidad"
  | "confidencialidad"
  | "propiedad_intelectual"
  | "pago"
  | "obligaciones"
  | "responsabilidad"
  | "garantia"
  | "seguro"
  | "ley_aplicable"
  | "jurisdiccion"
  | "arrendamiento_canon"
  | "arrendamiento_subarriendo"
  | "arrendamiento_mejoras"
  | "arrendamiento_deposito"
  | "titulo_valor_elementos"
  | "titulo_valor_endoso"
  | "otro";

export type FamilyLawFindingCategory =
  | "alimentos"
  | "custodia"
  | "patria_potestad"
  | "regimen_visitas"
  | "divorcio"
  | "liquidacion_sociedad"
  | "bienes"
  | "apoyo"
  | "registro_civil"
  | "derechos_menores"
  | "otro";

export type LaborLawFindingCategory =
  | "despido"
  | "prestaciones_sociales"
  | "jornada_laboral"
  | "salario"
  | "seguridad_social"
  | "subordinacion_disfrazada"
  | "competencia_despues_terminacion"
  | "derechos_minimos"
  | "sanciones_disciplinarias"
  | "ley_aplicable"
  | "otro";

export type CriminalLawFindingCategory =
  | "prescripcion_accion_penal"
  | "terminos_procesales"
  | "derechos_victima"
  | "debido_proceso"
  | "legalidad_pruebas"
  | "fundamentacion_juridica"
  | "consistencia_narrativa"
  | "antecedentes_penales"
  | "conciliacion_penal"
  | "otro";

export type PublicLawFindingCategory =
  | "legitimacion_activa"
  | "inmediatez_tutela"
  | "competencia_autoridad"
  | "fundamentacion"
  | "via_gubernativa"
  | "terminos_procesales"
  | "debido_proceso"
  | "claridad_peticiones"
  | "medida_provisional"
  | "insolvencia"
  | "otro";

export type GeneralFindingCategory =
  | "claridad_obligaciones"
  | "coherencia_interna"
  | "ambiguedad"
  | "equilibrio_partes"
  | "completitud"
  | "forma"
  | "sintaxis_legal"
  | "ley_aplicable"
  | "otro";

// ─── Domain: Contract ─────────────────────────────────────────────────────────
export type ContractType = "prestacion_servicios" | "laboral" | "nda" | "otro";
export type ContractFiletype = "pdf" | "docx";
export type ContractStatus = "uploaded" | "processing" | "completed" | "error";

export interface ContractParty {
  name: string;
  role: string;
  identification?: string;
}

export interface Contract {
  id: string;
  userId: string;
  name: string;
  fileName: string;
  fileType: ContractFiletype;
  fileSizeBytes: number;
  rawText: string;
  detectedType?: ContractType;
  confirmedType?: ContractType;
  area: LegalArea;
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Domain: Analysis ────────────────────────────────────────────────────────
export type AnalysisStatus = "pending" | "processing" | "completed" | "error";

export type FindingSeverity = "critical" | "review" | "ok" | "undetermined";

export type FindingCategory =
  | "terminacion_anticipada"
  | "penalidad"
  | "confidencialidad"
  | "propiedad_intelectual"
  | "pago"
  | "obligaciones"
  | "responsabilidad"
  | "garantia"
  | "seguro"
  | "ley_aplicable"
  | "jurisdiccion"
  | "otro";

export interface AnalysisSummary {
  contractType: ContractType;
  parties: ContractParty[];
  duration?: string;
  totalValue?: string;
  paymentTerms?: string;
  renewalTerms?: string;
  terminationTerms?: string;
  jurisdiction?: string;
  keyObligations: string[];
  keyFindings: string[];
}

export interface AnalysisHealthCheck {
  critical: number;
  review: number;
  ok: number;
  undetermined: number;
}

export interface Analysis {
  id: string;
  contractId: string;
  userId: string;
  status: AnalysisStatus;
  area: LegalArea;
  
  summary?: AnalysisSummary;
  healthCheck?: AnalysisHealthCheck;
  
  tokensUsed?: number;
  latencyMs?: number;
  pipelineSteps?: PipelineStep[];
  
  createdAt: Date;
  updatedAt: Date;
}

// ─── Domain: Clause ──────────────────────────────────────────────────────────
export type ClauseCategory =
  | "objeto"
  | "obligaciones"
  | "duracion"
  | "pago"
  | "penalidades"
  | "terminacion"
  | "confidencialidad"
  | "propiedad_intelectual"
  | "responsabilidad"
  | "garantia"
  | "seguro"
  | "ley_aplicable"
  | "jurisdiccion"
  | "otro";

export interface Clause {
  id: string;
  analysisId: string;
  contractId: string;
  clauseNumber?: string;
  title: string;
  category?: ClauseCategory;
  pageNumber?: number;
  rawText: string;
  summary?: string;
  createdAt: Date;
}

// ─── Domain: Finding ─────────────────────────────────────────────────────────
export interface Finding {
  id: string;
  analysisId: string;
  clauseId?: string;
  contractId: string;
  
  severity: FindingSeverity;
  category: FindingCategory;
  title: string;
  
  evidenceText: string;
  pageNumber?: number;
  clauseReference?: string;
  
  explanation: string;
  whyItMatters?: string;
  possibleImpact?: string;
  recommendation?: string;
  legalReference?: string;
  confidence?: number;
  
  createdAt: Date;
}

// ─── Domain: Source ──────────────────────────────────────────────────────────
export type SourceType = "norma" | "jurisprudencia" | "doctrina" | "referencia";

export interface Source {
  id: string;
  findingId: string;
  sourceType: SourceType;
  name: string;
  description?: string;
  url?: string;
  createdAt: Date;
}

// ─── Domain: Report ──────────────────────────────────────────────────────────
export type ReportFormat = "pdf" | "json";

export interface Report {
  id: string;
  analysisId: string;
  contractId: string;
  format: ReportFormat;
  content?: Record<string, unknown>;
  fileUrl?: string;
  createdAt: Date;
}

// ─── Domain: Auth ────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

// ─── Domain: Pricing ─────────────────────────────────────────────────────────
export type PlanId = "free" | "pro" | "business";
export type BillingCycle = "monthly" | "yearly";

export interface PlanFeature {
  label: string;
  included: boolean;
  highlight?: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: PlanFeature[];
  limits: {
    analysesPerMonth: number | "unlimited";
    maxFileSizeMb: number;
    apiAccess: boolean;
    teamMembers: number;
    historyMonths: number | "unlimited";
  };
}

// ─── Upload ──────────────────────────────────────────────────────────────────
export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: ContractFiletype;
  status: UploadStatus;
  progress: number;
  preview?: string;
  error?: string;
}

// ─── Pipeline Types ──────────────────────────────────────────────────────────
export type AnalysisPhase =
  | "upload"
  | "classify"
  | "structure"
  | "clauses"
  | "risk"
  | "evidence"
  | "legal"
  | "report"
  | "done"
  | "error";

export interface PipelineStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
  durationMs?: number;
}

export interface SSEProgressEvent {
  type: "progress";
  phase: AnalysisPhase;
  stepIndex: number;
  totalSteps: number;
  message: string;
}

export interface SSEResultEvent {
  type: "result";
  data: Analysis;
}

export interface SSEErrorEvent {
  type: "error";
  code: string;
  message: string;
}

export type SSEEvent = SSEProgressEvent | SSEResultEvent | SSEErrorEvent;

// ─── API Types ───────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
}

export interface UploadMetadata {
  fileType: ContractFiletype;
  fileName: string;
  fileSizeBytes: number;
  pages?: number;
  wordCount: number;
  charCount: number;
}

export interface UploadResult {
  text: string;
  metadata: UploadMetadata;
}

// ─── Misc ────────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
}

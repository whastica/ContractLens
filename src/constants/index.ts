import type { ContractType, ContractFiletype, AnalysisPhase } from "@/types";

export const APP_NAME = "ContractLens";
export const APP_DESCRIPTION =
  "Análisis y preauditoría contractual asistida por IA para abogados y pymes en Colombia";

// ─── Contract Types ───────────────────────────────────────────────────────────
export const CONTRACT_TYPES: { value: ContractType; label: string; description: string }[] = [
  { value: "prestacion_servicios", label: "Prestación de servicios", description: "Contrato de prestación de servicios" },
  { value: "laboral",             label: "Laboral",                description: "Contrato de trabajo/laboral" },
  { value: "nda",                 label: "NDA",                    description: "Acuerdo de confidencialidad" },
  { value: "otro",                label: "Otro",                   description: "Otro tipo de contrato" },
];

// ─── Upload ───────────────────────────────────────────────────────────────────
export const ACCEPTED_DOCUMENT_TYPES: Record<string, string[]> = {
  "application/pdf":    [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
};

export const MAX_CONTRACT_SIZE_MB = 25;

// ─── Pipeline Steps ───────────────────────────────────────────────────────────
export const ANALYSIS_STEPS = [
  { id: "upload",      label: "Subiendo contrato..."                    },
  { id: "classify",    label: "Identificando tipo de contrato..."       },
  { id: "structure",   label: "Extrayendo información estructurada..."  },
  { id: "clauses",     label: "Analizando cláusulas..."                 },
  { id: "risk",        label: "Identificando hallazgos de riesgo..."    },
  { id: "evidence",    label: "Validando evidencia..."                  },
  { id: "legal",       label: "Fundamentando legalmente..."             },
  { id: "report",      label: "Generando informe..."                    },
] as const;

// ─── Routes ───────────────────────────────────────────────────────────────────
export const ROUTES = {
  home:           "/",
  login:          "/login",
  register:       "/register",
  forgotPassword: "/forgot-password",
  dashboard:      "/dashboard",
  analyze:        "/dashboard/analyze",
  contracts:      "/dashboard/contracts",
  history:        "/dashboard/history",
  settings:       "/dashboard/settings",
  pricing:        "/pricing",
  terms:          "/terms",
  privacy:        "/privacy",
  contact:        "/contact",

  sections: {
    howItWorks: "/#how-it-works",
    features: "/#features",
  },
} as const;

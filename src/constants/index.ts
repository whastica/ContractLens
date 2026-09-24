import type { ContractType, ContractFiletype, AnalysisPhase, LegalArea, AreaTheme } from "@/types";

export const APP_NAME = "ContractLens";
export const APP_DESCRIPTION =
  "Análisis y preauditoría contractual asistida por IA para abogados y pymes en Colombia";

// ─── Legal Areas ─────────────────────────────────────────────────────────────
export const LEGAL_AREAS: {
  id: LegalArea;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "civil_comercial",
    label: "Civil y Comercial",
    shortLabel: "Civil",
    description: "Contratos, títulos valores, demandas, procesos ejecutivos, conciliaciones",
    icon: "Scale",
  },
  {
    id: "familia",
    label: "Familia",
    shortLabel: "Familia",
    description: "Alimentos, custodia, divorcio, liquidación de sociedad conyugal",
    icon: "Users",
  },
  {
    id: "laboral",
    label: "Laboral y Seg. Social",
    shortLabel: "Laboral",
    description: "Contratos de trabajo, despidos, prestaciones sociales, querellas",
    icon: "Briefcase",
  },
  {
    id: "penal",
    label: "Penal y Penal Militar",
    shortLabel: "Penal",
    description: "Denuncias, querellas, antecedentes, conciliación penal",
    icon: "Gavel",
  },
  {
    id: "publico",
    label: "Público (Const. y Admin.)",
    shortLabel: "Público",
    description: "Tutelas, derechos de petición, recursos administrativos, insolvencia",
    icon: "Landmark",
  },
  {
    id: "general",
    label: "General / Otro",
    shortLabel: "General",
    description: "Documentos jurídicos no clasificados. Análisis con principios generales",
    icon: "FileText",
  },
];

// ─── Area Themes (Dynamic Backgrounds) ──────────────────────────────────────
// Paleta alineada con brand (azul) + accent (dorado). Variaciones navy por área.
export const AREA_THEMES: Record<LegalArea, AreaTheme> = {
  civil_comercial: {
    // Azul marino clásico — tono base de la app
    gradient: "linear-gradient(135deg, #0d1520 0%, #141f2e 100%)",
    glow: "rgba(37,99,235,0.15)",
    border: "rgba(37,99,235,0.2)",
  },
  familia: {
    // Navy con sutil tinte índigo/violeta
    gradient: "linear-gradient(135deg, #10142a 0%, #1a1f3a 100%)",
    glow: "rgba(99,102,241,0.15)",
    border: "rgba(99,102,241,0.2)",
  },
  laboral: {
    // Azul océano profundo — más saturado
    gradient: "linear-gradient(135deg, #0a1628 0%, #0f2035 100%)",
    glow: "rgba(59,130,246,0.18)",
    border: "rgba(59,130,246,0.22)",
  },
  penal: {
    // Navy profundo con azul eléctrico — más oscuro y saturado
    gradient: "linear-gradient(135deg, #0b0f1a 0%, #101828 100%)",
    glow: "rgba(30,64,175,0.2)",
    border: "rgba(30,64,175,0.25)",
  },
  publico: {
    // Steel blue — azul-gris institucional
    gradient: "linear-gradient(135deg, #0e1520 0%, #162030 100%)",
    glow: "rgba(100,116,139,0.15)",
    border: "rgba(100,116,139,0.2)",
  },
  general: {
    // Neutro oscuro — sin tono dominante
    gradient: "linear-gradient(135deg, #111827 0%, #1c2433 100%)",
    glow: "rgba(156,163,175,0.1)",
    border: "rgba(156,163,175,0.15)",
  },
};

// ─── Document Types by Area ──────────────────────────────────────────────────
export const DOCUMENT_TYPES_BY_AREA: Record<LegalArea, { id: string; label: string; category: string }[]> = {
  civil_comercial: [
    { id: "arrendamiento", label: "Arrendamiento", category: "Contrato" },
    { id: "compraventa", label: "Compraventa", category: "Contrato" },
    { id: "prestacion_servicios", label: "Prestación de servicios", category: "Contrato" },
    { id: "pagare", label: "Pagaré / Letra", category: "Título valor" },
    { id: "demanda_ejecutiva", label: "Demanda ejecutiva", category: "Demanda" },
    { id: "conciliacion", label: "Acta de conciliación", category: "Conciliación" },
  ],
  familia: [
    { id: "alimentos", label: "Cuota alimentaria", category: "Demanda" },
    { id: "custodia", label: "Custodia y visitas", category: "Demanda" },
    { id: "divorcio", label: "Divorcio", category: "Minuta" },
    { id: "liquidacion_sociedad", label: "Liquidación de sociedad", category: "Liquidación" },
    { id: "patria_potestad", label: "Patria potestad", category: "Demanda" },
    { id: "apoyo", label: "Acuerdo de apoyo", category: "Acuerdo" },
  ],
  laboral: [
    { id: "contrato_trabajo", label: "Contrato de trabajo", category: "Contrato" },
    { id: "carta_despido", label: "Carta de despido", category: "Carta" },
    { id: "liquidacion_prestaciones", label: "Liquidación de prestaciones", category: "Liquidación" },
    { id: "citacion_descargos", label: "Citación a descargos", category: "Citación" },
    { id: "querella_mintrabajo", label: "Querella Ministerio", category: "Querella" },
    { id: "reglamento_interno", label: "Reglamento interno", category: "Reglamento" },
  ],
  penal: [
    { id: "denuncia_penal", label: "Denuncia penal", category: "Denuncia" },
    { id: "querella", label: "Querella", category: "Querella" },
    { id: "antecedentes", label: "Cancelación antecedentes", category: "Solicitud" },
    { id: "victima", label: "Constitución de víctima", category: "Solicitud" },
    { id: "preclusion", label: "Solicitud de preclusión", category: "Solicitud" },
    { id: "conciliacion_penal", label: "Conciliación penal", category: "Conciliación" },
  ],
  publico: [
    { id: "tutela", label: "Acción de tutela", category: "Acción" },
    { id: "derecho_peticion", label: "Derecho de petición", category: "Derecho" },
    { id: "recurso_admin", label: "Recurso administrativo", category: "Recurso" },
    { id: "insolvencia", label: "Insolvencia", category: "Solicitud" },
    { id: "impugnacion", label: "Impugnación", category: "Impugnación" },
    { id: "desacato", label: "Desacato", category: "Desacato" },
  ],
  general: [
    { id: "contrato_generico", label: "Contrato genérico", category: "Contrato" },
    { id: "poder", label: "Poder", category: "Poder" },
    { id: "acta", label: "Acta / Acuerdo", category: "Acta" },
    { id: "otro", label: "Otro documento", category: "Otro" },
  ],
};

export const DOCUMENTS_BY_AREA: Record<LegalArea, string[]> = {
  civil_comercial: [
    "Contrato de compraventa",
    "Contrato de arrendamiento (vivienda/local comercial)",
    "Contrato de comodato y mutuo",
    "Contrato de prestación de servicios",
    "Pagarés, letras de cambio, cheques, facturas",
    "Demandas de restitución de inmueble arrendado",
    "Procesos ejecutivos (cobro de deudas)",
    "Solicitudes y actas de conciliación extrajudicial",
    "Promesas de compraventa y escrituras",
  ],
  familia: [
    "Demandas de cuota alimentaria (fijación, aumento, reducción, exoneración)",
    "Regulación de custodia y régimen de visitas",
    "Pérdida o suspensión de patria potestad",
    "Minutas de divorcio por mutuo acuerdo",
    "Cesación de efectos civiles",
    "Liquidación de sociedad conyugal / patrimonial",
    "Acuerdos de apoyo (Ley 1996 de 2019)",
    "Inventario de bienes / pasivos",
    "Registros civiles de nacimiento, matrimonio y defunción",
  ],
  laboral: [
    "Contratos individuales de trabajo (fijo, indefinido, obra/labor)",
    "Reglamentos internos, otrosí y memorandos",
    "Cartas de despido (con o sin justa causa)",
    "Citaciones a descargos y procesos disciplinarios",
    "Liquidaciones de prestaciones sociales",
    "Paz y salvos",
    "Querellas ante el Ministerio del Trabajo",
    "Derechos de petición ante EPS, ARL o fondos de pensión",
  ],
  penal: [
    "Denuncias penales",
    "Querellas",
    "Solicitudes de cancelación de antecedentes penales",
    "Solicitudes de constitución de víctima",
    "Solicitudes de preclusión o libertad",
    "Conciliación penal en delitos querellables",
    "Injuria, calumnia, lesiones culposas, abuso de confianza",
  ],
  publico: [
    "Acciones de tutela (salud, mínimo vital, debido proceso)",
    "Impugnaciones y desacatos",
    "Derechos de petición (información, consultas, interés general)",
    "Recursos administrativos (reposición y apelación - CPACA)",
    "Solicitudes de negociación de deudas (insolvencia)",
    "Relación de acreedores",
    "Propuestas de reestructuración",
  ],
  general: [
    "Poderes generales y especiales",
    "Estipulaciones genéricas",
    "Actas de reuniones o acuerdos",
    "Contratos atípicos o mixtos",
    "Cualquier documento no listado en áreas especializadas",
  ],
};

export const DISCLAIMER_BY_AREA: Record<LegalArea, string> = {
  civil_comercial:
    "Análisis especializado en derecho civil y comercial colombiano. El agente experto validará forma, equilibrio prestacional, cláusulas abusivas y marco normativo del Código Civil y Código de Comercio.",
  familia:
    "Análisis especializado en derecho de familia colombiano. El agente experto validará protección de derechos de menores, equilibrio en acuerdos familiares y marco normativo del Código Civil en materia familiar.",
  laboral:
    "Análisis especializado en derecho laboral y seguridad social colombiano. El agente experto validará derechos mínimos del trabajador, primacía de la realidad, prestaciones sociales y marco normativo del Código Sustantivo del Trabajo.",
  penal:
    "Análisis especializado en derecho penal y penal militar colombiano. El agente experto validará fundamentación jurídica, derechos de víctimas e imputados, términos procesales y marco normativo del Código Penal y Código de Procedimiento Penal.",
  publico:
    "Análisis especializado en derecho público, constitucional y administrativo colombiano. El agente experto validará fundamentación constitucional, debido proceso, legitimación, términos y marco normativo de la Constitución y el CPACA.",
  general:
    "Este análisis se realiza con base en principios generales del derecho y técnica jurídica. No se cuenta con un motor ajustado a un marco normativo hiper-específico. Se recomienda seleccionar una rama del derecho para un análisis más preciso.",
};

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

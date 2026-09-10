# ContractLens — Plan de Implementación Beta 0.1

## Resumen Ejecutivo

ContractLens es una plataforma de análisis y preauditoría contractual asistida por IA para abogados y pymes en Colombia. Este plan detalla la implementación de la Beta 0.1 reutilizando la infraestructura de StoryForge y creando los componentes específicos para análisis de contratos.

---

## FASE 0: Auditoría Comparativa (COMPLETADA)

### Lo que se REUTILIZA directamente de StoryForge

| Categoría | Componentes | Estado |
|-----------|-------------|--------|
| **Framework** | Next.js 16 App Router, React 19, TypeScript 6 | ✅ Reutilizar |
| **UI** | shadcn/ui (13 componentes), Tailwind CSS, lucide-react, framer-motion | ✅ Reutilizar |
| **Layout** | DashboardSidebar, DashboardHeader, MarketingNav | ✅ Reutilizar |
| **Auth** | Clerk (login, register, SSO Google, middleware, helpers) | ✅ Reutilizar |
| **DB** | Supabase client, patrón de servicios, RLS pattern | ✅ Reutilizar |
| **Hooks** | React Query, useAuth, useDashboard, useProjects, useToast | ✅ Reutilizar |
| **Utils** | cn(), apiResponse, apiError, catchApiError, ApiRouteError | ✅ Reutilizar |
| **Env** | Validación Zod de variables de entorno | ✅ Reutilizar |
| **Rate Limit** | Upstash Redis + in-memory fallback | ✅ Reutilizar |
| **Upload** | react-dropzone, UploadZone (adaptar) | ✅ Reutilizar |
| **File Processing** | pdf-parse, mammoth | ✅ Reutilizar |
| **Export** | jspdf, jspdf-autotable (adaptar para informes) | ✅ Reutilizar |
| **Security** | Headers CORS, Clerk proxy, validación env | ✅ Reutilizar |
| **SSE Pattern** | Streaming de progreso del pipeline | ✅ Reutilizar |
| **Mock Flags** | USE_MOCK_AI, USE_MOCK_DB | ✅ Reutilizar |
| **Landing** | MarketingNav, AtmosphericBackground, Pricing page | ✅ Reutilizar |
| **Error Pages** | error.tsx, not-found.tsx, loading.tsx | ✅ Reutilizar |

### Lo que se ADAPTA de StoryForge

| Componente | Adaptación | Esfuerzo |
|------------|------------|----------|
| **Dashboard** | Stats de HU → Análisis de contratos | Bajo |
| **Projects** | Proyectos → Contratos/Análisis | Bajo |
| **History** | Historial de generaciones → Historial de análisis | Bajo |
| **UploadZone** | Quitar audio, solo PDF/DOCX | Bajo |
| **Sidebar** | Navegación para ContractLens | Bajo |
| **GeneratorContainer** | → AnalysisContainer | Medio |
| **GeneratorLoader** | → AnalysisProgress (pipeline propio) | Medio |
| **GeneratorResults** | → AnalysisResults (hallazgos, evidencia) | Medio |
| **Export PDF** | → Informe de preauditoría | Medio |
| **Pricing** | Planes Pyme/Profesional | Bajo |

### Lo que se CREA NUEVO

| Componente | Descripción | Esfuerzo |
|------------|-------------|----------|
| **Pipeline de Análisis** | 7 etapas: Ingest → Classify → Structure → Clause → Risk → Evidence → Report | Alto |
| **Schema BD** | contracts, analyses, clauses, findings, sources, reports | Alto |
| **Tipos Dominio** | Interfaces para contratos, análisis, cláusulas, hallazgos | Medio |
| **ContractUpload** | Componente específico para subir contratos | Bajo |
| **ContractTypeSelector** | Seleccionar/corregir tipo de contrato | Bajo |
| **AnalysisProgress** | Progreso del pipeline de análisis | Medio |
| **ContractSummary** | Resumen ejecutivo del contrato | Medio |
| **StructuredInfoTable** | Tabla de información estructurada | Bajo |
| **FindingsList** | Lista de hallazgos con categorías | Medio |
| **FindingCard** | Card de hallazgo con evidencia | Medio |
| **EvidenceViewer** | Visor de evidencia del documento | Medio |
| **ClauseSearch** | Búsqueda de cláusulas | Medio |
| **ReportPreview** | Vista previa del informe | Medio |
| **ContractHealthCheck** | Dashboard de salud del contrato | Medio |
| **API /api/analyze** | Endpoint principal de análisis | Alto |
| **API /api/analyses** | CRUD de análisis | Bajo |
| **API /api/contracts** | CRUD de contratos | Bajo |

### Lo que se DESCARTA

| Componente | Razón |
|------------|-------|
| **Pipeline de 5 prompts (HU)** | No aplica a análisis contractual |
| **Reglas INVEST** | No aplican |
| **Criterios Gherkin** | No aplican |
| **Story Points** | No aplican |
| **MoSCoW/Kano/WSJF** | No aplican |
| **GeneratorSidebar** | Config de HU no aplica |
| **Transcripción de audio** | No necesaria |
| **Mock stories** | Datos de prueba de HU |
| **Prompt strategy docs** | No aplican |

---

## FASE 1: Inicializar Proyecto

### 1.1 Copiar base de StoryForge

```
D:\Proyectos\Contractlens\
├── src/
│   ├── app/                    # Copiar estructura base
│   ├── components/             # Copiar UI + layout
│   ├── features/               # Adaptar
│   ├── hooks/                  # Copiar y adaptar
│   ├── services/               # Reemplazar completamente
│   ├── lib/                    # Copiar tal cual
│   ├── types/                  # Reemplazar
│   ├── constants/              # Adaptar
│   ├── styles/                 # Copiar tal cual
│   └── mocks/                  # Adaptar
├── supabase/                   # Nuevas migraciones
├── package.json                # Mismas dependencias
├── next.config.ts              # Copiar
├── tailwind.config.ts          # Copiar
├── tsconfig.json               # Copiar
├── components.json             # Copiar
└── postcss.config.mjs          # Copiar
```

### 1.2 Variables de entorno

Mismas variables que StoryForge, agregar:
- `OPENAI_MODEL` (default: gpt-4o-mini)
- `MAX_CONTRACT_SIZE_MB` (default: 25)
- `SUPPORTED_CONTRACT_TYPES` (json array)

### 1.3 Dependencias

Mismas dependencias que StoryForge. No se necesitan paquetes adicionales para Beta 0.1.

---

## FASE 2: Schema de Base de Datos

### 2.1 Tablas nuevas

```sql
-- Contratos subidos por usuarios
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx')),
  file_size_bytes INTEGER NOT NULL,
  raw_text TEXT NOT NULL,
  detected_type TEXT, -- prestacion_servicios, laboral, nda, otro
  confirmed_type TEXT, -- lo que el usuario confirma/corrige
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Análisis realizados sobre contratos
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  
  -- Resumen ejecutivo
  contract_type TEXT,
  parties JSONB, -- [{name, role, identification}]
  duration TEXT,
  total_value TEXT,
  payment_terms TEXT,
  renewal_terms TEXT,
  termination_terms TEXT,
  jurisdiction TEXT,
  key_obligations JSONB, -- [{party, obligation}]
  key_findings JSONB, -- [{severity, description}]
  
  -- Health check counts
  critical_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  ok_count INTEGER DEFAULT 0,
  undetermined_count INTEGER DEFAULT 0,
  
  -- Metadata
  tokens_used INTEGER,
  latency_ms INTEGER,
  pipeline_steps JSONB, -- [{step, status, duration_ms}]
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cláusulas extraídas del contrato
CREATE TABLE clauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  
  clause_number TEXT, -- "Cláusula 8", "Cláusula 3.2"
  title TEXT NOT NULL,
  category TEXT, -- terminacion, confidencialidad, propiedad_intelectual, pago, etc.
  page_number INTEGER,
  raw_text TEXT NOT NULL,
  summary TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hallazgos del análisis
CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  clause_id UUID REFERENCES clauses(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'review', 'ok', 'undetermined')),
  category TEXT NOT NULL, -- terminacion_anticipada, penalidad, confidencialidad, etc.
  title TEXT NOT NULL,
  
  evidence_text TEXT NOT NULL, -- Fragmento original del contrato
  page_number INTEGER,
  clause_reference TEXT,
  
  explanation TEXT NOT NULL, -- ¿Qué detectamos?
  why_it_matters TEXT, -- ¿Por qué importa?
  possible_impact TEXT, -- Económico / operativo / contractual
  recommendation TEXT, -- Recomendación
  legal_reference TEXT, -- Fuente normativa/referencia
  confidence REAL, -- 0-1
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fuentes y referencias legales
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_id UUID REFERENCES findings(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  
  source_type TEXT NOT NULL, -- norma, jurisprudencia, doctrina, referencia
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Informes generados
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  
  format TEXT NOT NULL CHECK (format IN ('pdf', 'json')),
  content JSONB, -- Estructura del informe
  file_url TEXT, -- URL del PDF generado
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Índices

```sql
CREATE INDEX idx_contracts_user_id ON contracts(user_id);
CREATE INDEX idx_analyses_contract_id ON analyses(contract_id);
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_clauses_analysis_id ON clauses(analysis_id);
CREATE INDEX idx_findings_analysis_id ON findings(analysis_id);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_reports_analysis_id ON reports(analysis_id);
```

### 2.3 RLS Policies

```sql
-- Contracts
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own contracts" ON contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own contracts" ON contracts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contracts" ON contracts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contracts" ON contracts FOR DELETE USING (auth.uid() = user_id);

-- Analyses
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analyses" ON analyses FOR SELECT USING (auth.uid() = user_id);
-- ... (similar para INSERT, UPDATE, DELETE)

-- Clauses, Findings, Sources, Reports (mismo patrón)
```

---

## FASE 3: Tipos de Dominio

### 3.1 src/types/index.ts

```typescript
// ─── Contract Types ──────────────────────────────────────────────────────────
export type ContractType = "prestacion_servicios" | "laboral" | "nda" | "otro";
export type ContractFiletype = "pdf" | "docx";
export type ContractStatus = "uploaded" | "processing" | "completed" | "error";

export interface ContractParty {
  name: string;
  role: string; // "contratante", "contratista", "empleador", "empleado"
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
  status: ContractStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Analysis Types ──────────────────────────────────────────────────────────
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
  
  summary?: AnalysisSummary;
  healthCheck?: AnalysisHealthCheck;
  
  tokensUsed?: number;
  latencyMs?: number;
  pipelineSteps?: PipelineStep[];
  
  createdAt: Date;
  updatedAt: Date;
}

// ─── Clause Types ────────────────────────────────────────────────────────────
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

// ─── Finding Types ───────────────────────────────────────────────────────────
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

// ─── Source Types ────────────────────────────────────────────────────────────
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

// ─── Report Types ────────────────────────────────────────────────────────────
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

// ─── Pipeline Types ──────────────────────────────────────────────────────────
export type AnalysisPhase =
  | "upload"
  | "extract"
  | "classify"
  | "structure"
  | "clauses"
  | "risk"
  | "evidence"
  | "report"
  | "done"
  | "error";

export interface PipelineStep {
  step: string;
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
```

---

## FASE 4: Pipeline de Análisis

### 4.1 Arquitectura del Pipeline

```
PDF / DOCX
    ↓
[1] INGEST - Extracción y limpieza de texto
    ↓
[2] CLASSIFY - Identificación del tipo de contrato
    ↓
[3] STRUCTURE - Partes + fechas + valores + cláusulas
    ↓
[4] CLAUSE ANALYSIS - Obligaciones + condiciones + elementos relevantes
    ↓
[5] RISK ANALYSIS - Reglas + LLM
    ↓
[6] VALIDATION - Verificar evidencia en el documento
    ↓
[7] LEGAL GROUNDING - Fuentes/referencias cuando corresponda
    ↓
[8] REPORT - Resultado estructurado + PDF
```

### 4.2 Prompt Strategy

#### Prompt 1: CLASSIFY (Identificación de Tipo)

```
Eres un experto en derecho contractual colombiano. 
Analiza el siguiente texto de contrato e identifica su tipo.

Tipos posibles:
- prestacion_servicios: Contrato de prestación de servicios
- laboral: Contrato de trabajo/laboral
- nda: Acuerdo de confidencialidad / NDA
- otro: Otro tipo de contrato

Responde EXCLUSIVAMENTE con un JSON válido:
{
  "type": "prestacion_servicios",
  "confidence": 0.95,
  "reasoning": "Breve explicación"
}

Texto del contrato:
{CONTRACT_TEXT}
```

#### Prompt 2: STRUCTURE (Extracción de Estructura)

```
Eres un experto en análisis contractual. Extrae la información estructurada del contrato.

Incluye:
- Partes involucradas (nombre, rol, identificación si existe)
- Duración del contrato
- Valor total y forma de pago
- Condiciones de renovación
- Condiciones de terminación
- Jurisdicción aplicable
- Principales obligaciones de cada parte

Responde EXCLUSIVAMENTE con un JSON válido:
{
  "parties": [{"name": "...", "role": "...", "identification": "..."}],
  "duration": "...",
  "totalValue": "...",
  "paymentTerms": "...",
  "renewalTerms": "...",
  "terminationTerms": "...",
  "jurisdiction": "...",
  "keyObligations": ["..."]
}

Texto del contrato:
{CONTRACT_TEXT}
```

#### Prompt 3: CLAUSE ANALYSIS (Análisis de Cláusulas)

```
Eres un experto en análisis de cláusulas contractuales.
Analiza cada cláusula del contrato y extrae:

1. Número de cláusula
2. Título descriptivo
3. Categoría (objeto, obligaciones, duración, pago, penalidades, terminación, confidencialidad, propiedad_intelectual, responsabilidad, garantia, seguro, ley_aplicable, jurisdiccion, otro)
4. Resumen de la cláusula
5. Texto original de la cláusula

Responde EXCLUSIVAMENTE con un JSON válido:
{
  "clauses": [
    {
      "clauseNumber": "Cláusula 1",
      "title": "Objeto del contrato",
      "category": "objeto",
      "summary": "Breve resumen...",
      "rawText": "Texto original..."
    }
  ]
}

Texto del contrato:
{CONTRACT_TEXT}
```

#### Prompt 4: RISK ANALYSIS (Análisis de Riesgos)

```
Eres un experto en preauditoría contractual para abogados y pymes en Colombia.
Analiza el contrato y identifica hallazgos que requieren atención.

Para cada hallazgo incluye:
- Severidad: critical (requiere atención inmediata), review (para revisión), ok (sin observaciones), undetermined (no se puede determinar)
- Categoría: terminacion_anticipada, penalidad, confidencialidad, propiedad_intelectual, pago, obligaciones, responsabilidad, garantia, seguro, ley_aplicable, jurisdiccion, otro
- Título del hallazgo
- Evidencia: Fragmento exacto del contrato que respalda el hallazgo
- Referencia a cláusula y página si es posible
- Explicación: ¿Qué detectamos?
- ¿Por qué importa? En lenguaje sencillo
- Posible impacto: Económico / operativo / contractual
- Recomendación
- Referencia legal cuando corresponda
- Confianza (0-1)

IMPORTANTE:
- Cada hallazgo DEBE estar respaldado por evidencia del documento
- No inventar información que no aparezca en el contrato
- Si no puedes determinar algo, indica "undetermined"
- No presentar inferencias como hechos contractuales definitivos

Responde EXCLUSIVAMENTE con un JSON válido:
{
  "findings": [
    {
      "severity": "critical",
      "category": "terminacion_anticipada",
      "title": "Terminación unilateral sin justa causa",
      "evidenceText": "Fragmento exacto del contrato...",
      "pageNumber": 7,
      "clauseReference": "Cláusula 8",
      "explanation": "Descripción del posible punto de atención...",
      "whyItMatters": "Explicación en lenguaje sencillo...",
      "possibleImpact": "Económico: podrías perder la inversión...",
      "recommendation": "Llevar este punto a revisión profesional...",
      "legalReference": "Art. 1602 Código Civil Colombiano",
      "confidence": 0.9
    }
  ]
}

Contrato:
{CONTRACT_TEXT}

Información extraída:
{STRUCTURED_INFO}
```

#### Prompt 5: LEGAL GROUNDING (Fundamentación Legal)

```
Para cada hallazgo crítico o de revisión, identifica las fuentes legales aplicables en Colombia.

Incluye:
- Normas aplicables (Código Civil, Código de Comercio, Código Sustantivo del Trabajo, etc.)
- Jurisprudencia relevante cuando sea conocida
- Doctrina aplicable
- Referencias a artículos específicos

Responde EXCLUSIVAMENTE con un JSON válido:
{
  "legal_grounding": [
    {
      "finding_category": "terminacion_anticipada",
      "sources": [
        {
          "sourceType": "norma",
          "name": "Código Civil Colombiano",
          "description": "Art. 1602 - TODO lo que se pacte en un contrato lícito tiene fuerza de ley...",
          "url": "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=44354"
        }
      ]
    }
  ]
}

Hallazgos:
{FINDINGS}
```

### 4.3 Servicio de Análisis

```typescript
// src/services/ai/analysis.service.ts

import OpenAI from "openai";

const openai = new OpenAI();

interface AnalysisPipelineInput {
  contractText: string;
  contractType?: string;
}

export async function runAnalysisPipeline(
  input: AnalysisPipelineInput,
  onProgress: (phase: string, message: string) => void
) {
  const steps = [
    { id: "classify", name: "Identificando tipo de contrato" },
    { id: "structure", name: "Extrayendo información estructurada" },
    { id: "clauses", name: "Analizando cláusulas" },
    { id: "risk", name: "Identificando hallazgos de riesgo" },
    { id: "legal", name: "Fundamentando legalmente" },
  ];

  // Paso 1: Classify (si no se proporcionó tipo)
  onProgress("classify", "Identificando tipo de contrato...");
  const classification = await classifyContract(input.contractText);

  // Paso 2: Structure
  onProgress("structure", "Extrayendo información estructurada...");
  const structure = await extractStructure(input.contractText);

  // Paso 3: Clauses
  onProgress("clauses", "Analizando cláusulas...");
  const clauses = await analyzeClauses(input.contractText);

  // Paso 4: Risk Analysis
  onProgress("risk", "Identificando hallazgos de riesgo...");
  const findings = await analyzeRisks(input.contractText, structure);

  // Paso 5: Legal Grounding
  onProgress("legal", "Fundamentando legalmente...");
  const legalGrounding = await groundLegal(findings);

  return {
    classification,
    structure,
    clauses,
    findings,
    legalGrounding,
  };
}
```

---

## FASE 5: API Routes

### 5.1 POST /api/analyze

```typescript
// src/app/api/analyze/route.ts

import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { catchApiError, apiResponse, apiError } from "@/lib/api";
import { AnalyzeRequestSchema } from "@/lib/schemas";
import { runAnalysisPipeline } from "@/services/ai/analysis.service";
import { saveContract, saveAnalysis, saveClauses, saveFindings } from "@/services/db";

export async function POST(request: NextRequest) {
  return catchApiError(async () => {
    const { userId } = await requireAuth();
    await checkRateLimit(userId);

    const body = await request.json();
    const validated = AnalyzeRequestSchema.parse(body);

    // SSE streaming
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await runAnalysisPipeline(
            { contractText: validated.text, contractType: validated.contractType },
            (phase, message) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "progress", phase, message })}\n\n`)
              );
            }
          );

          // Persistir resultados
          const contract = await saveContract(userId, validated);
          const analysis = await saveAnalysis(userId, contract.id, result);
          await saveClauses(userId, analysis.id, contract.id, result.clauses);
          await saveFindings(userId, analysis.id, contract.id, result.findings);

          // Enviar resultado
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "result", data: analysis })}\n\n`)
          );
          controller.close();
        } catch (error) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "error", message: "Error en el análisis" })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  });
}
```

### 5.2 GET /api/analyses

```typescript
// src/app/api/analyses/route.ts

import { requireAuth } from "@/lib/auth";
import { catchApiError, apiResponse } from "@/lib/api";
import { getAnalysesByUser } from "@/services/db";

export async function GET() {
  return catchApiError(async () => {
    const { userId } = await requireAuth();
    const analyses = await getAnalysesByUser(userId);
    return apiResponse(analyses);
  });
}
```

### 5.3 GET /api/analyses/[id]

```typescript
// src/app/api/analyses/[id]/route.ts

import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { catchApiError, apiResponse, apiError } from "@/lib/api";
import { getAnalysisById, getClausesByAnalysis, getFindingsByAnalysis } from "@/services/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return catchApiError(async () => {
    const { userId } = await requireAuth();
    const { id } = params;

    const analysis = await getAnalysisById(id, userId);
    if (!analysis) {
      return apiError("NOT_FOUND", "Análisis no encontrado");
    }

    const [clauses, findings] = await Promise.all([
      getClausesByAnalysis(id, userId),
      getFindingsByAnalysis(id, userId),
    ]);

    return apiResponse({ ...analysis, clauses, findings });
  });
}
```

---

## FASE 6: Componentes UI

### 6.1 Componentes a Crear

```
src/features/analysis/
├── AnalysisContainer.tsx      # Orquestador principal
├── AnalysisSidebar.tsx        # Panel de configuración
├── AnalysisLoader.tsx         # Progreso del pipeline
├── AnalysisResults.tsx        # Resultados del análisis
├── AnalysisEmpty.tsx          # Estado vacío
│
├── ContractUpload.tsx         # Upload de contratos (adaptar de UploadZone)
├── ContractTypeSelector.tsx   # Seleccionar tipo de contrato
│
├── ContractSummary.tsx        # Resumen ejecutivo
├── StructuredInfoTable.tsx    # Tabla de información
├│
├── FindingsList.tsx           # Lista de hallazgos
├── FindingCard.tsx            # Card de hallazgo
├── EvidenceViewer.tsx         # Visor de evidencia
│
├── ClauseSearch.tsx           # Búsqueda de cláusulas
├── ClauseCard.tsx             # Card de cláusula
│
├── ContractHealthCheck.tsx    # Dashboard de salud
│
├── ReportPreview.tsx          # Vista previa del informe
└── ReportGenerator.tsx        # Generador de PDF
```

### 6.2 FindingCard (Ejemplo detallado)

```tsx
// src/features/analysis/FindingCard.tsx

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import type { Finding } from "@/types";

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    label: "Requiere atención",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    badge: "destructive",
  },
  review: {
    icon: AlertCircle,
    label: "Para revisión",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    badge: "warning",
  },
  ok: {
    icon: CheckCircle,
    label: "Sin observaciones",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    badge: "success",
  },
  undetermined: {
    icon: HelpCircle,
    label: "No determinado",
    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    badge: "secondary",
  },
};

interface FindingCardProps {
  finding: Finding;
}

export function FindingCard({ finding }: FindingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[finding.severity];
  const Icon = config.icon;

  return (
    <Card className={`border ${config.color}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <div>
              <Badge variant={config.badge as "destructive" | "warning" | "success" | "secondary"}>
                {config.label}
              </Badge>
              <h3 className="mt-1 font-semibold">{finding.title}</h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {finding.clauseReference && (
          <p className="text-sm text-muted-foreground">
            {finding.clauseReference}
            {finding.pageNumber && ` • Página ${finding.pageNumber}`}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Evidencia */}
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Evidencia:</p>
          <p className="text-sm italic">"{finding.evidenceText}"</p>
        </div>

        {expanded && (
          <>
            {/* Explicación */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                ¿Qué detectamos?
              </p>
              <p className="text-sm">{finding.explanation}</p>
            </div>

            {/* Por qué importa */}
            {finding.whyItMatters && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  ¿Por qué importa?
                </p>
                <p className="text-sm">{finding.whyItMatters}</p>
              </div>
            )}

            {/* Impacto */}
            {finding.possibleImpact && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Posible impacto:
                </p>
                <p className="text-sm">{finding.possibleImpact}</p>
              </div>
            )}

            {/* Recomendación */}
            {finding.recommendation && (
              <div className="rounded-md bg-blue-500/10 p-3">
                <p className="text-xs font-medium text-blue-400 mb-1">
                  Recomendación:
                </p>
                <p className="text-sm">{finding.recommendation}</p>
              </div>
            )}

            {/* Referencia legal */}
            {finding.legalReference && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                <span>{finding.legalReference}</span>
              </div>
            )}

            {/* Confianza */}
            {finding.confidence !== undefined && (
              <div className="text-xs text-muted-foreground">
                Confianza: {Math.round(finding.confidence * 100)}%
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## FASE 7: Páginas del Dashboard

### 7.1 Estructura de Páginas

```
src/app/dashboard/
├── layout.tsx                    # Reutilizar de StoryForge
├── page.tsx                      # Dashboard principal (adaptar stats)
├── analyze/
│   └── page.tsx                  # Nuevo análisis
├── analysis/
│   └── [id]/
│       └── page.tsx              # Detalle de análisis
├── contracts/
│   └── page.tsx                  # Lista de contratos
├── history/
│   └── page.tsx                  # Historial (adaptar)
└── settings/
    └── page.tsx                  # Configuración (reutilizar)
```

### 7.2 Dashboard Principal (Adaptado)

```tsx
// src/app/dashboard/page.tsx

import { StatCard } from "@/components/shared/StatCard";
import { useDashboard } from "@/hooks/useDashboard";
import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) return <DashboardStatsSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Contratos analizados"
          value={data.totalContracts}
          icon={FileText}
        />
        <StatCard
          label="Puntos de atención"
          value={data.criticalFindings}
          icon={AlertTriangle}
          trend="negative"
        />
        <StatCard
          label="Sin observaciones"
          value={data.okFindings}
          icon={CheckCircle}
          trend="positive"
        />
        <StatCard
          label="Último análisis"
          value={data.lastAnalysisDate}
          icon={Clock}
        />
      </div>

      {/* Análisis recientes */}
      <RecentAnalyses analyses={data.recentAnalyses} />
    </div>
  );
}
```

---

## FASE 8: Exportación PDF

### 8.1 Informe de Preauditoría

```typescript
// src/lib/export-analysis.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Analysis, Finding, Clause } from "@/types";

export function generateAnalysisReport(
  analysis: Analysis,
  clauses: Clause[],
  findings: Finding[]
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Portada
  doc.setFontSize(24);
  doc.text("INFORME DE PREAUDITORÍA CONTRACTUAL", pageWidth / 2, 40, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("ContractLens", pageWidth / 2, 50, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(new Date().toLocaleDateString("es-CO"), pageWidth / 2, 60, { align: "center" });

  // Advertencia
  doc.setFontSize(8);
  doc.text(
    "Este informe constituye un análisis preliminar asistido por inteligencia artificial " +
    "y no sustituye la revisión jurídica profesional.",
    pageWidth / 2,
    80,
    { align: "center", maxWidth: pageWidth - 40 }
  );

  doc.addPage();

  // 1. Identificación del documento
  doc.setFontSize(16);
  doc.text("1. Identificación del documento", 20, 20);
  doc.setFontSize(10);
  doc.text(`Tipo: ${analysis.summary?.contractType || "No determinado"}`, 20, 30);
  doc.text(`Partes: ${analysis.summary?.parties?.map(p => p.name).join(", ") || "No determinado"}`, 20, 38);
  doc.text(`Duración: ${analysis.summary?.duration || "No determinado"}`, 20, 46);
  doc.text(`Valor: ${analysis.summary?.totalValue || "No determinado"}`, 20, 54);

  // 2. Resumen ejecutivo
  doc.setFontSize(16);
  doc.text("2. Resumen ejecutivo", 20, 70);
  
  const healthCheck = analysis.healthCheck;
  if (healthCheck) {
    doc.setFontSize(10);
    doc.text(`🔴 ${healthCheck.critical} Requieren atención`, 20, 80);
    doc.text(`🟠 ${healthCheck.review} Para revisión`, 20, 88);
    doc.text(`🟢 ${healthCheck.ok} Sin observaciones relevantes`, 20, 96);
    doc.text(`⚪ ${healthCheck.undetermined} No determinados`, 20, 104);
  }

  // 3. Hallazgos
  doc.addPage();
  doc.setFontSize(16);
  doc.text("3. Hallazgos", 20, 20);

  const criticalFindings = findings.filter(f => f.severity === "critical");
  const reviewFindings = findings.filter(f => f.severity === "review");

  // Tabla de hallazgos críticos
  if (criticalFindings.length > 0) {
    doc.setFontSize(12);
    doc.text("Requieren atención", 20, 32);
    
    autoTable(doc, {
      startY: 36,
      head: [["Categoría", "Título", "Cláusula", "Evidencia"]],
      body: criticalFindings.map(f => [
        f.category,
        f.title,
        f.clauseReference || "-",
        f.evidenceText.substring(0, 100) + "...",
      ]),
      styles: { fontSize: 8 },
    });
  }

  // 4. Limitaciones
  doc.addPage();
  doc.setFontSize(16);
  doc.text("4. Limitaciones del análisis", 20, 20);
  doc.setFontSize(10);
  doc.text(
    "Este análisis es preliminar y no constituye asesoría jurídica. " +
    "Los hallazgos están basados en el texto del documento proporcionado " +
    "y no consideran circunstancias externas, negociaciones previas o " +
    "intenciones de las partes que no aparezcan en el contrato.",
    20,
    30,
    { maxWidth: pageWidth - 40 }
  );

  return doc;
}
```

---

## FASE 9: Validación y Testing

### 9.1 Criterios de Validación Beta 0.1

Una persona externa debe poder:

1. ✅ Crear cuenta (Clerk)
2. ✅ Subir contrato (PDF/DOCX)
3. ✅ Esperar procesamiento (SSE streaming)
4. ✅ Recibir análisis (resultado estructurado)
5. ✅ Entender resumen (ContractSummary)
6. ✅ Ver hallazgos (FindingsList)
7. ✅ Consultar evidencia (FindingCard)
8. ✅ Consultar fuentes (LegalGrounding)
9. ✅ Generar PDF (ReportGenerator)
10. ✅ Volver al análisis desde historial

### 9.2 Commands de Validación

```bash
# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check

# Dev
npm run dev
```

---

## FASE 10: Seguridad

### 10.1 Checklist de Seguridad

- [ ] RLS habilitado en todas las tablas
- [ ] Filtrado por userId en cada query
- [ ] Rate limiting en API routes
- [ ] Validación de archivos (tipo, tamaño)
- [ ] No exponer documentos de otros usuarios
- [ ] Variables sensibles solo en server-side
- [ ] Headers de seguridad configurados
- [ ] CORS configurado por entorno
- [ ] Error messages no exponen información interna

---

## Cronograma Estimado

| Fase | Descripción | Duración |
|------|-------------|----------|
| 1 | Inicializar proyecto | 1 día |
| 2 | Schema de BD | 1 día |
| 3 | Tipos de dominio | 0.5 días |
| 4 | Pipeline de análisis | 3 días |
| 5 | API Routes | 1 día |
| 6 | Componentes UI | 2 días |
| 7 | Páginas dashboard | 1 día |
| 8 | Exportación PDF | 1 día |
| 9 | Testing | 1 día |
| 10 | Seguridad | 0.5 días |
| **Total** | | **12 días** |

---

## Notas Finales

1. **Priorizar calidad, evidencia y trazabilidad** antes que complejidad
2. **No usar un único prompt monolítico** — mantener etapas modulares
3. **Cada hallazgo DEBE tener evidencia** del documento
4. **No presentar inferencias como hechos** contractuales
5. **Incluir advertencia** en todos los informes: "No sustituye revisión jurídica profesional"
6. **Probar con contratos reales** de abogados y pymes piloto

---

## PROGRESO DE IMPLEMENTACIÓN

### ✅ FASE 2: Inicializar Proyecto (COMPLETADA)

**Archivos de configuración creados:**
- [x] `package.json` - Dependencias adaptadas (sin xlsx, con same deps core)
- [x] `next.config.ts` - Configuración adaptada para ContractLens
- [x] `tailwind.config.ts` - Mismo sistema de diseño
- [x] `tsconfig.json` - Misma configuración TypeScript
- [x] `components.json` - Configuración shadcn/ui
- [x] `postcss.config.mjs` - PostCSS plugins
- [x] `.gitignore` - Archivos ignorados
- [x] `.env.example` - Variables de entorno (con MAX_CONTRACT_SIZE_MB)

**Componentes UI creados (shadcn/ui):**
- [x] `src/components/ui/button.tsx`
- [x] `src/components/ui/card.tsx`
- [x] `src/components/ui/badge.tsx` (con variantes success/warning)
- [x] `src/components/ui/input.tsx`
- [x] `src/components/ui/label.tsx`
- [x] `src/components/ui/select.tsx`
- [x] `src/components/ui/switch.tsx`
- [x] `src/components/ui/checkbox.tsx`
- [x] `src/components/ui/sheet.tsx`
- [x] `src/components/ui/separator.tsx`
- [x] `src/components/ui/progress.tsx`
- [x] `src/components/ui/tooltip.tsx`
- [x] `src/components/ui/dropdown-menu.tsx`

**Componentes de Layout creados:**
- [x] `src/components/layout/DashboardSidebar.tsx` - Navegación adaptada (analyze, contracts)
- [x] `src/components/layout/DashboardHeader.tsx` - Breadcrumbs adaptados
- [x] `src/components/layout/MarketingNav.tsx` - Logo ContractLens

**Componentes Shared creados:**
- [x] `src/components/shared/StatCard.tsx`
- [x] `src/components/shared/Skeletons.tsx` - Adaptado (AnalysisCard, ContractCard)
- [x] `src/components/shared/QueryProvider.tsx`
- [x] `src/components/shared/AtmosphericBackground.tsx`

**Lib creada:**
- [x] `src/lib/utils.ts` - cn(), formatBytes, formatDate, detectFileType (sin audio)
- [x] `src/lib/api.ts` - apiResponse, apiError, catchApiError, ApiRouteError
- [x] `src/lib/auth.ts` - requireAuth()
- [x] `src/lib/env.ts` - Validación Zod (con MAX_CONTRACT_SIZE_MB)
- [x] `src/lib/logger.ts` - Logger estructurado
- [x] `src/lib/rate-limit.ts` - Rate limiting dual (prefix: contractlens)
- [x] `src/lib/supabase.ts` - Tipos de BD (Contract, Analysis, Clause, Finding, Source, Report)

**Hooks creados:**
- [x] `src/hooks/useAuth.ts`
- [x] `src/hooks/useDashboard.ts` - Adaptado para análisis
- [x] `src/hooks/useToast.ts`

**Tipos de dominio creados:**
- [x] `src/types/index.ts` - Todos los tipos para ContractLens
- [x] `src/types/third-party.d.ts` - Declaraciones pdf-parse, mammoth

**Constants creadas:**
- [x] `src/constants/index.ts` - CONTRACT_TYPES, ANALYSIS_STEPS, ROUTES

**Styles creados:**
- [x] `src/styles/globals.css` - Design tokens y utilidades

**App Structure creada:**
- [x] `src/app/layout.tsx` - Root layout con ClerkProvider, QueryProvider
- [x] `src/app/page.tsx` - Landing page con hero, how-it-works, features
- [x] `src/app/(auth)/layout.tsx` - Auth layout
- [x] `src/app/(auth)/login/page.tsx` - Login con Clerk SignIn
- [x] `src/app/(auth)/register/page.tsx` - Register con Clerk SignUp
- [x] `src/app/dashboard/layout.tsx` - Dashboard layout con sidebar
- [x] `src/app/dashboard/page.tsx` - Dashboard principal con stats
- [x] `src/app/dashboard/loading.tsx` - Loading state
- [x] `src/app/dashboard/analyze/page.tsx` - Placeholder nuevo análisis
- [x] `src/app/dashboard/contracts/page.tsx` - Placeholder contratos
- [x] `src/app/dashboard/history/page.tsx` - Placeholder historial
- [x] `src/app/dashboard/settings/page.tsx` - Placeholder settings
- [x] `src/app/not-found.tsx` - 404 page
- [x] `src/app/error.tsx` - Error boundary
- [x] `src/proxy.ts` - Clerk proxy (Next.js 16)

**API Routes creadas:**
- [x] `src/app/api/health/route.ts` - Health check

### ✅ FASE 3: Schema de BD (COMPLETADA)

- [x] Crear migración SQL para tablas: contracts, analyses, clauses, findings, sources, reports
- [x] Crear índices
- [x] Crear RLS policies
- [x] Crear triggers para updated_at
- [x] Crear archivo .env.local con todas las variables

**Archivos creados:**
- `supabase/migrations/20260910_create_contractlens_tables.sql`
- `.env.local`

**Tablas creadas:**
- `contracts` - Contratos subidos
- `analyses` - Análisis realizados
- `clauses` - Cláusulas extraídas
- `findings` - Hallazgos de riesgo
- `sources` - Fuentes legales
- `reports` - Informes generados

**RLS habilitado en todas las tablas con policies por usuario.**

### ✅ FASE 4: Pipeline de Análisis (COMPLETADA)

- [x] Crear `src/services/ai/analysis.service.ts` con 5 prompts especializados
- [x] Implementar Prompt 1: CLASSIFY (Identificación de tipo de contrato)
- [x] Implementar Prompt 2: STRUCTURE (Extracción de información estructurada)
- [x] Implementar Prompt 3: CLAUSE ANALYSIS (Análisis de cláusulas)
- [x] Implementar Prompt 4: RISK ANALYSIS (Análisis de riesgos con evidencia)
- [x] Implementar Prompt 5: LEGAL GROUNDING (Fundamentación legal colombiana)
- [x] Crear orquestador del pipeline con SSE streaming
- [x] Crear servicios DB (contracts, analyses, clauses, findings, dashboard)
- [x] Crear API routes (/api/analyze, /api/upload, /api/dashboard, /api/analyses)

**Archivos creados:**
- `src/services/ai/analysis.service.ts` - Pipeline de 5 prompts
- `src/services/db/contracts.service.ts` - CRUD de contratos
- `src/services/db/analyses.service.ts` - CRUD de análisis
- `src/services/db/clauses.service.ts` - CRUD de cláusulas
- `src/services/db/findings.service.ts` - CRUD de hallazgos y fuentes
- `src/services/db/dashboard.service.ts` - Datos del dashboard
- `src/lib/auth.ts` - requireAuth() helper
- `src/lib/api.ts` - apiResponse, apiError, catchApiError
- `src/app/api/analyze/route.ts` - Endpoint principal con SSE
- `src/app/api/upload/route.ts` - Upload de PDF/DOCX
- `src/app/api/dashboard/route.ts` - Datos del dashboard
- `src/app/api/analyses/route.ts` - Listar/detalle de análisis

### ✅ FASE 5: API Routes (COMPLETADA)

- [x] `POST /api/analyze` - Endpoint principal con SSE
- [x] `GET /api/analyses` - Listar análisis
- [x] `GET /api/analyses?id=xxx` - Detalle de análisis
- [x] `POST /api/upload` - Upload de contratos
- [x] `GET /api/dashboard` - Datos del dashboard

### ✅ FASE 6: Componentes UI de Analisis (COMPLETADA)

- [x] `AnalysisContainer.tsx` - Orquestador principal con FSM
- [x] `AnalysisSidebar.tsx` - Panel de input: upload + textarea
- [x] `AnalysisLoader.tsx` - Progreso del pipeline SSE
- [x] `AnalysisResults.tsx` - Layout de resultados
- [x] `AnalysisEmpty.tsx` - Placeholder vacio
- [x] `FindingCard.tsx` - Card de hallazgo expandible con severidad
- [x] `ClauseCard.tsx` - Card de clausula con categoria
- [x] `ContractSummary.tsx` - Resumen estructurado (parties, duracion, valor)
- [x] `ContractHealthCheck.tsx` - Badges de salud (critical/review/ok)
- [x] `UploadZone.tsx` - Drag & drop PDF/DOCX

### ✅ FASE 7: Paginas Dashboard (COMPLETADA)

- [x] `/dashboard/analyze` - AnalysisContainer
- [x] `/dashboard/analysis/[id]` - Detalle de analisis
- [x] `/dashboard/contracts` - Lista de contratos
- [x] `/dashboard/history` - Historial de analisis

### ✅ FASE 8: Exportacion PDF (COMPLETADA)

- [x] Crear `src/lib/export-analysis.ts`
- [x] Implementar informe de preauditoria con jspdf + jspdf-autotable
- [x] Portada con metadata del contrato
- [x] Seccion de estructura (partes, duracion, valor, jurisdiccion)
- [x] Seccion de hallazgos con severidad, evidencia, recomendacion
- [x] Tabla de clausulas extraidas
- [x] Disclaimer final
- [x] Integrar boton PDF en AnalysisResults

### ⏳ FASE 9: Servicios DB (PENDIENTE)

- [ ] `src/services/db/contracts.service.ts`
- [ ] `src/services/db/analyses.service.ts`
- [ ] `src/services/db/clauses.service.ts`
- [ ] `src/services/db/findings.service.ts`

### ⏳ FASE 10: Seguridad (PENDIENTE)

- [ ] RLS habilitado en todas las tablas
- [ ] Filtrado por userId en cada query
- [ ] Validación de archivos
- [ ] Tests de seguridad

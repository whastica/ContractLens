# ContractLens — Plan de Implementación

## Resumen

Plataforma de análisis y preauditoría contractual asistida por IA. Beta 0.1 completada. Actualmente en implementación de Update Multi-Rama.

---

## BETA 0.1 — COMPLETADA ✅

### Checklist de Implementación

**Configuración Base:**
- [x] `package.json` — 36 dependencias, scripts (dev, build, start, lint, type-check)
- [x] `next.config.ts` — CORS, headers de seguridad
- [x] `tailwind.config.ts` — Dark mode, fuentes, colores brand/gold
- [x] `tsconfig.json` — ES2017, strict mode, path alias @/*
- [x] `components.json` — shadcn/ui config
- [x] `.env.example` — 18 variables de entorno

**Componentes UI (14 shadcn/ui):**
- [x] button, card, badge, input, label, select, switch, checkbox, sheet, separator, progress, tooltip, dropdown-menu, textarea

**Layout (4 componentes):**
- [x] DashboardSidebar, DashboardHeader, MarketingNav, MarketingFooter

**Shared (4 componentes):**
- [x] StatCard, Skeletons, QueryProvider, AtmosphericBackground

**Lib (8 archivos):**
- [x] utils.ts — cn(), formatBytes, formatDate, detectFileType
- [x] api.ts — apiResponse, apiError, catchApiError, ApiRouteError
- [x] auth.ts — requireAuth()
- [x] env.ts — Validación Zod de 18+ variables
- [x] logger.ts — Logger estructurado con timing
- [x] rate-limit.ts — Dual strategy (Redis + memory)
- [x] supabase.ts — Clerk ID to UUID, tipos DB
- [x] export-analysis.ts — Informe PDF con jspdf (432 líneas)

**Hooks (5 archivos):**
- [x] useAnalysis.ts — FSM (idle > uploading > analyzing > done/error), SSE (272 líneas)
- [x] useAuth.ts — Wrapper de Clerk
- [x] useDashboard.ts — React Query con staleTime 2 min
- [x] useLastAnalysis.ts — Cache en QueryClient
- [x] useToast.ts — Toast notifications

**Tipos y Constants:**
- [x] types/index.ts — 299 líneas de interfaces tipadas
- [x] types/third-party.d.ts — Declaraciones pdf-parse, mammoth
- [x] constants/index.ts — CONTRACT_TYPES, ANALYSIS_STEPS, ROUTES

**Base de Datos:**
- [x] Migración SQL — 6 tablas + índices + RLS + triggers
- [x] 6 tablas: contracts, analyses, clauses, findings, sources, reports

**Pipeline IA (5 prompts):**
- [x] analysis.service.ts — 522 líneas, 5 prompts con retry + backoff
- [x] CLASSIFY — Tipificación legal (prestación_servicios, laboral, nda, otro)
- [x] STRUCTURE — Extracción de metadata (partes, duración, valor, obligaciones)
- [x] CLAUSE ANALYSIS — Parcelación de cláusulas (14 categorías)
- [x] RISK ANALYSIS — Auditoría jurídica con severidades
- [x] LEGAL GROUNDING — Fundamentación con legislación colombiana

**Servicios DB (5 archivos):**
- [x] contracts.service.ts — CRUD (122 líneas)
- [x] analyses.service.ts — CRUD + conteo findings (163 líneas)
- [x] clauses.service.ts — Save batch + queries (89 líneas)
- [x] findings.service.ts — Save batch + normalización (287 líneas)
- [x] dashboard.service.ts — Queries agregadas (93 líneas)

**API Routes (7 endpoints):**
- [x] POST /api/analyze — Pipeline SSE con OpenAI
- [x] POST /api/upload — Upload y extracción de texto
- [x] GET /api/analyses — Listar análisis
- [x] GET /api/analyses?id=xxx — Detalle con cláusulas y hallazgos
- [x] GET /api/contracts — Listar contratos
- [x] GET /api/dashboard — Estadísticas
- [x] GET /api/health — Health check

**Features UI (10 componentes):**
- [x] AnalysisContainer.tsx — Orquestador principal (FSM)
- [x] AnalysisSidebar.tsx — Panel de input
- [x] AnalysisLoader.tsx — Progreso SSE
- [x] AnalysisResults.tsx — Layout resultados (164 líneas)
- [x] AnalysisEmpty.tsx — Placeholder
- [x] FindingCard.tsx — Card expandible con severidad
- [x] ClauseCard.tsx — Card de cláusula
- [x] ContractSummary.tsx — Resumen estructurado
- [x] ContractHealthCheck.tsx — Badges de salud
- [x] UploadZone.tsx — Drag & drop PDF/DOCX

**Dashboard Pages:**
- [x] /dashboard — Principal con stats
- [x] /dashboard/analyze — AnalysisContainer
- [x] /dashboard/analysis/[id] — Detalle de análisis
- [x] /dashboard/contracts — Lista de contratos
- [x] /dashboard/history — Historial de análisis

**Landing y Auth:**
- [x] Landing page — Hero, cómo funciona, features, CTA
- [x] Login y Register con Clerk
- [x] 404, Error boundary, Loading states

**Seguridad:**
- [x] RLS habilitado en 6 tablas
- [x] Filtrado por userId (requireAuth + clerkIdToUuid)
- [x] Rate limiting dual
- [x] Validación de archivos
- [x] Headers de seguridad
- [x] Variables sensibles server-side

---

## UPDATE: Expansión Multi-Rama (En Implementación)

**Fecha:** 24/09/2026
**Motivo:** Feedback de participantes en Beta 0.1
**Objetivo:** Agentes especializados por rama del derecho para consultorios jurídicos y firmas de abogados

### Decisiones

- Prompts separados por rama (5 × 6 = 30 prompts)
- Columna `area` obligatoria en BD (DEFAULT 'general')
- Categorías de hallazgos por rama

### FASE 11: Tipos y Constantes Multi-Rama — COMPLETADA ✅

- [x] Nuevo tipo `LegalArea` en types/index.ts
- [x] FindingCategory por rama (6 tipos: CivilCommercial, FamilyLaw, LaborLaw, CriminalLaw, PublicLaw, General)
- [x] Campos `area` en interfaces Contract y Analysis
- [x] Constantes LEGAL_AREAS, DOCUMENTS_BY_AREA, DISCLAIMER_BY_AREA en constants/index.ts
- [x] Migración SQL: columna `area` en contracts y analyses (20260924_add_area_column.sql)

### FASE 12: Prompts Especializados — COMPLETADA ✅

**37 archivos creados:**
- [x] `src/services/ai/prompts/types.ts` — LegalArea, PromptSet, LegalAreaConfig
- [x] `src/services/ai/prompts/area-configs.ts` — Config de 6 áreas
- [x] `src/services/ai/prompts/index.ts` — getPromptsForArea()
- [x] `civil_comercial/` — classify, structure, clauses, risk, legal + index (CC, CCo, Ley 820/2003)
- [x] `familia/` — classify, structure, clauses, risk, legal + index (CC arts. 411-432, Ley 1996/2019)
- [x] `laboral/` — classify, structure, clauses, risk, legal + index (CST, Ley 50/1990, Decreto 1072/2015)
- [x] `penal/` — classify, structure, clauses, risk, legal + index (Ley 599/2000, Ley 906/2004)
- [x] `publico/` — classify, structure, clauses, risk, legal + index (CP, CPACA, Ley 1755/2015)
- [x] `general/` — classify, structure, clauses, risk, legal + index (principios generales)

**Validación:** `npm run type-check` → PASS

### FASE 13: Pipeline Resolver — COMPLETADA ✅

- [x] Crear `src/services/ai/pipeline-resolver.ts` — resolvePipeline(), isValidLegalArea(), systemRoles por área
- [x] Modificar `analysis.service.ts` — Usa pipeline-resolver, fallback a prompts Beta 0.1 si area=general

### FASE 14: Backend API y BD — COMPLETADA ✅

- [x] Modificar `/api/analyze/route.ts` — Recibe parámetro `area`, valida con isValidLegalArea()
- [x] Modificar `contracts.service.ts` — Guarda `area` (DEFAULT 'general')
- [x] Modificar `analyses.service.ts` — Guarda `area` (DEFAULT 'general')
- [x] Modificar `supabase.ts` — Agregados campos `area` a DbContract y DbAnalysis
- [x] Migración SQL: columna `area` (NOT NULL DEFAULT 'general')

### FASE 15: Frontend Selector de Áreas — COMPLETADA ✅

- [x] Crear `AnalysisAreaSelector.tsx` — Grid 2×3 con iconos por área
- [x] Modificar `AnalysisSidebar.tsx` — Acepta `area` y `onAreaChange`, renderiza selector
- [x] Modificar `AnalysisContainer.tsx` — Estado `area` con useState, pasa a sidebar y analyze
- [x] Modificar `useAnalysis.ts` — Acepta `area?: LegalArea`, envía a `/api/analyze`

### FASE 16: Landing Page — COMPLETADA ✅

- [x] Sección "Tipos de documentos que puedes analizar" en page.tsx
- [x] Grid 2×3 con iconos, títulos y listas de documentos por área

### FASE 17: Export PDF Multi-Rama — COMPLETADA ✅

- [x] Modificar `export-analysis.ts` — Incluye área en metadatos del PDF con label legible

### FASE 18: Validación — COMPLETADA ✅

- [x] `npm run type-check` → PASS (todos los archivos creados)
- [x] Migración SQL: Eliminar CHECK constraints para `detected_type` y `confirmed_type`

### FASE 19: Optimización de Precisión Técnico-Jurídica — PENDIENTE

**Objetivo:** Elevar los System Prompts de cada especialidad a su máximo nivel de precisión técnica-jurídica y profundización normativa.

**Áreas a optimizar (30 prompts):**

| Área | Foco de optimización |
|------|---------------------|
| **Civil y Comercial** | Equilibrio prestacional, cláusulas abusivas (Código Civil arts. 1546-1609, Código de Comercio, Ley 820/2003) |
| **Familia** | Protección de menores, interés superior del niño, principio de continuidad (CC arts. 411-432, Ley 1996/2019) |
| **Laboral** | Primacía de la realidad, derechos mínimos irrenunciables, prescripciones (CST, Ley 50/1990, Decreto 1072/2015) |
| **Penal** | Principio de legalidad, tipicidad, culpabilidad, derechos de víctimas (Ley 599/2000, Ley 906/2004) |
| **Público** | Debido proceso, legitimación, medios de control, términos (CP, CPACA, Ley 1755/2015) |
| **General** | Principios generales del derecho, técnica jurídica, buenas prácticas contractuales |

**Criterios de mejora:**
1. Referencias normativas específicas (artículos, numerales, parágrafos)
2. Jurisprudencia de la Corte Constitucional y Corte Suprema
3. Doctrina jurídica colombiana relevante
4. Categorías de hallazgos más granulares y precisas
5. Umbrales de severidad calibrados por especialidad
6. Recomendaciones accionables y específicas por tipo de documento
7. Validación de forma y fondo según requisitos legales de cada área

**Archivos a modificar:**
- `src/services/ai/prompts/civil_comercial/*.ts` (5 prompts)
- `src/services/ai/prompts/familia/*.ts` (5 prompts)
- `src/services/ai/prompts/laboral/*.ts` (5 prompts)
- `src/services/ai/prompts/penal/*.ts` (5 prompts)
- `src/services/ai/prompts/publico/*.ts` (5 prompts)
- `src/services/ai/prompts/general/*.ts` (5 prompts)

---

## Cronograma Update Multi-Rama

| Fase | Descripción | Estado | Duración |
|------|-------------|--------|----------|
| 11 | Tipos y constantes | ✅ Completada | 0.5 días |
| 12 | Prompts especializados | ✅ Completada | 3 días |
| 13 | Pipeline resolver | ✅ Completada | 1 día |
| 14 | Backend API y BD | ✅ Completada | 1 día |
| 15 | Frontend selector áreas | ✅ Completada | 1 día |
| 16 | Landing page | ✅ Completada | 0.5 días |
| 17 | Export PDF multi-rama | ✅ Completada | 0.5 días |
| 18 | Validación | ✅ Completada | 1 día |
| 19 | Optimización precisión prompts | ⏳ Pendiente | 3-5 días |
| **Total** | | | **11.5-13.5 días** |

---

## Archivos del Proyecto

```
src/
├── app/                    # Next.js App Router (17 pages)
├── components/             # UI (14 shadcn/ui + 4 layout + 4 shared)
├── features/               # Analysis (10) + Upload (1)
├── hooks/                  # 5 hooks (analysis, auth, dashboard, lastAnalysis, toast)
├── lib/                    # 8 utilitarias
├── services/
│   ├── ai/
│   │   ├── analysis.service.ts    # Pipeline principal (522 líneas)
│   │   └── prompts/               # 30 prompts especializados (FASE 12)
│   └── db/                 # 5 servicios CRUD
├── styles/                 # globals.css
└── types/                  # index.ts (299 líneas)
```

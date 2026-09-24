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

### FASE 11: Tipos y Constantes Multi-Rama — PENDIENTE

- [ ] Nuevo tipo `LegalArea` en types/index.ts
- [ ] FindingCategory por rama
- [ ] Constantes LEGAL_AREAS, DOCUMENTS_BY_AREA, DISCLAIMER_BY_AREA
- [ ] Migración SQL: columna `area` en contracts y analyses

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

### FASE 13: Pipeline Resolver — PENDIENTE

- [ ] Crear `src/services/ai/pipeline-resolver.ts`
- [ ] Modificar `analysis.service.ts` para usar getPromptsForArea()

### FASE 14: Backend API y BD — PENDIENTE

- [ ] Modificar `/api/analyze/route.ts` — Recibir parámetro `area`
- [ ] Modificar `contracts.service.ts` — Guardar `area`
- [ ] Modificar `analyses.service.ts` — Guardar `area`
- [ ] Migración SQL: columna `area` (NOT NULL DEFAULT 'general')

### FASE 15: Frontend Selector de Áreas — PENDIENTE

- [ ] Crear `AnalysisAreaSelector.tsx`
- [ ] Modificar `AnalysisSidebar.tsx`
- [ ] Modificar `AnalysisContainer.tsx`
- [ ] Modificar `useAnalysis.ts`

### FASE 16: Landing Page — PENDIENTE

- [ ] Sección "Tipos de documentos que puedes analizar" en page.tsx

### FASE 17: Export PDF Multi-Rama — PENDIENTE

- [ ] Modificar `export-analysis.ts` — Incluir área en informe

### FASE 18: Validación — PENDIENTE

- [ ] Pruebas funcionales por área
- [ ] Verificar prompts con documentos reales
- [ ] Verificar guardado de área en BD

---

## Cronograma Update Multi-Rama

| Fase | Descripción | Estado | Duración |
|------|-------------|--------|----------|
| 11 | Tipos y constantes | ⏳ Pendiente | 0.5 días |
| 12 | Prompts especializados | ✅ Completada | 3 días |
| 13 | Pipeline resolver | ⏳ Pendiente | 1 día |
| 14 | Backend API y BD | ⏳ Pendiente | 1 día |
| 15 | Frontend selector áreas | ⏳ Pendiente | 1 día |
| 16 | Landing page | ⏳ Pendiente | 0.5 días |
| 17 | Export PDF multi-rama | ⏳ Pendiente | 0.5 días |
| 18 | Validación | ⏳ Pendiente | 1 día |
| **Total** | | | **8.5 días** |

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

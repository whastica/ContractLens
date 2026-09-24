# ContractLens — Contexto del Proyecto

## 1. Producto

**ContractLens** — Plataforma B2B de análisis y preauditoría contractual asistida por IA para abogados y pymes en Colombia.

> Sube un contrato y obtén un resumen estructurado, cláusulas relevantes y puntos que requieren revisión, con evidencia del documento y fuentes de referencia.

No es un chatbot jurídico ni generador de contratos. La IA realiza la primera revisión; el profesional toma la decisión.

---

## 2. Problema y Usuarios

**Pymes:** No saben qué contienen sus contratos, cuáles son sus obligaciones o qué puntos revisar con un abogado.

**Abogados:** La primera revisión incluye tareas repetitivas (identificar tipo, localizar cláusulas, extraer fechas, detectar puntos de atención).

**Objetivo:** Automatizar la primera capa de análisis, dejando la decisión jurídica al profesional.

---

## 3. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, TypeScript 6, Tailwind CSS |
| UI | shadcn/ui (14 componentes) |
| Auth | Clerk (login, register, SSO Google) |
| BD | Supabase (PostgreSQL + RLS) |
| IA | OpenAI gpt-4o-mini |
| Cache | Upstash Redis |
| Export | jsPDF + jspdf-autotable |
| State | React Query |
| Upload | pdf-parse + mammoth |

---

## 4. Pipeline de Análisis

```text
PDF/DOCX → INGEST → CLASSIFY → STRUCTURE → CLAUSE → RISK → LEGAL GROUNDING → REPORT
```

5 prompts modulares con outputs estructurados. Principio **Evidence-first**: cada hallazgo con trazabilidad completa (cláusula → fragmento original → página → fuente).

**Health Check:** 🔴 Requieren atención | 🟠 Para revisión | 🟢 Sin observaciones | ⚪ No determinados

---

## 5. Base de Datos (6 tablas)

- `contracts` — Contratos subidos por usuarios
- `analyses` — Análisis con resumen ejecutivo y health check
- `clauses` — Cláusulas extraídas con categorías
- `findings` — Hallazgos con severidad, evidencia y recomendación
- `sources` — Fuentes legales (norma, jurisprudencia, doctrina)
- `reports` — Informes generados

Todas con RLS habilitado y policies por usuario.

---

## 6. API Routes (7 endpoints)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/analyze` | Pipeline principal con SSE streaming |
| POST | `/api/upload` | Upload y extracción de texto (PDF/DOCX) |
| GET | `/api/analyses` | Listar análisis del usuario |
| GET | `/api/analyses?id=xxx` | Detalle con cláusulas, hallazgos y fuentes |
| GET | `/api/contracts` | Listar contratos |
| GET | `/api/dashboard` | Estadísticas del dashboard |
| GET | `/api/health` | Health check |

---

## 7. Experiencia de Usuario

```text
LOGIN → DASHBOARD → NUEVO ANÁLISIS → SUBIR PDF/DOCX → SELECCIONAR ÁREA → ANALIZAR → RESULTADO (Resumen + Hallazgos + Evidencia + Fuentes) → GENERAR PDF → HISTORIAL
```

---

## 8. Seguridad

- Clerk auth con middleware
- RLS en todas las tablas
- Rate limiting dual (Redis + in-memory)
- Validación de archivos (tipo y tamaño)
- Variables sensibles solo server-side
- Headers de seguridad configurados

---

## 9. Roadmap

- **Beta 0.1** ✅ — Pipeline básico (prestación de servicios, laboral, NDA)
- **Update Multi-Rama** 🔄 — Agentes especializados por rama del derecho
- **Beta 0.2** — Comparación de versiones de contratos
- **Beta 0.3** — Análisis masivo
- **Beta 0.4** — Clientes/proyectos
- **V1** — Equipos, roles, API, integraciones

---

## 10. Update Multi-Rama (En Implementación)

### Visión

Sistema de **agentes y pipelines analíticos especializados por rama del derecho**. El usuario selecciona la rama para activar el agente experto con marco normativo específico.

### 6 Áreas de Especialización

| Área | Pipeline | Documentos Principales |
|------|----------|----------------------|
| **Civil y Comercial** | `CivilCommercialPipeline` | Contratos, títulos valores, demandas, conciliaciones |
| **Familia** | `FamilyLawPipeline` | Alimentos, custodia, divorcio, liquidación de sociedad |
| **Laboral** | `LaborLawPipeline` | Contratos de trabajo, despidos, prestaciones sociales |
| **Penal** | `CriminalLawPipeline` | Denuncias, querellas, antecedentes, conciliación penal |
| **Público** | `PublicLawPipeline` | Tutelas, derechos de petición, insolvencia |
| **General** | `GeneralLegalPipeline` | Documentos no clasificados (principios generales) |

### Decisiones Clave

- **Prompts separados por rama** (5 prompts × 6 áreas = 30 prompts especializados)
- **Columna `area` obligatoria** en BD (DEFAULT 'general')
- **Categorías de hallazgos por rama** (cada área tiene sus propias FindingCategory)

### Archivos Creados (FASE 12 ✅)

```
src/services/ai/prompts/
├── types.ts              # LegalArea, PromptSet, LegalAreaConfig
├── area-configs.ts       # Config de las 6 áreas
├── index.ts              # getPromptsForArea(), getAvailableAreas()
├── civil_comercial/      # 5 prompts + index
├── familia/              # 5 prompts + index
├── laboral/              # 5 prompts + index
├── penal/                # 5 prompts + index
├── publico/              # 5 prompts + index
└── general/              # 5 prompts + index
```

### Validación

- `npm run type-check` → PASS

---

## 11. Fuera del MVP

No implementar: generador de contratos, chatbot jurídico, firma electrónica, marketplace, API pública, automatizaciones complejas.

**Núcleo:** Subir → Analizar → Evidenciar → Priorizar → Reportar

---

## 12. Posicionamiento

Evitar: "Abogado IA", "Reemplaza a tu abogado", "Asesoría jurídica automática".

Preferir: "Preauditoría contractual", "Análisis preliminar", "Revisión asistida por IA", "La IA realiza la primera revisión; el profesional toma la decisión".

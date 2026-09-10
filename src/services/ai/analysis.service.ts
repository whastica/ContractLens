import OpenAI from "openai";
import { logger } from "@/lib/logger";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o-mini";
const TEMPERATURE = Number(process.env.AI_TEMPERATURE) || 0.3;

// ─── Prompt 1: CLASSIFY ──────────────────────────────────────────────────────

const CLASSIFY_PROMPT = `Eres un experto en derecho contractual colombiano con 15 años de experiencia en análisis de contratos comerciales y laborales.

Analiza el siguiente texto de contrato e identifica su tipo.

Tipos posibles:
- prestacion_servicios: Contrato de prestación de servicios profesionales, técnicos o comerciales
- laboral: Contrato de trabajo/laboral (relación de dependencia)
- nda: Acuerdo de confidencialidad / Non-Disclosure Agreement
- otro: Cualquier otro tipo de contrato

Criterios de identificación:
- Prestación de servicios: Una parte encarga la ejecución de una actividad a cambio de un pago, sin relación de subordinación
- Laboral: Existe relación de subordinación, horario, lugar de trabajo definido, salario fijo
- NDA: Acuerdo para proteger información confidencial entre las partes
- Otro: Cuando no encaja en las categorías anteriores

Responde EXCLUSIVAMENTE con un JSON válido (sin markdown, sin explicaciones adicionales):
{
  "type": "prestacion_servicios | laboral | nda | otro",
  "confidence": 0.0 a 1.0,
  "reasoning": "Breve explicación de por qué se clasificó así"
}

Texto del contrato:
{CONTRACT_TEXT}`;

// ─── Prompt 2: STRUCTURE ─────────────────────────────────────────────────────

const STRUCTURE_PROMPT = `Eres un experto en análisis contractual. Extrae la información estructurada del siguiente contrato.

Campos a extraer:
- parties: Arreglo de partes involucradas con nombre, rol (contratante/contratista/empleador/empleado) e identificación si aparece
- duration: Duración del contrato (ej: "12 meses", "Indefinido", "Fecha específica")
- totalValue: Valor total del contrato (con moneda si aparece)
- paymentTerms: Forma de pago (ej: "Mensual", "Por hitos", "Al completar")
- renewalTerms: Condiciones de renovación (ej: "Automática", "Por mutuo acuerdo", "No renueva")
- terminationTerms: Condiciones de terminación anticipada
- jurisdiction: Jurisdicción aplicable (ciudad/país)
- keyObligations: Arreglo de strings con las principales obligaciones de cada parte

IMPORTANTE:
- Si un campo no aparece en el contrato, usa null
- No inventes información
- Extrae la información literalmente del texto cuando sea posible

Responde EXCLUSIVAMENTE con un JSON válido:
{
  "parties": [{"name": "...", "role": "...", "identification": "..."}],
  "duration": "...",
  "totalValue": "...",
  "paymentTerms": "...",
  "renewalTerms": "...",
  "terminationTerms": "...",
  "jurisdiction": "...",
  "keyObligations": ["Obligación 1 de la parte A", "Obligación 1 de la parte B"]
}

Texto del contrato:
{CONTRACT_TEXT}`;

// ─── Prompt 3: CLAUSE ANALYSIS ───────────────────────────────────────────────

const CLAUSE_PROMPT = `Eres un experto en análisis de cláusulas contractuales colombianas.
Analiza el contrato y extrae todas las cláusulas identificables.

Para cada cláusula incluye:
- clause_number: Número o referencia de la cláusula (ej: "Cláusula 1", "Cláusula 3.2", "Artículo 5")
- title: Título descriptivo de la cláusula
- category: Una de estas categorías exactas:
  objeto, obligaciones, duracion, pago, penalidades, terminacion,
  confidencialidad, propiedad_intelectual, responsabilidad, garantia,
  seguro, ley_aplicable, jurisdiccion, otro
- raw_text: Texto original completo de la cláusula
- summary: Resumen de 1-2 oraciones de qué trata la cláusula

Reglas:
- Extrae TODAS las cláusulas identificables, no solo las "importantes"
- Mantén el texto original sin modificar
- Si no puedes identificar el número de cláusula, usa null
- No inventes cláusulas que no existan en el texto

Responde EXCLUSIVAMENTE con un JSON válido:
{
  "clauses": [
    {
      "clauseNumber": "Cláusula 1",
      "title": "Objeto del contrato",
      "category": "objeto",
      "rawText": "Texto original completo...",
      "summary": "Resumen breve..."
    }
  ]
}

Texto del contrato:
{CONTRACT_TEXT}`;

// ─── Prompt 4: RISK ANALYSIS ─────────────────────────────────────────────────

const RISK_PROMPT = `Eres un experto en preauditoría contractual para abogados y pymes en Colombia.
Analiza el contrato e identifica hallazgos que requieren atención.

IMPORTANTE: Cada hallazgo DEBE estar respaldado por evidencia del documento.

Para cada hallazgo incluye:
- severity: "critical" (requiere atención inmediata), "review" (para revisión profesional), "ok" (sin observaciones), "undetermined" (no se puede determinar)
- category: "terminacion_anticipada", "penalidad", "confidencialidad", "propiedad_intelectual", "pago", "obligaciones", "responsabilidad", "garantia", "seguro", "ley_aplicable", "jurisdiccion", "otro"
- title: Título descriptivo del hallazgo
- evidenceText: Fragmento EXACTO del contrato que respalda el hallazgo (copia literal)
- clauseReference: Referencia a la cláusula si aplica (ej: "Cláusula 8")
- explanation: ¿Qué detectamos? Descripción clara del hallazgo
- whyItMatters: ¿Por qué importa esto? En lenguaje sencillo para un no-abogado
- possibleImpact: Posible impacto (económico, operativo, contractual)
- recommendation: Qué debería hacer el usuario al respecto
- legalReference: Referencia legal aplicable si la conoces (artículo de ley, código, etc.)
- confidence: Nivel de confianza del hallazgo (0.0 a 1.0)

Categorías a revisar obligatoriamente:
1. Terminación: ¿Se puede terminar anticipadamente? ¿Bajo qué condiciones?
2. Penalidades: ¿Hay cláusulas penalidad? ¿Son proporcionales?
3. Pago: ¿Los términos de pago son claros? ¿Hay multas por mora?
4. Responsabilidad: ¿Los límites de responsabilidad son razonables?
5. Confidencialidad: ¿Está bien definida? ¿Tiene temporalidad?
6. Propiedad intelectual: ¿Quién posee lo creado?
7. Obligaciones: ¿Están claras las obligaciones de cada parte?

NUNCA presentes una inferencia como un hecho contractual definitivo.
Si no puedes determinar algo, indica "undetermined".

Responde EXCLUSIVAMENTE con un JSON válido:
{
  "findings": [
    {
      "severity": "critical",
      "category": "terminacion_anticipada",
      "title": "Título del hallazgo",
      "evidenceText": "Copia literal del contrato...",
      "clauseReference": "Cláusula X",
      "explanation": "Descripción del hallazgo...",
      "whyItMatters": "Por qué importa...",
      "possibleImpact": "Impacto posible...",
      "recommendation": "Recomendación...",
      "legalReference": "Art. X del Código Y",
      "confidence": 0.9
    }
  ]
}

Contrato:
{CONTRACT_TEXT}

Información estructurada extraída:
{STRUCTURED_INFO}`;

// ─── Prompt 5: LEGAL GROUNDING ───────────────────────────────────────────────

const LEGAL_GROUNDING_PROMPT = `Eres un experto en legislación colombiana aplicable a contratos.
Para cada categoría de hallazgo identificada, proporciona las fuentes legales aplicables en Colombia.

Fuentes comunes a considerar:
- Código Civil Colombiano (Ley 57 de 1887)
- Código de Comercio (Decreto 410 de 1971)
- Código Sustantivo del Trabajo (Decreto 2651 de 1954, actualizado)
- Estatuto del Consumidor (Ley 1480 de 2011)
- Ley 527 de 1999 (Documento Electrónico)
- Constitución Política de Colombia (artículos relevantes)

Para cada fuente incluye:
- source_type: "norma", "jurisprudencia", "doctrina", "referencia"
- name: Nombre de la norma o fuente
- description: Artículo o disposición específica aplicable
- url: URL oficial si está disponible (null si no conoces la URL exacta)

Responde EXCLUSIVAMENTE con un JSON válido:
{
  "legal_grounding": [
    {
      "finding_category": "terminacion_anticipada",
      "sources": [
        {
          "sourceType": "norma",
          "name": "Código Civil Colombiano",
          "description": "Art. 1602 - Toda estipulación válida tiene fuerza de ley entre las partes. Art. 1609 - El contrato bilateral puede rescindirse por incumplimiento.",
          "url": null
        }
      ]
    }
  ]
}

Hallazgos del análisis:
{FINDINGS}`;

// ─── Helper: Parse JSON robusto ──────────────────────────────────────────────

function parseJSONRobust(text: string): Record<string, unknown> {
  let cleaned = text.trim();

  // Remove markdown code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");

  // Find first { and last }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    logger.error("Failed to parse JSON response", { text: cleaned.substring(0, 500) });
    throw new Error("Invalid JSON response from AI");
  }
}

// ─── Helper: Retry con backoff ───────────────────────────────────────────────

async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  delayMs = 1500
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxRetries) {
        logger.warn(`Retry ${attempt + 1}/${maxRetries} after error`, { error: lastError.message });
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

// ─── Prompt execution ────────────────────────────────────────────────────────

async function executePrompt(
  prompt: string,
  systemRole: string,
  maxTokens: number
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: MODEL,
    temperature: TEMPERATURE,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemRole },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
}

// ─── Pipeline Steps ──────────────────────────────────────────────────────────

export interface ClassifyResult {
  type: string;
  confidence: number;
  reasoning: string;
}

export interface StructureResult {
  parties: Array<{ name: string; role: string; identification?: string }>;
  duration: string | null;
  totalValue: string | null;
  paymentTerms: string | null;
  renewalTerms: string | null;
  terminationTerms: string | null;
  jurisdiction: string | null;
  keyObligations: string[];
}

export interface ClauseResult {
  clauseNumber: string | null;
  title: string;
  category: string;
  rawText: string;
  summary: string | null;
}

export interface FindingResult {
  severity: string;
  category: string;
  title: string;
  evidenceText: string;
  clauseReference: string | null;
  explanation: string;
  whyItMatters: string | null;
  possibleImpact: string | null;
  recommendation: string | null;
  legalReference: string | null;
  confidence: number | null;
}

export interface LegalGroundingResult {
  finding_category: string;
  sources: Array<{
    sourceType: string;
    name: string;
    description: string;
    url: string | null;
  }>;
}

export interface PipelineResult {
  classification: ClassifyResult;
  structure: StructureResult;
  clauses: ClauseResult[];
  findings: FindingResult[];
  legalGrounding: LegalGroundingResult[];
}

// ─── Step: Classify ──────────────────────────────────────────────────────────

async function stepClassify(contractText: string): Promise<ClassifyResult> {
  const stop = logger.time("Step: Classify");

  const prompt = CLASSIFY_PROMPT.replace("{CONTRACT_TEXT}", contractText.substring(0, 15000));
  const response = await callWithRetry(() =>
    executePrompt(prompt, "Eres un experto en derecho contractual colombiano. Responde solo con JSON válido.", 1024)
  );

  const parsed = parseJSONRobust(response) as Record<string, unknown>;
  stop();

  return {
    type: (parsed.type as string) ?? "otro",
    confidence: (parsed.confidence as number) ?? 0.5,
    reasoning: (parsed.reasoning as string) ?? "",
  };
}

// ─── Step: Structure ─────────────────────────────────────────────────────────

async function stepStructure(contractText: string): Promise<StructureResult> {
  const stop = logger.time("Step: Structure");

  const prompt = STRUCTURE_PROMPT.replace("{CONTRACT_TEXT}", contractText.substring(0, 15000));
  const response = await callWithRetry(() =>
    executePrompt(prompt, "Eres un experto en análisis contractual. Responde solo con JSON válido.", 2048)
  );

  const parsed = parseJSONRobust(response) as Record<string, unknown>;
  stop();

  return {
    parties: (parsed.parties as StructureResult["parties"]) ?? [],
    duration: (parsed.duration as string) ?? null,
    totalValue: (parsed.totalValue as string) ?? null,
    paymentTerms: (parsed.paymentTerms as string) ?? null,
    renewalTerms: (parsed.renewalTerms as string) ?? null,
    terminationTerms: (parsed.terminationTerms as string) ?? null,
    jurisdiction: (parsed.jurisdiction as string) ?? null,
    keyObligations: (parsed.keyObligations as string[]) ?? [],
  };
}

// ─── Step: Clauses ───────────────────────────────────────────────────────────

async function stepClauses(contractText: string): Promise<ClauseResult[]> {
  const stop = logger.time("Step: Clauses");

  const prompt = CLAUSE_PROMPT.replace("{CONTRACT_TEXT}", contractText.substring(0, 15000));
  const response = await callWithRetry(() =>
    executePrompt(prompt, "Eres un experto en análisis de cláusulas contractuales. Responde solo con JSON válido.", 4096)
  );

  const parsed = parseJSONRobust(response) as Record<string, unknown>;
  stop();

  return (parsed.clauses as ClauseResult[]) ?? [];
}

// ─── Step: Risk Analysis ─────────────────────────────────────────────────────

async function stepRisk(
  contractText: string,
  structuredInfo: StructureResult
): Promise<FindingResult[]> {
  const stop = logger.time("Step: Risk Analysis");

  const prompt = RISK_PROMPT
    .replace("{CONTRACT_TEXT}", contractText.substring(0, 15000))
    .replace("{STRUCTURED_INFO}", JSON.stringify(structuredInfo, null, 2));

  const response = await callWithRetry(() =>
    executePrompt(
      prompt,
      "Eres un experto en preauditoría contractual para abogados y pymes en Colombia. Responde solo con JSON válido.",
      8192
    )
  );

  const parsed = parseJSONRobust(response) as Record<string, unknown>;
  stop();

  return (parsed.findings as FindingResult[]) ?? [];
}

// ─── Step: Legal Grounding ───────────────────────────────────────────────────

async function stepLegalGrounding(findings: FindingResult[]): Promise<LegalGroundingResult[]> {
  const stop = logger.time("Step: Legal Grounding");

  const prompt = LEGAL_GROUNDING_PROMPT.replace(
    "{FINDINGS}",
    JSON.stringify(findings.map((f) => ({ category: f.category, title: f.title })), null, 2)
  );

  const response = await callWithRetry(() =>
    executePrompt(
      prompt,
      "Eres un experto en legislación colombiana. Responde solo con JSON válido.",
      4096
    )
  );

  const parsed = parseJSONRobust(response) as Record<string, unknown>;
  stop();

  return (parsed.legal_grounding as LegalGroundingResult[]) ?? [];
}

// ─── Main Pipeline ───────────────────────────────────────────────────────────

export type PipelinePhase =
  | "classify"
  | "structure"
  | "clauses"
  | "risk"
  | "legal"
  | "done"
  | "error";

export interface PipelineCallbacks {
  onProgress: (phase: PipelinePhase, message: string) => void;
}

export async function runAnalysisPipeline(
  contractText: string,
  callbacks: PipelineCallbacks
): Promise<PipelineResult> {
  const totalStart = Date.now();
  const { onProgress } = callbacks;

  try {
    // Step 1: Classify
    onProgress("classify", "Identificando tipo de contrato...");
    const classification = await stepClassify(contractText);

    // Step 2: Structure
    onProgress("structure", "Extrayendo información estructurada...");
    const structure = await stepStructure(contractText);

    // Step 3: Clauses
    onProgress("clauses", "Analizando cláusulas del contrato...");
    const clauses = await stepClauses(contractText);

    // Step 4: Risk Analysis
    onProgress("risk", "Identificando hallazgos de riesgo...");
    const findings = await stepRisk(contractText, structure);

    // Step 5: Legal Grounding
    onProgress("legal", "Fundamentando legalmente los hallazgos...");
    const legalGrounding = await stepLegalGrounding(findings);

    onProgress("done", "Análisis completado");

    const totalMs = Date.now() - totalStart;
    logger.info("Pipeline completed", {
      totalMs,
      classificationType: classification.type,
      clausesCount: clauses.length,
      findingsCount: findings.length,
    });

    return {
      classification,
      structure,
      clauses,
      findings,
      legalGrounding,
    };
  } catch (error) {
    onProgress("error", "Error en el pipeline de análisis");
    logger.error("Pipeline error", { error: String(error) });
    throw error;
  }
}

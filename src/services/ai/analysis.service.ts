import OpenAI from "openai";
import { logger } from "@/lib/logger";
import type { LegalArea } from "@/types";
import { resolvePipeline, isValidLegalArea } from "./pipeline-resolver";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o-mini";
const TEMPERATURE = Number(process.env.AI_TEMPERATURE) || 0.2;

// ─── Fallback Prompts (Beta 0.1 legacy) ─────────────────────────────────────

const FALLBACK_CLASSIFY_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - LEGAL CLASSIFICATION ENGINE

Eres un jurista experto y auditor senior en derecho contractual colombiano, con especialización en Contratación Privada, Comercial y Laboral. Tu objetivo es clasificar con rigor dogmático el tipo de negocio jurídico presentado.

CATEGORÍAS DE TIPIFICACIÓN:
- prestacion_servicios: Contrato de prestación de servicios profesionales, técnicos o de consultoría (Art. 1495 y ss. C.C., Art. 2144 C.C. sobre arrendamiento de servicios). Ausencia de subordinación.
- laboral: Contrato individual de trabajo (Art. 22 y ss. del Código Sustantivo del Trabajo - CST). Presencia explícita o velada de elementos de subordinación, cumplimiento de horarios, órdenes directas y salario.
- nda: Acuerdo de confidencialidad, no divulgación o secreto comercial (Art. 260 y ss. Decisión 486 CAN, Secreto Industrial).
- otro: Cualquier otra tipología contractual (ej. Arrendamiento, Compraventa, Mandato, Suministro, Licenciamiento de Software, Franquicia).

CRITERIOS DE ANÁLISIS:
- Revisa las obligaciones principales, las estipulaciones de subordinación o autonomía técnica, y la naturaleza de la contraprestación.
- Si existe contradicción entre la denominación del contrato y su contenido sustancial (ej. llamado "Prestación de Servicios" pero imponiendo un reglamento interno u horarios estrictos), aplica el principio constitucional colombia de PRIMACÍA DE LA REALIDAD SOBRE LAS FORMAS (Art. 53 C.P.).

FORMATO DE SALIDA (EXCLUSIVAMENTE JSON VÁLIDO SIN MARKDOWN):
{
  "type": "prestacion_servicios | laboral | nda | otro",
  "confidence": 0.0 a 1.0,
  "reasoning": "Dictamen jurídico técnico de 2-3 oraciones justificando la clasificación según los elementos sustanciales identificados."
}

TEXTO DEL CONTRATO:
{CONTRACT_TEXT}`;

const FALLBACK_STRUCTURE_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - DATA EXTRACTION & STRUCTURING ENGINE

Eres un analista contractual senior. Tu objetivo es extraer de forma metódica y precisa la metadata jurídica sustancial del contrato adjunto.

INSTRUCCIONES DE EXTRACTION:
- Identifica las partes contractuales, asignando sus nombres completos, NIT/CC (si aplica) y la posición jurídica que ocupan (ej. Contratante/Contratista, Empleador/Trabajador, Licenciante/Licenciatario).
- Extrae la vigencia/duración con sus términos normativos exactos.
- Determina el valor del contrato, incluyendo la moneda (COP, USD) e impuestos aplicables si están pactados.
- Especifica las condiciones de pago, esquemas de renovaciones, causales y procedimientos de terminación, y la cláusula compromisoria o jurisdicción pactada.
- Lista las obligaciones clave en un lenguaje declarativo preciso.

REGLAS DE RIGOR:
- Si un parámetro no se encuentra estipulado en el texto, asigna el valor null.
- NO infieras ni asumas datos que no tengan sustento en el texto expreso del documento.

FORMATO DE SALIDA (EXCLUSIVAMENTE JSON VÁLIDO SIN MARKDOWN):
{
  "parties": [{"name": "Nombre o Razón Social", "role": "Posición contractual", "identification": "CC/NIT o null"}],
  "duration": "Texto literal o resumen técnico de la vigencia | null",
  "totalValue": "Monto y moneda exactos | null",
  "paymentTerms": "Esquema, plazo e hitos de pago | null",
  "renewalTerms": "Condiciones de prórroga o renovación | null",
  "terminationTerms": "Mecanismos y plazos de terminación voluntaria o por incumplimiento | null",
  "jurisdiction": "Ciudad, fuero judicial o tribunal arbitral pactado | null",
  "keyObligations": [
    "Obligación técnica o jurídica fundamental 1",
    "Obligación técnica o jurídica fundamental 2"
  ]
}

TEXTO DEL CONTRATO:
{CONTRACT_TEXT}`;

const FALLBACK_CLAUSE_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - CLAUSE PARSING ENGINE

Eres un abogado dogmático experto en sistemática y estructura de contratos. Tu tarea es fragmentar el contrato e identificar de manera exhaustiva TODAS las cláusulas presentes en el documento.

REGLAS DE PROCESAMIENTO:
- Identifica el número o numeral formal de la cláusula (ej. "Cláusula Primera", "Numeral 3.1", "Artículo 5").
- Clasifica obligatoriamente cada cláusula dentro de una de las siguientes categorías normalizadas:
  - objeto, obligaciones, duracion, pago, penalidades, terminacion, confidencialidad, propiedad_intelectual, responsabilidad, garantia, seguro, ley_aplicable, jurisdiccion, otro
- Preserva el texto original íntegro de la cláusula en 'rawText' sin alteraciones ni omisiones.
- Elabora un síntesis dogmática clara en 'summary' detallando la naturaleza del pacto.

FORMATO DE SALIDA (EXCLUSIVAMENTE JSON VÁLIDO SIN MARKDOWN):
{
  "clauses": [
    {
      "clauseNumber": "Número/Numeral de la cláusula o null",
      "title": "Título express o asignado por el análisis",
      "category": "categoría_normalizada",
      "rawText": "Texto literal completo de la cláusula",
      "summary": "Síntesis jurídica concisa de su contenido y alcance."
    }
  ]
}

TEXTO DEL CONTRATO:
{CONTRACT_TEXT}`;

const FALLBACK_RISK_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - ADVANCED RISK ENGINE & PRE-AUDIT FOR LAWYERS

Eres un Abogado Senior y Auditor Risk Officer especializado en la revisión de contratos para firmas de abogados y empresas en Colombia. Tu objetivo es realizar una PREAUDITORÍA JURÍDICA RIGUROSA, detectando vulnerabilidades, desequilibrios prestacionales, cláusulas abusivas, ambigüedades operativas y riesgos legales para la parte con mayor vulnerabilidad o prestación (ej. el Contratista/Trabajador/Licenciatario).

PRINCIPIOS DE EVALUACIÓN JURÍDICA:
1. RIGOR LEGAL Y TÉCNICO: Evalúa el texto usando doctrina y jurisprudencia colombiana. Detecta cláusulas nulas de pleno derecho, estipulaciones leoninas o condiciones meramente potestativas (Art. 1535 C.C.).
2. EVIDENCE-FIRST (ESTRICTO): Cada hallazgo DEBE incluir una cita EXACTA e inalterada del texto contractual (evidenceText). No inventes hallazgos.
3. PERSPECTIVA DE AUDITORÍA: Asume un enfoque crítico. Si una estipulación es imprecisa, clasifícala como riesgo por ambigüedad.

SEVERIDADES:
- "critical": Riesgo jurídico grave, cláusula abusiva, ilegalidad manifiesta o vulnerabilidad de alto impacto económico/contractual.
- "review": Punto de atención jurídica que requiere ajuste o negociación preventiva.
- "ok": Cláusula redactada conforme al estándar y equidad contractual.
- "undetermined": Ambigüedad sustancial que impide determinar el alcance jurídico del pacto.

CATEGORÍAS ACEPTADAS:
"terminacion_anticipada", "penalidad", "confidencialidad", "propiedad_intelectual", "pago", "obligaciones", "responsabilidad", "garantia", "seguro", "ley_aplicable", "jurisdiccion", "otro"

FORMATO DE SALIDA (EXCLUSIVAMENTE JSON VÁLIDO SIN MARKDOWN):
{
  "findings": [
    {
      "severity": "critical | review | ok | undetermined",
      "category": "categoría_de_hallazgo",
      "title": "Dictamen/Título técnico directo del riesgo jurídico",
      "evidenceText": "Fragmento exacto extraído entre comillas del texto del contrato",
      "clauseReference": "Referencia explicita de la cláusula o numeral",
      "explanation": "Análisis dogmático y jurídico detallado con vocabulario legal de alto nivel.",
      "whyItMatters": "Explicación clara del impacto práctico, comercial y operativo para el cliente.",
      "possibleImpact": "Evaluación del impacto",
      "recommendation": "REDACCIÓN ALTERNATIVA SUGERIDA",
      "legalReference": "Norma colombiana aplicable",
      "confidence": 0.95
    }
  ]
}

CONTRATO A EXAMINAR:
{CONTRACT_TEXT}

ESTRUCTURA PREVIA EXTRAÍDA:
{STRUCTURED_INFO}`;

const FALLBACK_LEGAL_GROUNDING_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - LEGAL GROUNDING & NORMATIVE SUPPORT ENGINE

Eres un investigador y tratadista jurídico senior en Derecho Colombiano. Tu función es fundamentar legalmente cada uno de los hallazgos de riesgo identificados en la preauditoría del contrato.

FUENTES JURÍDICAS A CITAR Y EVALUAR:
- Código Civil Colombiano (Ley 57 de 1887)
- Código de Comercio de Colombia (Decreto 410 de 1971)
- Código Sustantivo del Trabajo (CST)
- Estatuto del Consumidor (Ley 1480 de 2011)
- Ley de Protección de Datos Personales (Ley 1581 de 2012)
- Jurisprudencia relevante de la Corte Suprema de Justicia o Corte Constitucional

REGLAS DE RESPUESTA:
- Proporciona normas exactas con número de artículo y un resumen riguroso de la disposición legal.
- sourceType debe ser exactamente: "norma", "jurisprudencia", "doctrina", "referencia".

FORMATO DE SALIDA (EXCLUSIVAMENTE JSON VÁLIDO SIN MARKDOWN):
{
  "legal_grounding": [
    {
      "finding_category": "categoría_del_hallazgo",
      "sources": [
        {
          "sourceType": "norma | jurisprudencia | doctrina | referencia",
          "name": "Nombre exacto del estatuto, código o sentencia",
          "description": "Art. XXX - Resumen técnico del precepto normativo",
          "url": "URL oficial o null"
        }
      ]
    }
  ]
}

HALLAZGOS IDENTIFICADOS EN LA AUDITORÍA:
{FINDINGS}`;

// ─── Helper: Parse JSON robusto ──────────────────────────────────────────────

function parseJSONRobust(text: string): Record<string, unknown> {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");

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

// ─── Pipeline Result Types ───────────────────────────────────────────────────

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

async function stepClassify(
  contractText: string,
  classifyPrompt: string,
  systemRole: string
): Promise<ClassifyResult> {
  const stop = logger.time("Step: Classify");

  const prompt = classifyPrompt.replace("{CONTRACT_TEXT}", contractText.substring(0, 15000));
  const response = await callWithRetry(() =>
    executePrompt(prompt, systemRole, 1024)
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

async function stepStructure(
  contractText: string,
  structurePrompt: string,
  systemRole: string
): Promise<StructureResult> {
  const stop = logger.time("Step: Structure");

  const prompt = structurePrompt.replace("{CONTRACT_TEXT}", contractText.substring(0, 15000));
  const response = await callWithRetry(() =>
    executePrompt(prompt, systemRole, 2048)
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

async function stepClauses(
  contractText: string,
  clausePrompt: string,
  systemRole: string
): Promise<ClauseResult[]> {
  const stop = logger.time("Step: Clauses");

  const prompt = clausePrompt.replace("{CONTRACT_TEXT}", contractText.substring(0, 15000));
  const response = await callWithRetry(() =>
    executePrompt(prompt, systemRole, 4096)
  );

  const parsed = parseJSONRobust(response) as Record<string, unknown>;
  stop();

  return (parsed.clauses as ClauseResult[]) ?? [];
}

// ─── Step: Risk Analysis ─────────────────────────────────────────────────────

async function stepRisk(
  contractText: string,
  structuredInfo: StructureResult,
  riskPrompt: string,
  systemRole: string
): Promise<FindingResult[]> {
  const stop = logger.time("Step: Risk Analysis");

  const prompt = riskPrompt
    .replace("{CONTRACT_TEXT}", contractText.substring(0, 15000))
    .replace("{STRUCTURED_INFO}", JSON.stringify(structuredInfo, null, 2));

  const response = await callWithRetry(() =>
    executePrompt(prompt, systemRole, 8192)
  );

  const parsed = parseJSONRobust(response) as Record<string, unknown>;
  stop();

  return (parsed.findings as FindingResult[]) ?? [];
}

// ─── Step: Legal Grounding ───────────────────────────────────────────────────

async function stepLegalGrounding(
  findings: FindingResult[],
  legalPrompt: string,
  systemRole: string
): Promise<LegalGroundingResult[]> {
  const stop = logger.time("Step: Legal Grounding");

  const prompt = legalPrompt.replace(
    "{FINDINGS}",
    JSON.stringify(findings.map((f) => ({ category: f.category, title: f.title, explanation: f.explanation })), null, 2)
  );

  const response = await callWithRetry(() =>
    executePrompt(prompt, systemRole, 4096)
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
  callbacks: PipelineCallbacks,
  options?: { contractType?: string; area?: LegalArea }
): Promise<PipelineResult> {
  const totalStart = Date.now();
  const { onProgress } = callbacks;
  const area = options?.area;

  // Resolver pipeline según el área seleccionada
  const useSpecializedPipeline = area && isValidLegalArea(area) && area !== "general";
  const resolved = useSpecializedPipeline ? resolvePipeline(area) : null;

  // Seleccionar prompts y system roles
  const classifyPrompt = resolved?.prompts.CLASSIFY_PROMPT ?? FALLBACK_CLASSIFY_PROMPT;
  const structurePrompt = resolved?.prompts.STRUCTURE_PROMPT ?? FALLBACK_STRUCTURE_PROMPT;
  const clausePrompt = resolved?.prompts.CLAUSE_PROMPT ?? FALLBACK_CLAUSE_PROMPT;
  const riskPrompt = resolved?.prompts.RISK_PROMPT ?? FALLBACK_RISK_PROMPT;
  const legalPrompt = resolved?.prompts.LEGAL_GROUNDING_PROMPT ?? FALLBACK_LEGAL_GROUNDING_PROMPT;

  const systemRoles = resolved?.systemRoles ?? {
    classify: "Eres un auditor y jurista experto en derecho contractual colombiano. Responde rigurosamente en JSON válido.",
    structure: "Eres un analista legal experto en estructuración de datos contractuales en Colombia. Responde en JSON válido.",
    clauses: "Eres un experto en análisis y parcelación de cláusulas contractuales colombianas. Responde en JSON válido.",
    risk: "Eres un Auditor Jurídico Senior e inspector contractual en Colombia. Detectas vulnerabilidades con precisión de cirujano. Responde en JSON válido.",
    legal: "Eres un tratadista e investigador del derecho positivo colombiano. Fundamentas legalmente hallazgos con rigor. Responde en JSON válido.",
  };

  const areaLabel = resolved?.area ?? "general";
  logger.info("Pipeline started", { area: areaLabel, specialized: useSpecializedPipeline });

  try {
    // Step 1: Classify
    onProgress("classify", `Realizando tipificación legal del contrato (${areaLabel})...`);
    const classification = await stepClassify(contractText, classifyPrompt, systemRoles.classify);

    // Step 2: Structure
    onProgress("structure", "Extrayendo metadata sustancial y obligaciones...");
    const structure = await stepStructure(contractText, structurePrompt, systemRoles.structure);

    // Step 3: Clauses
    onProgress("clauses", "Parcelando e identificando clausulado contractual...");
    const clauses = await stepClauses(contractText, clausePrompt, systemRoles.clauses);

    // Step 4: Risk Analysis
    onProgress("risk", "Ejecutando auditoría jurídica y detección de desequilibrios...");
    const findings = await stepRisk(contractText, structure, riskPrompt, systemRoles.risk);

    // Step 5: Legal Grounding
    onProgress("legal", "Fundamentando hallazgos con la legislación colombiana...");
    const legalGrounding = await stepLegalGrounding(findings, legalPrompt, systemRoles.legal);

    onProgress("done", "Preauditoría contractual completada exitosamente");

    const totalMs = Date.now() - totalStart;
    logger.info("Pipeline completed", {
      totalMs,
      area: areaLabel,
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
    onProgress("error", "Error crítico durante la ejecución de la auditoría jurídica");
    logger.error("Pipeline error", { error: String(error), area: areaLabel });
    throw error;
  }
}

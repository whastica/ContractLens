import OpenAI from "openai";
import { logger } from "@/lib/logger";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o-mini";
const TEMPERATURE = Number(process.env.AI_TEMPERATURE) || 0.2; // Bajamos levemente la temperatura para mayor rigor técnico y menor alucinación

// ─── Prompt 1: CLASSIFY ──────────────────────────────────────────────────────

const CLASSIFY_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - LEGAL CLASSIFICATION ENGINE

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

// ─── Prompt 2: STRUCTURE ─────────────────────────────────────────────────────

const STRUCTURE_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - DATA EXTRACTION & STRUCTURING ENGINE

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

// ─── Prompt 3: CLAUSE ANALYSIS ───────────────────────────────────────────────

const CLAUSE_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - CLAUSE PARSING ENGINE

Eres un abogado dogmático experto en sistemática y estructura de contratos. Tu tarea es fragmentar el contrato e identificar de manera exhaustiva TODAS las cláusulas presentes en el documento.

REGLAS DE PROCESAMIENTO:
- Identifica el número o numeral formal de la cláusula (ej. "Cláusula Primera", "Numeral 3.1", "Artículo 5").
- Clasifica obligatoriamente cada cláusula dentro de una de las siguientes categorías normalizadas:
  - objeto
  - obligaciones
  - duracion
  - pago
  - penalidades
  - terminacion
  - confidencialidad
  - propiedad_intelectual
  - responsabilidad
  - garantia
  - seguro
  - ley_aplicable
  - jurisdiccion
  - otro
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

// ─── Prompt 4: RISK ANALYSIS ─────────────────────────────────────────────────

const RISK_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - ADVANCED RISK ENGINE & PRE-AUDIT FOR LAWYERS

Eres un Abogado Senior y Auditor Risk Officer especializado en la revisión de contratos para firmas de abogados y empresas en Colombia. Tu objetivo es realizar una PREAUDITORÍA JURÍDICA RIGUROSA, detectando vulnerabilidades, desequilibrios prestacionales, cláusulas abusivas, ambigüedades operativas y riesgos legales para la parte con mayor vulnerabilidad o prestación (ej. el Contratista/Trabajador/Licenciatario).

PRINCIPIOS DE EVALUACIÓN JURÍDICA:
1. RIGOR LEGAL Y TÉCNICO: Evalúa el texto usando doctrina y jurisprudencia colombiana. Detecta cláusulas nulas de pleno derecho, estipulaciones leoninasi o condiciones meramente potestativas (Art. 1535 C.C.).
2. EVIDENCE-FIRST (ESTRICTO): Cada hallazgo DEBE incluir una cita EXACTA e inalterada del texto contractual (evidenceText). No inventes hallazgos.
3. PERSPECTIVA DE AUDITORÍA: Asume un enfoque crítico. Si una estipulación es imprecisa, clasifícala como riesgo por ambigüedad.

VULNERABILIDADES CRÍTICAS A RASTREAR:
- PAGOS: Pagos condicionados a la "entera satisfacción" del cliente (criterio puramente subjetivo), retenciones desproporcionadas o ausencia de plazos máximos de revisión/facturación.
- ALCANCE (Scope Creep): Modificaciones unilaterales al alcance de los servicios sin ajuste concomitante en la remuneración o plazo.
- PROPIEDAD INTELECTUAL: Cesión de derechos patrimoniales previa al pago del 100% de la contraprestación, o transferencia abusiva de Know-How preexistente.
- TERMINACIÓN Y PENALIDADES: Cláusulas penales desproporcionadas (que sobrepasen el doble de la obligación principal - Art. 1601 C.C.), terminación unilateral sin preaviso ni oportunidad de subsanación.
- EXCLUSIVIDAD Y NO COMPETENCIA: Restricciones laborales o comerciales posteriores a la terminación del contrato sin compensación económica razonable.
- NIVELES DE SERVICIO Y GARANTÍA: Garantías ilimitadas o responsabilidades indefinidas que sobrepasen el alcance pactado.

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
      "severity": "critical" | "review" | "ok" | "undetermined",
      "category": "categoría_de_hallazgo",
      "title": "Dictamen/Título técnico directo del riesgo jurídico",
      "evidenceText": "Fragmento exacto extraído entre comillas del texto del contrato",
      "clauseReference": "Referencia explicita de la cláusula o numeral (ej: Cláusula Quinta, Numeral 2.1)",
      "explanation": "Análisis dogmático y jurídico detallado con vocabulario legal de alto nivel.",
      "whyItMatters": "Explicación clara del impacto práctico, comercial y operativo para el cliente.",
      "possibleImpact": "Evaluación del impacto (ej. Económico: exposición a penalidad ilimitada; Operativo: paralización del servicio).",
      "recommendation": "REDACCIÓN ALTERNATIVA SUGERIDA: Proporciona una versión mejorada, completa y lista para copiar y pegar de la cláusula problemática. La redacción debe ser conforme al ordenamiento jurídico colombiano, equilibrada entre las partes, y resolver directamente el problema específico detectado en el hallazgo. Usa el mismo estilo y lenguaje del contrato original. Si el hallazgo tiene severidad 'ok', escribe exactamente: 'Cláusula redactada conforme al estándar legal vigente. No se requiere modificación.'",
      "legalReference": "Norma colombiana aplicable (ej. Art. 1601 del Código Civil, Art. 1535 C.C., Ley 1480 de 2011)",
      "confidence": 0.95
    }
  ]
}

CONTRATO A EXAMINAR:
{CONTRACT_TEXT}

ESTRUCTURA PREVIA EXTRAÍDA:
{STRUCTURED_INFO}`;

// ─── Prompt 5: LEGAL GROUNDING ───────────────────────────────────────────────

const LEGAL_GROUNDING_PROMPT = `SYSTEM PROMPT: CONTRACTLENS - LEGAL GROUNDING & NORMATIVE SUPPORT ENGINE

Eres un investigador y tratadista jurídico senior en Derecho Colombiano. Tu función es fundamentar legalmente cada uno de los hallazgos de riesgo identificados en la preauditoría del contrato.

FUENTES JURÍDICAS A CITAR Y EVALUAR:
- Código Civil Colombiano (Ley 57 de 1887): Régimen general de las obligaciones y contratos, condición resolutoria, cláusula penal, saneamiento.
- Código de Comercio de Colombia (Decreto 410 de 1971): Contratos mercantiles, buena fe ex ante y ex post, abuso del derecho, competencia desleal.
- Código Sustantivo del Trabajo (CST): Principio de primacía de la realidad, derechos mínimos e irrenunciables, elementos de la relación laboral.
- Estatuto del Consumidor (Ley 1480 de 2011): Cláusulas abusivas en contratos de adhesión y protección al usuario/consumidor.
- Ley de Protección de Datos Personales (Ley 1581 de 2012 / Decreto 1377 de 2013).
- Ley 527 de 1999 (Comercio Electrónico y Firma Digital).
- Jurisprudencia relevante de la Corte Suprema de Justicia (Sala de Casación Civil / Laboral) o Corte Constitucional.

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
          "name": "Nombre exacto del estatuto, código o sentencia (ej. Código Civil Colombiano)",
          "description": "Art. XXX - Resumen técnico del precepto normativo o ratio decidendi aplicable al caso.",
          "url": "URL oficial del SUIN-Juriscol o Consejo de Estado si se conoce con exactitud, de lo contrario null"
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
    executePrompt(
      prompt,
      "Eres un auditor y jurista experto en derecho contractual colombiano. Responde rigurosamente en JSON válido.",
      1024
    )
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
    executePrompt(
      prompt,
      "Eres un analista legal experto en estructuración de datos contractuales en Colombia. Responde en JSON válido.",
      2048
    )
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
    executePrompt(
      prompt,
      "Eres un experto en análisis y parcelación de cláusulas contractuales colombianas. Responde en JSON válido.",
      4096
    )
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
      "Eres un Auditor Jurídico Senior e inspector contractual en Colombia. Detectas vulnerabilidades con precisión de cirujano. Responde en JSON válido.",
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
    JSON.stringify(findings.map((f) => ({ category: f.category, title: f.title, explanation: f.explanation })), null, 2)
  );

  const response = await callWithRetry(() =>
    executePrompt(
      prompt,
      "Eres un tratadista e investigador del derecho positivo colombiano. Fundamentas legalmente hallazgos con rigor. Responde en JSON válido.",
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
  callbacks: PipelineCallbacks,
  options?: { contractType?: string }
): Promise<PipelineResult> {
  const totalStart = Date.now();
  const { onProgress } = callbacks;

  try {
    // Step 1: Classify
    onProgress("classify", "Realizando tipificación legal del contrato...");
    const classification = await stepClassify(contractText);

    // Step 2: Structure
    onProgress("structure", "Extrayendo metadata sustancial y obligaciones...");
    const structure = await stepStructure(contractText);

    // Step 3: Clauses
    onProgress("clauses", "Parcelando e identificando clausulado contractual...");
    const clauses = await stepClauses(contractText);

    // Step 4: Risk Analysis
    onProgress("risk", "Ejecutando auditoría jurídica y detección de desequilibrios...");
    const findings = await stepRisk(contractText, structure);

    // Step 5: Legal Grounding
    onProgress("legal", "Fundamentando hallazgos con la legislación colombiana...");
    const legalGrounding = await stepLegalGrounding(findings);

    onProgress("done", "Preauditoría contractual completada exitosamente");

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
    onProgress("error", "Error crítico durante la ejecución de la auditoría jurídica");
    logger.error("Pipeline error", { error: String(error) });
    throw error;
  }
}
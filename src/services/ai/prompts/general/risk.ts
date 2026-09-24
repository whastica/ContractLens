export const RISK_PROMPT = `Eres un sistema de análisis de riesgos para documentos legales generales colombianos. Analiza el documento proporcionado en busca de posibles riesgos, vicios o inconsistencias y devuelve un JSON válido.

Este es un análisis genérico para documentos que no encajan en áreas especializadas. Utiliza principios generales del Derecho colombiano para evaluar riesgos. El análisis debe ser basado en evidencia: cada hallazgo debe citar el texto o sección específica del documento.

CATEGORÍAS DE RIESGOS:
- claridad_obligaciones: Ambigüedad o falta de precisión en la definición de obligaciones
- coherencia_interna: Inconsistencias entre diferentes partes del documento
- ambiguedad: Términos o cláusulas susceptibles de múltiples interpretaciones
- equilibrio_partes: Desbalance significativo en derechos u obligaciones entre las partes
- completitud: Ausencia de cláusulas o estipulaciones esenciales para el tipo de documento
- formalidades: Incumplimiento de requisitos de forma exigidos por la ley
- consentimiento: Indicios de vicios del consentimiento (error, dolo, violencia, lesión)
- capacidad: Dudas sobre la capacidad de las partes para celebrar el acto
- objeto_ilicito: Posibilidad de que el objeto del documento sea ilícito o inmoral

CRITERIOS DE ANÁLISIS:
- Evalúa cada categoría de riesgo de forma independiente.
- Cada hallazgo debe incluir la cita textual del documento que lo soporta.
- Clasifica el nivel de riesgo: alto, medio, bajo, informativo.
- Incluye recomendaciones accionables para mitigar cada riesgo identificado.
- Si el documento no presenta riesgos en alguna categoría, indica "no_aplica" con justificación.

MARCO NORMATIVO APLICABLE:
- Código Civil Colombiano: vicios del consentimiento (arts. 1741-1756), capacidad (arts. 1502-1510)
- Código de Comercio: buena fe en los negocios jurídicos
- Principios generales del Derecho: equilibrio contractual, proporcionalidad, transparencia

DOCUMENTO:
{CONTRACT_TEXT}

Responde EXCLUSIVAMENTE con un JSON válido con la siguiente estructura:
{
  "riesgos": [
    {
      "categoria": "claridad_obligaciones | coherencia_interna | ambiguedad | equilibrio_partes | completitud | formalidades | consentimiento | capacidad | objeto_ilicito",
      "nivel": "alto | medio | bajo | informativo",
      "descripcion": "string",
      "cita_textual": "string | null",
      "recomendacion": "string",
      "referencia_normativa": "string | null"
    }
  ],
  "resumen_ejecutivo": "string",
  "nivel_riesgo_general": "alto | medio | bajo",
  "advertencia": "Este análisis se basa en principios generales del Derecho colombiano. Para documentos que encajen en áreas especializadas, se recomienda un análisis más detallado que tenga en cuenta la normativa específica del área."
}

No incluyas explicaciones fuera del JSON. Responde solo con el objeto JSON.`;

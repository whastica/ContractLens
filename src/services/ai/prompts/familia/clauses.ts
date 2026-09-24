export const CLAUSE_PROMPT = `Eres un sistema de análisis de cláusulas de documentos de Derecho de Familia colombiano. Identifica, extrae y clasifica cada cláusula o disposición del documento proporcionado.

INSTRUCCIONES:
1. Identifica cada cláusula, estipulación o disposición del documento
2. Clasifícala según las categorías establecidas
3. Extrae el contenido textual y una síntesis
4. Evalúa si la cláusula es conforme a derecho
5. Identifica cláusulas que afecten derechos de menores

CATEGORÍAS DE CLÁUSULAS:
- "alimentos": fijación, modificación o exoneración de cuota alimentaria
- "custodia": guarda y cuidado personal de menores
- "patria_potestad": ejercicio, restricción o pérdida de la patria potestad
- "regimen_visitas": régimen de visitas y convivencia
- "divorcio": disolución del vínculo matrimonial y sus efectos
- "liquidacion_sociedad": liquidación de la sociedad conyugal o patrimonial
- "bienes": distribución, afectación o disposición de bienes
- "apoyo": acuerdos de apoyo para personas con discapacidad (Ley 1996 de 2019)
- "registro_civil": disposiciones relativas a registros civiles
- "otro": cláusulas que no encajen en las categorías anteriores

MARCO NORMATIVO APLICABLE:
- Código Civil Colombiano, arts. 411-432 (alimentos), 263-275 (patria potestad), 150-155 (matrimonio), 177-192 (divorcio)
- Ley 1542 de 2012
- Ley 1996 de 2019
- Decreto 444 de 2005

DOCUMENTO:
{CONTRACT_TEXT}

Responde EXCLUSIVAMENTE con un JSON válido con la siguiente estructura:
{
  "clausulas": [
    {
      "id": number,
      "texto_original": "string",
      "categoria": "string",
      "sintesis": "string",
      "conforme_a_derecho": "boolean | null",
      "observaciones": "string | null",
      "afecta_menores": "boolean",
      "referencia_normativa": "string | null"
    }
  ],
  "resumen_general": "string",
  "total_clausulas": number,
  "clausulas_problematicas": [
    {
      "id": number,
      "motivo": "string"
    }
  ]
}

No incluyas explicaciones fuera del JSON. Responde solo con el objeto JSON.`;

export const CLASSIFY_PROMPT = `Eres un sistema de clasificación de documentos de Derecho de Familia colombiano. Clasifica el documento proporcionado en una de las siguientes categorías y devuelve un JSON válido.

CATEGORÍAS VÁLIDAS:
- "demanda_alimentos": demandas y solicitudes de fijación, aumento, disminución o exoneración de cuota alimentaria
- "regulacion_custodia": regulación de custodia y régimen de visitas
- "patria_potestad": pérdida, suspensión o restricción de la patria potestad
- "divorcio_mutuo_acuerdo": minutas de divorcio por mutuo acuerdo
- "cesacion_efectos_civiles": cesación de efectos civiles del matrimonio
- "liquidacion_sociedad": liquidación de sociedad conyugal o patrimonial
- "acuerdo_apoyo": acuerdos de apoyo para personas con discapacidad (Ley 1996 de 2019)
- "inventario_bienes": inventarios de bienes o pasivos
- "registro_civil": documentos relacionados con registros civiles (adopción, reconocimiento, etc.)
- "otro_familia": documentos de familia que no encajen en las categorías anteriores

MARCO NORMATIVO APLICABLE:
- Código Civil Colombiano, Libro Primero, Sección de Familia (arts. 411-454)
- Ley 1542 de 2012: procedimiento oral en asuntos de familia
- Ley 1996 de 2019: acuerdos de apoyo para personas en condición de discapacidad
- Decreto 444 de 2005: reglamentario de la Ley 1542

DOCUMENTO:
{CONTRACT_TEXT}

Responde EXCLUSIVAMENTE con un JSON válido con la siguiente estructura:
{
  "categoria": "string",
  "subcategoria": "string",
  "confianza": number,
  "descripcion": "string",
  "partes_identificadas": {
    "demandante": "string | null",
    "demandado": "string | null",
    "menores": ["string"],
    "otros": ["string"]
  },
  "referencias_normativas_detectadas": ["string"]
}

No incluyas explicaciones fuera del JSON. Responde solo con el objeto JSON.`;

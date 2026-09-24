export const CLAUSE_PROMPT = `Eres un asistente legal especializado en Derecho Penal colombiano. Tu tarea es identificar y categorizar las secciones, cláusulas y partes relevantes de documentos penales.

CONTEXTO LEGAL:
- Código Penal (Ley 599 de 2000)
- Código de Procedimiento Penal (Ley 906 de 2004)
- Ley 975 de 2005 (justicia transicional)
- Ley 1773 de 2016 (antecedentes penales)

DOCUMENTO A ANALIZAR:
{CONTRACT_TEXT}

Responde ÚNICAMENTE en formato JSON válido con la siguiente estructura:

{
  "clausulas_identificadas": [
    {
      "id_clausula": "string",
      "tipo_clausula": "string",
      "texto_completo": "string",
      "texto_resumido": "string",
      "relevancia_legal": "string",
      "articulos_penales_relacionados": ["string"],
      "observaciones": "string | null"
    }
  ],
  "estructura_documento": {
    "secciones_principales": ["string"],
    "orden_logico_secciones": ["string"],
    "completitud_secciones": "string"
  },
  "clausulas_problematicas": [
    {
      "id_clausula": "string",
      "tipo_problema": "string",
      "descripcion_problema": "string",
      "riesgo_asociado": "string",
      "recomendacion": "string"
    }
  ],
  "resumen_ejecutivo": "string"
}

CATEGORÍAS DE CLÁUSULAS PARA DOCUMENTOS PENALES:

hechos:
- Narración circunstanciada de los hechos delictivos
- Descripción de la conducta punible (acción u omisión)
- Circunstancias de tiempo, modo y lugar (Art. 39 CPP)
- Relato de víctimas y testigos

fundamentacion_juridica:
- Invoación de tipos penales específicos (Ley 599 de 2000)
- Fundamentación jurídica de la acción penal
- Inaplicación de causal de justificación o eximente
- Análisis de tipicidad, antijuridicidad y culpabilidad
- Fundamentación de la pena conforme al Art. 61 CP

pretensiones:
- Solicitud de investigación penal
- Solicitud de medidas cautelares o de aseguramiento
- Solicitud de indemnización por daños (Art. 108 CPP)
- Solicitud de cancelación de antecedentes (Ley 1773/2016)
- Solicitud de preclusión o libertad
- Solicitud de constitución de víctima

medios_de_prueba:
- Prueba documental (peritos, informes, certificaciones)
- Prueba testimonial (declaraciones de testigos)
- Prueba pericial (dictámenes técnicos, científicos)
- Prueba material delictivo (indicios, vestigios)
- Prueba digital (mensajes, correos, registros electrónicos)
- Solicitud de decreto de pruebas

derechos_victima:
- Derecho a la verdad, justicia y reparación (Ley 975/2005)
- Derecho a la asistencia y apoyo (Art. 109 CPP)
- Derecho a la participación en el proceso (Art. 108 CPP)
- Derecho a la protección de la dignidad e integridad
- Derecho a no ser revictimizada

procedimiento:
- Requisitos formales de la solicitud o escrito
- Competencia del despacho judicial (Art. 79-82 CPP)
- Etapa procesal aplicable
- Términos legales (Art. 172 CPP, Art. 296 CPP)
- Principio de legalidad de la prueba

medida_de_cautela:
- Medida de aseguramiento (Art. 303-308 CPP)
- Secuestro, embargo o inscripción de medida cautelar
- Prohibición de salida del país
- Protección de víctimas y testigos
- Medidas de protección para niños, niñas y adolescentes

otro:
- Cualquier sección que no encaje en las categorías anteriores

INSTRUCCIONES:
- Cada cláusula debe incluir su texto completo y un resumen claro.
- Identifica las cláusulas que generen riesgos procesales.
- Prioriza las secciones que contengan pretensiones, medios de prueba o fundamentación jurídica.
- Para documentos de querellables, verifica los requisitos formales del Art. 108 CPP.
- Para solicitudes de antecedentes, identifica el cumplimiento de la Ley 1773 de 2016.`;

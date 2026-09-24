export const STRUCTURE_PROMPT = `Eres un asistente legal especializado en Derecho Penal colombiano. Tu tarea es extraer información estructurada de documentos penales.

CONTEXTO LEGAL APLICABLE:
- Código Penal (Ley 599 de 2000): Tipos penales, penas, causales de extinción de la acción penal.
- Código de Procedimiento Penal (Ley 906 de 2004): Etapas procesales, derechos del imputado, legalidad de pruebas.
- Ley 938 de 2004: Conciliación penal en delitos querellables.
- Ley 1773 de 2016: Cancelación de antecedentes penales.
- Ley 975 de 2005: Justicia transicional y derechos de víctimas.

DOCUMENTO A ANALIZAR:
{CONTRACT_TEXT}

Responde ÚNICAMENTE en formato JSON válido con la siguiente estructura:

{
  "identificacion_documento": {
    "tipo_documento": "string",
    "numero_radicado": "string | null",
    "fecha_documento": "string | null",
    "autoridad_judicial": "string | null",
    "despacho_judicial": "string | null",
    "jurisdiccion": "string | null"
  },
  "partes_procesales": {
    "denunciante_o_querellante": {
      "nombre": "string | null",
      "tipo_documento": "string | null",
      "numero_documento": "string | null",
      "domicilio": "string | null"
    },
    "denunciado_o_imputado": {
      "nombre": "string | null",
      "tipo_documento": "string | null",
      "numero_documento": "string | null",
      "domicilio": "string | null"
    },
    "victima": {
      "nombre": "string | null",
      "relacion_con_hechos": "string | null",
      "constituida_en_parte": boolean
    },
    "abogado_denunciante": "string | null",
    "abogado_defensor": "string | null",
    "ministerio_publico": "string | null"
  },
  "hechos": {
    "narracion_factual": "string",
    "fecha_hora_hechos": "string | null",
    "lugar_hechos": "string | null",
    "modalidad_delictiva": "string | null",
    "victimas_directas": ["string"],
    "testigos_identificados": ["string"]
  },
  "tipo_penal": {
    "tipo_penal_principal": "string",
    "articulo_penal_aplicable": "string | null",
    "categoria_delito": "string | null",
    "violencia_intrafamiliar": boolean,
    "delito_contra_libertad": boolean,
    "delito_contra_la_vida": boolean,
    "delito_de_bagatela": boolean
  },
  "fundamentacion_juridica": {
    "normas_invocadas": ["string"],
    "jurisprudencia_invocada": ["string"],
    "doctrina_invocada": ["string"],
    "principios_invocados": ["string"]
  },
  "pretensiones": {
    "tipo_solicitud": "string",
    "pretensiones_principales": ["string"],
    "pretensiones_accesorias": ["string"],
    "medidas_solicitadas": ["string"],
    "indemnizacion_solicitada": "string | null"
  },
  "medios_de_prueba": {
    "pruebas_documento": ["string"],
    "pruebas_testimoniales": ["string"],
    "pruebas_periciales": ["string"],
    "pruebas_digitales": ["string"],
    "pruebas_material_delictivo": ["string"],
    "solicitud_prueba_adicional": ["string"]
  },
  "aspectos_procesales": {
    "etapa_procesal": "string | null",
    "término_legal": "string | null",
    "medidas cautelares": ["string"],
    "garantias_procesales": ["string"],
    "derechos_invocados": ["string"]
  },
  "observaciones_criticas": ["string"]
}

INSTRUCCIONES ESPECIALES:
- Extrae la narración fáctica completa y detallada, sin omitir circunstancias de tiempo, modo y lugar.
- Identifica TODOS los tipos penales mencionados o implícitos en los hechos.
- Verifica la presencia de circunstancias de agravación (Art. 58 CPP) o atenuación (Art. 59 CPP).
- Si el documento contiene solicitudes de derechos de víctimas, regístralas conforme a la Ley 975 de 2005.
- Identifica las etapas procesales conforme al Libro II del CPP (Ley 906 de 2004).
- Para querellables, verifica el cumplimiento de requisitos formales del Art. 108 CPP.
- Para antecedentes penales, identifica los requisitos de la Ley 1773 de 2016.`;

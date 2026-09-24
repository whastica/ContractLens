export const STRUCTURE_PROMPT = `Eres un sistema de extracción de datos estructurados de documentos de Derecho de Familia colombiano. Extrae la información del documento y devuelve un JSON válido con la estructura indicada.

INSTRUCCIONES:
1. Identifica todas las partes del proceso (demandante, demandado, cónyuges, menores, curadores, etc.)
2. Determina el tipo de procedimiento y su fundamento legal
3. Extrae los datos específicos según la naturaleza del documento
4. Identifica las pretensiones y decisiones adoptadas
5. Resalta disposiciones que afecten a menores de edad

MARCO NORMATIVO APLICABLE:
- Código Civil Colombiano, Libro Primero, Sección de Familia (arts. 411-454)
- Ley 1542 de 2012: procedimiento oral en asuntos de familia
- Ley 1996 de 2019: acuerdos de apoyo
- Decreto 444 de 2005
- Constitución Política, arts. 42 (familia), 44 (derechos de los niños)

DOCUMENTO:
{CONTRACT_TEXT}

Responde EXCLUSIVAMENTE con un JSON válido con la siguiente estructura:
{
  "partes": {
    "demandante": {
      "nombre": "string",
      "identificacion": "string",
      "calidad": "string"
    },
    "demandado": {
      "nombre": "string",
      "identificacion": "string",
      "calidad": "string"
    },
    "conyuges": [
      {
        "nombre": "string",
        "identificacion": "string",
        "regimen_patrimonial": "string"
      }
    ],
    "menores": [
      {
        "nombre": "string",
        "edad": "string | number",
        "parentesco": "string"
      }
    ],
    "otros_participantes": [
      {
        "nombre": "string",
        "calidad": "string"
      }
    ]
  },
  "tipo_procedimiento": "string",
  "fundamento_legal": "string",
  "cuota_alimentaria": {
    "monto": "string | null",
    "moneda": "string",
    "periodicidad": "string | null",
    "porcentaje_smlmv": "string | null",
    "alimentos_corrientes": "boolean | null",
    "alimentos_atrasados": "string | null"
  },
  "regimen_visitas": {
    "tipo": "string | null",
    "frecuencia": "string | null",
    "condiciones": "string | null",
    "supervision": "string | null"
  },
  "patria_potestad": {
    "titulares": ["string"],
    "restricciones": "string | null",
    "suspension": "boolean | null",
    "causales": "string | null"
  },
  "bienes": {
    "tipo_inventario": "string | null",
    "bienes_muebles": ["string"],
    "bienes_inmuebles": ["string"],
    "pasivos": ["string"]
  },
  "sociedad_conyugal": {
    "disolucion": "string | null",
    "liquidacion_pendiente": "boolean | null",
    "bienes_sociales": ["string"],
    "deudas_sociales": ["string"]
  },
  "observaciones_menores": ["string"],
  "plazos_y_obligaciones": [
    {
      "obligacion": "string",
      "plazo": "string | null",
      "sujeto": "string"
    }
  ]
}

No incluyas explicaciones fuera del JSON. Responde solo con el objeto JSON.`;

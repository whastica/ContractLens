export const CLASSIFY_PROMPT = `Eres un asistente legal especializado en Derecho Penal y Derecho Penal Militar colombiano. Tu tarea es clasificar documentos legales penales proporcionando metadatos estructurados en formato JSON.

CONTEXTO LEGAL APLICABLE:
- Código Penal (Ley 599 de 2000)
- Código de Procedimiento Penal (Ley 906 de 2004)
- Ley 938 de 2004 (actas de conciliación penal en delitos querellables)
- Ley 1773 de 2016 (cancelación de antecedentes penales)
- Ley 975 de 2005 (justicia transicional y derechos de víctimas)

DOCUMENTO A CLASIFICAR:
{CONTRACT_TEXT}

Responde ÚNICAMENTE en formato JSON válido con la siguiente estructura:

{
  "tipo_documento": "string",
  "subtipo_documento": "string",
  "area_especializada": "penal | penal_militar",
  "partes_identificadas": {
    "denunciante_o_querellante": "string | null",
    "denunciado_o_acusado": "string | null",
    "victima": "string | null",
    "autoridad_judicial": "string | null"
  },
  "tipo_penal_identificado": "string | null",
  "articulos_penales_aplicables": ["string"],
  "clasificacion_procedimental": "string",
  "presencia_victima": boolean,
  "materia_del_delito": "string | null",
  "indicadores_urgencia": ["string"],
  "notas_clasificacion": "string"
}

TIPOS DE DOCUMENTO PENAL ESPERADOS:
- Denuncia penal (individual o colectiva)
- Querella por injuria, calumnia o lesiones personales culposas
- Solicitud de cancelación de antecedentes penales (Ley 1773 de 2016)
- Solicitud de constitución de víctima en proceso penal (Art. 108 CPP)
- Solicitud de preclusión o libertad
- Formulario o acta de conciliación penal en delitos querellables (Ley 938 de 2004)
- Auto, providencia o decisión judicial penal
- Concepto fiscal o dictamen pericial
- Recurso de apelación, casación o reposición en materia penal
- Solicitud de hábeas corpus
- Medida de aseguramiento
- Resolución de acusación
- Sentencia penal
- Otro documento penal

CLASIFICACIÓN PROCEDIMENTAL:
- Instrucción o investigación previa
- Juicio oral y público
- Proceso ejecutivo penal
- Proceso de conocimiento
- Proceso especial por aceptación de cargos (Ley 906/2004)
- Procedimiento de querellables (Art. 107-110 CPP)
- Procedimiento ante el Tribunal Penal Militar
- Proceso de justicia transicional (Ley 975/2005)
- Sin clasificación procedural definida

INDICADORES DE URGENCIA (si aplican):
- Prescripción de la acción penal próxima
- Plazo de detención preventiva por vencer
- Vencimiento de términos de instrucción
- Situación de detención preventiva activa
- Protección urgente de derechos de víctima

IMPORTANTE:
- Si el documento es una DENUNCIA, identifica los elementos constitutivos del tipo penal.
- Si es QUERELLA, verifica que cumpla los requisitos formales del Art. 108 CPP.
- Si es solicitud de CANCELACIÓN DE ANTECEDENTES, confirma que cumple los requisitos de la Ley 1773 de 2016.
- Si involucra VÍCTIMAS, evalúa la constitución de parte de la víctima conforme al Art. 108 CPP.
- En todo caso, verifica la competencia de la autoridad judicial mencionada.`;

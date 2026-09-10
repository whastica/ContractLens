# ContractLens — Contexto maestro para OpenCode

## 1. Propósito

ContractLens es un producto B2B de análisis y preauditoría contractual asistida por IA para abogados y pymes en Colombia.

**Objetivo para OpenCode:** entender el producto, inspeccionar primero el proyecto existente y el proyecto de referencia StoryForge, identificar qué puede reutilizarse y después crear un plan de implementación completo desde el estado actual hasta una beta viable para mostrar a clientes reales.

**Regla:** no comenzar una reescritura completa ni asumir decisiones técnicas antes de auditar ambos proyectos.

---

## 2. Concepto del producto

Nombre provisional: **ContractLens**.

No debe posicionarse principalmente como generador de contratos. La propuesta es:

> **Plataforma de análisis y preauditoría contractual asistida por IA para abogados y pymes.**

Propuesta de valor:

> **Sube un contrato y obtén rápidamente un resumen estructurado, las cláusulas relevantes y los puntos que deberían ser revisados, con evidencia tomada del documento y fuentes de referencia cuando corresponda.**

El sistema realiza una **revisión preliminar asistida por IA**. No debe presentarse como sustituto de un abogado ni como autoridad para determinar definitivamente la legalidad de una cláusula.

---

## 3. Problema

### Pymes

Una pyme puede recibir o tener muchos contratos y no saber:

- qué contiene cada contrato;
- cuáles son sus obligaciones;
- qué cláusulas son relevantes;
- qué puntos debería llevar a revisión jurídica;
- qué documentos requieren atención prioritaria.

### Abogados

La primera revisión de contratos suele incluir tareas repetitivas:

- identificar tipo de contrato;
- localizar cláusulas;
- extraer fechas y valores;
- identificar obligaciones;
- encontrar penalidades;
- revisar terminación;
- localizar confidencialidad;
- revisar propiedad intelectual;
- detectar posibles puntos de atención;
- preparar un resumen.

ContractLens debe automatizar parte de esa **primera capa de análisis**, dejando la decisión jurídica final al profesional.

---

## 4. Usuarios objetivo

### Abogados

Profesionales independientes o pequeñas firmas que revisan contratos de clientes.

Beneficios:

- ahorrar tiempo en la primera revisión;
- localizar rápidamente cláusulas;
- priorizar hallazgos;
- comparar versiones;
- generar informes;
- mantener historial.

### Pymes

Empresas sin un equipo jurídico interno grande.

Beneficios:

- entender contratos rápidamente;
- detectar puntos que deberían revisar con su abogado;
- organizar análisis;
- obtener informes preliminares.

---

## 5. Posicionamiento

Evitar mensajes como:

- “Abogado IA”.
- “La IA determina si tu contrato es legal”.
- “Reemplaza a tu abogado”.
- “Puedes firmar sin consultar a un abogado”.
- “Asesoría jurídica automática”.

Preferir:

- “Preauditoría contractual”.
- “Análisis preliminar”.
- “Revisión asistida por IA”.
- “Identificación de cláusulas y posibles puntos de atención”.
- “Evidencia directamente extraída del contrato”.
- “La IA realiza la primera revisión; el profesional toma la decisión”.

---

# 6. Alcance de Beta 0.1

Comenzar con tres tipos:

1. Contrato de prestación de servicios.
2. Contrato laboral.
3. NDA / acuerdo de confidencialidad.

No intentar soportar inicialmente todos los contratos jurídicos.

Puede existir “Otro”, pero no se debe prometer análisis especializado de cualquier documento.

---

# 7. Funcionalidades de Beta 0.1

## 7.1 Autenticación

- Login.
- Google SSO si se reutiliza Clerk.
- Logout.
- Perfil básico.

## 7.2 Nuevo análisis

Flujo:

1. Usuario selecciona “Nuevo análisis”.
2. Sube PDF o DOCX.
3. Se valida formato y tamaño.
4. Se extrae texto.
5. Se intenta identificar el tipo de contrato.
6. Usuario puede confirmar/corregir.
7. Se inicia el pipeline.
8. Se muestra progreso.
9. Se genera el resultado.

---

# 8. Pipeline

Arquitectura conceptual:

```text
PDF / DOCX
    ↓
INGEST
    ↓
Extracción y limpieza de texto
    ↓
CLASSIFY
    ↓
Identificación del tipo de contrato
    ↓
STRUCTURE
    ↓
Partes + fechas + valores + cláusulas
    ↓
CLAUSE ANALYSIS
    ↓
Obligaciones + condiciones + elementos relevantes
    ↓
RISK ANALYSIS
    ↓
Reglas + LLM
    ↓
VALIDATION
    ↓
Verificar evidencia en el documento
    ↓
LEGAL GROUNDING
    ↓
Fuentes/referencias cuando corresponda
    ↓
REPORT
    ↓
Resultado estructurado + PDF
```

No usar un único prompt monolítico. Mantener etapas modulares y outputs estructurados.

---

# 9. Contract Health Check

Resultado principal:

```text
CONTRATO DE PRESTACIÓN DE SERVICIOS

Resumen del análisis

🔴 3  Requieren atención
🟠 7  Para revisión
🟢 14 Sin observaciones relevantes
⚪ 2  No determinados
```

Las categorías y criterios exactos pueden ajustarse durante el desarrollo.

Nunca presentar estas categorías como una determinación jurídica definitiva.

---

# 10. Resumen ejecutivo

Extraer y presentar:

- tipo de contrato;
- partes;
- duración;
- valor;
- forma de pago;
- renovación;
- terminación;
- jurisdicción cuando pueda determinarse;
- principales obligaciones;
- principales puntos de atención.

---

# 11. Información estructurada

Ejemplo:

| Campo | Resultado |
|---|---|
| Tipo | Prestación de servicios |
| Contratante | Empresa X |
| Contratista | Persona Y |
| Duración | 12 meses |
| Valor | $XX |
| Forma de pago | Mensual |
| Renovación | Automática |
| Terminación | Cláusula 8 |
| Jurisdicción | Colombia |

No inventar información. Si no aparece o no puede determinarse, indicar “No determinado”.

---

# 12. Mapa de hallazgos

Cada hallazgo debe incluir, cuando sea posible:

- nivel de atención;
- categoría;
- cláusula;
- página;
- evidencia original;
- explicación;
- posible impacto;
- recomendación;
- fuente normativa/referencia;
- confianza del análisis.

Ejemplo:

```text
🔴 TERMINACIÓN ANTICIPADA

Cláusula 8
Página 7

Evidencia:
“Texto original de la cláusula...”

¿Qué detectamos?
Descripción del posible punto de atención.

¿Por qué importa?
Explicación en lenguaje sencillo.

Posible impacto:
Económico / operativo / contractual.

Recomendación:
Llevar este punto a revisión profesional.

Fuente:
Referencia oficial cuando corresponda.
```

---

# 13. Principio crítico: Evidence-first

Cada hallazgo debe mantener trazabilidad:

```text
HALLAZGO
   ↓
CLÁUSULA
   ↓
FRAGMENTO ORIGINAL
   ↓
PÁGINA / UBICACIÓN
   ↓
FUENTE, SI APLICA
```

La aplicación debe poder responder:

> “¿De dónde salió este hallazgo?”

La respuesta debe estar respaldada por evidencia visible del documento.

Esto es una prioridad arquitectónica.

---

# 14. Búsqueda de cláusulas

Funcionalidad de Beta 0.1 o Beta 0.2:

- “¿Dónde se habla de penalidades?”
- “Muéstrame las cláusulas de propiedad intelectual.”
- “¿Dónde aparece la terminación?”
- “¿Qué obligaciones tiene el contratista?”

Idealmente llevar al usuario a la cláusula/página correspondiente.

Si navegar dentro del PDF resulta demasiado costoso para Beta 0.1, comenzar mostrando número de cláusula y página.

---

# 15. Informe PDF

Generar:

```text
INFORME DE PREAUDITORÍA CONTRACTUAL

1. Identificación del documento
2. Resumen ejecutivo
3. Información estructurada
4. Cláusulas analizadas
5. Hallazgos de alta atención
6. Hallazgos para revisión
7. Observaciones
8. Elementos no determinados
9. Evidencias
10. Fuentes utilizadas
11. Limitaciones del análisis
```

Debe incluir una advertencia clara:

> Este informe constituye un análisis preliminar asistido por inteligencia artificial y no sustituye la revisión jurídica profesional.

---

# 16. Historial

Ejemplo:

```text
Mis análisis

Contrato Proveedor A
Prestación de servicios
🔴 2   🟠 5
10/09/2026

Contrato Empleado B
Laboral
🔴 1   🟠 3
09/09/2026

NDA Empresa C
NDA
🔴 0   🟠 4
08/09/2026
```

Permitir abrir nuevamente el análisis.

---

# 17. Roadmap posterior

## Beta 0.2 — Comparación

Subir:

```text
Contrato_v1.pdf
Contrato_v2.pdf
```

Detectar:

- cláusulas modificadas;
- nuevas;
- eliminadas;
- cambios relevantes;
- posibles cambios de riesgo.

## Beta 0.3 — Análisis masivo

Ejemplo:

```text
50 contratos
    ↓
Procesamiento
    ↓
Clasificación
    ↓
Priorización
```

## Beta 0.4 — Clientes/proyectos

Para abogados:

```text
Cliente A
   ├── Contrato 1
   ├── Contrato 2
   └── Contrato 3

Cliente B
   ├── Contrato 1
   └── NDA
```

## V1

Posibles:

- equipos;
- roles;
- permisos;
- análisis masivo avanzado;
- plantillas de análisis;
- API;
- integraciones.

---

# 18. Fuera del MVP

No implementar inicialmente:

- generador general de contratos;
- demandas;
- derechos de petición;
- chatbot jurídico general;
- asesoría jurídica personalizada;
- firma electrónica;
- marketplace de abogados;
- gestión completa de expedientes;
- decenas de tipos contractuales;
- automatizaciones complejas;
- API pública.

El núcleo es:

> **Subir → Analizar → Evidenciar → Priorizar → Reportar.**

---

# 19. Reutilización de StoryForge

Existe un proyecto previo llamado **StoryForge** que debe servir como referencia técnica y posible fuente de reutilización.

## Ruta local

El desarrollador debe reemplazar:

```text
[STORYFORGE_LOCAL_PATH]
```

por la ruta absoluta real.

Ejemplo:

```text
C:\Users\Usuario\Documents\proyectos\story-forge
```

OpenCode debe inspeccionarlo sin modificarlo salvo solicitud explícita.

### Debe auditar:

- package.json;
- stack;
- estructura;
- frontend;
- componentes;
- autenticación;
- carga de archivos;
- procesamiento PDF/DOCX;
- APIs;
- Supabase;
- integración LLM;
- historial;
- exportación;
- configuración;
- manejo de errores;
- variables de entorno;
- despliegue.

Crear un inventario:

```text
REUTILIZABLE
ADAPTABLE
NUEVO
DESCARTAR
```

---

# 20. Qué potencialmente reutilizar

Del StoryForge existente, evaluar reutilización de:

- Next.js / App Router;
- TypeScript;
- React;
- Tailwind;
- sistema de componentes;
- layout;
- dashboard;
- Clerk;
- Google SSO;
- Supabase;
- PostgreSQL;
- RLS;
- usuarios;
- carga de archivos;
- procesamiento PDF/DOCX;
- estados de procesamiento;
- API routes;
- OpenAI;
- Claude si sigue siendo útil;
- React Query;
- historial;
- exportación PDF;
- utilidades;
- patrones de servicios;
- manejo de errores;
- configuración;
- despliegue Vercel.

No copiar ciegamente.

---

# 21. Qué NO reutilizar directamente

StoryForge tiene un pipeline orientado a historias de usuario:

```text
Context analysis
    ↓
Requirements discovery
    ↓
Story generation
    ↓
INVEST validation
    ↓
Acceptance criteria
```

ContractLens necesita:

```text
Document ingestion
    ↓
Contract classification
    ↓
Clause extraction
    ↓
Obligation extraction
    ↓
Risk analysis
    ↓
Legal grounding
    ↓
Evidence validation
    ↓
Report generation
```

Reutilizar:

- infraestructura;
- arquitectura;
- componentes;
- servicios genéricos;
- patrones.

No reutilizar como lógica de negocio:

- prompts de historias;
- reglas INVEST;
- generación de HU;
- criterios de aceptación.

---

# 22. Arquitectura conceptual

```text
                    CONTRACTLENS
                         |
          +--------------+--------------+
          |                             |
       FRONTEND                       BACKEND
          |                             |
    Next.js / React                API / Services
    Tailwind                       |
    Components                     +-- Document Service
                                   +-- Extraction Service
                                   +-- Classification
                                   +-- Clause Service
                                   +-- Analysis Service
                                   +-- Risk Engine
                                   +-- Evidence Validator
                                   +-- Legal Sources
                                   +-- Report Service
                                           |
                              +------------+------------+
                              |                         |
                           Supabase                 LLM APIs
                        PostgreSQL + RLS        OpenAI / Claude
```

Este diagrama es conceptual. OpenCode debe adaptarlo después de auditar StoryForge y el proyecto actual.

---

# 23. Modelo de datos conceptual

Posibles entidades:

```text
users
organizations
clients
contracts
contract_versions
analyses
clauses
findings
sources
reports
```

Relación:

```text
Organization
   ↓
Client
   ↓
Contract
   ↓
Contract Version
   ↓
Analysis
   ├── Clauses
   ├── Findings
   ├── Sources
   └── Report
```

Para Beta 0.1 se puede simplificar. Evitar sobreingeniería.

---

# 24. IA y calidad

Preferir:

- etapas independientes;
- outputs estructurados;
- schemas;
- validación;
- evidencia;
- trazabilidad;
- prompts especializados;
- manejo de errores;
- evaluación por etapa.

Distinguir entre:

1. información explícita del documento;
2. inferencia;
3. información no determinada.

Nunca presentar una inferencia como hecho contractual.

---

# 25. Fuentes jurídicas

La arquitectura debe permitir incorporar fuentes oficiales y actualizadas.

No depender únicamente del conocimiento del LLM.

Evolución prevista:

```text
Cláusula / consulta
       ↓
Recuperación de fuente
       ↓
LLM
       ↓
Análisis fundamentado
```

RAG puede incorporarse posteriormente.

Para Beta 0.1 priorizar calidad, evidencia y trazabilidad antes que construir un sistema RAG jurídico gigantesco.

---

# 26. Seguridad y privacidad

El producto manejará contratos potencialmente sensibles.

OpenCode debe considerar desde el principio:

- separación de datos por usuario/organización;
- RLS;
- autorización en backend;
- validación de archivos;
- límites de tamaño;
- almacenamiento seguro;
- no exponer documentos de otros usuarios;
- no confiar en IDs enviados por el cliente;
- manejo seguro de errores;
- variables secretas únicamente en entorno seguro;
- políticas claras de retención/eliminación cuando se implemente producción.

---

# 27. Experiencia objetivo

```text
LOGIN
  ↓
DASHBOARD
  ↓
NUEVO ANÁLISIS
  ↓
SUBIR PDF/DOCX
  ↓
IDENTIFICAR CONTRATO
  ↓
ANALIZAR
  ↓
RESULTADO
  ├── Resumen
  ├── Información
  ├── Hallazgos
  ├── Evidencia
  ├── Fuentes
  └── Recomendaciones
  ↓
GENERAR PDF
  ↓
HISTORIAL
```

La UX debe sentirse como una herramienta profesional de trabajo, no como un simple chatbot.

---

# 28. Propuesta de valor

### General

> **Analiza contratos en minutos, identifica los puntos que requieren atención y encuentra la evidencia directamente en el documento.**

### Para abogados

> **Haz la primera revisión de tus contratos con IA y dedica tu tiempo al análisis jurídico que realmente requiere criterio profesional.**

### Para pymes

> **Entiende tus contratos y detecta los puntos que deberías revisar con tu abogado antes de avanzar.**

---

# 29. Validación comercial inicial

No buscar inicialmente cientos de usuarios.

Objetivo:

**5 abogados y algunas pymes piloto.**

Probar con contratos reales o apropiadamente anonimizados.

Medir:

- tiempo ahorrado;
- utilidad de hallazgos;
- errores;
- información faltante;
- tipos de contrato solicitados;
- confianza;
- disposición de pago;
- funcionalidades usadas.

Priorizar el roadmap según evidencia real.

---

# 30. Modelo de negocio inicial

## Plan Pyme

Suscripción mensual:

- número limitado de análisis;
- historial;
- informes;
- análisis de cláusulas.

## Plan Profesional

Para abogados:

- más análisis;
- clientes;
- comparación;
- informes;
- posteriormente análisis masivo.

No fijar precios definitivos antes de validar disposición de pago.

---

# 31. Criterio de Beta viable

Una persona externa debe poder:

1. crear cuenta;
2. subir contrato;
3. esperar procesamiento;
4. recibir análisis;
5. entender resumen;
6. ver hallazgos;
7. consultar evidencia;
8. consultar fuentes cuando existan;
9. generar PDF;
10. volver al análisis desde historial.

Además:

- build funcional;
- lint;
- pruebas disponibles;
- manejo razonable de errores;
- persistencia;
- aislamiento de usuarios;
- UX consistente;
- sin datos ficticios presentados como reales;
- sin conclusiones jurídicas absolutas.

---

# 32. Instrucciones de trabajo para OpenCode

## Fase 0 — Auditoría

Primero inspeccionar:

1. proyecto ContractLens actual;
2. StoryForge en `[STORYFORGE_LOCAL_PATH]`.

Comparar:

- estructura;
- stack;
- dependencias;
- componentes;
- servicios;
- APIs;
- base de datos;
- autenticación;
- carga de archivos;
- IA;
- exportación;
- seguridad.

Generar un diagnóstico de:

```text
REUTILIZAR
ADAPTAR
CREAR
ELIMINAR
```

## Fase 1 — Plan

Crear un plan completo desde el estado actual hasta Beta 0.1.

Debe incluir:

- fases;
- objetivos;
- tareas;
- dependencias;
- archivos que se modificarán;
- componentes reutilizados;
- componentes nuevos;
- cambios de BD;
- APIs;
- pipeline IA;
- validaciones;
- pruebas;
- seguridad;
- UX;
- despliegue.

## Fase 2 — Implementación

Implementar incrementalmente.

Cada fase debe ser pequeña y verificable.

No hacer una migración masiva sin validación.

## Fase 3 — Validación

Al finalizar cada fase:

- build;
- lint;
- tests disponibles;
- prueba funcional;
- revisión de errores;
- actualización de documentación.

---

# 33. Regla fundamental

Antes de crear una nueva solución:

> **¿Esto ya existe en StoryForge y puede reutilizarse limpiamente?**

Si sí:

- reutilizar;
- adaptar;
- extraer componente/servicio;
- evitar duplicación.

Pero ContractLens debe terminar siendo un proyecto independiente y mantenible.

No crear acoplamiento innecesario con StoryForge.

---

# 34. Resultado esperado

OpenCode no debe comenzar simplemente a programar al recibir este archivo.

Primero debe:

1. leer este contexto;
2. inspeccionar StoryForge;
3. inspeccionar ContractLens;
4. comparar ambos;
5. identificar reutilización real;
6. detectar riesgos;
7. proponer arquitectura;
8. crear plan de acción;
9. presentar el plan para revisión;
10. comenzar implementación después de la revisión.

Objetivo final:

> **Una beta funcional, segura y suficientemente profesional para ser mostrada y probada con abogados y pymes reales.**

---

# 35. Resumen ejecutivo

ContractLens es un producto B2B para abogados y pymes.

No es un chatbot jurídico ni un simple generador de contratos.

Su núcleo:

```text
SUBIR CONTRATO
      ↓
ANALIZAR
      ↓
EXTRAER
      ↓
IDENTIFICAR CLÁUSULAS
      ↓
DETECTAR POSIBLES PUNTOS DE ATENCIÓN
      ↓
MOSTRAR EVIDENCIA
      ↓
PRIORIZAR
      ↓
GENERAR INFORME
```

Beta inicial:

- prestación de servicios;
- laboral;
- NDA.

Principio diferencial:

**Analizar → Evidenciar → Priorizar → Reportar**

StoryForge será la referencia técnica y fuente potencial de reutilización. La ruta local será proporcionada por el desarrollador.

La primera tarea de OpenCode es una **auditoría comparativa y un plan de implementación**, no una reescritura indiscriminada.

---

## 36. Variable pendiente

Reemplazar:

```text
[STORYFORGE_LOCAL_PATH]
```

por la ruta absoluta local real del proyecto StoryForge antes de iniciar la auditoría.

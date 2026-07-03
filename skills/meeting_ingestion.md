# Skill: Ingesta de Transcripciones de Reunión (Vía C)

## Propósito
Las reuniones con stakeholders se **graban** y se obtiene su **transcripción**. Esta skill convierte esa transcripción en dos productos:

1. **Un acta destilada** en `reuniones/reunion-{slug}-{YYYY-MM-DD}.md` (memoria institucional de la reunión).
2. **Conocimiento ruteado** a los specs/índices vivos (glosario, dolores, blueprints, políticas, normativa, invariantes) vía **Real-Time Sync**.

Es la **tercera vía** del onboarding, complementaria a:
- **Vía A** — destilar del código (`skills/context_onboarding.md`).
- **Vía B** — entrevistar al equipo en vivo (`skills/interview_guide.md`).
- **Vía C** — destilar de transcripciones de reunión (**esta skill**).

> **Regla de oro:** el acta es un **resumen estructurado y fiel**, no una copia de la transcripción. La transcripción cruda contiene PII de stakeholders y muletillas — **no se versiona** (ver §6). Lo que perdura es el acta + el conocimiento ruteado.

---

## Cómo se invoca
- Atajo: `/meeting`
- O en lenguaje natural: *"acá está la transcripción de la reunión de hoy"*, *"procesa esta acta"*, *"documenta esta reunión"*.

El equipo aporta el **texto de la transcripción** (pegado o ruta a archivo en `reuniones/transcripts/`). El agente **no** necesita el audio.

---

## Procedimiento (6 pasos)

### Paso 1 — Encuadre
Antes de leer a fondo, fija los metadatos: **fecha**, **tema/slug**, **asistentes** (¿dueño, secretaria, instructor, equipo dev?), **canal** (presencial/Zoom). Si la transcripción no los trae, **pregúntalos** — no los inventes (Cero Alucinaciones).

### Paso 2 — Lectura con lente de dominio (Critic Loop)
Recorre la transcripción buscando, en este orden, señales de:
- **Términos nuevos / Lenguaje Ubicuo** → candidatos a `indices/DOMAIN_GLOSSARY.md`.
- **Decisiones de negocio** ("decidimos que…", "de ahora en adelante…") → `specs/domain/policies.md`.
- **Reglas/pasos de un flujo** → `specs/blueprints/`.
- **Dolores / fricción** ("nos cuesta…", "se nos cae…", "perdemos tiempo en…") → `indices/PAIN_LOG.md`.
- **Referencias normativas** (MTT, SENCE, edad, vigencia de documentos) → `specs/regulatory/normativa_chile.md` + posible advertencia en `specs/eval/compliance_check.md` (Capa B).
- **Invariantes de integridad** (algo que el sistema *no debe* permitir) → `specs/eval/compliance_check.md` (Capa A).
- **Pendientes / compromisos** (acuerdos, tareas, cosas por confirmar) → `Acuerdos & Pendientes` del acta + `indices/BACKLOG.md` si es de largo plazo.

### Paso 3 — Clasificar la certeza de cada hallazgo
Etiqueta cada extracción con su estado de conocimiento (misma convención del glosario):
- `[Validado]` — el stakeholder dueño de la regla la afirmó sin ambigüedad.
- `[Por Validar]` — se dijo, pero quedó como hipótesis, propuesta o sin confirmar el dueño de la regla.
- `[Por rellenar]` — se nombró un concepto pero no se definió.

> **Anti-alucinación:** si en la transcripción no se dijo algo, **no lo escribas**. No completes huecos con "lo que normalmente haría una autoescuela". Lo que no quedó claro se marca `[Por Validar]` y entra como pregunta en `Acuerdos & Pendientes`.

### Paso 4 — Escribir el acta
Crea `reuniones/reunion-{slug}-{YYYY-MM-DD}.md` a partir de `reuniones/_TEMPLATE.md`. El acta es **autocontenida**: quien la lea entiende qué se decidió sin escuchar el audio.

### Paso 5 — Rutear conocimiento (Real-Time Sync, OBLIGATORIO)
En **el mismo turno**, edita los `.md` destino con cada hallazgo `[Validado]` o `[Por Validar]`. Cada entrada ruteada lleva un puntero de vuelta al acta como fuente:
`→ reunión: reuniones/reunion-{slug}-{YYYY-MM-DD}.md`

Prohibido decir "lo guardaré" sin ejecutar la edición. Si la reunión no aportó nada ruteable, dilo explícitamente.

### Paso 6 — Registrar e indexar
Añade la fila de la reunión a `reuniones/INDEX.md` y cierra con un reporte: qué archivos tocaste, qué se ruteó y qué quedó pendiente de validar.

---

## §6 — Privacidad y manejo de la transcripción cruda
- La transcripción cruda **NO se versiona en git** (contiene PII de stakeholders: nombres, datos personales, montos, eventualmente RUT).
- Si se guarda como archivo, va en `reuniones/transcripts/`, que está en `.gitignore`.
- El acta destilada **sí** se versiona, pero se redacta **minimizando PII**: usa rol ("la secretaria de sede Roja") en vez de nombre completo cuando el dato personal no aporte a la regla de negocio.
- Nunca pegues RUT, teléfonos, direcciones ni montos de cuentas personales en el acta o en los specs.

---

## Relación con las otras skills
- Si un hallazgo necesita confirmarse contra el producto → **Vía A** (`context_onboarding`): búscalo en `indices/CODE_MAP.md` y cita.
- Si la transcripción dejó huecos → **Vía B** (`interview_guide`): formula las preguntas de seguimiento.
- Al cerrar sesión → `/sync` (`sync_knowledge`) audita que nada del acta haya quedado solo en el chat.

# Skill: Context Onboarding & Knowledge Extraction (Dual)

## Propósito
Convierte al agente en un "Entrevistador de Dominio" proactivo. Dado que Autoescuela **ya tiene mucho conocimiento codificado** en `el repositorio Autoescuela`, el onboarding es **TRIPLE**:

- **Vía A — Destilar del código:** extraer reglas ya implementadas y reflejarlas en specs propias con punteros.
- **Vía B — Entrevistar al equipo:** capturar lo que **NO** está en el código (decisiones de reunión, intenciones, normativa, dolores).
- **Vía C — Destilar de transcripciones de reunión:** las reuniones con stakeholders se graban y transcriben. Procesa la transcripción con `skills/meeting_ingestion.md` (atajo `/meeting`): produce un acta en `reuniones/` y rutea el conocimiento a glosario/specs. Es la fuente más rica de "lo decidido en sala".
- **Vía D — Captura ambiental del chat diario:** conocimiento que el equipo suelta en conversación normal, sin invocar ningún flujo. Lo captura el `skills/radar_de_contexto.md` (siempre encendido). No requiere `/onboarding`; es el goteo continuo que alimenta los mismos destinos.

## Cuándo usar cada vía
1. **Primero intenta la Vía A.** Si el equipo pregunta algo de dominio, búscalo en `indices/CODE_MAP.md` → archivo del código. Si lo encuentras, respóndelo citando y, si es relevante y aún no está, **destílalo** a un spec/glosario.
2. **Usa la Vía B** solo cuando el conocimiento no esté en el código: pruebas escritas por email (DOLOR-003), términos de "concepto" (DOLOR-004), fuentes legales precisas de `regulatory/`, intención de un flujo futuro.

## Canales de la Vía B (afirmado por el equipo, 2026-07-06)
La Vía B usa **dos canales complementarios**; elegir según el peso del tema:

- **Videollamada (reuniones):** el canal para lo profundo — mapear flujos completos, resolver contradicciones código↔equipo, discutir políticas o dolores. Se graban y transcriben, así que su salida entra por **Vía C** (`/meeting`). El agente prepara la **agenda** previa (los 🟡 / pendientes de la task en curso, priorizados).
- **WhatsApp (canal directo):** para dudas puntuales y coordinación menor. Micro-cuestionarios asíncronos:
  1. El agente redacta la pregunta lista para pegar: mensaje corto, autocontenido (*"hoy el sistema hace X, ¿es correcto?"*), con opciones cerradas `a) / b) / c) otra: ¿cuál?` — respondible desde el teléfono en un minuto. Máximo 2-3 por tanda, dirigidas a quien tiene autoridad sobre el tema (política/precios → dueño; operación diaria → secretaria).
  2. Las respuestas vuelven pegadas al chat con el agente (el Radar/Vía D las captura), citando quién y cuándo. Audios: transcripción nativa de WhatsApp y pegar el texto.
  3. Respuesta de la persona con autoridad = afirmación del equipo → `[Validado]` citando `WhatsApp, <persona>, <fecha>`. Ambigua o parcial → `[Por Validar]` + repregunta; si el tema resulta más grande de lo esperado → **escalarlo a la agenda de la próxima videollamada**, no insistir por chat.

**Criterio de ruteo:** confirmación rápida o pregunta cerrada → WhatsApp; discusión, contradicción, flujo completo o decisión de política → videollamada. La cola de preguntas pendientes vive en el archivo de la task (p.ej. TASK_002 § Pendiente), nunca solo en el chat; cada respuesta recibida → Real-Time Sync al spec destino y marcar el ítem en la task.

## Estados de adquisición (qué fase toca)

### Fase 1 — Lenguaje Ubicuo
- **Condición:** `indices/DOMAIN_GLOSSARY.md` tiene términos `[Por rellenar]` o `[Por Validar]` críticos.
- **Acción:** confirmar/definir el término. Disparo rápido: *"En el código veo `payment_mode = deposit` como 50%. ¿Confirmas que el depósito siempre es la mitad, o varía por curso?"*

### Fase 2 — Mapeo de Procesos (Blueprints)
- **Condición:** un flujo operativo no tiene blueprint o el blueprint tiene `[Por Validar]`.
- **Acción:** mapear un proceso a la vez. *"Vamos a cerrar el flujo de reprogramación de clases. Desde que la secretaria decide mover una clase, ¿cuáles son los pasos y qué valida el sistema?"*

### Fase 3 — Invariantes, Normativa y Casos Límite
- **Condición:** hay procesos mapeados pero faltan reglas duras o fuentes normativas.
- **Acción:** estresar el proceso. *"Si el vehículo tiene la revisión técnica vencida el día de la clase, ¿el sistema lo impide, lo advierte, o no dice nada? ¿Cuál debería ser la política?"* → actualizar `compliance_check.md` / `regulatory/normativa_chile.md`.

## Instrucciones de ejecución
Cuando el usuario invoque `/onboarding` o pida "obtener contexto":
1. **Analiza el estado actual:** lee tus índices/specs y detecta qué Fase y qué vía toca. Usa `indices/CONTEXT_MAP.md` como **backlog de onboarding**: cada marca 🟡 es un hueco por entrevistar (Vía B) o transcribir (Vía C). Prioriza los 🟡 de los contextos **Core** (Matrícula, Academia Clase B).
2. **Intenta resolver con el código primero** (Vía A): busca en `CODE_MAP.md` y cita.
3. **Si falta, propón un método de extracción acotado** (Vía B): un cuestionario de 3 preguntas, o pegar un correo/acta para que lo analices, o una hipótesis para que el equipo confirme.
4. **Extrae y transforma con DDD:** identifica Entidad, Agregado, Regla.
5. **GUARDA EN EL ACTO (Real-Time Sync):** en el mismo turno, **edita el `.md` correspondiente** (glosario / pain_log / blueprint / policy / regulatory / code_map) y **luego** formula la siguiente pregunta. Jamás dejes el conocimiento solo en el chat.

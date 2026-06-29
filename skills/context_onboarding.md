# Skill: Context Onboarding & Knowledge Extraction (Dual)

## Propósito
Convierte al agente en un "Entrevistador de Dominio" proactivo. A diferencia del framework de bodega (que nació en blanco), Autoescuela **ya tiene mucho conocimiento codificado** en `el repositorio Autoescuela`. Por eso el onboarding es **DUAL**:

- **Vía A — Destilar del código:** extraer reglas ya implementadas y reflejarlas en specs propias con punteros.
- **Vía B — Entrevistar al equipo:** capturar lo que **NO** está en el código (decisiones de reunión, intenciones, normativa, dolores).

## Cuándo usar cada vía
1. **Primero intenta la Vía A.** Si el equipo pregunta algo de dominio, búscalo en `indices/CODE_MAP.md` → archivo del código. Si lo encuentras, respóndelo citando y, si es relevante y aún no está, **destílalo** a un spec/glosario.
2. **Usa la Vía B** solo cuando el conocimiento no esté en el código: pruebas escritas por email (DOLOR-003), términos de "concepto" (DOLOR-004), fuentes legales precisas de `regulatory/`, intención de un flujo futuro.

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
1. **Analiza el estado actual:** lee tus índices/specs y detecta qué Fase y qué vía toca.
2. **Intenta resolver con el código primero** (Vía A): busca en `CODE_MAP.md` y cita.
3. **Si falta, propón un método de extracción acotado** (Vía B): un cuestionario de 3 preguntas, o pegar un correo/acta para que lo analices, o una hipótesis para que el equipo confirme.
4. **Extrae y transforma con DDD:** identifica Entidad, Agregado, Regla.
5. **GUARDA EN EL ACTO (Real-Time Sync):** en el mismo turno, **edita el `.md` correspondiente** (glosario / pain_log / blueprint / policy / regulatory / code_map) y **luego** formula la siguiente pregunta. Jamás dejes el conocimiento solo en el chat.

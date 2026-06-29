# Guía de Entrevista: Descubrimiento de Dominio (Autoescuela)

## 🧠 Metodología "Cero Suposiciones"
Tu postura es de investigador. Cada escuela de conducción tiene "mañas" y reglas no escritas. No asumas que opera como en los manuales.

Aplica estas técnicas:
1. **Event Storming:** busca el inicio y el fin de cada proceso. *("¿Qué evento exacto le avisa a la secretaria que debe cerrar la caja?")*
2. **Show Me, Don't Tell Me:** si dicen "revisamos los documentos", pide ver el caso real en pantalla.
3. **Edge Cases:** el sistema falla en las excepciones. *("¿Qué pasa si el instructor no llega? ¿Y si el alumno pagó depósito pero quiere más clases?")*
4. **Diferenciar negocio vs código:** pregunta siempre "¿esto es así porque la ley lo exige, porque el dueño lo decidió, o porque el sistema quedó así?" → clasifica en `regulatory/` vs `domain/policies.md` vs dolor.

---

## FASE 1 — Estructura y Actores (Macro)
**Objetivo:** entender la geografía del negocio.
- "¿Cuántas sedes hay y en qué se diferencian? (Azul / Roja — ¿una hace profesional y la otra no?)"
- "¿Quién hace qué? Dueño, secretaria, instructor, relator — ¿hay solapamiento de roles?"
- "¿Qué métricas mira el dueño cada día/mes?"

## FASE 2 — Lenguaje Ubicuo (Identidades)
**Objetivo:** definir exactamente de qué hablamos.
- "Cuando dicen 'matrícula', ¿es el contrato, el acto de inscribir, o el número correlativo?"
- "Para clase profesional: 'promoción', 'relator', 'módulo', 'convalidación' — ¿cómo los usan ustedes?"
- "Un 'descuento' y una 'promoción' del sistema anterior, ¿son lo mismo?"

## FASE 3 — Flujos Vitales
**Objetivo:** trazar el camino completo.
- **Matrícula:** "Desde que el alumno llega/entra a la web hasta que queda matriculado, ¿cuáles son los pasos? ¿Qué cambia entre sede y online?"
- **Agenda (Triple Match):** "¿Cómo decide la secretaria que se puede agendar una clase? ¿Qué revisa del alumno, del instructor y del vehículo?"
- **Finanzas:** "¿Cómo es un día de caja? ¿Qué entra a cuadratura y qué no?"
- **Profesional:** "¿Cómo nace una promoción, cómo se asignan relatores, cómo se evalúa?"

## FASE 4 — Excepciones, Normativa y Reglas de Negocio
**Objetivo:** descubrir políticas ocultas y casos borde.
- "¿Qué exige la ley vs qué decidió el dueño? (edad mínima, clases/día, documentos de flota)"
- "¿Qué pasa si se intenta algo que viola una norma? ¿Se bloquea o se advierte?" → confirma la postura de **advertir, no bloquear**.
- "Si hay un descuadre de caja, ¿quién autoriza el ajuste y cómo se registra?"
- "¿Hay reglas estrictas de vigencia (SOAP, revisión técnica, HVC) que el sistema deba vigilar?"

---

> **Recordatorio:** cada respuesta útil se guarda **inmediatamente** en el `.md` correcto (Real-Time Sync). Clasifica bien: normativa estatal → `regulatory/`; decisión del negocio → `domain/policies.md`; término → glosario; fricción → `PAIN_LOG.md`; proceso → `blueprints/`.

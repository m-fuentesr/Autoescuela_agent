# Spec: Loop de Autoevaluación de Dominio (Autoescuela)

Define los criterios que el agente valida mentalmente **antes** de emitir cualquier respuesta o propuesta. Es la capa "Anti-Corrupción" contra alucinaciones perjudiciales.

> **Principio de dos capas (decisión del equipo):**
> - **CAPA A — Invariantes de Integridad** → *bloquean*. Son consistencia del sistema; si se violan, el agente rechaza su propia idea.
> - **CAPA B — Advertencias Normativas** → *advierten y citan*. Son normativa chilena; el agente NO bloquea, emite una advertencia clara con cita a `specs/regulatory/normativa_chile.md` y deja la decisión al equipo.

---

## CAPA A — Invariantes de Integridad (BLOQUEAN)

| Invariante | Descripción | Acción si falla (Critic Loop) |
| :--- | :--- | :--- |
| **Triple Match** | No se confirma una clase práctica sin verificar **simultáneamente** alumno + instructor + vehículo disponibles en ese horario. | Rechazar. Indicar cuál de las tres patas falta. (→ `DOMAIN_GLOSSARY.md` Triple Match) |
| **No doble-booking** | Un instructor o un vehículo no puede tener dos clases en el mismo slot. | Rechazar. Proponer slot alternativo libre. |
| **Existencia antes de acción** | No se puede agendar/cobrar/certificar contra una entidad inexistente o en estado inválido (ej: certificar sin completar las 12 clases). | Rechazar. Verificar estado real en el código (`v_student_progress_b`). |
| **Cupo de curso singular** | No se inscribe sobre la capacidad del curso. | Rechazar. (→ trigger `trg_standalone_capacity`, `DATABASE.md:27`) |
| **Integridad de cuadratura** | No eliminar alumnos/pagos de forma que corrompa una cuadratura ya cerrada. Usar soft-delete (`archived`). | Rechazar borrado físico. Proponer papelera. (→ `reunion-demo:61`) |
| **Scope de sede (branch)** | Un dato branch-scoped no se muestra/mezcla entre sedes salvo grant explícito (`can_access_both_branches`). | Rechazar. (→ `facades.md` sección 7) |

## CAPA B — Advertencias Normativas (ADVIERTEN, no bloquean)

| Situación | Advertencia a emitir | Cita |
| :--- | :--- | :--- |
| **Alumno menor de edad** | "El alumno es menor; requiere **autorización notarial** para matricular." | `regulatory/normativa_chile.md` (edad/menores) |
| **Más de 1 clase/día (online) o más de 3/día (sede)** | "Excede el máximo de clases/día. Regulación MTT = 1 clase de 45 min/día; en sede se permite hasta 3 por excepción operativa." | `regulatory/normativa_chile.md` (clases/día); `reunion-demo:25-28` |
| **Vehículo con SOAP o revisión técnica vencida** | "El vehículo tiene documentación vencida; no debería circular para clases." | `regulatory/normativa_chile.md` (flota) |
| **Instructor con licencia vencida/no habilitada para el tipo** | "El instructor no está habilitado para esta clase." | `regulatory/normativa_chile.md` (instructor) |
| **Certificado sin folio/fecha de entrega** | "El certificado necesita folio y fecha de entrega; es la prueba legal ante reclamos." | `regulatory/normativa_chile.md` (certificados) |
| **Reprobar a un alumno profesional** | "El alumno profesional ya pagó el certificado; el negocio no reprueba — usar 'concepto', no nota reprobatoria." | `PAIN_LOG.md` DOLOR-004 |

---

## Formato de Salida Obligatorio (cuando hay conflicto)

### Si se viola una INVARIANTE (Capa A):
- **Estado del Dominio:** `[En Conflicto — Invariante]`
- **Acción Evaluada:** [lo que pidió/dedujo]
- **Invariante Vulnerada:** [cita explícita]
- **Resolución Propuesta:** [alternativa segura acorde al dominio]

### Si hay un cruce NORMATIVO (Capa B):
- **Estado del Dominio:** `[Válido con Advertencia]`
- **Respuesta:** [responde normalmente a lo pedido]
- **⚠️ Advertencia Normativa:** [la advertencia + cita de `regulatory/normativa_chile.md`]
- (No se bloquea; la decisión queda en el equipo.)

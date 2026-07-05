# Spec: Políticas Duras del Negocio (no estatales)

> Reglas de negocio **propias de la escuela / del producto** (distintas de la normativa estatal, que vive en `specs/regulatory/normativa_chile.md`). Estas reglas representan cómo decidió operar el negocio, respaldadas por el código.

---

## P1 — Modalidad de pago de la matrícula
- **Total vs Depósito (`payment_mode`):** la matrícula puede pagarse completa (`total`) o con depósito (`deposit`, 50%). El depósito condiciona cuántas clases puede agendar el alumno.
- **Descuento libre:** en el paso de pago se puede aplicar un descuento libre (monto + motivo, queda en log de auditoría) — equivale a las "promociones" del sistema anterior.
  → código: `EnrollmentPaymentFacade` (`FACADES.md:14`); `enrollments.payment_mode` (`DATABASE.md:67`).

## P2 — Selector de 6 o 12 clases
- En la matrícula se elige 6 o 12 clases, lo que controla cuántas fechas puede seleccionar el alumno. Al matricularse en Clase B se agendan **todas** las clases de una vez (ya no existe "agendar la segunda mitad" desde la agenda).
  → código: `AgendaFacade` fix-017 (`FACADES.md:18`); `reunion-demo-2026-05-29.md:23`.

## P3 — Clases por día según canal
- Online: 1 clase/día. En sede (secretaria): hasta 3/día. (Coincide con la normativa MTT pero es además decisión operativa del producto.)
  → ver `regulatory/normativa_chile.md` §2.

## P4 — Egresos: operacional vs estructural
- **Operacional → cuadratura** (lo registra la secretaria): bencina, útiles, anticipos a instructores, gastos chicos del día (incluso ~50k si es habitual).
- **Estructural → solo reportes del dueño** (NO cuadratura): choques/reparaciones mayores, luz, agua, arriendo, contribuciones, sueldos.
- Regla: día a día operacional → cuadratura; estructural o irregular de monto grande → reportes admin.
  → código: `expenses` vs `fixed_expenses` (`DATABASE.md:21-22`); `reunion-demo-2026-05-29.md:50-57`.

## P5 — Soft-delete (papelera) en vez de borrado
- Los alumnos se archivan (`status='archived'`), no se borran, para no corromper la cuadratura. La base separa activos / ex-alumnos.
  → código: `students.status` (`DATABASE.md:11`); `AdminAlumnosFacade` (`FACADES.md:15`).

## P6 — Convalidaciones no consumen cupo
- Cursos con `is_convalidation=true` (A2→A4, A5→A3) **no generan enrollment ni cuentan contra el cupo**.
  → código: `courses.is_convalidation` (`DATABASE.md:12`); `license_validations` (`DATABASE.md:56`).

## P7 — Drafts de matrícula expiran
- Una matrícula `draft` expira (24h presencial) y un cron la limpia junto con sus datos huérfanos. Por diseño un draft nunca tiene `total_paid > 0`.
  → código: `cleanup_expired_drafts()` (`DATABASE.md:117`).

## P8 — Idempotencia de pagos online
- El flujo online es idempotente por `session_token` (UUID en localStorage). Las reservas de slot tienen TTL 20 min.
  → código: `payment_attempts`/`slot_holds` (`DATABASE.md:63-64`); Edge Function `public-enrollment`.

## P9 — Profesional: un relator en varias promociones
- Un relator puede estar en múltiples promociones simultáneamente. Una promoción puede tener múltiples categorías de alumnos. Un desertor puede integrarse a una promoción posterior.
  → código: `promotion_course_lecturers` (`DATABASE.md:50`); `reunion-demo-2026-05-29.md:89-97`.

## P10 — Oferta por tipo de academia (Clase B / Profesional) y alcance de la secretaria
- El producto soporta **dos tipos de academia**: **Clase B** y **Profesional**. Una escuela puede ofrecer **ambas o solo una**; la operación se adapta a lo que su escuela ofrezca.
- **La secretaria de una escuela con Profesional tiene participación plena** en ese módulo: puede **matricular, ver datos y operar todo lo profesional** (no queda restringido al admin ni a Clase B).
- La **matrícula profesional usa el mismo formulario/wizard de matrícula** que Clase B (corrección 2026-07-05). Al seleccionar "profesional" —opción disponible solo si la sede tiene `has_professional`— el flujo **se ramifica** por `license_group`: en vez de la ruta de slots/Triple Match, se asigna a una **promoción** (debe existir una abierta; normalmente siempre hay). Ver `roles/secretaria.md` A1/A8.
- **Unidad operativa = la Sede `[Validado]`.** "Escuela" se usa de forma laxa: NO es multi-tenant. La oferta (B / Prof / ambas) es **por sede** vía `has_professional`, y hay **1 secretaria por sede**. Caso actual: 2 sedes (Azul, Roja), 2 secretarias.
  → código: `branches.has_professional` (glosario, Sede); chat 2026-07-05.

---

> **Para el agente:** cuando el equipo confirme o cambie una política de negocio, edítala aquí de inmediato (Real-Time Sync). Distingue siempre **política de negocio** (este archivo) de **normativa estatal** (`regulatory/`).

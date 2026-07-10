# Blueprint: Matrícula (Wizard de 6 pasos — Clase B y Profesional)

> El flujo más importante del producto. Existe en dos canales: **presencial** (secretaria) y **online público** (alumno + Transbank). Aquí se mapea el flujo y sus reglas; el detalle técnico vive en el código.

## Canales
- **Presencial:** la secretaria opera el wizard en sede. Hasta 3 clases/día. Draft expira en 24h.
- **Online (público):** el alumno se matricula solo. Reserva de slots (TTL 20 min), pago Transbank Webpay, idempotencia por `session_token`. Máx 1 clase/día.
  → código: `EnrollmentFacade` (`FACADES.md:12`); Edge Function `public-enrollment` (`DATABASE.md:108`).

## Los 6 pasos `[orden corregido 2026-07-05 — destilado del código]`
> El orden real es **Contrato (4) antes de Pago (5)** — specs anteriores lo tenían invertido.
> → código: `stepLabels` en `secretaria-matricula.component.ts`.

1. **Datos personales** — RUT, nombres, contacto, fecha nacimiento, sexo (M/F/X), dirección, categoría y tipo de curso. Validaciones: RUT, edad (under-17 / requires-authorization), email duplicado. Al escribir el RUT de un alumno que vuelve, **precarga sus datos** (fix-020; misma entrada que "Re-matricular" desde Ex-alumnos vía query param `rut`).
   → `enrollment-personal-data.model.ts`; `findUserByEmail()` (fix-018); `prefillFromStudent()`.
2. **Asignación** — *ramifica por categoría* (ver "Diferencias" abajo). Clase B: instructor + slots (Triple Match); Profesional: promoción. Se elige también la modalidad de pago (`total`/`deposit`).
   → `enrollment-assignment.model.ts`.
3. **Documentos** — foto carnet (cámara/archivo, con reutilización de la foto anterior si es re-matrícula), autorización notarial para menores; en rama profesional además HVC obligatoria (máx 30 días), cédula y licencia opcionales.
   → `EnrollmentDocumentsFacade` (`FACADES.md:13`); `PROFESSIONAL_DOCUMENTS`.
4. **Contrato** — generación automática de PDF y subida del **firmado** (escaneado) o aceptación digital.
   → Edge Function `generate-contract-pdf` (`DATABASE.md:103`); `digital_contracts`.
5. **Pago** — desglose de precio, depósito 50% o total, **descuentos predefinidos por tipo de curso** + descuento libre (monto+motivo), método de pago (efectivo/transferencia/tarjeta/pendiente).
   → `EnrollmentPaymentFacade` (`FACADES.md:14`); `loadAvailableDiscounts(courseType)`.
6. **Confirmación** — número de matrícula correlativo (por sede + grupo), resumen, próximos pasos (texto distinto por rama), alerta de documentos pendientes.
   → RPC `confirm_enrollment_with_payment` (`DATABASE.md:118`).

## Reglas clave
- **Número de matrícula:** UNIQUE por `(number, branch_id, license_group)`.
- **Re-matrícula (fix-020):** bloquea solo si hay matrícula viva (active/pending_payment) en el mismo curso; histórico pide confirmación; excluye drafts.
- **Draft recovery:** se pueden retomar borradores pendientes (`loadActiveDrafts`).
- **Confirmación atómica:** pago + activación en una sola transacción (anti doble-clic).
- **Se agendan SIEMPRE todas las clases (12) en el paso 2**, aunque el alumno abone solo la mitad (`deposit`). El depósito afecta el **monto a pagar**, no cuántas clases se agendan (fix-017 eliminó "agendar la segunda mitad" desde la Agenda).
  → código: comentario en `step2Data` de `secretaria-matricula.component.ts`; `AgendaFacade` fix-017.

## Diferencias por rama (`license_group`) `[destilado del código 2026-07-05]`
- **Entrada compartida:** ambos usan el **mismo wizard**. La opción "profesional" aparece solo si la sede tiene `has_professional` (y solo si hay cursos de esa categoría cargados).
- **Paso 1 (extra profesional):** licencia actual + fecha, **convalidación simultánea** (A2→A4, A5→A3), promoción histórica, libro de convalidación.
- **Paso 2:** Clase B = instructor + selección de slots (máx 3/día presencial). Profesional = **asignación a promoción abierta** (grupos de promoción); sin slots.
- **Paso 3:** Clase B = solo foto carnet (+ notarial si menor). Profesional = además **HVC obligatoria** (emisión ≤ 30 días, RF-082.3), cédula y licencia opcionales.
- **Paso 4 (Contrato): MISMO generador y MISMA plantilla** para ambas ramas — se parametriza con los datos del curso (nombre, clase de licencia, duración, horas). Si hay **convalidación simultánea**, el PDF agrega una sección y una **cláusula SÉPTIMA** (libro de clases independiente, horas cubiertas por el valor único). **No existe plantilla profesional aparte.** *(Cierra la Grill Q5 de TASK_002.)*
  → código: `supabase/functions/_shared/contract-pdf.ts`; `generate-contract-pdf/index.ts`.
- **Paso 5:** misma mecánica; descuentos predefinidos se cargan por tipo de curso.
- **Paso 6:** textos de próximos pasos propios (calendario de la promoción, asistencia mínima para el examen final; si convalida, aviso de apertura del libro de la licencia convalidada).
- **Rama "singular" OCULTA:** el wizard soporta técnicamente `courseType='singular'` pero está **siempre oculto** — el alta de cursos singulares se gestiona en **admin: Contabilidad > Cursos Singulares**.
  → código: `EnrollmentFacade.hiddenCourseCategories` ("Singular siempre oculto…").

## Pendiente de mapeo `[Por Validar]`
- Manejo de documentos faltantes post-matrícula (alerta de pendientes).
- ¿Por qué el depósito es 50%? ¿Puede variar por curso? (el *porqué* no está en el código).

# Blueprint: Matrícula Clase B (Wizard de 6 pasos)

> El flujo más importante del producto. Existe en dos canales: **presencial** (secretaria) y **online público** (alumno + Transbank). Aquí se mapea el flujo y sus reglas; el detalle técnico vive en el código.

## Canales
- **Presencial:** la secretaria opera el wizard en sede. Hasta 3 clases/día. Draft expira en 24h.
- **Online (público):** el alumno se matricula solo. Reserva de slots (TTL 20 min), pago Transbank Webpay, idempotencia por `session_token`. Máx 1 clase/día.
  → código: `EnrollmentFacade` (`FACADES.md:12`); Edge Function `public-enrollment` (`DATABASE.md:108`).

## Los 6 pasos
1. **Datos personales** — RUT, nombres, contacto, fecha nacimiento, sexo (M/F/X), dirección, categoría y tipo de curso. Validaciones: RUT, edad (under-17 / requires-authorization), email duplicado.
   → `enrollment-personal-data.model.ts`; `findUserByEmail()` (fix-018).
2. **Clases / horario** — selector 6 o 12 clases; selección de instructor y slots (Triple Match). Ver `agenda_triple_match.md`.
   → `enrollment-assignment.model.ts`.
3. **Documentos** — foto carnet (cámara/archivo), autorización notarial para menores, documentos profesionales (HVC máx 30 días).
   → `EnrollmentDocumentsFacade` (`FACADES.md:13`).
4. **Pago** — desglose de precio, depósito 50% o total, descuento libre (monto+motivo), método de pago.
   → `EnrollmentPaymentFacade` (`FACADES.md:14`).
5. **Contrato** — generación automática de PDF; en online, upload del firmado escaneado.
   → Edge Function `generate-contract-pdf` (`DATABASE.md:103`); `digital_contracts`.
6. **Confirmación** — número de matrícula correlativo (por sede + grupo), resumen, próximos pasos, alerta de documentos pendientes.
   → RPC `confirm_enrollment_with_payment` (`DATABASE.md:118`).

## Reglas clave
- **Número de matrícula:** UNIQUE por `(number, branch_id, license_group)`.
- **Re-matrícula (fix-020):** bloquea solo si hay matrícula viva (active/pending_payment) en el mismo curso; histórico pide confirmación; excluye drafts.
- **Draft recovery:** se pueden retomar borradores pendientes (`loadActiveDrafts`).
- **Confirmación atómica:** pago + activación en una sola transacción (anti doble-clic).

## Diferencias Clase B vs Profesional
- **Entrada compartida `[corregido 2026-07-05]`:** ambos usan el **mismo formulario/wizard de matrícula**. La rama la decide `license_group`; la opción "profesional" aparece solo si la sede tiene `has_professional`.
- **Clase B:** ruta de slots — 6/12 clases prácticas, Triple Match, carnet dual.
- **Profesional:** tras elegir profesional, la ruta cambia — se asigna a una **promoción** (con **relatores**) en vez de slots. Requiere promoción abierta. Cursos de convalidación no generan enrollment (ver futuro blueprint `promocion_profesional.md`).

## Pendiente de mapeo `[Por Validar]`
- Flujo exacto de pago pendiente (depósito) y su efecto en cuántas clases puede agendar.
- Manejo de documentos faltantes post-matrícula (alerta de pendientes).

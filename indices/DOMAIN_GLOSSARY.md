# Índice: Glosario del Dominio (Autoescuela)

> **Nota:** Punto de entrada del Discovery Gate. Toda entidad o término del dominio debe mapearse aquí antes de procesar lógica. Es el "Ubiquitous Language" del negocio.

> **🚥 Convención de Estados de Conocimiento:**
> - `[Por rellenar]`: término identificado, falta su concepto.
> - `[Por Validar]`: hipótesis derivada del código o de reunión, requiere confirmación del equipo/dueño.
> - `[Validado]`: confirmado por el negocio.
> - `→ código:` puntero a la fuente de verdad técnica (ver `indices/CODE_MAP.md`).

---

## Regla de Negocio Central

- **Triple Match `[Validado]`** — Antes de confirmar una clase práctica deben verificarse **simultáneamente** tres disponibilidades: **(1) Alumno** (sin deuda bloqueante, horas restantes > 0, documentos vigentes), **(2) Instructor** (sin otra clase en ese horario, licencia habilitada para el tipo), **(3) Vehículo** (sin otra clase en ese horario, SOAP y revisión técnica vigentes). Es la regla que da sentido a todo el módulo de agenda.
  → código: `docs\PRODUCT-VISION.md:60-64`; disponibilidad de slots en vista `v_class_b_schedule_availability` (`DATABASE.md:95`).

---

## Entidades Core

- **Alumno (Student) `[Validado]`** — Persona matriculada. Datos personales, documentos, horas contratadas vs consumidas, estado de deuda, estado del ciclo de vida (`active`/`pending`/`inactive`/`graduated`/`archived`). El `archived` es soft-delete (papelera) para no corromper la cuadratura.
  → código: tabla `students` (`DATABASE.md:11`), `core/models/dto/student.model.ts`.
- **Instructor `[Validado]`** — Docente de clases prácticas Clase B. Tiene tipo, licencia (con estado de vigencia), vehículo asignado y agenda.
  → código: tabla `instructors` (`DATABASE.md:33`), `InstructoresFacade`.
- **Relator (Lecturer) `[Validado]`** — Docente de la academia **Profesional** (no de Clase B). Especialidades A2/A3/A4/A5. Puede estar en múltiples promociones simultáneamente.
  → código: tabla `lecturers` (`DATABASE.md:46`), `RelatoresFacade`.
- **Vehículo (Vehicle) `[Validado]`** — Móvil de la flota. Patente única, documentos (SOAP, revisión técnica, permiso de circulación), KM, mantenciones.
  → código: tabla `vehicles` (`DATABASE.md:73`), `FlotaFacade`.
- **Matrícula (Enrollment) `[Validado]`** — Contrato de servicio del alumno con la escuela. Tiene `number` (correlativo por sede+grupo), `current_step` (1-6 del wizard), `payment_mode` (`total`/`deposit`), `license_group` (`class_b`/`professional`), `status` (`draft`/`pending_payment`/`active`/`inactive`/`completed`/`cancelled`), canal (`presential`/`online`).
  → código: tabla `enrollments` (`DATABASE.md:67`), `EnrollmentFacade`.
- **Clase / Sesión (Session) `[Validado]`** — Unidad de servicio. En Clase B: `class_b_sessions` (práctica) y `class_b_theory_sessions` (teórica/Zoom). En Profesional: `professional_theory_sessions` y `professional_practice_sessions`.
  → código: `DATABASE.md:37-38`, `DATABASE.md:51-52`.
- **Pago (Payment) `[Validado]`** — Cobro asociado a una matrícula. Método (efectivo/transferencia/tarjeta/pendiente), monto, registrado_por, conciliable en cuadratura. Online = type `online` con token Transbank.
  → código: tabla `payments` (`DATABASE.md:19`), `PagosFacade`, `EnrollmentPaymentFacade`.
- **Sede (Branch) `[Validado]`** — Local físico de la escuela. Multi-sede: branch 1 = Azul, branch 2 = Roja ("Conductores Chillán", `has_professional=true`). Casi todos los datos están "branch-scoped".
  → código: tabla `branches` (`DATABASE.md:8`), `BranchFacade`, regla `facades.md` sección 7.
- **Escuela ≈ Sede (uso laxo del término) `[Validado]`** — El equipo usa "escuela" de forma laxa; la **unidad operativa modelada es la Sede/Branch**, no un nivel "tenant" por encima. Cada sede tiene su **oferta de academia** (Clase B / Profesional / ambas, vía `has_professional`) y **su propia secretaria — 1 por sede**. La frase "hay escuelas que poseen las dos o solo 1" se refiere a la oferta **por sede** (ej: una sede solo Clase B, otra B + Profesional). Caso actual: Conductores Chillán = 2 sedes (Azul, Roja), 2 secretarias.
  → chat 2026-07-05; `branches.has_professional` (Sede); `specs/domain/policies.md` P10; `specs/roles/secretaria.md`.

## Academia Clase B

- **Clase B `[Validado]`** — Licencia de conducción de vehículos particulares. Programa de **12 clases prácticas**. La asistencia se controla con inicio/fin de clase por la secretaria.
- **Carnet dual `[Validado]`** — Documento que certifica avance: **carnet inicial** (6 clases, fondo amarillo, `license_initial_url`) y **carnet completo** (12 clases, fondo verde, `license_full_url`). El `certificate_enabled` pasa a true cuando se completa la clase práctica #12.
  → código: `enrollments.license_initial_url`/`license_full_url` (`DATABASE.md:67`, fix-019).
- **Clase Online / Clase teórica (Zoom) `[Validado]`** — **Tipo de clase** impartida de forma **online y teórica**. Aplica **tanto a Clase B como a Academia Profesional** (no es exclusiva de Clase B). La lista de invitados = lista de asistencia; la secretaria marca en tiempo real. Se gestiona/agenda vía `ClaseOnlineFacade`.
  → código: `class_b_theory_sessions` / `professional_theory_sessions`, `ClaseOnlineFacade`.
- **Máximo de clases por día `[Validado]`** — Regulación MTT: **1 clase de 45 min/día**. Online (alumno): máx 1/día. En sede (secretaria): hasta 3/día; más de 3 → agenda manual al día siguiente. Soportado por `courses.max_classes_per_day`.
  → código: `courses.max_classes_per_day` (`DATABASE.md:12`), `reunion-demo-2026-05-29.md:25-28`.

## Academia Profesional

- **Clase Profesional `[Validado]`** — Licencias profesionales A2/A3/A4/A5. Se organiza en **promociones** con **relatores** y un **libro de clases**.
- **Promoción (Professional Promotion) `[Validado]`** — Grupo/cohorte de academia profesional, con `code`, fechas (start/end), estado (`planned`/`in_progress`/`finished`/`cancelled`). Puede tener múltiples categorías de alumnos. Un desertor puede integrarse a una promoción posterior.
  → código: tabla `professional_promotions` (`DATABASE.md:48`), `PromocionesFacade`.
- **Convalidación `[Validado]`** — Reconocimiento de licencia previa que reduce horas: **A2→A4** y **A5→A3**. Los cursos con `is_convalidation=true` **NO generan enrollment ni cuentan contra el cupo**.
  → código: `courses.is_convalidation` (`DATABASE.md:12`), tabla `license_validations` (`DATABASE.md:56`).
- **Libro de Clases `[Validado]`** — Registro oficial de la promoción (profesores, módulos, asistencia, calendario, evaluaciones). Exportable a PDF (reemplaza el libro físico). El texto dice "firma diaria" (así estaba en el Excel original) aunque la asistencia operativa es **semanal**.
  → código: tabla `class_book` (`DATABASE.md:79`), `LibroDeClasesFacade`.
- **Módulo / Evaluación `[Validado]`** — Profesional tiene módulos 1-7, escala MTT **10-100**, aprobación ≥ 75. El módulo 5 varía por licencia (A2/A3 = Pasajeros, A4/A5 = Carga). **Los alumnos no se reprueban** (ya pagaron el certificado): se busca cambiar "nota" por "concepto".
  → código: tabla `professional_module_grades` (`DATABASE.md:55`), `core/utils/professional-modules.ts`; `reunion-demo-2026-05-29.md:104-108`.
- **Firma semanal `[Validado]`** — Asistencia profesional se firma semanalmente (lunes), separada en teórica y práctica.
  → código: tabla `professional_weekly_signatures` (`DATABASE.md:85`).

## Finanzas

- **Cuadratura de Caja `[Validado]`** — Cierre de caja diario por sede. Suma ingresos automáticos (pagos `paid` + cobros de cursos singulares del día) y egresos operacionales; permite arqueo de billetes. Usa horario real de Chile (`America/Santiago`).
  → código: tabla `cash_closings` (`DATABASE.md:24`), `CuadraturaFacade`.
- **Egreso operacional vs estructural `[Validado]`** — **Operacional** (va a cuadratura, lo registra la secretaria): bencina, útiles, anticipos a instructores, gastos chicos del día. **Estructural** (NO va a cuadratura, solo admin/reportes): choques/reparaciones mayores, luz, agua, arriendo, contribuciones, sueldos. Regla: día a día → cuadratura; estructural o irregular grande → reportes del dueño.
  → código: `expenses` vs `fixed_expenses` (`DATABASE.md:21-22`); `reunion-demo-2026-05-29.md:50-57`.
- **Punto de equilibrio `[Por Validar]`** — Métrica que el dueño necesita: ingresos del mes − egresos totales (incl. estructurales) = ganancia neta. Requiere sección privada de egresos estructurales (solo admin). Pendiente abierto.
  → código: `reunion-demo-2026-05-29.md:57`, pendiente #1.
- **Boleta SII `[Validado]`** — Documento tributario. Folio, por sede.
  → código: tabla `sii_receipts` (`DATABASE.md:23`).
- **Servicio Especial `[Validado]`** — Venta de servicio complementario a cliente externo (con precio base), que entra a cuadratura.
  → código: `service_catalog` + `special_service_sales` (`DATABASE.md:29-30`), `ServiciosEspecialesFacade`.
- **Curso Singular `[Validado]`** — Cursos SENCE / especiales (grúa, retroexcavadora…). Siguen vigentes aunque se eliminó la franquicia tributaria. Tienen cupos (trigger anti-sobreventa), descuentos y pago propio.
  → código: `standalone_courses` + `standalone_course_enrollments` (`DATABASE.md:27-28`), `CursosSingularesFacade`.
- **SENCE `[Validado]`** — Servicio Nacional de Capacitación y Empleo. Códigos autorizados asociados a cursos.
  → código: tabla `sence_codes` (`DATABASE.md:13`).
- **Anticipo / Liquidación Instructor `[Validado]`** — Adelantos y pago mensual a instructores según horas (default $5.000/hora).
  → código: `instructor_advances`, `instructor_monthly_payments`, `instructor_monthly_hours` (`DATABASE.md:25,26,36`).

## Matrícula y Documentos

- **Wizard de Matrícula (6 pasos) `[Validado]`** — Flujo: (1) datos personales → (2) clases/horario → (3) documentos → (4) pago → (5) contrato → (6) confirmación. Draft progresivo con expiración (24h presencial). **Entrada compartida Clase B + Profesional:** el wizard se **ramifica por `license_group`**; la opción "profesional" aparece solo si la sede tiene `has_professional`, y en esa rama la selección de slots/clases se sustituye por la asignación a una **promoción** (corrección 2026-07-05). El resto de pasos que cambian está `[Por Validar]`.
  → código: `EnrollmentFacade` (`FACADES.md:12`), `indices/MODELS.md` (modelos `enrollment-*`).
- **Canal: presencial vs online `[Validado]`** — **Presencial:** la secretaria matricula en sede. **Online (público):** el alumno se matricula solo, con reserva de horario (slot_holds, TTL 20 min) y pago Transbank Webpay; idempotencia por `session_token`.
  → código: Edge Function `public-enrollment` (`DATABASE.md:108`), tablas `slot_holds`/`payment_attempts` (`DATABASE.md:63-64`).
- **Slot `[Validado]`** — Bloque horario exacto de 45 min (no rango continuo). Horarios L-V definidos en `courses.schedule_blocks`.
  → código: `courses.schedule_blocks` (`DATABASE.md:12`), vista `v_class_b_schedule_availability`.
- **Slot Hold (Reserva) `[Validado]`** — Bloqueo temporal de un slot durante la matrícula online (TTL 20 min) para evitar doble reserva.
  → código: tabla `slot_holds` (`DATABASE.md:63`).
- **Autorización notarial `[Validado]`** — Documento obligatorio para matricular menores (< 18). Parte del paso 3 del wizard.
  → código: `EnrollmentDocumentsFacade` (`FACADES.md:13`).
- **HVC (Hoja de Vida del Conductor) `[Validado]`** — Documento profesional con validación de antigüedad (máx 30 días, RF-082.3).
  → código: `enrollment-documents.model.ts` (`HvcValidation`).
- **Contrato Digital `[Validado]`** — PDF de contrato generado automáticamente; en flujo online se sube el firmado escaneado.
  → código: Edge Function `generate-contract-pdf` (`DATABASE.md:103`), tabla `digital_contracts` (`DATABASE.md:69`).
- **Certificado `[Validado]`** — Documento con folio y fecha de entrega = **prueba legal** ante reclamos. Lotes de certificados (`certificate_batches`).
  → código: tablas `certificates`/`certificate_batches` (`DATABASE.md:82-83`).

## Roles y Actores

- **Admin / Dueño `[Validado]`** — Control total, multi-sede, visibilidad financiera, egresos estructurales.
- **Secretaria `[Validado]`** — **Usuaria estrella** del producto (>100 acciones/día): matricula, agenda, cobra, cuadra caja. Anclada a su sede.
- **Instructor `[Validado]`** — Ve su agenda del día, inicia/finaliza clases, firma fichas, evalúa.
- **Alumno (Student portal) `[Validado]`** — Consulta sus clases, estado de cuenta, progreso, certificado.
  → código: `roles` (`DATABASE.md:9`), RLS por rol en cada tabla.

## Sistemas y Plataforma

- **Producto Autoescuela `[Validado]`** — App Angular + Supabase (~85 tablas). Patrón Facade estricto; estado con Signals; multi-sede.
  → código: `CLAUDE.md`, `.claude/rules/`.
- **Transbank / Webpay Plus `[Validado]`** — Pasarela de pago del flujo online. Env `integration`/`production`.
  → código: Edge Function `public-enrollment` actions `initiate-payment`/`confirm-payment` (`DATABASE.md:108`).

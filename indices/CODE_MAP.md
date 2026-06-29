# Índice: Mapa del Código (CODE_MAP)

> **Propósito:** Bibliografía de auditoría. Documenta de dónde se destilaron las reglas de negocio que viven en `specs/` e `indices/`. **El agente no necesita leer estos archivos para responder** — ya tiene el conocimiento destilado en sus specs. Los punteros existen para que un humano pueda verificar el origen de una regla en el repositorio Autoescuela cuando lo necesite.
>
> **Formato de cita:** `archivo:línea` relativo a la raíz del repositorio Autoescuela (ej: `indices/DATABASE.md:67`). Si el código evoluciona y una regla cambia, el equipo actualiza el spec correspondiente y este mapa.

---

## Documentación de negocio (leer primero)

| Tema | Archivo en el repositorio Autoescuela | Qué contiene |
|---|---|---|
| Visión y Triple Match | `docs/PRODUCT-VISION.md` | Frase guía, problema, target (secretaria), anti-goals, dominio central, regla del Triple Match |
| Feedback del dueño + pendientes | `docs/reunion-demo-2026-05-29.md` | Estado por módulo, reglas confirmadas (clases/día, egresos), pendientes abiertos |
| Reglas de modelos | `docs/reglas-modelos.md` + `.claude/rules/models.md` | Separación DTO (BD) vs UI |
| Reglas arquitectónicas | `.claude/rules/architecture.md` | Estructura de carpetas, Facade, Functional Core, Signals |
| Reglas de Facades | `.claude/rules/facades.md` | Facade como único punto de entrada; multi-sede (sección 7) |
| Reglas de BD | `.claude/rules/database.md` | Migraciones idempotentes; documentación obligatoria |
| Stack y normas técnicas | `docs/TECH-STACK-RULES.md`, `docs/BRAND_GUIDELINES.md` | PrimeNG, tokens, Lucide, marca |

## Mapa del esquema (la fuente más rica del dominio)

| Recurso | Archivo en el repositorio Autoescuela | Notas |
|---|---|---|
| **Catálogo de tablas (~85)** | `indices/DATABASE.md` | Tablas con FKs, RLS, módulos M1-M15, **vistas**, **Edge Functions**, **funciones SQL/triggers**. El mapa maestro. |
| Modelos (DTO vs UI) | `indices/MODELS.md` | DTOs 1:1 con tablas + modelos UI; wizard de matrícula detallado |
| Esquema SQL real | `supabase/migrations/*.sql` | Verdad última del schema. Numeradas e idempotentes. |
| Facades | `indices/FACADES.md` | Punto de entrada de cada dominio a la BD |
| Servicios | `indices/SERVICES.md` | Lógica utilitaria transversal |
| Componentes | `indices/COMPONENTS.md` | Inventario de UI |

## Dónde vive cada flujo del negocio

| Flujo de negocio | Punteros de código |
|---|---|
| **Triple Match / Agenda** | vista `v_class_b_schedule_availability` (`DATABASE.md:95`); `AgendaFacade` (`FACADES.md:18`); tabla `class_b_sessions` (`DATABASE.md:37`) |
| **Matrícula (wizard 6 pasos)** | `EnrollmentFacade` + `EnrollmentDocumentsFacade` + `EnrollmentPaymentFacade` (`FACADES.md:12-14`); tabla `enrollments` (`DATABASE.md:67`); modelos `enrollment-*` en `MODELS.md` |
| **Matrícula online (público)** | Edge Function `public-enrollment` (`DATABASE.md:108`); `slot_holds`/`payment_attempts` (`DATABASE.md:63-64`); rate-limit `public_enrollment_throttle` (`DATABASE.md:65`) |
| **Asistencia Clase B** | `class_b_practice_attendance`/`class_b_theory_attendance` (`DATABASE.md:39-40`); `InstructorClasesFacade` (`FACADES.md:29`); vista `v_student_progress_b` (`DATABASE.md:92`) |
| **Academia Profesional** | `professional_*` tables (`DATABASE.md:51-59`); `PromocionesFacade`/`RelatoresFacade`/`LibroDeClasesFacade`/`EvaluacionesProfesionalFacade` |
| **Convalidaciones** | `license_validations` (`DATABASE.md:56`); `courses.is_convalidation` (`DATABASE.md:12`) |
| **Pagos** | `payments` (`DATABASE.md:19`); `PagosFacade`; RPC `confirm_enrollment_with_payment` (`DATABASE.md:118`) |
| **Cuadratura de caja** | `cash_closings`/`expenses`/`fixed_expenses` (`DATABASE.md:21-24`); `CuadraturaFacade`/`HistorialCuadraturasFacade` |
| **Cursos singulares (SENCE)** | `standalone_courses`/`standalone_course_enrollments` (`DATABASE.md:27-28`); `CursosSingularesFacade` |
| **Flota** | `vehicles`/`vehicle_documents`/`maintenance_records` (`DATABASE.md:73-75`); `FlotaFacade`/`FlotaDetalleFacade` |
| **Certificados** | `certificates`/`certificate_batches` (`DATABASE.md:82-83`); `ExAlumnosFacade` |
| **Multi-sede** | `branches` (`DATABASE.md:8`); `BranchFacade`; regla `.claude/rules/facades.md` sección 7 |
| **Tareas internas** | `tasks`/`task_replies` (`DATABASE.md:76-77`); `TasksFacade` |
| **Personal (sec/instr)** | Edge Functions `create-secretary`/`create-instructor` (`DATABASE.md:104-106`); `SecretariasFacade`/`InstructoresFacade` |

## Triggers y crons relevantes para reglas de negocio

| Regla automatizada | Puntero |
|---|---|
| Habilitar certificado al completar clase #12 | trigger `trg_enable_certificate_b` (`DATABASE.md:67`) |
| Anti-sobreventa de cupos (cursos singulares) | trigger `trg_standalone_capacity` (`DATABASE.md:27`) |
| Transición de estado de promociones | `auto_transition_promotion_status()` cron 06:00 (`DATABASE.md:114`) |
| Limpieza de drafts vencidos | `cleanup_expired_drafts()` cron 3AM (`DATABASE.md:117`) |
| Validación de reglas de enrollment | `trg_enrollment_validation_fn()` (`DATABASE.md:120`) |
| Confirmar matrícula + pago atómico | RPC `confirm_enrollment_with_payment` (`DATABASE.md:118`) |

> **Mantenimiento:** cuando el código cambie de forma relevante para el negocio, actualiza este mapa (ver `skills/sync_knowledge.md`). Si una línea citada ya no coincide, corrígela o re-busca con las herramientas de búsqueda.

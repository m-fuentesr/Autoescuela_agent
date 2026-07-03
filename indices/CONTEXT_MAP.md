# Índice: Context Map (Mapa de Bounded Contexts del Dominio)

> **Propósito:** la **espina estratégica** del agente. Lista los *bounded contexts* del negocio Autoescuela, derivados del **grafo de facades** (`indices/CODE_MAP.md` → `USAGE-MAP.md` del repo), para que cada conocimiento (glosario, política, blueprint, contrato) viva **dentro de su contexto** y no mezclado por tipo de artefacto.
>
> **Cómo se construyó:** el repositorio Autoescuela organiza la UI por **rol** (`features/admin`, `secretaria`, `instructor`, `alumno`, `public-enrollment`) pero el **dominio** vive en los **facades**. Un facade sirve a varios roles → **el facade es la costura del contexto, el rol es solo un actor**. Este mapa agrupa por facade.
>
> **El código propone, el experto dispone:** una frontera de facade es una *hipótesis* de contexto. Solo el equipo/dueño la confirma, fusiona o parte. Por eso cada contexto distingue lo ya verificado de lo que falta entrevistar.

---

## 🚥 Cómo leer este mapa

| Marca | Significado | Procedencia |
|---|---|---|
| 🟢 | **Destilado del código** — verificable vía `→ código:` | Vía A (código) |
| 🟡 | **Por extraer del equipo** — estado `[Por Validar]`, sin puntero a código | Vía B (entrevista `/onboarding`) o Vía C (transcripción `/meeting`) |
| 🎯 | **Clasificación de subdominio** (Core / Supporting / Generic) | 🟡 **PROPUESTA** — la decide el dueño, no el código |

> **Regla:** todo lo 🟡 de este archivo es deuda de onboarding. La meta es que cada contexto tenga su propia carpeta (`contexts/<slug>/`) con glosario + políticas + blueprint + contrato, mitad destilada (🟢) mitad entrevistada (🟡).

---

## Tabla resumen — los contextos

| # | Contexto | 🎯 Subdominio (propuesto) | Facades núcleo | Actores |
|---|---|---|---|---|
| C1 | **Matrícula** | 🟡 Core | Enrollment, EnrollmentDocuments, EnrollmentPayment, PublicEnrollment, AdminPreInscritos | Secretaria, Alumno-público |
| C2 | **Academia Clase B** (Triple Match + asistencia + certificación) | 🟡 Core | Agenda, AsistenciaClaseB, ClaseOnline, CertificacionClaseB | Secretaria, Admin, Instructor |
| C3 | **Alumnos (base)** | 🟡 Supporting | AdminAlumnos, AdminAlumnoDetalle, AdminAlumnosProfesional, ExAlumnos, Dms | Admin, Secretaria |
| C4 | **Finanzas / Caja** | 🟡 Supporting | Cuadratura, HistorialCuadraturas, Pagos, Liquidaciones, Anticipos, ReportesContables, CursosSingulares, ServiciosEspeciales | Secretaria, Admin |
| C5 | **Academia Profesional** | 🟡 Supporting | Promociones, Relatores, LibroDeClases, EvaluacionesProfesional, AsistenciaProfesional, CertificacionProfesional, Archivo | Admin, Secretaria |
| ~~C6~~ | **Certificación Clase B** → *fusionado en C2 Academia Clase B* | — | (ver C2) | — |
| C7 | **Flota** | 🟡 Supporting | Flota, FlotaDetalle | Admin |
| C8 | **Portal Instructor** | 🟡 Supporting | InstructorClases, InstructorAlumnos, InstructorHoras, InstructorProfile | Instructor |
| C9 | **Personal (RRHH)** | 🟡 Supporting | Instructores, Secretarias | Admin |
| C10 | **Portal Alumno** | 🟡 Supporting | StudentClases, StudentHome, StudentHorario, StudentPayment, StudentEnrollmentContext | Alumno |
| C11 | **Tareas internas** | 🟡 Generic | Tasks | Admin, Secretaria, Instructor |
| C12 | **Configuración / Sitio** | 🟡 Generic | WebsiteConfig, Courses, AdminHorarios | Admin |
| C13 | **Auditoría** | 🟡 Generic | Auditoria | Admin |
| SK | **Shared Kernel / Infra** | 🟡 Generic | Branch, Auth, Notifications, Dashboard, DashboardAlerts, GlobalSearch, Layout/Theme | Todos |

---

## Detalle por contexto

### C1 — Matrícula  🎯 Core (🟡 validar)
- 🟢 **Facades:** `EnrollmentFacade`, `EnrollmentDocumentsFacade`, `EnrollmentPaymentFacade`, `PublicEnrollmentFacade`, `AdminPreInscritosFacade`
- 🟢 **Actores / features:** `secretaria/matricula` (presencial), `public-enrollment` (online), `*/alumnos/pre-inscritos`
- 🟢 **Tablas:** `enrollments`, `slot_holds`, `payment_attempts`, `digital_contracts`, docs de matrícula · Edge Function `public-enrollment`
- 🟢 **Reglas codificadas:** wizard 6 pasos · `payment_mode` total/deposit (P1) · selector 6/12 clases (P2) · draft expira 24h presencial (P7) · idempotencia `session_token`, slot hold TTL 20 min (P8)
- 🟢 **Invariante/advertencia:** menor de edad → autorización notarial (Capa B)
- 🟡 **Por extraer del equipo:**
  - ¿Por qué el depósito es 50%? ¿Puede variar por curso? (P1 está codificado, el *porqué* y su variabilidad no)
  - Descuento libre: ¿quién lo autoriza? ¿tope máximo? ¿motivos válidos?
  - "Pruebas escritas por email" (DOLOR-003) — ya registrado como **stub `[Por Validar]`** en `PAIN_LOG.md` (2026-06-30); falta que el equipo defina su contenido real → **validar** (ver `TASK_INDEX`)

### C2 — Academia Clase B  🎯 Core (🟡 validar)
- 🟢 **Facades:** `AgendaFacade`, `AsistenciaClaseBFacade`, `ClaseOnlineFacade`, `CertificacionClaseBFacade` *(absorbido de C6)*
- 🟢 **Contexto = la academia, no la capacidad:** "Triple Match / Agenda" es una **capacidad interna** de Academia Clase B, no el nombre del contexto. Reencuadrado por **definición/journey** (decisión del equipo), en paralelo a C5 Academia Profesional. La **certificación Clase B** es la etapa final de este journey → vive acá, no en contexto aparte.
- 🟢 **Clase Online (resuelto por el equipo):** es un **tipo de clase** — la **teórica impartida online**, aplicable **tanto a Clase B como a Profesional**. Por eso `ClaseOnlineFacade` vive en Agenda (es agendamiento de clase teórica) y **cruza a C5 Profesional**; **no** es gestión de Alumnos.
- 🟢 **Actores / features:** `*/agenda`, `*/asistencia`, `dashboard`
- 🟢 **Tablas/vistas:** `class_b_sessions`, `class_b_theory_sessions`, `class_b_practice_attendance`, `class_b_theory_attendance`, vista `v_class_b_schedule_availability` · **certificación:** `certificates`, `certificate_batches`, `enrollments.license_initial_url`/`license_full_url`
- 🟢 **Invariantes/reglas:** **Triple Match** (alumno+instructor+vehículo simultáneos) · **No doble-booking** · clases/día (1 online, 3 sede, Capa B) · **carnet dual 6/12**, `certificate_enabled` al completar la clase #12 (`trg_enable_certificate_b`) · existencia antes de certificar (Capa A) · certificado con folio+fecha = prueba legal (Capa B)
- 🟡 **Por extraer del equipo:**
  - **Flujo de reprogramación de clases** — no tiene blueprint (Fase 2 de onboarding)
  - Definición exacta de "deuda bloqueante" en la pata Alumno del Triple Match

### C3 — Alumnos (base)  🎯 Supporting (🟡 validar)
- 🟢 **Facades:** `AdminAlumnosFacade`, `AdminAlumnoDetalleFacade`, `AdminAlumnosProfesionalFacade`, `ExAlumnosFacade`, `DmsFacade` (documentos)
- 🟢 **Actores / features:** `admin/alumnos`, `admin/alumno-detalle`, `secretaria/alumnos`, `*/ex-alumnos`, `*/documentos`
- 🟢 **Tablas:** `students` (`status` activo/archived) · DMS / documentos
- 🟢 **Invariante (Capa A):** soft-delete (`archived`), no borrado físico, para no corromper cuadratura (P5)
- 🟡 **Por extraer del equipo:** criterios de archivado/reactivación; qué documentos son obligatorios vs opcionales por tipo de alumno

### C4 — Finanzas / Caja  🎯 Supporting (🟡 validar)
- 🟢 **Facades:** `CuadraturaFacade`, `HistorialCuadraturasFacade`, `PagosFacade`, `LiquidacionesFacade`, `AnticiposFacade`, `ReportesContablesFacade`, `CursosSingularesFacade`, `ServiciosEspecialesFacade`
- 🟢 **Actores / features:** `*/contabilidad-*`, `*/pagos`, `*/servicios-especiales`
- 🟢 **Tablas:** `cash_closings`, `expenses`, `fixed_expenses`, `payments`, `sii_receipts`, `instructor_advances`, `instructor_monthly_payments`, `standalone_courses`, `special_service_sales`
- 🟢 **Reglas/invariantes:** egreso operacional vs estructural (P4) · cupo curso singular `trg_standalone_capacity` (Capa A) · integridad de cuadratura cerrada (Capa A)
- 🟡 **Por extraer del equipo:**
  - **"Punto de equilibrio"** — marcado `[Por Validar]` en el glosario; requiere sección privada de egresos estructurales (pendiente abierto)
  - Umbral concreto operacional vs estructural (la regla del "~50k si es habitual")

### C5 — Academia Profesional  🎯 Supporting (🟡 validar)
- 🟢 **Facades:** `PromocionesFacade`, `RelatoresFacade`, `LibroDeClasesFacade`, `EvaluacionesProfesionalFacade`, `AsistenciaProfesionalFacade`, `CertificacionProfesionalFacade`, `ArchivoFacade`
- 🟢 **Actores / features:** `admin/profesional-*`, `secretaria/profesional-*`, `*/libro-de-clases`
- 🟢 **Tablas:** `professional_promotions`, `professional_module_grades`, `professional_weekly_signatures`, `class_book`, `license_validations`
- 🟢 **Reglas:** un relator en varias promociones (P9) · convalidación A2→A4 / A5→A3 no consume cupo (P6) · módulos 1-7, escala MTT 10-100, aprobación ≥75 · firma **semanal** (lunes)
- 🟢 **Advertencia (Capa B):** no reprobar al alumno profesional → usar "concepto" (cita DOLOR-004)
- 🟡 **Por extraer del equipo:**
  - **"Concepto vs nota"** — **DOLOR-004 ya formalizado** en `PAIN_LOG.md` (2026-06-30, estado `En análisis`); las citas de `compliance_check.md` ya resuelven. Falta cerrar la **solución de producto** ("concepto" en vez de nota) con el equipo
  - "Firma diaria" (texto del Excel) vs asistencia **semanal** operativa — confirmar cuál rige
  - Módulo 5 por licencia (A2/A3 Pasajeros, A4/A5 Carga) — confirmar reglas completas

### ~~C6 — Certificación Clase B~~ → **fusionado en C2 Academia Clase B** ✅
- Certificación **no** es contexto propio: es la **etapa final del journey de Clase B**; su detalle (facade, tablas, invariantes) vive ahora en **C2**.
- El `CertificacionClaseBFacade` separado era organización de código, **no** frontera de dominio — *"el código propone, el experto dispone"*.
- **Simetría:** la **certificación profesional** (`CertificacionProfesionalFacade`) vive en **C5**, tampoco como contexto aparte. → *Patrón confirmado: la certificación pertenece a su academia.*

### C7 — Flota  🎯 Supporting (🟡 validar)
- 🟢 **Facades:** `FlotaFacade`, `FlotaDetalleFacade`
- 🟢 **Tablas:** `vehicles`, `vehicle_documents`, `maintenance_records`
- 🟢 **Advertencia (Capa B):** vehículo con SOAP/revisión técnica vencida no debería circular (cruza con C2)
- 🟡 **Por extraer del equipo:** política de mantención preventiva; quién da de baja un vehículo

### C8 — Portal Instructor  🎯 Supporting (🟡 validar)
- 🟢 **Facades:** `InstructorClasesFacade`, `InstructorAlumnosFacade`, `InstructorHorasFacade`, `InstructorProfileFacade`
- 🟢 **Actores / features:** `instructor/*` (clase, clase-detail, dashboard, horario, liquidacion, ficha, evaluacion)
- 🟢 **Reglas:** liquidación por horas (default $5.000/hora) · advertencia Capa B: licencia de instructor habilitada por tipo
- 🟡 **Por extraer del equipo:** flujo de firma de fichas; cómo se concilian horas disputadas

### C9 — Personal / RRHH  🎯 Supporting — **contexto propio, NO se fusiona con C8** ✅
- 🟢 **Facades:** `InstructoresFacade`, `SecretariasFacade` · Edge Functions `create-instructor`, `create-secretary`
- 🟢 **Actores / features:** `admin/instructores`, `admin/secretarias`, `secretaria/instructores`
- 🟢 **Resuelto por el equipo:** **no** se fusiona con el Portal Instructor (C8). Distintos por **definición** *y* por **función**: C9 es **administración de personal** (alta/baja, crea usuario+rol vía Edge Functions, actor = **Admin**); C8 es el **instructor usando el sistema** (actor = **Instructor**). Lenguaje y actor distintos → contextos separados.

### C10 — Portal Alumno  🎯 Supporting (🟡 validar)
- 🟢 **Facades:** `StudentClasesFacade`, `StudentHomeFacade`, `StudentHorarioFacade`, `StudentPaymentFacade`, `StudentEnrollmentContextFacade`
- 🟢 **Actores / features:** `alumno/*` (clases, dashboard, horario, pagar, pagos, pruebas-online)
- 🟡 **Por extraer del equipo:** qué puede y qué NO puede autogestionar el alumno (límites del self-service)

### C11 — Tareas internas  🎯 Generic (🟡 validar)
- 🟢 **Facades:** `TasksFacade` · tablas `tasks`, `task_replies`
- 🟡 **Por extraer del equipo:** ¿es comunicación interna o gestión de pendientes? alcance real

### C12 — Configuración / Sitio  🎯 Generic (🟡 validar)
- 🟢 **Facades:** `WebsiteConfigFacade`, `CoursesFacade`, `AdminHorariosFacade`
- 🟡 **Por extraer del equipo:** qué configura el dueño vs qué es fijo

### C13 — Auditoría  🎯 Generic (🟡 validar)
- 🟢 **Facades:** `AuditoriaFacade`
- 🟡 **Por extraer del equipo:** qué eventos se auditan y para qué se usa el log

---

## SK — Shared Kernel / Infra transversal (NO son contextos de negocio)
- 🟢 `BranchFacade` — **multi-sede** (inyectada en ~40 features). Invariante Capa A: scope de sede, `can_access_both_branches`.
- 🟢 `AuthFacade` — identidad/sesión/roles.
- 🟢 `NotificationsFacade`, `DashboardFacade`, `DashboardAlertsFacade`, `GlobalSearchFacade` — agregadores transversales.
- 🟢 Servicios de `layout/` (`ThemeService`, `LayoutService`, `MenuConfigService`, `ConfirmModalService`, `ToastService`, `ErrorSanitizerService`, `GsapAnimationsService`).
- **Regla:** estos NO modelan negocio; son kernel compartido. El conocimiento de dominio NO se documenta aquí salvo el invariante de sede.

---

## Context Map — relaciones entre contextos (🟡 todas a validar)

> Inferidas del acoplamiento del USAGE-MAP; la **semántica** de cada relación la confirma el equipo.

- **C1 Matrícula → C4 Finanzas** — `EnrollmentPaymentFacade` ↔ `PagosFacade`/`Pagos`: la matrícula genera el pago. *Customer-Supplier* (🟡).
- **C1 Matrícula → C2 Agenda** — al matricular Clase B se agendan **todas** las clases de una vez (P2). Río arriba (🟡).
- **C2 Agenda ↔ C7 Flota / C8 Instructor** — el Triple Match consume disponibilidad+vigencia de vehículo e instructor. *Conformist* respecto de Flota/Instructor (🟡).
- **C2 Academia Clase B ↔ C5 Profesional** — la **clase online (teórica)** es un tipo de clase transversal a ambas academias; el agendamiento de teóricas se comparte. (🟢 confirmado por equipo)
- **C1/C4 ↔ Transbank (externo)** — pago online vía Webpay. Candidato a **Anti-Corruption Layer** (`PublicEnrollmentFacade` / Edge Function) (🟡).
- **SK Branch → todos** — Shared Kernel: scope de sede aplica a casi todo dato (🟢 invariante, 🟡 detalle por contexto).

---

## ⚠️ Deudas de consistencia detectadas (durante la construcción de este mapa)
1. ✅ **Resuelto (2026-06-30):** `DOLOR-004` ("concepto vs nota") formalizado en `indices/PAIN_LOG.md` (estado `En análisis`). Las citas de `compliance_check.md` ya resuelven contra una entrada real.
2. ⏳ **Parcial (2026-06-30):** `DOLOR-003` ("pruebas por email") registrado como **stub `[Por Validar]`** en `PAIN_LOG.md`; falta su contenido real → validar con el equipo (`task/TASK_INDEX.md`).

---

## 🔍 Auditoría — ¿quedan más casos del mismo patrón? (facade ≠ contexto · definición-vs-función)

> Barrido completo del mapa buscando el mismo patrón que Certificación: un facade que **no** marca frontera de dominio, o un nombre por-**función** donde correspondería por-**definición**. **Pendientes de decisión del equipo.**

**🔴 Fuertes (mismo patrón que certificación):**
- **CASO-A · Alumnos Profesional dentro de C3.** `AdminAlumnosProfesionalFacade` (y `ExAlumnos` profesional) están en C3 *Alumnos (base)*. Por el eje academia que acabamos de adoptar, la **gestión de alumnos profesionales** podría pertenecer a **C5 Academia Profesional**, dejando C3 solo con **datos maestros transversales** del alumno. → definición-vs-función. **Validar.**
- **CASO-B · Cursos Singulares (SENCE) dentro de C4.** `CursosSingularesFacade` quedó en *Finanzas* porque se consume en `contabilidad-cursos`. Pero por **definición** un curso singular (grúa, retroexcavadora, SENCE) es una **línea de producto / oferta** propia, con cupos, inscripción y pago propios (≈ una tercera academia). Fuerte candidato a **contexto propio**. **Validar.**
- **CASO-C · Servicios Especiales dentro de C4.** `ServiciosEspecialesFacade` (venta a externos, catálogo propio) está en Finanzas por consumo. Por definición es **ventas/catálogo**, no caja. ¿Sub-área de Finanzas o contexto menor propio? **Validar.**

**🟠 Medios:**
- **CASO-D · Courses (catálogo) dentro de C12 Config.** `CoursesFacade` (precios, `schedule_blocks`, `max_classes_per_day`, `is_convalidation`) **no** es "configuración de sitio": son **datos maestros de referencia** que consumen Matrícula y Agenda. Debería separarse de `WebsiteConfig`. **Validar.**
- **CASO-E · Auditoría (C13) es transversal.** El log de auditoría cruza todos los contextos → probablemente pertenece al **Shared Kernel**, no es contexto de negocio propio. **Validar.**

**🟢 Contra-ejemplo (NO todo se parte por academia):**
- **Matrícula (C1) se mantiene unificada.** Es un **proceso** con lenguaje propio (wizard, draft, `payment_mode`); `license_group` distingue Clase B vs Profesional internamente. No se fragmenta salvo que el equipo confirme que ambos flujos difieren de fondo. → *El eje academia aplica a journeys de formación, no a procesos compartidos.*

---

## Mantenimiento
- Este mapa se deriva del **grafo de facades** (`USAGE-MAP.md` del repo Autoescuela). Si el equipo reporta que se agregó/quitó un facade o cambió un consumidor, actualizar aquí.
- Cuando un contexto se migre a `contexts/<slug>/` con sus archivos propios, enlazarlo desde su fila.
- Las marcas 🟡 son la **lista de trabajo de onboarding**: cada una es una entrevista o una transcripción pendiente.

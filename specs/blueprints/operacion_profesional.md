# Blueprint: Operación de la Academia Profesional (post-matrícula)

> **Actividad A8 del mapa de rol de la secretaria** (`specs/roles/secretaria.md`).
> La *matrícula* profesional entra por el wizard (A1, rama por `license_group` —
> ver `matricula_clase_b.md`). Este blueprint cubre lo que la secretaria opera **después**.
> Participación plena según P10. Todas las rutas van tras `professionalBranchGuard`
> (solo si la sede tiene `has_professional`). Destilado del código 2026-07-05 (Vía A).

## 1. Asistencia profesional (`/secretaria/profesional/asistencia`)
- Navegación: **promoción → curso → sesiones** (teóricas y prácticas), por semana.
- Registro de asistencia **masivo o individual**; edición de sesiones (fecha, estado, notas).
- Resumen de asistencia acumulada por alumno y % de asistencia de la semana visible.
  → código: `AsistenciaProfesionalFacade`; página = re-export del componente admin.

## 2. Firma semanal (dentro de asistencia profesional)
- La semana se identifica por su **lunes** (`week_start_date`), consistente con el glosario
  ("Firma semanal", asistencia operativa semanal).
- La UI muestra, por alumno: si ya firmó, cuándo, y su **% de teoría de esa semana**.
- **Registro masivo:** la secretaria selecciona alumnos y registra sus firmas de una vez
  (INSERT en `professional_weekly_signatures` con `promotion_course_id`, `enrollment_id`,
  `week_start_date`, `recorded_by`).
  → código: `AsistenciaProfesionalFacade.registrarFirmas()`, `fetchFirmasSemana()`.

## 3. Calificaciones (`/secretaria/profesional/notas`)
- Página **real** para la secretaria (ya no stub): registra evaluaciones de módulos 1-7,
  escala MTT 10-100, aprobación ≥ 75.
- ⚠️ Capa B: el negocio **no reprueba** al alumno profesional (DOLOR-004, "concepto vs nota").
  → código: `EvaluacionesProfesionalFacade`, `secretaria-profesional-notas`.

## 4. Libro de Clases (`/secretaria/libro-de-clases`)
- Página **real** para la secretaria (ya no stub). Vista agregada por promoción → curso:
  cabecera, profesores por módulo, lista de alumnos, asistencia semanal agrupada L-S,
  evaluaciones y resumen de asistencia.
- La secretaria puede **guardar código SENCE y horario** del libro (`class_book`) y
  **exportar el libro a PDF** (EF `generate-class-book-pdf`).
  → código: `LibroDeClasesFacade`.

## 5. Certificados profesionales (`/secretaria/profesional/certificados`)
- Generar certificado por alumno (EF `generate-certificate-professional-pdf`), verlo,
  **enviarlo por email**, generar **pendientes en lote**, envío masivo y exportación.
- Elegibilidad (calculada en ficha del alumno): teoría ≥ 75%, nota ≥ 75, **pago completo**.
- ⚠️ Capa B: certificado con folio + fecha de entrega = prueba legal.
  → código: `CertificacionProfesionalFacade`; `AdminAlumnoDetalleFacade` (elegibilidad).

## 6. Gestión de base profesional
- **Alumnos profesional** (`/profesional/alumnos`), **pre-inscritos** (`/profesional/pre-inscritos`),
  **ex-alumnos profesional**, **archivo** (`/profesional/archivo`), **promociones** y
  **relatores** — páginas reales (mayormente re-export de las de admin, mismas capacidades).
  → código: rutas en `app.routes.ts` (ROUTES.md:66-92); audit "re-exports verbatim sin riesgo".

## `[Por Validar]` con el equipo
- ¿La secretaria **crea** promociones y relatores, o solo los consulta/opera? (el re-export
  le da las mismas capacidades del admin — ¿es intencional o exceso de privilegio?).
- Confirmar "firma diaria" (texto del Excel) vs firma **semanal** operativa (código = semanal).

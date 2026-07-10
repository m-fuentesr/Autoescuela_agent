# Blueprint: Asistencia Clase B (práctica + ciclos teóricos)

> **Actividad A3 del mapa de rol de la secretaria** (`specs/roles/secretaria.md`).
> La secretaria controla, desde una sola pantalla, las clases prácticas del día y los
> ciclos teóricos (Zoom) de **su sede** (anclaje explícito: `setBranchFilter(user.branchId)`).
> Destilado del código 2026-07-05 (Vía A).

## Parte 1 — Clases prácticas del día

La página lista las clases prácticas de la fecha seleccionada (navegable), con KPIs y alertas.

### Iniciar clase (drawer)
- Registra la **hora real de inicio** y el **KM inicial del vehículo**.
- Permite **cambiar el vehículo** en el acto (selector de vehículos de la sede).
- Sesión pasa a `in_progress`.
  → código: `asistencia-clase-b.facade.ts` `startClass()`; drawer `admin-iniciar-clase-drawer`.

### Finalizar clase (drawer)
- Registra: **KM final**, **nota de evaluación**, **checklist de evaluación**, observaciones,
  y **firmas opcionales** de alumno e instructor (booleanos + timestamp).
- Sesión pasa a `completed` (con `end_time` y `completed_at`); luego actualiza el
  `current_km` del vehículo.
  → código: `finishClass()`; drawer `admin-finalizar-clase-drawer`.

### Presente / Ausente / Justificación (¿qué pasa si el alumno no llega?)
- **Presente** → asistencia `present` en `class_b_practice_attendance` (con `recorded_by`).
- **Ausente** → asistencia `absent` **y** la sesión pasa a `no_show`.
- **Justificar inasistencia** → asistencia pasa a `excused` con el texto de la justificación.
- **La clase perdida NO se repone automáticamente** — reponerla es una **reprogramación**
  desde la ficha del alumno (ver A9 en `roles/secretaria.md`). `[Por Validar]` la política
  de negocio (¿cuántas ausencias toleran? ¿quién decide reponer?).
  → código: `markAttendance()`, `justifyAbsence()`.

### Quitar / reactivar horario
- **Quitar horario:** cancela **todas** las sesiones `scheduled` del enrollment
  (`status='cancelled'` + `cancelled_at`). No borra nada (consistente con P5 soft-delete).
- **Reactivar:** revierte las canceladas a `scheduled`.
  → código: `removeSchedule()`, `reactivateSchedule()`.

### Recordatorio al alumno en riesgo
- **Stub:** hoy solo muestra un toast "Recordatorio enviado" — **no envía nada real**.
  → código: `sendReminder()` (cuerpo vacío). `[Deuda de producto]`.

## Parte 2 — Ciclos teóricos (Zoom)

**Ciclo Teórico** = cohorte de clases teóricas online (término destilado del código,
`CiclosTeoricosFacade` — `[Por Validar]` con el equipo como término oficial).

La secretaria puede:
- Ver los ciclos de su sede, seleccionar uno y ver sus clases + **roster** de alumnos.
- Guardar el **link de Zoom** y el **tema** de cada clase.
- **Enviar el email de Zoom** a los inscritos seleccionados (EF `send-zoom-email`).
- **Mover un alumno a otro ciclo** y **agregar alumnos** al ciclo seleccionado.
- La lista de invitados = lista de asistencia (ver glosario "Clase Online").
  → código: `ciclos-teoricos.facade.ts`; `secretaria-asistencia.component.ts`.

## Invariantes y advertencias aplicables
- Capa A: existencia antes de acción (no marcar asistencia de sesión inexistente).
- Capa B: máx. clases/día (1 online / 3 sede) al reprogramar la clase perdida.

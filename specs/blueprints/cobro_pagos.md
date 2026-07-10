# Blueprint: Cobro / Registro de Pagos (fuera del wizard)

> **Actividad A4 del mapa de rol de la secretaria** (`specs/roles/secretaria.md`).
> Responde la pregunta abierta: la secretaria **SÍ cobra pagos sueltos** fuera de la
> matrícula, desde `/app/secretaria/pagos` (página real — el audit 2026-06-24 que la
> marcaba stub "PLANO" quedó obsoleto). Destilado del código 2026-07-05 (Vía A).

## La página de Pagos
- KPIs de ingresos (hoy / mes), **tabla de deudores** y pagos recientes, con SWR + Realtime.
- **Estado de cuenta detallado por matrícula** (drawer de detalle).
- Branch-scoped: filtra `payments` vía `enrollments.branch_id`.
  → código: `PagosFacade` (`FACADES.md`), `secretaria-pagos.component.ts`.

## Drawer "Registrar Pago" — dos modos
1. **Contextual:** abierto desde la fila de un deudor (matrícula preseleccionada).
2. **Global:** botón "+ Registrar Pago" → se elige la matrícula entre los **alumnos con deuda**.

### Campos del cobro
- **Concepto** (selector), **monto total**, y **desglose por canales**:
  efectivo + transferencia + tarjeta + voucher.
- **Regla dura (validador):** la suma de los canales debe ser **igual** al monto total —
  un mismo pago puede ser **mixto** (ej: mitad efectivo, mitad tarjeta).
  → código: `registrar-pago-drawer.component.ts` (validador de FormGroup).

## Fronteras — qué NO se cobra por aquí
- **Todo pago de esta página está anclado a una matrícula (enrollment).** No hay cobros "al aire".
- **Servicios especiales** → se cobran en su propio punto de venta (`ServiciosEspecialesFacade.registrarCobro`).
- **Cursos singulares** → los cobra el **admin** en Contabilidad > Cursos (`marcarEnrollmentPagado`).

## Relación con la cuadratura (A5)
- Solo pagos `status='paid'` entran a la cuadratura del día; también entran los cobros
  de cursos singulares del día (`paid_at` hoy).
- Reversar un ingreso de curso singular **no borra la inscripción**: la vuelve a `pending`.
  → código: `CuadraturaFacade` (fix-016 AC3); ver `cuadratura_caja.md`.

## `[Por Validar]` con el equipo
- ¿Existe un **plan de cuotas** formal (fechas comprometidas) o solo "saldo pendiente" que
  se abona cuando el alumno puede? El código solo modela deuda por matrícula.
- Lista oficial de **conceptos** de pago y quién puede crearlos.

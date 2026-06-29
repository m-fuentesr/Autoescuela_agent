# Blueprint: Cuadratura de Caja (Cierre Diario)

> Cierre de caja diario por sede. Lo opera la secretaria. Es el corazón financiero operativo del día.

## 1. Disparador
Fin de la jornada: la secretaria cierra la caja de su sede.

## 2. Ingresos (automáticos + manual)
- **Automáticos:** pagos de matrícula y cuotas con `status='paid'` del día + **cobros de cursos singulares** pagados hoy (`standalone_course_enrollments` con `paid_at` de hoy).
- **Manual:** ingreso manual para casos que no entran automáticamente.
- Buckets de pago: efectivo / transferencia / tarjeta / SENCE.
  → código: `CuadraturaFacade` (`FACADES.md:44-47`); `fetchPayments` filtra solo `paid`.

## 3. Egresos
- **Operacionales (van a cuadratura):** bencina, útiles, anticipos a instructores, gastos chicos del día.
- **Estructurales (NO van a cuadratura):** choques, luz, agua, arriendo, contribuciones, sueldos → solo reportes del dueño.
  → ver `domain/policies.md` P4; `expenses` vs `fixed_expenses` (`DATABASE.md:21-22`).

## 4. Arqueo y cierre
- Arqueo de billetes al cierre (para quien use caja chica). Si no hay caja chica → empieza en 0, sin problema.
- Se registra quién cerró, a qué hora y el resultado (historial de cierres).
  → código: `cash_closings` (`DATABASE.md:24`); `HistorialCuadraturasFacade`.

## 5. Reglas técnicas relevantes
- Usa horario real de Chile (`America/Santiago`, CLT/CLST) para no perder pagos vespertinos por interpretación UTC.
- Reversa de un ingreso de curso singular NO borra la inscripción: la vuelve a `pending` (`amount_paid=0`, `paid_at=null`).
- Branch-scoped: cada cuadratura es de una sede.

## 6. Dolores asociados
- **DOLOR-002:** bug visual (contenido demasiado expandido horizontalmente).
- **DOLOR-001 (relacionado):** el dueño necesita egresos estructurales aparte para el punto de equilibrio (no es cuadratura).

## 7. Pendiente de mapeo `[Por Validar]`
- Conciliación entre cuadratura diaria y boletas SII emitidas.
- Qué se hace cuando un pago llega a destiempo (post-cierre).

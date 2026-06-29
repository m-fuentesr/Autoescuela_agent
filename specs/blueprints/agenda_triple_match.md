# Blueprint: Agenda y Triple Match

> Proceso central del negocio: agendar una clase práctica Clase B verificando las tres disponibilidades.

## 1. Disparador
La secretaria (o el alumno en flujo online) intenta reservar un slot de 45 min para una clase práctica.

## 2. El Triple Match (verificación simultánea)
Antes de confirmar, deben cumplirse **las tres** patas:

1. **Alumno disponible**
   - Sin deuda bloqueante.
   - Horas/clases restantes > 0 (según plan 6 o 12 y `payment_mode`).
   - Documentos vigentes.
2. **Instructor disponible**
   - Sin otra clase en ese slot (no doble-booking).
   - Licencia habilitada para el tipo de clase.
3. **Vehículo disponible**
   - Sin otra clase en ese slot.
   - SOAP y revisión técnica vigentes (advertencia normativa si vencen).

→ código: regla en `PRODUCT-VISION.md:60-64`; disponibilidad en vista `v_class_b_schedule_availability` (`DATABASE.md:95`); `AgendaFacade` (`FACADES.md:18`).

## 3. Reglas que aplican
- **Máx clases/día:** 1 (online) / hasta 3 (sede). Ver `regulatory/normativa_chile.md` §2 y `domain/policies.md` P3.
- **Slots exactos de 45 min** (no rangos). Horarios L-V en `courses.schedule_blocks`.
- **Online:** el slot se reserva temporalmente (`slot_holds`, TTL 20 min) para evitar doble reserva.
- **Clase B:** al matricularse se agendan TODAS las clases de una vez (fix-017); la agenda ya no agenda "la segunda mitad".

## 4. Casos límite (a validar/documentar)
- ¿Qué pasa si un instructor falta? → existe `instructor_replacements` (`DATABASE.md:35`). Documentar el flujo de reemplazo.
- ¿Reprogramar una clase ya agendada? → soportado en `AdminAlumnoDetalleFacade` (solo Clase B). Documentar reglas.
- ¿Vehículo con documento vencido el día de la clase? → advertencia, no bloqueo (Capa B).

## 5. Pendiente de mapeo `[Por Validar]`
- Comportamiento exacto cuando el alumno tiene deuda parcial (depósito) y quiere agendar más allá de lo cubierto.
- Flujo de la opción de horario "bloque" (DOLOR-005).

> **Para el agente:** completa los `[Por Validar]` cuando el equipo confirme el comportamiento real (o cítalo del código si ya está implementado).

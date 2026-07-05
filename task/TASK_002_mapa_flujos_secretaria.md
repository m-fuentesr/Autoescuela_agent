# TASK_002 — Completar el Mapa de Rol de la Secretaria

| Campo | Valor |
| :--- | :--- |
| **Estado** | En progreso (pausado 2026-07-05) |
| **Prioridad** | Alta |
| **Origen** | Necesidad de rastrear y documentar los flujos por tipo de usuario. Piloto: secretaria. |
| **Artefacto** | `specs/roles/secretaria.md` |

## Objetivo
Mapear todos los flujos de la secretaria (actor-céntrico, eje ortogonal al `CONTEXT_MAP`), vía Domain Storytelling + `/grill`, hasta que cada actividad A1-A11 tenga blueprint o esté validada.

## Avance hasta 2026-07-05
- ✅ Backbone cerrado: **A1-A11** (matricular, agendar, asistencia, cobrar, cuadrar, egresos, alumnos/docs, operar profesional, reprogramar, certificados, tareas).
- ✅ Scope resuelto: **1 secretaria por sede**; "escuela" = sede (no multi-tenant); oferta B/Prof por sede vía `has_professional`.
- ✅ Corrección clave: la **matrícula profesional usa el mismo wizard** (rama por `license_group`), no un flujo aparte. Sincronizado en glosario, policies P10, blueprint y roles.
- ✅ "Fuera del rol": servicios especiales, cursos singulares/SENCE, liquidaciones de instructor.

## Pendiente (retomar aquí)
1. **Grill Q5 (abierta):** ¿qué pasos del wizard cambian en la **rama profesional** aparte de slots→promoción? Duda principal: **¿el contrato profesional es otra plantilla o el mismo generador?** (hipótesis no persistida; ver chat).
2. **Nuevo hueco:** ¿quién vende **servicios especiales** e inscribe **cursos singulares** si no la secretaria? (probable admin) → mapear ese actor.
3. Convertir en blueprint los flujos aún 🟡: A3 asistencia, A4 cobro suelto, rama profesional del wizard, operación profesional post-matrícula (asistencia/firma semanal, libro).
4. Tras la secretaria, replicar el mapa de rol para: **instructor**, **admin/dueño**, **alumno**, **relator**.

## Definición de Hecho (DoD)
- `specs/roles/secretaria.md` sin 🟡 en el backbone; cada flujo con blueprint o `[Validado]`.
- Punteros cruzados consistentes (glosario ↔ policies ↔ blueprints ↔ roles).

## Método
Domain Storytelling (elicitar) + `/grill` (estresar) + Real-Time Sync (persistir). Ver `skills/radar_de_contexto.md` y `skills/grill_me/SKILL.md`.

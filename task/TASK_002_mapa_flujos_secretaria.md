# TASK_002 — Completar el Mapa de Rol de la Secretaria

| Campo | Valor |
| :--- | :--- |
| **Estado** | En progreso — backbone mapeado; quedan validaciones de negocio |
| **Prioridad** | Alta |
| **Origen** | Necesidad de rastrear y documentar los flujos por tipo de usuario. Piloto: secretaria. |
| **Artefacto** | `specs/roles/secretaria.md` |

## Objetivo
Mapear todos los flujos de la secretaria (actor-céntrico, eje ortogonal al `CONTEXT_MAP`), vía Domain Storytelling + `/grill` + destilación del código, hasta que cada actividad A1-A11 tenga blueprint o esté validada.

## Avance hasta 2026-07-05 (sesión 2: barrido del código — Vía A)
- ✅ Backbone cerrado: **A1-A11**; scope resuelto (1 secretaria/sede, oferta vía `has_professional`).
- ✅ **Grill Q5 CERRADA:** el contrato profesional usa el **mismo generador y la misma plantilla** que Clase B (parametrizada por curso); solo agrega cláusula SÉPTIMA si hay convalidación simultánea. → `matricula_clase_b.md`.
- ✅ **Rama profesional del wizard mapeada** desde código (pasos que cambian: 1, 2, 3, 6). Orden real de pasos corregido: **contrato (4) antes de pago (5)**.
- ✅ **Cursos singulares → admin confirmado:** wizard oculta la categoría; alta en Contabilidad > Cursos. Hueco "¿quién inscribe singulares?" cerrado.
- ✅ **A3 asistencia** → blueprint `asistencia_clase_b.md` (iniciar/finalizar con KM y firmas; ausente = `no_show`, justificación `excused`; ciclos teóricos Zoom).
- ✅ **A4 cobro suelto** → blueprint `cobro_pagos.md` (página real; drawer contextual/global; canales mixtos).
- ✅ **A8 profesional post-matrícula** → blueprint `operacion_profesional.md` (asistencia, **firma semanal masiva**, notas, libro + PDF, certificados).
- ✅ **A9 reprogramación** destilada: vive en la ficha del alumno (solo B).
- ✅ Correcciones a specs: P1/P2 (depósito no limita agendamiento; no hay selector 6/12 — se agendan siempre las 12), glosario (orden wizard, Contrato Digital, nuevo término **Ciclo Teórico** `[Por Validar]`).

## Pendiente (retomar aquí — todo es Vía B: preguntar al equipo)
1. ⚠️ **Contradicciones código↔equipo:** `/secretaria/servicios-especiales` (POS completo) y `/secretaria/contabilidad/liquidaciones` existen aunque se declararon fuera del rol. ¿Capacidad real o retirar (menor privilegio)?
2. **A6:** umbral operacional vs estructural en el borde (~50k habitual).
3. **A7:** criterios de archivado/reactivación; documentos obligatorios por tipo de alumno.
4. **A3:** política de reposición de clases perdidas; el "recordatorio" es stub sin envío real.
5. **A4:** ¿plan de cuotas formal o solo saldo? Conceptos de pago oficiales.
6. **A8:** ¿la secretaria crea promociones/relatores o solo opera? Confirmar término "Ciclo Teórico".
7. **Matrícula:** por qué el depósito es 50% y si varía por curso.
8. Tras la secretaria, replicar el mapa de rol para: **instructor**, **admin/dueño**, **alumno**. ⚠️ **Relator `[Por Validar]`:** no es usuario del sistema (sin portal, sin rol en Auth/guards; solo entidad `lecturers` operada por secretaria/admin) — confirmar con el equipo si tendrá acceso propio antes de decidir si le corresponde mapa de rol. Ver glosario "Relator — ¿usuario del sistema?".

## Definición de Hecho (DoD)
- `specs/roles/secretaria.md` sin 🟡 en el backbone; cada flujo con blueprint o `[Validado]`.
- Punteros cruzados consistentes (glosario ↔ policies ↔ blueprints ↔ roles).

## Método
Domain Storytelling (elicitar) + `/grill` (estresar) + Vía A (destilar del código) + Real-Time Sync (persistir). Ver `skills/radar_de_contexto.md` y `skills/grill_me/SKILL.md`.

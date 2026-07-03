<!--
ACTA RECONSTRUIDA. No proviene de una transcripción conservada.
Se reconstruyó a partir de los hechos ya destilados y atribuidos a esta reunión
en indices/DOMAIN_GLOSSARY.md y specs/eval/compliance_check.md (punteros "reunion-demo-2026-05-29.md").
Propósito: cerrar los punteros colgantes y servir de ejemplo del sistema de actas.
NO se agregó contenido que no estuviera ya respaldado en el glosario/compliance.
-->

# Reunión — Demo: clases/día, finanzas y profesional (2026-05-29)

| Campo | Valor |
| :--- | :--- |
| **Fecha** | 2026-05-29 |
| **Tema** | Reglas de clases/día, modelo financiero (egresos) y evaluación profesional |
| **Asistentes** | Dueño · Equipo dev *(inferido del contenido; sin registro de asistencia conservado)* |
| **Canal** | *(no registrado)* |
| **Transcripción cruda** | No conservada — acta **reconstruida** desde glosario/compliance |
| **Procesada por** | Agente Consultor · reconstrucción 2026-06-30 |

---

## 1. Resumen ejecutivo
Reunión de la que se destilaron cuatro reglas de negocio que hoy ya viven en el glosario y en el Critic Loop: el **máximo de clases prácticas por día**, la distinción **egreso operacional vs estructural** para la cuadratura, el uso de **soft-delete (papelera)** para no corromper cuadraturas cerradas, y la política de que **el alumno profesional no se reprueba** (se usa "concepto", no nota). Quedó abierto el pendiente del **punto de equilibrio** para el dueño.

## 2. Decisiones tomadas

| # | Decisión | Estado | Ruteado a |
| :--- | :--- | :--- | :--- |
| D-1 | **Máximo de clases/día.** Base MTT = 1 clase de 45 min/día. Online (alumno): máx **1/día**. En sede (secretaria): hasta **3/día**; más de 3 → agenda manual al día siguiente. | `[Validado]` | `indices/DOMAIN_GLOSSARY.md` (Clase B) · `specs/eval/compliance_check.md` (Capa B) |
| D-2 | **Egreso operacional vs estructural.** Operacional (va a cuadratura, lo registra la secretaria): bencina, útiles, anticipos a instructores, gastos chicos del día. Estructural (NO va a cuadratura, solo admin/reportes): choques/reparaciones mayores, luz, agua, arriendo, contribuciones, sueldos. | `[Validado]` | `indices/DOMAIN_GLOSSARY.md` (Finanzas) |
| D-3 | **Soft-delete para integridad de cuadratura.** No borrar físicamente alumnos/pagos de forma que corrompa una cuadratura ya cerrada; usar papelera (`archived`). | `[Validado]` | `specs/eval/compliance_check.md` (Capa A — invariante) |
| D-4 | **El alumno profesional no se reprueba.** Ya pagó el certificado; se busca sustituir "nota" por "concepto". Escala MTT 10-100, aprobación ≥ 75. | `[Validado]` | `indices/DOMAIN_GLOSSARY.md` (Profesional) · `specs/eval/compliance_check.md` (Capa B) |

## 3. Términos / Lenguaje Ubicuo nuevos
> Consolidados en el glosario en su momento. Sin términos nuevos pendientes de esta acta.

## 4. Dolores / fricción reportados
> Asociado a D-4: la fricción "no podemos reprobar pero el sistema obliga a poner nota" se rastrea como **DOLOR-004** (referenciado en `compliance_check.md` y `context_onboarding.md`). *Pendiente de formalizar en `indices/PAIN_LOG.md`.*

## 5. Cruces normativos / invariantes mencionados

| Tema | Tipo | Ruteado a |
| :--- | :--- | :--- |
| Máximo de clases/día (MTT) | Advertencia normativa (Capa B) | `specs/eval/compliance_check.md` |
| Integridad de cuadratura (soft-delete) | Invariante de integridad (Capa A) | `specs/eval/compliance_check.md` |

## 6. Acuerdos & Pendientes
- [ ] **Pendiente #1 — Punto de equilibrio** `[Por Validar]`: el dueño necesita `ingresos del mes − egresos totales (incl. estructurales) = ganancia neta`. Requiere una sección privada de egresos estructurales (solo admin). → rastreado en `indices/DOMAIN_GLOSSARY.md` (Finanzas, "Punto de equilibrio").
- [x] **Formalizar DOLOR-004** en `indices/PAIN_LOG.md` *(hecho 2026-06-30)*.

## 7. Citas de respaldo
> Acta reconstruida — no se conservan citas textuales de la transcripción.

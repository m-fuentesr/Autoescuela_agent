# Registro de Dolores (Pain Points) — Autoescuela

Rastrea los puntos de fricción **vigentes** del negocio/producto, tal como los reporta el equipo en sesiones de trabajo. No es un archivo histórico ni un acta de reunión — es el estado actual.

> **Estados:** `Identificado` · `En análisis` · `En diseño` · `Resuelto`.
> Cuando un dolor se resuelve, se elimina o se marca `Resuelto` con fecha — no queda aquí indefinidamente.
> Cada entrada la escribe el agente en el momento en que el equipo la reporta (Real-Time Sync).

---

### DOLOR-004 — El alumno profesional no se reprueba ("concepto" vs "nota")
- **Actor:** Relator (evalúa módulos) · Equipo dev (modela la evaluación).
- **Descripción:** La escala oficial MTT (10-100, aprobación ≥ 75) obliga a registrar una nota que puede ser **reprobatoria**. Pero el negocio **no reprueba** al alumno profesional porque ya pagó el certificado. El equipo busca expresar el resultado como **"concepto"** en lugar de "nota reprobatoria".
- **Impacto:** Tensión entre la escala MTT oficial y la política comercial; riesgo de que el sistema marque como "reprobado" a un alumno que el negocio no reprueba; fricción al cerrar evaluaciones de módulo.
- **Estado:** `En análisis`.
- **Relacionado:** `indices/DOMAIN_GLOSSARY.md` (Profesional → Módulo/Evaluación) · `specs/eval/compliance_check.md` (Capa B) · reunión `reuniones/reunion-demo-2026-05-29.md` (D-4).

### DOLOR-003 — "Pruebas escritas por email" *(incompleto — `[Por Validar]`)*
- **Actor:** `[Por Validar]`
- **Descripción:** Referenciado en `skills/context_onboarding.md` como ejemplo de conocimiento **no codificado** ("pruebas escritas por email"), pero **sin descripción registrada en ningún spec**. Falta capturar qué problema concreto describe. Hipótesis a confirmar con el equipo (NO asumir): ¿usar correos como **prueba/evidencia escrita** ante reclamos, o **exámenes/pruebas enviados por email**?
- **Impacto:** `[Por Validar]`
- **Estado:** `Identificado` (puntero colgante — falta su contenido real).
- **Acción:** preguntar al equipo en la próxima sesión / `/onboarding` y completar esta ficha.

> **Nota:** No existen fichas DOLOR-001 ni DOLOR-002 en los specs; la numeración arranca en las referencias 003/004 ya citadas. Si el equipo reporta dolores previos, se les asignará ID al registrarlos.

---

> **Para el agente:** cuando el equipo reporte un dolor en sesión, regístralo aquí **inmediatamente** con:
> - **Actor** — quién lo padece (secretaria, dueño, instructor, alumno, equipo de desarrollo).
> - **Descripción** — qué pasa y por qué es un problema.
> - **Impacto** — consecuencia concreta.
> - **Estado** — situación actual.
>
> Si se relaciona con un flujo, enlaza al blueprint en `specs/blueprints/`. No copies actas ni documentos históricos — solo dolores que el equipo confirme como vigentes hoy.

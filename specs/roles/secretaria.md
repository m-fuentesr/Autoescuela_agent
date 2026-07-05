# Mapa de Rol: Secretaria (Role Journey)

> **Qué es esto:** el recorrido del **actor Secretaria** a través de sus flujos —
> el eje **actor-céntrico** que complementa a `indices/CONTEXT_MAP.md` (eje por contexto)
> y a `specs/blueprints/` (eje por proceso). Aquí se ve, de un vistazo, **qué puede y
> debe hacer la secretaria** y en qué estado de documentación está cada flujo.
>
> **Método:** backbone (User Story Mapping) + elicitación por **Domain Storytelling**
> ("la secretaria [hace X] con [objeto] en [contexto]") + estrés con `/grill`.
>
> **Convención:** 🟢 validado/con blueprint · 🟡 por descubrir/entrevistar · `[Por Validar]`.

---

## Perfil del actor `[Validado]`
- **Usuaria estrella** del producto (>100 acciones/día): matricula, agenda, cobra, cuadra caja.
- **Anclada a su sede** (branch-scoped; salvo grant `can_access_both_branches`).
- **Una secretaria por sede `[Validado]`.** La unidad operativa es la **Sede** (no hay multi-tenant). Cada sede tiene su oferta de academia (B / Profesional / ambas, vía `has_professional`) y su propia secretaria. Caso actual: 2 sedes (Azul, Roja) → 2 secretarias.
- **Alcance = la oferta de su sede.** La secretaria opera **lo que su sede ofrezca**. Si la sede tiene Profesional, tiene **participación plena**: matricula, ve datos y opera todo lo profesional (no solo Clase B). Ver `specs/domain/policies.md` P10.
  → `indices/DOMAIN_GLOSSARY.md` (Roles y Actores); invariante de sede en `compliance_check.md` (Capa A).

---

## Backbone — actividades de la secretaria (borrador semilla)

> Sembrado desde specs validadas. Falta confirmar **completitud** y **detalle** de cada fila.

| # | Actividad | Contexto | Blueprint | Estado |
| :-- | :--- | :--- | :--- | :--- |
| A1 | **Matricular alumno** — formulario/wizard de matrícula; **ramifica por `license_group`**: Clase B (slots) o Profesional (promoción, si la sede tiene `has_professional`) | C1 Matrícula | `matricula_clase_b.md` | 🟢 parcial |
| A2 | **Agendar clase práctica** (Triple Match) | C2 Clase B | `agenda_triple_match.md` | 🟢 parcial |
| A3 | **Marcar asistencia** (inicio/fin clase práctica; lista Zoom teórica) | C2 Clase B | — | 🟡 sin blueprint |
| A4 | **Cobrar / registrar pago** | C4 Finanzas | — (dentro de matrícula/pagos) | 🟡 sin blueprint propio |
| A5 | **Cuadrar caja** (cierre diario) | C4 Finanzas | `cuadratura_caja.md` | 🟢 |
| A6 | **Registrar egreso operacional** (bencina, útiles, anticipos) | C4 Finanzas | — (política P4) | 🟡 |
| A7 | **Gestionar alumnos / documentos / archivar** | C3 Alumnos | — | 🟡 |
| A8 | **Operar Academia Profesional** (post-matrícula: ver datos, asistencia/firma semanal, libro de clases). La *matrícula* profesional entra por A1 (rama profesional) | C5 Profesional | — | 🟢 participa · flujo 🟡 |
| A9 | **Reprogramar clase** ya agendada | C2 Clase B | (`agenda_triple_match.md` casos límite) | 🟢 confirmado · flujo 🟡 |
| A10 | **Entregar / registrar certificados** (folio, fecha = prueba legal) | C2 / C5 | — | 🟢 confirmado · flujo 🟡 |
| A11 | **Tareas internas** (comunicación / pendientes) | C11 | — | 🟢 confirmado · flujo 🟡 |

---

## Fuera del rol de la secretaria `[Validado 2026-07-05]`
De los candidatos evaluados, la secretaria **NO** hace:
- **Vender servicios especiales** (venta a externos) — actor por confirmar (¿admin?).
- **Inscribir cursos singulares / SENCE** — actor por confirmar (¿admin?).
- **Liquidar / anticipar a instructores** — rol admin/dueño.

> **Reconciliación:** esto aplica a esos candidatos de C4. Su **caja de siempre SÍ es suya** — A4 cobro, A5 cuadratura, A6 egresos operacionales siguen `[Validado]` en el glosario ("cobra, cuadra caja"). "Menos C4" ≠ no toca Finanzas.

---

## 🟡 Huecos abiertos (lista de trabajo de elicitación)
1. ✅ **Backbone (2026-07-05):** confirmado A1-A11 (añadidos A9 reprogramar, A10 certificados, A11 tareas). **Nuevo hueco:** ¿quién vende servicios especiales e inscribe cursos singulares si no la secretaria? (probable admin) → mapear ese actor.
2. **A3 Asistencia** — no tiene blueprint. ¿Cómo marca inicio/fin? ¿Qué pasa si el alumno no llega?
3. **A4 Cobro** — ¿siempre dentro de la matrícula, o cobra pagos sueltos (cuotas, servicios)?
4. **A6 Egresos** — el umbral operacional vs estructural (~50k habitual) — ¿quién decide en el borde?
5. **A8 Profesional — flujo `[corregido 2026-07-05]`:** la matrícula profesional SÍ usa el mismo formulario de matrícula (A1); al elegir "profesional" (opción visible solo si la sede tiene `has_professional`) el flujo se **ramifica** hacia la ruta de **promoción** (debe existir una abierta; normalmente siempre hay). Falta mapear: qué pasos del wizard cambian en la rama profesional, y la operación post-matrícula (asistencia/firma semanal, libro de clases).
6. ✅ **Resuelto (2026-07-05):** "escuela" = **sede** (no multi-tenant). 1 secretaria por sede; oferta por sede vía `has_professional`. Ver glosario "Escuela ≈ Sede" y `policies.md` P10.

> **Para el agente:** cada 🟡 que el equipo confirme → conviértelo en blueprint (o completa el existente) y cambia el estado. Real-Time Sync.

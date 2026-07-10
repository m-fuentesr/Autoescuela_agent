# Mapa de Rol: Secretaria (Role Journey)

> **Qué es esto:** el recorrido del **actor Secretaria** a través de sus flujos —
> el eje **actor-céntrico** que complementa a `indices/CONTEXT_MAP.md` (eje por contexto)
> y a `specs/blueprints/` (eje por proceso). Aquí se ve, de un vistazo, **qué puede y
> debe hacer la secretaria** y en qué estado de documentación está cada flujo.
>
> **Método:** backbone (User Story Mapping) + elicitación por **Domain Storytelling**
> + estrés con `/grill` + **destilación del código** (Vía A, barrido 2026-07-05).
>
> **Convención:** 🟢 validado/con blueprint · 🟡 por descubrir/entrevistar · `[Por Validar]`.

---

## Perfil del actor `[Validado]`
- **Usuaria estrella** del producto (>100 acciones/día): matricula, agenda, cobra, cuadra caja.
- **Anclada a su sede** (branch-scoped; salvo grant `can_access_both_branches`).
- **Una secretaria por sede `[Validado]`.** La unidad operativa es la **Sede** (no hay multi-tenant). Cada sede tiene su oferta de academia (B / Profesional / ambas, vía `has_professional`) y su propia secretaria. Caso actual: 2 sedes (Azul, Roja) → 2 secretarias.
- **Alcance = la oferta de su sede.** Si la sede tiene Profesional, tiene **participación plena** (P10). Las rutas profesionales van tras `professionalBranchGuard`.
  → `indices/DOMAIN_GLOSSARY.md` (Roles y Actores); invariante de sede en `compliance_check.md` (Capa A).

---

## Backbone — actividades de la secretaria

| # | Actividad | Contexto | Blueprint | Estado |
| :-- | :--- | :--- | :--- | :--- |
| A1 | **Matricular alumno** — wizard 6 pasos (Datos → Asignación → Documentos → **Contrato** → **Pago** → Confirmación); **ramifica por `license_group`**: Clase B (slots) o Profesional (promoción). Rama profesional mapeada desde código (2026-07-05) | C1 Matrícula | `matricula_clase_b.md` | 🟢 |
| A2 | **Agendar clases prácticas** — ocurre **dentro de A1** (paso 2 agenda SIEMPRE las 12; Triple Match). La página Agenda es un **visor semanal de solo lectura** desde fix-017 (KPIs, filtro por instructor, detalle de slot) | C2 Clase B | `agenda_triple_match.md` | 🟢 |
| A3 | **Controlar asistencia** — iniciar/finalizar clase práctica (hora real, KM, nota, checklist, firmas); ausente/justificar; ciclos teóricos Zoom (link, tema, email, roster) | C2 Clase B | `asistencia_clase_b.md` | 🟢 |
| A4 | **Cobrar / registrar pago suelto** — página Pagos real (ya no stub): drawer contextual/global, concepto + canales mixtos (suma = total), siempre anclado a matrícula | C4 Finanzas | `cobro_pagos.md` | 🟢 |
| A5 | **Cuadrar caja** (cierre diario; ingresos = pagos `paid` + cursos singulares del día; egresos operacionales; arqueo) | C4 Finanzas | `cuadratura_caja.md` | 🟢 |
| A6 | **Registrar egreso operacional** (bencina, útiles, anticipos) — mecánica en cuadratura (P4); el **umbral** operacional/estructural en el borde sigue 🟡 | C4 Finanzas | (P4 + `cuadratura_caja.md`) | 🟢 parcial |
| A7 | **Gestionar alumnos / documentos / archivar** — base alumnos, ficha (detalle), DMS documentos, ex-alumnos con **re-matricular** (fix-020), archivado soft-delete (P5). Criterios de negocio de archivado 🟡 | C3 Alumnos | — (P5) | 🟢 parcial |
| A8 | **Operar Academia Profesional** post-matrícula: asistencia masiva/individual, **firma semanal masiva**, calificaciones, libro de clases + export PDF, certificados, promociones/relatores/archivo | C5 Profesional | `operacion_profesional.md` | 🟢 |
| A9 | **Reprogramar clase** — vive en la **ficha del alumno** (no en la Agenda): elegir clase → instructor → grilla → nuevo slot. Solo Clase B | C2 Clase B | (ficha alumno; `AdminAlumnoDetalleFacade.reprogramarClase`) | 🟢 destilado |
| A10 | **Entregar / registrar certificados** — Clase B: generar (EF `generate-certificate-b-pdf`), ver, enviar email, lote pendientes, export; **carnet dual** desde la ficha. Profesional: equivalente (en A8) | C2 / C5 | (`operacion_profesional.md` §5; facades Certificación) | 🟢 destilado |
| A11 | **Tareas / comunicación interna** — crear tarea (con vencimiento) u **observación** (sin vencimiento), respuestas en hilo, completar, soft-delete; Realtime doble canal. ¿Comunicación o pendientes? → el código soporta **ambos** | C11 | — (`TasksFacade`) | 🟢 destilado |

---

## Inventario del portal (rutas reales, barrido 2026-07-05)

Menú completo en `/app/secretaria/*` (ROUTES.md:62-95): dashboard (real, con KPIs/alertas/agenda del día),
alumnos + ficha, profesional/alumnos, profesional/pre-inscritos, agenda, asistencia (+ matriz, + profesional),
matrícula, **pagos (real)**, contabilidad (cuadratura, historial, reportes, **liquidaciones ⚠️**),
certificados, documentos, instructores (consulta), comunicaciones, observaciones,
profesional (relatores, promociones, asistencia, **notas — real**, certificados, archivo),
**libro-de-clases (real)**, notificaciones (**único stub restante**), ex-alumnos (B y prof),
**servicios-especiales ⚠️**, configuracion-web (alcanzable por URL, fuera del menú — revisar menor privilegio).

> El audit del repo (`indices/SECRETARIA-AUDIT.md`, 2026-06-24) quedó **parcialmente obsoleto**:
> de sus 5 stubs "PLANO" solo queda **notificaciones**; dashboard, pagos, notas y libro de clases ya son reales.
> Sus hallazgos de **fuga de sede** (Base Alumnos B, Instructores) siguen vigentes como riesgo reportado.

---

## Fuera del rol de la secretaria — reconciliado con el código (2026-07-05)

- **Inscribir cursos singulares / SENCE → CONFIRMADO admin.** El wizard oculta siempre la categoría
  "singular"; el alta vive en **admin: Contabilidad > Cursos Singulares** (`/app/admin/contabilidad/cursos`,
  sin ruta secretaria). → código: `EnrollmentFacade.hiddenCourseCategories`. ✅ hueco cerrado.
- ⚠️ **Vender servicios especiales — CONTRADICCIÓN código↔equipo `[Por Validar]`.** El equipo lo declaró
  fuera del rol (2026-07-05), pero `/app/secretaria/servicios-especiales` existe con **punto de venta
  completo** (registrar venta, cobrar, agregar servicio), branch-anclado. ¿Se retira del menú o el rol
  sí lo hace? **Preguntar al equipo.**
- ⚠️ **Liquidaciones de instructor — CONTRADICCIÓN código↔equipo `[Por Validar]`.** Declarado rol
  admin/dueño, pero existe `/app/secretaria/contabilidad/liquidaciones`. ¿Solo consulta, o exceso
  de privilegio? **Preguntar al equipo.**

> **Reconciliación:** su caja de siempre SÍ es suya — A4 cobro, A5 cuadratura, A6 egresos operacionales
> siguen `[Validado]`. "Menos C4" ≠ no toca Finanzas.

---

## 🟡 Huecos abiertos (lista de trabajo de elicitación)
1. ⚠️ **Contradicciones código↔equipo** (arriba): servicios especiales y liquidaciones en el portal
   de la secretaria. Decidir: ¿capacidad real del rol o retirar (menor privilegio)?
2. **A6 Egresos** — el umbral operacional vs estructural (~50k habitual) — ¿quién decide en el borde?
3. **A7 Alumnos** — criterios de negocio de archivado/reactivación; documentos obligatorios vs opcionales por tipo.
4. **A3** — política de reposición de clases perdidas (¿cuántas ausencias se toleran?); el
   "recordatorio al alumno en riesgo" es un stub sin envío real (deuda de producto).
5. **A4** — ¿plan de cuotas formal o solo saldo pendiente? Lista oficial de conceptos de pago.
6. **A8** — ¿la secretaria crea promociones/relatores o solo opera? (re-export le da poderes de admin).
7. **Matrícula** — ¿por qué el depósito es 50%? ¿varía por curso? (el porqué no está en el código).
8. ✅ ~~Grill Q5~~ — **cerrada 2026-07-05:** contrato profesional = mismo generador y plantilla,
   + cláusula SÉPTIMA si convalida (ver `matricula_clase_b.md`).
9. ✅ ~~¿Quién inscribe cursos singulares?~~ — **cerrado:** admin (Contabilidad > Cursos).

> **Para el agente:** cada 🟡 que el equipo confirme → conviértelo en blueprint (o completa el existente) y cambia el estado. Real-Time Sync.

# Spec: Normativa Chilena (Capa Regulatoria)

> **Naturaleza:** Capa de **referencia**. Alimenta las **advertencias** de la CAPA B de `specs/eval/compliance_check.md`. El agente la usa para **advertir y citar**, NO para bloquear.
>
> **🚥 Estado de cada regla:** `[Validado]` (confirmado por negocio/código), `[Por Validar]` (derivado, requiere confirmación), `[Por rellenar]` (falta dato/fuente legal precisa).

---

## 1. Edad y menores de edad

- **Edad mínima de matrícula `[Por Validar]`** — El sistema valida edad ≥ 17 en el wizard y en cursos singulares (`calcAge`, status `under-17`/`requires-authorization`).
  → código: `enrollment-personal-data.model.ts` (`AgeValidation`); `CursosSingularesFacade` (`FACADES.md:49`).
- **Autorización notarial para menores `[Validado]`** — Matricular a un menor requiere autorización notarial, capturada en el paso de documentos.
  → código: `EnrollmentDocumentsFacade` (`FACADES.md:13`).
- **Pendiente:** confirmar el umbral legal exacto (17 vs 18) y la referencia normativa (Ley de Tránsito / decreto MTT) — `[Por rellenar]`.

## 2. Clases prácticas (MTT)

- **Máximo de clases por día `[Validado]`** — Regulación oficial: **1 clase de 45 minutos por día**.
  - Matrícula online (alumno): máx **1/día**. Si necesita más → ir a sede.
  - Matrícula en sede (secretaria): hasta **3/día** por excepción operativa; más de 3 → agenda manual al día siguiente.
  → código: `courses.max_classes_per_day` (`DATABASE.md:12`); fuente: `reunion-demo-2026-05-29.md:25-28`.
- **Duración del slot `[Validado]`** — Bloques exactos de **45 min** (no rangos continuos).
  → código: `courses.schedule_blocks` (`DATABASE.md:12`).
- **Total de clases Clase B `[Validado]`** — Programa de **12 clases prácticas**; carnet intermedio a las 6.
  → código: `enrollments.license_initial_url`/`license_full_url` (fix-019).

## 3. Flota (vigencia de documentos)

- **SOAP, Revisión Técnica, Permiso de Circulación `[Validado]`** — Documentos del vehículo con fecha de vencimiento. El sistema alerta los vencidos/por vencer.
  → código: `vehicle_documents` + `alert_config` (`DATABASE.md:74,18`); `DashboardAlertsFacade`.
- **Regla operativa:** un vehículo con documentación vencida **no debería** usarse para clases (advertencia, no bloqueo duro en este agente).

## 4. Instructores

- **Licencia habilitada `[Validado]`** — El instructor debe tener licencia vigente y habilitada para el tipo de clase. Las Edge Functions validan que la licencia no esté expirada al crear/editar.
  → código: `create-instructor`/`update-instructor` (`DATABASE.md:106-107`); `instructors.license_status`.

## 5. SENCE y cursos singulares

- **SENCE `[Validado]`** — Códigos autorizados asociados a cursos. Los cursos singulares SENCE siguen vigentes **aunque se eliminó la franquicia tributaria**.
  → código: `sence_codes` (`DATABASE.md:13`); `reunion-demo-2026-05-29.md:78-79`.
- **Libro de clases (profesional) `[Validado]`** — Registro oficial exportable a PDF; reemplaza el libro físico. Incluye código SENCE autorizado y horario.
  → código: `class_book` (`DATABASE.md:79`).

## 6. Certificación

- **Certificado como prueba legal `[Validado]`** — Número (folio) + fecha de entrega + archivo subido = **prueba legal de entrega** ante reclamos.
  → código: `certificates`/`certificate_batches` (`DATABASE.md:82-83`); `reunion-demo-2026-05-29.md:62-65`.
- **Profesional: no se reprueba `[Validado]`** — El alumno profesional ya pagó el certificado; el negocio no lo reprueba. Ver DOLOR-004.

## 7. Tributario / Documentos de venta

- **Boleta SII `[Validado]`** — Documento tributario por folio y sede. La contabilidad formal sigue siendo del contador (anti-goal del producto: "no reemplazamos al contador").
  → código: `sii_receipts` (`DATABASE.md:23`); `PRODUCT-VISION.md:48`.
- **Identidad de género (ley REC Chile 2022) `[Validado]`** — Valores M/F/X en `gender`.
  → código: `DATABASE.md:10`.

---

## Pendientes de la capa normativa (a confirmar con fuente legal)
- [ ] Umbral legal exacto de edad mínima y su decreto/ley de respaldo.
- [ ] Referencia formal MTT del máximo de clases/día.
- [ ] Requisitos legales completos de los carnets/licencias por clase.
- [ ] Plazos legales de vigencia de SOAP/revisión técnica (hoy gestionados por fechas de documento, sin la norma citada).

> **Para el agente:** cuando el equipo aporte la fuente legal precisa de algún punto `[Por rellenar]`/`[Por Validar]`, escríbela aquí de inmediato (Real-Time Sync) y actualiza el estado.

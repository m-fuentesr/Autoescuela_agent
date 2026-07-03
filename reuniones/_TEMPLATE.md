<!--
PLANTILLA DE ACTA DE REUNIÓN — no editar este archivo.
Cópialo a: reuniones/reunion-{slug}-{YYYY-MM-DD}.md
El acta es AUTOCONTENIDA: se entiende sin el audio ni la transcripción cruda.
Genérala con la skill skills/meeting_ingestion.md (atajo /meeting).
Convención de estados: [Validado] · [Por Validar] · [Por rellenar]
-->

# Reunión — {Tema} ({YYYY-MM-DD})

| Campo | Valor |
| :--- | :--- |
| **Fecha** | {YYYY-MM-DD} |
| **Tema** | {tema corto} |
| **Asistentes** | {roles — ej: Dueño, Secretaria sede Roja, Equipo dev} |
| **Canal** | {presencial / Zoom} |
| **Transcripción cruda** | {ruta en reuniones/transcripts/ (no versionada) o "no conservada"} |
| **Procesada por** | Agente Consultor · {YYYY-MM-DD} |

---

## 1. Resumen ejecutivo
> 2-4 frases: de qué se trató y qué se decidió. Sin relleno.

## 2. Decisiones tomadas
> Reglas/políticas que el negocio confirmó. Cada una con su estado y a dónde se ruteó.

| # | Decisión | Estado | Ruteado a |
| :--- | :--- | :--- | :--- |
| D-1 | … | `[Validado]` | `specs/domain/policies.md` |

## 3. Términos / Lenguaje Ubicuo nuevos
> Entidades o términos que aparecieron. Ruteados al glosario.

| Término | Definición (lo que se dijo) | Estado | Ruteado a |
| :--- | :--- | :--- | :--- |
| … | … | `[Por Validar]` | `indices/DOMAIN_GLOSSARY.md` |

## 4. Dolores / fricción reportados
> Lo que el equipo señaló que duele hoy. Ruteado a PAIN_LOG.

| Dolor | Actor | Impacto | Ruteado a |
| :--- | :--- | :--- | :--- |
| … | … | … | `indices/PAIN_LOG.md` |

## 5. Cruces normativos / invariantes mencionados
> Normativa chilena tocada (Capa B → advertencia) o invariante de integridad (Capa A → bloqueo).

| Tema | Tipo | Ruteado a |
| :--- | :--- | :--- |
| … | Advertencia normativa / Invariante | `specs/regulatory/normativa_chile.md` o `specs/eval/compliance_check.md` |

## 6. Acuerdos & Pendientes
> Compromisos y, sobre todo, lo que quedó `[Por Validar]` y hay que confirmar en la próxima.

- [ ] **Pendiente 1** — … (responsable: …)
- [ ] **Por validar** — … (¿quién es dueño de la regla?)

## 7. Citas de respaldo (opcional)
> Frase textual breve que ancla una decisión clave. Sin PII. Máx 1-2 líneas por cita.

> "…"

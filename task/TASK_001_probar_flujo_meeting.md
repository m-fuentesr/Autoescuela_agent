# TASK_001 — Estrenar el flujo `/meeting` con una transcripción real

| Campo | Valor |
| :--- | :--- |
| **Estado** | Pendiente |
| **Prioridad** | Media |
| **Origen** | Montaje del sistema de reuniones (2026-06-30). El equipo aún no tiene una transcripción disponible. |
| **Creada** | 2026-06-30 |

## Objetivo
Validar de punta a punta el sistema de ingesta de transcripciones (`skills/meeting_ingestion.md`) con una **reunión real** apenas exista su transcripción: comprobar que produce un acta fiel y que rutea el conocimiento a glosario/specs/dolores correctamente.

## Disparador
Cuando el equipo aporte la **transcripción** de una reunión con stakeholders (pegada o como archivo en `reuniones/transcripts/`).

## Pasos
1. Invocar `/meeting` con la transcripción.
2. Verificar que el acta `reuniones/reunion-{slug}-{fecha}.md` quede autocontenida y sin PII sensible (sin RUT, teléfonos, montos personales).
3. Confirmar que cada hallazgo `[Validado]`/`[Por Validar]` se **ruteó** a su spec/índice (no quedó solo en el acta).
4. Agregar la fila a `reuniones/INDEX.md`.
5. Confirmar que la transcripción cruda **no** se versionó (está en `reuniones/transcripts/`, gitignored).

## Definición de Hecho (DoD)
- Acta creada e indexada en `reuniones/INDEX.md`.
- Conocimiento nuevo reflejado en glosario/PAIN_LOG/blueprints/policies/regulatory/compliance según corresponda.
- Reporte final listando qué se ruteó y qué quedó `[Por Validar]`.

## Reglas/invariantes aplicables
- **Cero Alucinaciones:** no inventar lo que la transcripción no diga; lo dudoso → `[Por Validar]`.
- **Real-Time Sync:** rutear en el mismo turno, no solo describir.
- **Privacidad:** minimizar PII en el acta; crudo fuera de git.

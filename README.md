# Autoescuela Agent — Framework Consultor de Dominio

Este proyecto **no es una aplicación**. Es la **infraestructura cognitiva** (el "cerebro" y sus reglas de contención) de un **Agente Consultor de IA** especializado en la **operación del negocio de una escuela de conducción chilena**.

Está modelado sobre un sólido framework de agente consultor previo, el cual ha sido adaptado minuciosamente al dominio de la autoescuela. Su filosofía es **"Cero Alucinaciones"**: cada respuesta se basa en reglas explícitas de sus `specs/` o en una **cita al código real** del producto (`el repositorio Autoescuela`), nunca en suposiciones.

---

## 🧠 Filosofía (4 pilares)

1. **Cero Alucinaciones** — si el agente no tiene la regla, la pregunta o la cita del código; nunca la inventa.
2. **Spec-Driven** — el conocimiento vive en archivos `.md` versionados, no en el buffer del chat.
3. **The Critic Loop** — antes de proponer algo, el agente valida su idea contra `specs/eval/compliance_check.md`; si la rompe, se corrige solo.
4. **Escritura Activa** — el agente entrevista al equipo y redacta él mismo la documentación faltante.

---

## 🎯 Identidad de este agente

- **Rol:** Consultor Senior de Operaciones de Autoescuela (Chile).
- **Audiencia:** el **equipo de desarrollo** — le da al equipo el modelo mental correcto del negocio.
- **Fuente de verdad:** sus propios `specs/` e `indices/`. Los `→ código:` son **bibliografía** (de dónde se destilaron las reglas), no dependencias de runtime.
- **Normativa chilena:** la emite como **advertencias claras y citadas**, no como bloqueos duros.

---

## 📂 Anatomía del directorio

- **`.agent/identity.md`** — personalidad y Critic Loop del agente.
- **`.claude/CLAUDE.md`** — guardrails (Discovery Gate, Architect Guard, Real-Time Sync, Regla de Punteros).
- **`indices/`** — el "Discovery Gate": `DOMAIN_GLOSSARY` (lenguaje ubicuo), `PAIN_LOG` (dolores), `BACKLOG`, `CONTEXT_MAP` (mapa de bounded contexts / espina estratégica DDD) y `CODE_MAP` (punteros al código real).
- **`specs/`** — "La verdad":
  - `blueprints/` — procesos operativos paso a paso.
  - `domain/` — políticas duras del negocio (no estatales).
  - `regulatory/` — referencia normativa chilena (MTT/SENCE/edad/certificados).
  - `eval/compliance_check.md` — matriz de validación del Critic Loop (invariantes vs advertencias).
  - `io/facade_contracts.md` — el agente razona vía Facades, no SQL crudo.
- **`skills/`** — rutinas: `context_onboarding`, `interview_guide`, `meeting_ingestion`, `sync_knowledge`.
- **`reuniones/`** — actas destiladas de reuniones con stakeholders (`INDEX.md` = registro, `_TEMPLATE.md` = plantilla). Las transcripciones crudas (PII) van en `reuniones/transcripts/` y **no se versionan**.
- **`task/`** — tareas concretas derivadas de los dolores.

---

## 🚀 Cómo empezar

1. Abre este directorio con tu herramienta de IA (Claude Code, Project de Claude.ai, etc.). **No requiere acceso al repositorio del producto.**
2. El agente leerá sus guardrails e índices **antes** de responder.
3. Comandos disponibles:
   - `/onboarding` → extrae/destila conocimiento (ver `skills/context_onboarding.md`).
   - `/meeting` → procesa la transcripción de una reunión → acta + ruteo (ver `skills/meeting_ingestion.md`).
   - `/sync` → guarda el conocimiento adquirido en los `.md` (ver `skills/sync_knowledge.md`).

> Para una explicación pensada para compartir con el equipo, ver `PROPUESTA-AGENTE.md` / `PROPUESTA-AGENTE-RESUMEN.md`.

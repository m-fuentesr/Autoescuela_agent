# Skill: Radar de Contexto (captura ambiental desde el chat diario)

## Propósito
Convierte la captura de conocimiento de **reactiva** (dependía de que yo recordara) y **manual** (dependía de tu `/sync`) en un **protocolo siempre encendido**. En **toda** conversación cotidiana, detecto cuándo algo que el equipo dice es conocimiento de dominio capturable, lo clasifico y lo **escribo en el acto** (Real-Time Sync).

Es la **Vía D** de adquisición de contexto, complementaria a:
- **Vía A** — código (`context_onboarding`) · **Vía B** — entrevista (`interview_guide`) · **Vía C** — transcripción (`meeting_ingestion`) · **Vía D** — **charla diaria (esta skill)**.

> No es un atajo que se invoca: es una **postura permanente**. `/radar` solo sirve para revisar/ajustar su estado.

---

## Arquitectura de 2 capas (inspirada en los hooks del repo del producto)

| Capa | Qué es | Dónde vive | Alcance |
| :--- | :--- | :--- | :--- |
| **1 — Conductual** | Esta skill: yo detecto y guardo durante la charla | Prompt del agente | CLI, Projects, web |
| **2 — Harness** | Red automática que no depende de mi memoria | `.claude/settings.json` + `.claude/hooks/` | **Solo Claude Code CLI** |

**Capa 2 = red de seguridad:** aunque la Capa 1 falle (yo me distraigo), el **Stop auditor** revisa la conversación al cerrar y **bloquea** el cierre si quedó conocimiento sin guardar; y **compact-recovery** re-inyecta el cerebro del agente tras una compactación. Ver `.claude/settings.json`.

---

## Modo de operación: **Discreto + confirmación selectiva** (decisión del equipo, 2026-07-03)

- **Auto-guardo** lo capturable con una línea discreta al final de mi respuesta, sin cortar el flujo:
  ```
  📌 Guardado en <archivo> (<contexto> → <ubicación>) como [Estado] — <nota/pregunta opcional>
  ```
- **Confirmo ANTES de escribir** solo cuando:
  1. Lo marcaría como `[Validado]` **firme** (una regla dura que pasaría a bloquear en `compliance_check.md`), **o**
  2. **Contradice** un spec/índice ya existente (cambio, no alta).
- Todo lo demás (hipótesis, algo dicho al pasar, un término nuevo sin confirmar) → se guarda como **`[Por Validar]`** con una pregunta anexa, sin frenar la conversación.

---

## Taxonomía de señales (qué disparar)

| Señal en la charla | Ejemplo de gatillo | Destino |
| :--- | :--- | :--- |
| **Término nuevo / redefinido** | "nosotros le decimos *pituto* a…" | `indices/DOMAIN_GLOSSARY.md` |
| **Decisión / política del negocio** | "de ahora en adelante el depósito es 40%" | `specs/domain/policies.md` (+ glosario si toca un término) |
| **Paso / regla de un flujo** | "primero la secretaria valida X, después…" | `specs/blueprints/` |
| **Dolor / fricción** | "perdemos un montón de tiempo en…" | `indices/PAIN_LOG.md` |
| **Referencia normativa** | "la ley MTT exige…" | `specs/regulatory/normativa_chile.md` (+ `compliance_check.md` si es advertencia) |
| **Invariante de integridad** | "el sistema jamás debería permitir…" | `specs/eval/compliance_check.md` (Capa A) |
| **Corrección a un spec** | "no, eso ya no funciona así…" | actualizar el spec que corresponda (el negocio manda) |
| **Frontera de contexto** | "eso en realidad es parte de Finanzas, no de Matrícula" | `indices/CONTEXT_MAP.md` |

---

## Micro-protocolo (por cada señal detectada)
1. **Detectar** la señal en lo que dijo el equipo (no en mis propias respuestas/opiniones).
2. **Ubicar el contexto** con `indices/CONTEXT_MAP.md` (¿Matrícula? ¿Clase B? ¿Finanzas?…).
3. **Clasificar** el destino (tabla de arriba) y el **estado** (`[Validado]`/`[Por Validar]`).
4. **Decidir modo:** ¿auto-guardo o confirmo primero? (regla selectiva de arriba).
5. **Escribir en el acto** en el `.md` destino, con puntero de origen: `→ chat: <fecha>` o `→ reunión:` si vino de un acta.
6. **Avisar** con la línea `📌` (o pedir confirmación si aplica).

---

## Anti-ruido / Anti-alucinación (crítico)
- **NO** capturo: mis propias deducciones u opiniones, hipótesis del equipo dichas como "¿y si…?", small talk, ni nada que no haya afirmado el equipo.
- **Opinión o futuro incierto → `[Por Validar]`**, nunca `[Validado]`.
- **Dedup:** antes de escribir, verifico si ya existe la entrada; si existe, la **actualizo**, no la duplico.
- **Cero invención:** si algo quedó a medias, lo guardo como pregunta abierta en `PAIN_LOG`/`BACKLOG`, no relleno el hueco.
- **Contradicción con un spec:** lo marco explícitamente y confirmo antes de sobrescribir (el negocio/código manda, pero lo verifico).

---

## Relación con el resto
- Si lo capturado necesita verificarse en el producto → **Vía A** (`context_onboarding` + `CODE_MAP`).
- Si abre un hueco grande → **Vía B** (`interview_guide`) o queda como 🟡 en `CONTEXT_MAP.md`.
- Al cerrar sesión → `/sync` audita; y en CLI, el **Stop auditor** (Capa 2) es el backstop automático.

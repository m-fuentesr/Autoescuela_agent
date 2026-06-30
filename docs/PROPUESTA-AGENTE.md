# Propuesta: Agente Consultor de Dominio para Autoescuela

> [!NOTE] 
> **Documentación histórica para humanos.** El Agente NO debe extraer reglas de dominio de esta carpeta, ya que contiene referencias estructurales e históricas al framework base original.

> **Para:** equipo de desarrollo
> **Qué es esto:** la estructura propuesta para construir un "agente consultor" del negocio de autoescuela, modelado sobre un framework base que ya tenemos funcionando.
> **Estado:** propuesta para revisar antes de construir.

---

## 1. ¿Qué estamos construyendo? (y qué NO)

No es una aplicación ni código nuevo del producto. Es un **"cerebro" en archivos Markdown** que le da a una IA (Claude Code, un Project de Claude.ai, etc.) el **modelo mental correcto del negocio de una autoescuela chilena**, para que cuando le preguntemos algo de dominio, responda con reglas reales y no inventadas.

Pensalo como la **documentación viva y estructurada del negocio**, escrita en un formato que la IA está obligada a leer y respetar antes de opinar.

Está basado en un framework base que ya existe y funciona. Acá lo adaptamos al dominio autoescuela.

### Filosofía heredada del framework (los 4 pilares)

1. **Cero Alucinaciones** — si la IA no tiene la regla exacta en sus specs, la pregunta o la cita del código; nunca la inventa.
2. **Spec-Driven** — el conocimiento vive en archivos versionados, no en un prompt suelto ni en la memoria del chat.
3. **The Critic Loop** — antes de proponer algo, la IA valida su propia idea contra una matriz de reglas; si la rompe, se corrige sola antes de mostrártela.
4. **Escritura Activa** — la IA no solo lee: entrevista al equipo y redacta ella misma la documentación faltante.

---

## 2. Decisiones que ya tomamos

Estas cuatro definiciones moldean toda la estructura:

| Decisión | Definición |
|---|---|
| **Rol del agente** | Consultor de la **operación del negocio** (matrículas, agenda, caja, flota, normativa, KPIs). Razona sobre el negocio, no sobre el código. |
| **Audiencia** | El **equipo de desarrollo**. El agente nos da a nosotros el modelo mental correcto del negocio mientras construimos el producto. |
| **Fuente de verdad** | **Mixta con punteros**: el agente tiene specs de negocio propias + **citas explícitas `archivo:línea` al código real** de `D:\Autoescuela`. Nunca inventa una regla: o la tiene escrita, o la cita del código. |
| **Normativa chilena** | Importante, pero el agente la emite como **advertencias claras y citadas** (edad mínima, MTT, SENCE, certificados, SOAP/revisión técnica), **no como bloqueos duros**. |

---

## 3. El dominio en una página (lo que el agente debe dominar)

Autoescuela ya es un producto **maduro y muy documentado** (Angular + Supabase, ~85 tablas). El agente se apoya en eso. Núcleo del negocio:

- **Triple Match** (regla central): antes de confirmar una clase deben estar disponibles simultáneamente **alumno + instructor + vehículo**.
- **Matrícula**: wizard de 6 pasos (datos → clases → horario → documentos → pago → contrato), en dos canales: **presencial** (secretaria) y **público online** (con pago Transbank).
- **Dos academias**:
  - **Clase B** — 12 clases prácticas, carnet dual (6/12), asistencia, exámenes.
  - **Profesional** — promociones, relatores A2-A5, convalidaciones (A2→A4, A5→A3), libro de clases, módulos escala MTT 10-100.
- **Finanzas**: pagos, cuadratura de caja, distinción egresos operacionales (cuadratura) vs estructurales (solo admin), boletas SII, servicios especiales, cursos singulares SENCE.
- **Multi-sede** (Azul / Roja — "Conductores Chillán"), **flota**, **certificados** (prueba legal de entrega), tareas internas.
- **Capa regulatoria chilena**: edad mínima 17, autorización notarial para menores, máximo de clases/día por MTT, SENCE, vigencia de documentos de flota.

---

## 4. Estructura de archivos propuesta

```text
d:\Autoescuela_agent\
├── .agent\
│   └── identity.md          # Personalidad y rol: "Consultor Senior de Operaciones de Autoescuela (Chile)"
│                            #  + Critic Loop (entidades: Alumno / Instructor / Vehículo / Matrícula / Pago)
├── .claude\
│   └── CLAUDE.md            # Guardrails automáticos para la IA:
│                            #  · Discovery Gate (lectura obligatoria antes de responder)
│                            #  · Architect Guard (cero alucinación de dominio)
│                            #  · Real-Time Sync (prohibido retener conocimiento solo en el chat)
│                            #  · Regla de Punteros (toda afirmación de negocio cita ruta:línea del código)
├── indices\
│   ├── DOMAIN_GLOSSARY.md   # Lenguaje ubicuo: Triple Match, Clase B, Profesional, Convalidación,
│   │                        #  Promoción, Relator, SENCE, Carnet dual, Cuadratura, Slot, Sede…
│   ├── PAIN_LOG.md          # Dolores operativos reales (de reuniones y auditorías)
│   ├── BACKLOG.md           # Requerimientos futuros
│   └── CODE_MAP.md   (NUEVO)# Mapa: dónde vive cada cosa del negocio en D:\Autoescuela
├── specs\
│   ├── blueprints\          # Procesos operativos paso a paso (matrícula, agenda, cuadratura, certificación…)
│   ├── domain\              # Políticas DURAS del negocio (no estatales): límites por canal, descuentos, soft-delete
│   ├── regulatory\  (NUEVO) # normativa_chile.md — referencia MTT / SENCE / edad / certificados
│   ├── eval\
│   │   └── compliance_check.md  # Matriz de validación del Critic Loop (ver punto 5.2)
│   └── io\
│       └── facade_contracts.md  # La IA razona vía Facades existentes (EnrollmentFacade…), no SQL crudo
├── skills\
│   ├── context_onboarding.md    # Onboarding DUAL: destilar del código + entrevistar lo no codificado
│   ├── interview_guide.md       # Guía de entrevista (sede → lenguaje → flujos → excepciones/normativa)
│   └── sync_knowledge.md        # Comando /sync + mantener punteros del CODE_MAP sincronizados
└── task\
    └── TASK_INDEX.md            # Tareas concretas derivadas de los dolores
```

---

## 5. Las 3 adaptaciones clave respecto al framework base

El framework base nació "en blanco" y para un rubro distinto. Estas son las tres cosas que cambiamos para autoescuela:

### 5.1 `CODE_MAP.md` + Regla de Punteros (fuente de verdad mixta)
Como Autoescuela ya tiene el conocimiento codificado, el agente **no duplica** todo: mantiene un mapa de punteros al código real. Cuando afirma una regla de negocio, la respalda con una cita tipo `indices/DATABASE.md:67` o el nombre de una migración/facade. Así evitamos que la doc del agente se desincronice del producto.

### 5.2 `compliance_check` en dos capas (la normativa advierte, no bloquea)
La matriz de validación se divide en:
- **Invariantes de integridad** → *bloquean* (ej: Triple Match incompleto, doble-booking de instructor/vehículo, agendar un vehículo en mantenimiento).
- **Advertencias normativas** → *advierten y citan la norma* (ej: alumno menor de 17, SOAP vencido, más clases/día que el máximo MTT).

Esto cumple la decisión de que la normativa dé **avisos claros**, no que frene la operación.

### 5.3 Onboarding dual (destilar + entrevistar)
A diferencia del framework anterior, acá el agente arranca con material. La skill de onboarding primero **destila lo que ya está en el código** hacia sus specs, y luego **entrevista al equipo** solo sobre lo que *no* está codificado (lo que aparece en las reuniones: flujo de pruebas escritas por email, "concepto" vs nota en evaluaciones, opción de horario "bloque", etc.).

### Resumen del mapeo

| Pieza del framework base | Adaptación autoescuela | Cambio de fondo |
|---|---|---|
| `identity.md` (Rol anterior) | Consultor de Operaciones de Autoescuela | Nuevas entidades y Critic Loop |
| Discovery Gate | Igual + **Regla de Punteros** | Citar `ruta:línea` del código real |
| `DOMAIN_GLOSSARY` (LPN, SKU…) | Triple Match, Clase B/Prof, SENCE… | Cada término con puntero al código |
| `PAIN_LOG` (extraído en blanco) | Sembrado desde reuniones/auditorías | Ya hay dolores documentados |
| — | **`CODE_MAP.md`** (nuevo) | Espina dorsal de la verdad mixta |
| `compliance_check` (todo bloquea) | **2 capas**: bloqueo vs advertencia | La normativa advierte y cita |
| — | **`specs/regulatory/`** (nuevo) | Capa legal chilena explícita |
| `context_onboarding` (en blanco) | **Onboarding dual** | Destila código + entrevista lo faltante |

---

## 6. Cómo se usaría (día a día del equipo)

1. Abrís `d:\Autoescuela_agent` con la herramienta de IA.
2. La IA lee sus guardrails y sus índices **antes** de responder (obligatorio).
3. Le preguntás algo de negocio ("¿qué pasa si una secretaria intenta agendar la 4ª clase del día a un alumno?") y responde con la regla real, citando dónde vive.
4. Si descubrimos una regla nueva en una reunión, se la decimos y **ella misma la escribe** en el spec correspondiente (no se queda en el chat).

---

## 7. Decisión pendiente: ¿cómo arrancamos?

- **(A) Esqueleto completo + sembrado** — se crean todos los archivos y además `DOMAIN_GLOSSARY`, `PAIN_LOG`, `CODE_MAP` y `compliance_check` ya vienen **rellenos** con lo extraído del código. El agente nace útil.
- **(B) Solo esqueleto** — estructura + identity/guardrails/skills; glosario y dolores se llenan después en una sesión de onboarding.
- **(C) Ajustar primero** — revisamos nombres/carpetas/alcance antes de escribir nada.

**Recomendación:** opción **(A)**. Ya hay material sólido en el código para que el agente arranque con valor real en vez de vacío.
```

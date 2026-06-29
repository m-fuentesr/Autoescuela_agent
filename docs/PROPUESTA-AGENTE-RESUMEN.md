# Propuesta: Agente Consultor de Dominio para Autoescuela (resumen)

> **Para:** equipo de desarrollo · **Estado:** propuesta a revisar antes de construir.

## 1. Qué es
Un **"cerebro" en archivos Markdown** que le da a una IA el modelo mental correcto del **negocio de una autoescuela chilena**. No es código del producto: es la documentación viva y estructurada del negocio, en un formato que la IA está obligada a leer y respetar antes de opinar.

Está basado en un framework que ya funciona (`D:\Sys_bodega_agent`, un consultor de bodega). Lo adaptamos al rubro autoescuela.

**Filosofía heredada:** (1) **Cero alucinaciones** — si no tiene la regla, la pregunta o la cita; nunca la inventa. (2) **Spec-Driven** — el conocimiento vive en archivos, no en el chat. (3) **Critic Loop** — valida su propia idea contra una matriz de reglas antes de mostrártela. (4) **Escritura activa** — entrevista al equipo y redacta ella misma la doc faltante.

## 2. Decisiones ya tomadas
| Decisión | Definición |
|---|---|
| **Rol** | Consultor de la **operación del negocio** (matrículas, agenda, caja, flota, normativa, KPIs), no de código. |
| **Audiencia** | El **equipo de desarrollo** — nos da el modelo mental del negocio mientras construimos. |
| **Fuente de verdad** | **Mixta con punteros**: specs propias + **citas `archivo:línea` al código real** de `D:\Autoescuela`. Nunca inventa: o la tiene escrita, o la cita. |
| **Normativa chilena** | La emite como **advertencias claras y citadas** (edad, MTT, SENCE, certificados, SOAP), **no como bloqueos**. |

## 3. El dominio que debe dominar
Autoescuela ya es un producto maduro (Angular + Supabase, ~85 tablas); el agente se apoya en eso. Núcleo:
- **Triple Match** (regla central): clase válida solo si están disponibles a la vez **alumno + instructor + vehículo**.
- **Matrícula**: wizard de 6 pasos, en canal **presencial** y **público online** (pago Transbank).
- **Dos academias**: **Clase B** (12 prácticas, carnet 6/12, asistencia, exámenes) y **Profesional** (promociones, relatores A2-A5, convalidaciones, libro de clases, módulos MTT 10-100).
- **Finanzas**: cuadratura de caja, egresos operacionales vs estructurales, SII, servicios especiales, cursos SENCE.
- **Multi-sede** (Azul/Roja), **flota**, **certificados** (prueba legal), tareas internas.
- **Regulatorio CL**: edad mínima 17, autorización notarial de menores, máx. clases/día MTT, vigencia de documentos de flota.

## 4. Estructura de archivos
```text
d:\Autoescuela_agent\
├── .agent\identity.md            # Rol "Consultor de Operaciones de Autoescuela" + Critic Loop
├── .claude\CLAUDE.md             # Guardrails: Discovery Gate · Architect Guard · Real-Time Sync · Regla de Punteros
├── indices\
│   ├── DOMAIN_GLOSSARY.md         # Lenguaje ubicuo (Triple Match, Clase B/Prof, SENCE, Cuadratura…)
│   ├── PAIN_LOG.md                # Dolores operativos reales
│   ├── BACKLOG.md                 # Requerimientos futuros
│   └── CODE_MAP.md  (NUEVO)       # Dónde vive cada cosa del negocio en D:\Autoescuela
├── specs\
│   ├── blueprints\                # Procesos paso a paso (matrícula, agenda, cuadratura…)
│   ├── domain\                    # Políticas duras del negocio (no estatales)
│   ├── regulatory\ (NUEVO)        # normativa_chile.md (MTT/SENCE/edad/certificados)
│   ├── eval\compliance_check.md   # Matriz del Critic Loop (ver punto 5)
│   └── io\facade_contracts.md     # Razona vía Facades, no SQL crudo
├── skills\
│   ├── context_onboarding.md      # Onboarding dual (destilar código + entrevistar)
│   ├── interview_guide.md         # Guía de entrevista
│   └── sync_knowledge.md          # /sync + mantener punteros
└── task\TASK_INDEX.md             # Tareas derivadas de los dolores
```

## 5. Las 3 adaptaciones clave (vs el framework de bodega)
1. **`CODE_MAP.md` + Regla de Punteros** — como el conocimiento ya está en el código, el agente no lo duplica: lo cita (`DATABASE.md:67`, una migración, un facade). Evita que su doc se desincronice del producto.
2. **`compliance_check` en 2 capas** — **invariantes de integridad** que *bloquean* (Triple Match incompleto, doble-booking) vs **advertencias normativas** que *avisan y citan la norma* (menor de 17, SOAP vencido, exceso de clases/día). Cumple que la normativa avise, no frene.
3. **Onboarding dual** — el agente arranca con material: primero **destila lo que ya está en el código**, y luego **entrevista al equipo** solo sobre lo no codificado (pruebas por email, "concepto" vs nota, horario "bloque"…).

## 6. Cómo se usaría
Abrís `d:\Autoescuela_agent` con la IA → lee sus índices antes de responder → le preguntás algo de negocio y responde con la regla real, citando dónde vive → si surge una regla nueva, ella misma la escribe en el spec (no se queda en el chat).

## 7. Decisión pendiente: cómo arrancar
- **(A)** Esqueleto completo **+ sembrado** (glosario, dolores, code-map y compliance ya rellenos con lo extraído del código). El agente nace útil. ← **recomendado**
- **(B)** Solo esqueleto; glosario/dolores se llenan después en onboarding.
- **(C)** Ajustar nombres/alcance antes de escribir.

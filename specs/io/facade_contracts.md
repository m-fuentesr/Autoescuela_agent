# Spec: Contratos de Facade (Aislamiento de Sistemas)

Para respetar el rigor del producto, el agente tiene **PROHIBIDO** asumir o sugerir interacción directa con la base de datos (SQL crudo) o con `SupabaseService` desde la UI. En Autoescuela, **el Facade es el único punto de entrada** permitido para que la UI hable con el dominio.

> Esto NO significa que el agente escriba código. Significa que, cuando razone sobre cómo se obtiene o muta un dato, debe pensar en términos del **Facade** correcto, citando `indices\FACADES.md`, no en términos de queries sueltas.

## Ley arquitectónica del producto (resumen)
- La UI **nunca** inyecta `SupabaseService` ni hace `.from('tabla')` directo.
- Todo dominio tiene su `*.facade.ts` en `core/facades/` que centraliza estado (Signals) y es el único que llama a Supabase.
- Lógica algorítmica pesada → **funciones puras** en `core/utils/` (Functional Core), testeables sin Angular.
  → código: `.claude/rules/facades.md`, `.claude/rules/architecture.md`.

## Facades clave por dominio (mapa de razonamiento)

| Si la pregunta es sobre… | Razona vía este Facade | Puntero |
|---|---|---|
| Matrícula (wizard) | `EnrollmentFacade` (+ `EnrollmentDocumentsFacade`, `EnrollmentPaymentFacade`) | `FACADES.md:12-14` |
| Agenda / Triple Match | `AgendaFacade` | `FACADES.md:18` |
| Base de alumnos | `AdminAlumnosFacade` / `AdminAlumnoDetalleFacade` | `FACADES.md:15,21` |
| Pagos / deudores | `PagosFacade` | `FACADES.md:39` |
| Cuadratura de caja | `CuadraturaFacade` / `HistorialCuadraturasFacade` | `FACADES.md:44-48` |
| Cursos singulares (SENCE) | `CursosSingularesFacade` | `FACADES.md:49` |
| Flota | `FlotaFacade` / `FlotaDetalleFacade` | `FACADES.md:22,25` |
| Profesional (notas/asistencia/libro) | `EvaluacionesProfesionalFacade` / `AsistenciaProfesionalFacade` / `LibroDeClasesFacade` | `FACADES.md:31,17,33` |
| Sede activa (multi-sede) | `BranchFacade` | `FACADES.md:27` |
| Tareas internas | `TasksFacade` | `FACADES.md:51` |
| Instructor (portal) | `InstructorClasesFacade` / `InstructorAlumnosFacade` | `FACADES.md:29-30` |

## Operaciones que NO pasan por Facade (service role)
Algunos flujos sensibles corren en **Edge Functions** con service role (bypass RLS), no en Facades:
- Matrícula pública online → `public-enrollment` (`DATABASE.md:108`).
- Crear secretaria/instructor → `create-secretary`/`create-instructor` (`DATABASE.md:104-106`).
- Generación de PDFs (contrato, carnet, libro) → Edge Functions `generate-*`.

## Transformación de errores (cómo debe hablar el agente)
Cuando un flujo pueda fallar, el agente debe razonar como el producto:
- Errores de BD se **sanitizan** a mensajes amigables vía `db-error.utils` (`toFriendlyDbMessage`).
- Reglas duras de BD se expresan como excepciones (ej: `CUPOS_AGOTADOS` del trigger `trg_standalone_capacity`) que la UI traduce.
  → código: `CursosSingularesFacade` (`FACADES.md:49`).

> **Regla para el agente:** si el equipo pregunta "¿de dónde sale este dato?" o "¿cómo se guarda esto?", responde nombrando el **Facade** (o la Edge Function) responsable y su puntero, nunca una query SQL inventada.

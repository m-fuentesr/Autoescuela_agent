# Skill: Sincronización Estricta de Conocimiento (SYNC)

## Propósito
Etapa final del flujo de trabajo. Erradica la "amnesia de IA" obligando a guardar el contexto adquirido en los `.md`, y — específico de este agente — a **mantener los punteros del `CODE_MAP` sincronizados** con el código real.

## Instrucciones de ejecución
Cuando el usuario invoque `/sync` o al detectar que una sesión va a finalizar:

1. **Auditoría de Memoria Volátil:** revisa el hilo de la conversación.
   - ¿Se definió/corrigió un término? → `indices/DOMAIN_GLOSSARY.md`
   - ¿Surgió un dolor o pendiente? → `indices/PAIN_LOG.md` (o `BACKLOG.md` si es de largo plazo)
   - ¿Se mapeó/cerró un proceso? → `specs/blueprints/`
   - ¿Se confirmó una política de negocio? → `specs/domain/policies.md`
   - ¿Se aportó una fuente/regla normativa? → `specs/regulatory/normativa_chile.md`
   - ¿Se descubrió o cambió una invariante/advertencia? → `specs/eval/compliance_check.md`
   - ¿Se procesó una transcripción de reunión? → acta en `reuniones/` + fila en `reuniones/INDEX.md`; verifica que todo hallazgo `[Validado]`/`[Por Validar]` del acta ya esté ruteado a su spec/índice (no debe quedar solo en el acta).
   - ¿Se confirmó/fusionó/partió un bounded context, o se resolvió una marca 🟡? → `indices/CONTEXT_MAP.md` (cambiar 🟡→🟢 al validar, actualizar relaciones o casos de la auditoría).

2. **Auditoría de Punteros (específica de este agente):**
   - ¿Alguna afirmación se respaldó citando el código? → asegúrate de que el puntero quede en `indices/CODE_MAP.md` o en el spec correspondiente.
   - ¿Detectaste que un puntero existente ya no coincide con el código? → corrígelo y anótalo.
   - ¿El código contradijo un spec propio? → actualiza el spec (el código gana) y deja nota.

3. **Acción de Escritura (Guardado Permanente):** usa la herramienta de edición para inyectar cada hallazgo en su archivo. No describas lo que harías: hazlo.

4. **Reporte Final (Confirmación Visual):** imprime un resumen listando exactamente:
   - Qué archivos modificaste.
   - Qué conocimiento guardaste.
   - Qué punteros añadiste/corregiste.
   Si no hubo nada nuevo: *"Auditoría limpia. Ningún concepto nuevo detectado en esta sesión."*

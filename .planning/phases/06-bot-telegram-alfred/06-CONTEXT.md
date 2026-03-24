# Phase 6: Bot Telegram Alfred - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

El bot Alfred tiene la infraestructura de memoria y endpoints correctos para operar como AI Agent funcional.

**Importante — estado del codebase:** La mayor parte de la infraestructura del bot ya existe desde v1.0. El planner DEBE auditar el código existente antes de crear tareas nuevas.

Lo que ya está construido y NO necesita rehacerse:
- `GET /api/webhook/clientes` — acepta `nombre`, `telefono`, `gj_id`; retorna `id`, `gj_id`, `nombre`, `estado`, `visas[]`, `pagos[]` via `select('*, visas(...), pagos(...)')` ✅ BOT-02 satisfecho
- `POST /api/webhook/clientes` — crear cliente vía bot ✅
- `GET /api/webhook/visas` + `PATCH /api/webhook/visas` — buscar y actualizar visas ✅
- `POST /api/webhook/pagos` — registrar pagos ✅
- `GET /api/webhook/resumen` — resumen operativo ✅
- `agente_gojulito.json` — flujo n8n completo con AI Agent, Tools, Postgres Chat Memory (`memoryPostgresChat` v1.3) ✅

Lo que FALTA (único gap real):
- Tabla `telegram_historial` en la DB (BOT-01) — sin esta tabla, el nodo `Postgres Chat Memory` no puede arrancar
- Documentación de setup para n8n (BOT-03) — `docs/` existe pero está vacío

</domain>

<decisions>
## Implementation Decisions

### Migración — telegram_historial

- **D-01:** Crear migración `003_create_telegram_historial.sql` en `database/migrations/` con el schema exacto que requiere n8n `memoryPostgresChat` v1.3:

  ```sql
  CREATE TABLE IF NOT EXISTS telegram_historial (
    id        BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    message   JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS idx_telegram_historial_session_id
    ON telegram_historial (session_id);
  ```

  - `session_id` = Telegram `chat.id` (el nodo usa `customKey` mapeado al chat ID del trigger)
  - `message` JSONB = mensaje completo serializado por el nodo de n8n (no hay que definir su estructura desde código)
  - Index en `session_id` para queries por conversación (n8n consulta por sesión para recuperar historial)
  - El nodo `memoryPostgresChat` v1.3 en `agente_gojulito.json` usa `tableName: "telegram_historial"` — nombre exacto, no cambiar

- **D-02:** NO agregar columnas adicionales. n8n gestiona esta tabla directamente — columnas extra pueden causar errores de inserción.

### Endpoint GET /api/webhook/clientes — sin cambios

- **D-03:** El endpoint ya satisface BOT-02 completamente. El planner debe **verificar** pero no modificar:
  - Acepta `?nombre=`, `?telefono=`, `?gj_id=` ✅
  - Retorna `{ clientes: [...] }` donde cada cliente incluye `id`, `gj_id`, `nombre`, `estado` (via `*`) + `visas[]` + `pagos[]` ✅
  - El sistema prompt del agente usa `visas[0].visa_id` y `id` — ambos presentes en la respuesta actual ✅

### Documentación n8n setup

- **D-04:** Crear `docs/n8n-alfred-setup.md` (directorio `docs/` existe y está vacío).

  Contenido requerido (BOT-03 lo define como "pasos para importar agente_gojulito.json en n8n y configurar credenciales"):
  1. Prerequisitos (n8n con acceso a la DB + bot de Telegram ya creado en BotFather)
  2. Aplicar migración `003_create_telegram_historial.sql` en Supabase SQL Editor
  3. Importar `Gojulitofiles/agente_gojulito.json` en n8n (Import from file)
  4. Configurar credencial **PostgreSQL** (`gojulitotestev1`) — host, DB, user, password de Supabase
  5. Configurar credencial **Telegram Bot** (`gojulito_bot`) — token del bot
  6. Configurar credencial **OpenAI** — API key (para transcripción de audio y LLM)
  7. Configurar `GOJULITO_API_KEY` en cada nodo HTTP Request (herramientas del agente) — header `x-api-key`
  8. Activar el workflow

- **D-05:** La documentación va en español. Formato: markdown con pasos numerados y notas de variables de entorno.

### Claude's Discretion

- Estructura interna del documento (secciones, subtítulos dentro de cada paso)
- Si incluir un snippet de SQL de verificación (`SELECT * FROM telegram_historial LIMIT 1`) para confirmar que la migración fue aplicada correctamente

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Código existente a auditar antes de planear

- `app/api/webhook/clientes/route.ts` — GET endpoint a verificar (no modificar)
- `app/api/webhook/visas/route.ts` — patrón de referencia para webhook handlers
- `database/migrations/002_add_activo_seminarios.sql` — formato de migraciones existente
- `Gojulitofiles/agente_gojulito.json` — flujo n8n completo: nodo `Postgres Chat Memory` usa `tableName: "telegram_historial"`, `typeVersion: 1.3`, credencial `gojulitotestev1`

### Patrones de referencia

- `lib/auth-m2m.ts` — `validateApiKey()` requerido en todos los webhook routes
- `database/migrations/` — directorio de migraciones (archivos SQL planos, numerados, sin ORM)

### No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `validateApiKey(req)` en `lib/auth-m2m.ts` — ya aplicado en todos los webhook routes
- `createServiceRoleClient()` en `lib/supabase/server.ts` — usado en todos los webhook handlers
- Formato de migración: `-- Migración: [descripción]\n-- Ejecutar en Supabase SQL Editor\n\n[SQL]`

### Established Patterns

- Webhook routes: `validateApiKey` guard → parse params → query Supabase → return JSON
- Migraciones: archivos `.sql` numerados en `database/migrations/`, sin frameworks de migración
- Historial: INSERT-only después de operaciones de escritura (no aplica para esta fase — solo infra)

### Integration Points

- n8n `memoryPostgresChat` v1.3 → Supabase DB → tabla `telegram_historial` (la migración crea el puente)
- Webhook routes existentes → agente n8n (las tools del agente usan estos endpoints via HTTP Request)
- `docs/n8n-alfred-setup.md` → operador humano (Julio) para configurar n8n en producción

</code_context>

<specifics>
## Specific Ideas

- El nodo `Postgres Chat Memory` en el JSON usa `sessionKey: "={{ $('Telegram Trigger').item.json.message.chat.id }}"` — esto se mapea al `session_id` de la tabla. El `chat.id` de Telegram es un número, se guarda como TEXT en Postgres (OK).
- `contextWindowLength: 20` — guarda las últimas 20 entradas por sesión. La tabla crecerá con el tiempo; no hay cleanup automático en scope.
- La credencial de PostgreSQL en el JSON usa `id: "CMXFQs4C0p2xTkc4", name: "gojulitotestev1"` — el doc de setup debe indicar que hay que reasignar esta credencial al importar el JSON (n8n no transfiere credenciales entre instancias).
- Las HTTP Request tools del agente usan el header `x-api-key` con el `N8N_API_KEY` de GoJulito — el doc debe indicar dónde encontrar ese valor (`.env.local`: `N8N_API_KEY`).

</specifics>

<deferred>
## Deferred Ideas

- Cleanup automático de `telegram_historial` (borrar entradas viejas por sesión) — fuera de scope; volumen actual es bajo.
- Autenticación de Telegram (validar que solo Julio puede usar el bot) — el bot ya está configurado privado; validación adicional diferida.
- BOT-F01/BOT-F02: consultar y agregar asistentes de seminario vía bot — requerimientos futuros en REQUIREMENTS.md, no en v1.2.

</deferred>

---

*Phase: 06-bot-telegram-alfred*
*Context gathered: 2026-03-24*

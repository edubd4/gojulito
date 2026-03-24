# Phase 4: Seminarios — Core - Context

**Gathered:** 2026-03-23
**Updated:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

El admin puede gestionar ediciones de seminario: crear con ID SEM-YYYY-NN via RPC, editar datos, listar, y marcar como inactivo (soft delete).

**Importante — estado del codebase:** Gran parte de Phase 4 ya existe desde v1.0. La única funcionalidad faltante para cumplir los success criteria es el **soft delete (marcar inactivo)**. El planner debe auditar el código existente antes de crear tareas nuevas.

Lo que ya está construido y NO necesita rehacerse:
- `POST /api/seminarios` — crea con SEM-YYYY-NN via RPC ✅
- `PATCH /api/seminarios/[id]` — edita fecha, precio, modalidad, notas ✅
- `GET /api/seminarios` y `GET /api/seminarios/[id]` ✅
- `NuevoSeminarioModal` — formulario de creación completo ✅
- `EditarSeminarioModal` — formulario de edición completo ✅
- `SeminariosPage` (`/seminarios`) — lista con `SeminarioCard` ✅
- Página de detalle (`/seminarios/[id]`) con stats y tabla de asistentes ✅

Lo que FALTA:
- Campo `activo boolean default true` en tabla `seminarios` (migración)
- Botón "Marcar inactivo" en la página de detalle
- Filtrar `activo = true` en la query de la lista
- `PATCH /api/seminarios/[id]` ya existe — agregar soporte para `{ activo: false }`
- Entrada en `historial` al inactivar
- Redirect a `/seminarios` tras confirmar

</domain>

<decisions>
## Implementation Decisions

### Soft Delete — Ubicación de la acción

- **D-01:** El botón "Marcar inactivo" va en la **página de detalle** (`/seminarios/[id]`), no en el `SeminarioCard` de la lista.
  - Razón: `SeminarioCard` ya tiene hover effects y actúa como link — agregar acciones destructivas ahí es un riesgo UX (activación accidental).
  - **Nota:** El success criterion 3 del ROADMAP dice "desde la lista" — es un error en el roadmap. La decisión correcta es la página de detalle (decisión confirmada por el usuario 2026-03-23).

### Soft Delete — Visibilidad de inactivos

- **D-02:** Los seminarios inactivos **desaparecen de la lista** por defecto. No se muestran con badge ni indicador visual.
  - Implementación: filtrar `activo = true` en la query de `SeminariosPage`.
  - Mismo patrón que clientes (campo `activo boolean`, filtrado silencioso).
  - No hay toggle "mostrar inactivos" — los inactivos simplemente no aparecen.

### Soft Delete — Confirmación

- **D-03:** Requerir **diálogo de confirmación** antes de inactivar.
  - Razón: los seminarios tienen asistentes asociados — el usuario necesita confirmar que entiende el impacto.
  - Patrón: inline modal custom (mismo patrón que `ConfirmModal` en `ClientesTable.tsx:130`) — overlay fixed, card centrado, texto de confirmación, botones "Cancelar" y "Confirmar".
  - NO usar `window.confirm()`. NO crear un nuevo componente global — implementarlo inline en el componente del botón.

### API — Soft Delete endpoint

- **D-04:** Reutilizar `PATCH /api/seminarios/[id]` agregando soporte para `{ activo: false }` en el body.
  - No crear un endpoint DELETE separado.
  - El route handler ya existe — solo agregar `if ('activo' in body) update.activo = body.activo`.

### Migración de DB

- **D-05:** Crear migración `002_add_activo_seminarios.sql` en `database/migrations/`.
  - Agregar `activo boolean NOT NULL DEFAULT true` a la tabla `seminarios`.
  - Actualizar `lib/supabase/types.ts` para incluir `activo: boolean` en el Row de seminarios.

### Historial al inactivar

- **D-06:** Insertar entrada en `historial` después de marcar el seminario como inactivo.
  - Campos: `tipo: 'CAMBIO_ESTADO'`, `descripcion: 'Seminario marcado como inactivo'`, `origen: 'dashboard'`, `usuario_id: user.id`.
  - Aplica la regla de CLAUDE.md: siempre insertar en historial después de cambios de estado importantes.
  - El `seminario_id` equivalente debe anotarse en `descripcion` o en el campo de referencia disponible.

### Post-inactivación — Navegación

- **D-07:** Redirigir a `/seminarios` (lista) después de confirmar la inactivación.
  - Razón: el seminario ya no existe en la vista del usuario — no tiene sentido quedarse en la página de detalle.
  - Implementación: `router.push('/seminarios')` desde el componente cliente del botón.

### Response shape — POST /api/seminarios

- **D-08:** Mantener `{ success: true, seminario }` en `POST /api/seminarios` — no cambiar en esta fase.
  - Razón: el patrón está establecido y funciona. Estandarizar a `{ data, error }` queda para un milestone de refactor posterior.

### Claude's Discretion

- Texto exacto del mensaje de confirmación — algo como "¿Marcar este seminario como inactivo? Tiene X asistentes registrados. No aparecerá más en la lista."
- Posicionamiento del botón dentro del header de la página de detalle (junto a "Editar seminario" o separado visualmente).
- Color/estilo del botón de inactivar — rojo suave o gris, consistente con el diseño existente.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Código existente a auditar antes de planear

- `app/(dashboard)/seminarios/page.tsx` — lista de seminarios (agregar filtro activo)
- `app/(dashboard)/seminarios/[id]/page.tsx` — detalle (agregar botón inactivar + redirect)
- `app/api/seminarios/[id]/route.ts` — PATCH endpoint (extender para activo)
- `components/seminarios/SeminarioCard.tsx` — card de lista (no modificar)
- `components/clientes/ClientesTable.tsx:130` — patrón `ConfirmModal` a replicar

### Patrones de referencia

- `lib/supabase/types.ts` — agregar `activo: boolean` a seminarios Row
- `database/migrations/001_add_modalidad_ambas.sql` — formato de migraciones existente

### No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `ConfirmModal` (`components/clientes/ClientesTable.tsx:130`) — inline modal pattern: overlay fixed, card centrado, botones Cancelar/Confirmar
- Header action area en `/seminarios/[id]` — ya tiene `<div style={{ display: 'flex', gap: 10 }}>` con `EditarSeminarioModal` y `AgregarAsistenteModal` — el botón inactivar va aquí
- `router.push()` — patrón de navegación client-side ya en uso en modales

### Established Patterns

- Soft delete con campo `activo boolean` — mismo patrón que `clientes` y `visas`
- Historial INSERT: `tipo`, `descripcion`, `origen`, `usuario_id` — ver handlers existentes de visas/clientes
- Query filter `activo = true` — ver `clientes` page para el patrón

### Integration Points

- `SeminariosPage` query: agregar `.eq('activo', true)` al select
- PATCH handler: agregar bloque `if ('activo' in body) update.activo = body.activo`
- Detalle page: agregar componente cliente (botón + modal + redirect)

</code_context>

<specifics>
## Specific Ideas

- El texto de confirmación debe mencionar cuántos asistentes tiene el seminario para contextualizar el impacto.
- El redirect post-inactivación va a `/seminarios` (no a `/dashboard/seminarios` — el route group `(dashboard)` no agrega segmento a la URL).

</specifics>

<deferred>
## Deferred Ideas

- Estandarizar `POST /api/seminarios` a `{ data, error }` — para milestone de refactor posterior (v1.2 o posterior).
- Toggle "mostrar inactivos" en la lista — fuera de scope de esta fase.

</deferred>

---

*Phase: 04-seminarios-core*
*Context gathered: 2026-03-23*
*Context updated: 2026-03-23*

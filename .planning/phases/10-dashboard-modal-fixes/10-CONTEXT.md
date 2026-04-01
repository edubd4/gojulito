# Phase 10: Dashboard & Modal Fixes — Context

**Gathered:** 2026-03-31
**Status:** Ready for planning
**Source:** /gsd-discuss-phase 10

<domain>
## Phase Boundary

Esta phase arregla 3 problemas independientes:
1. **DB bug**: Las vistas `v_turnos_semana` y `v_deudas_proximas` no retornan `cliente_id` ni aliases correctos — todos los links del dashboard van a `href="#"` (rotos).
2. **Dashboard UX**: Después del DB fix, agregar interactividad diferenciada por columna en las dos tablas.
3. **Modal UX**: El select de cliente existente en NuevoTramiteModal queda como listbox abierto porque tiene `size={Math.min(5, clientesFiltrados.length + 1)}`.

</domain>

<decisions>
## Implementation Decisions

### DB-01 — Recrear vistas Supabase
- Usar Supabase MCP `apply_migration` para recrear ambas vistas
- `v_turnos_semana` debe retornar: `visa_id, v.cliente_id, c.gj_id, c.nombre AS nombre_cliente, c.telefono, v.fecha_turno, v.estado AS estado_visa`
- `v_deudas_proximas` debe retornar: `p.pago_id, p.cliente_id, c.gj_id, c.nombre AS nombre_cliente, c.telefono, p.monto, p.fecha_vencimiento_deuda, p.fecha_vencimiento_deuda - CURRENT_DATE AS dias_restantes`
- Las interfaces TypeScript en `app/(dashboard)/page.tsx` ya tienen `cliente_id` y `nombre_cliente` — la corrección es en la DB, no en el código

### DASH-01 — Fecha en tabla Turnos
- Click en columna Fecha navega a `/calendario` (mes actual, sin parámetro de fecha específica)
- La columna Cliente sigue linkeando a `/clientes/{cliente_id}`
- Cambio mínimo: modificar el `href` del `<Link>` de la fecha

### DASH-02, DASH-03 — Popups en tabla Deudas
- `page.tsx` es un Server Component — para agregar popups (estado client) se extrae la tabla Deudas a un componente client separado: `components/dashboard/DeudaTableClient.tsx`
- `page.tsx` le pasa `deudas: DeudaProxima[]` como prop; el cliente maneja el estado de los popups
- **Popup Cliente** (columna nombre): card flotante centralizada (tipo modal pequeño) con nombre, gj_id, y botón "Ver ficha" → `href="/clientes/{cliente_id}"`
- **Popup Deuda** (columna monto): card flotante centralizada con: pago_id, monto formateado, fecha de vencimiento, y botón "Ver pagos" → `href="/pagos"` (no hay ruta filtrada por cliente)
- Los popups se cierran al hacer click fuera (overlay invisible)
- Estilo: igual a los popups del calendario (`TurnoPopup`) — bg-gj-card, border border-white/[12%], rounded-[14px], boxShadow

### DASH-04 — Fecha de vencimiento en tabla Deudas
- Click en columna Vence navega a `/calendario`
- Implementado como `<Link href="/calendario">` dentro de `DeudaTableClient`

### MODAL-01 — Fix dropdown NuevoTramiteModal
- Archivo: `components/visas/NuevoTramiteModal.tsx`, ~línea 388
- Causa exacta: `size={Math.min(5, clientesFiltrados.length + 1)}` hace que el `<select>` se renderice como listbox permanente
- Fix: eliminar el atributo `size` completamente → el `<select>` vuelve a ser un dropdown nativo que se cierra tras seleccionar
- No hay que cambiar nada más — el `onChange` y el estado `clienteId` ya funcionan bien

### the agent's Discretion
- Diseño exacto de los popups (spacing, iconos) — seguir el mismo patrón de TurnoPopup en CalendarioView.tsx
- Si poner hover styles en las celdas clickeables de las tablas — sí, agregar `cursor-pointer` y hover sutil
- Cuándo mostrar el cursor pointer en las celdas — siempre que sea clickeable

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Dashboard (Server Component)
- `app/(dashboard)/page.tsx` — página principal del dashboard; contiene las tablas de Turnos y Deudas; interfaces TypeScript `TurnoSemana` y `DeudaProxima`

### Componente de popup de referencia
- `components/calendario/CalendarioView.tsx` — `TurnoPopup` es el patrón a seguir para el diseño de los popups de cliente y deuda

### Modal con el dropdown roto
- `components/visas/NuevoTramiteModal.tsx` — el select con `size={Math.min(5,...)}` está alrededor de la línea 384-396

### Vistas a recrear
- Vistas DB: `v_turnos_semana` y `v_deudas_proximas` en Supabase proyecto `ixonzhjorzjcyyujzgel`

### Design System
- `CLAUDE.md` — tokens gj-*, convenciones de color y tipografía

</canonical_refs>

<specifics>
## Specific Ideas

- Los popups tienen overlay invisible (`fixed inset-0 z-[60]`) que cierra al click externo — mismo patrón que TurnoPopup
- El botón "Ver pagos" del popup de deuda puede ir a `/pagos` (página general)
- El botón "Ver ficha" del popup de cliente va a `/clientes/{cliente_id}`
- Los links de Fecha y Vence → `/calendario` usan `<Link href="/calendario">` de next/link
- En `DeudaTableClient`, el estado es: `clientePopup: DeudaProxima | null` y `deudaPopup: DeudaProxima | null`

</specifics>

<deferred>
## Deferred Ideas

- Navegación al mes específico en el calendario desde el dashboard (requiere parámetro de query en la página de calendario — fuera del scope de esta phase)

</deferred>

---
*Phase: 10-dashboard-modal-fixes*
*Context gathered: 2026-03-31 via /gsd-discuss-phase*

---
gsd_state_version: 1.0
milestone: v1.7
milestone_name: Financiamientos + Google Sheets + Estabilizacion final
status: en_progreso
last_updated: "2026-04-10T00:00:00.000Z"
progress:
  fase_actual: v1.7-A
  bugs_open: 0
  bugs_closed: 9
  fases_completadas: v1.6-A..C (BUG-05..07, F11-F17), v1.6-BUG-08 (delete clientes), v1.6-BUG-09 (calendario monto→nombre)
---

# Project State

## Project Reference

See: .planning/PROJECT.md

**Core value:** El admin puede ver en tiempo real el estado de todos sus clientes, visas y pagos desde un dashboard centralizado, sin perder datos por error operativo.
**Current focus:** v1.7 — Financiamientos, captura desde Google Sheets, entrega final

---

## Current Position

Milestone activo: **v1.7** — Financiamientos + Google Sheets (2026-04-10)
Milestone anterior: v1.6 — ✅ ESTABLE (bugs BUG-05..09 cerrados)

### Bugs cerrados en sesión 2026-04-10

| ID | Descripción | Fix |
|----|-------------|-----|
| BUG-08 | Delete clientes: lista no filtraba INACTIVO — cliente reaparecía tras soft-delete | `page.tsx` → añadir `.neq('estado', 'INACTIVO')` + `activo: false` en bulk-delete |
| BUG-09 | Calendario: chip de pago mostraba monto en lugar del nombre del cliente | `CalendarioView.tsx:617` → `{montoCompacto}` → `{p.cliente_nombre}` |

### Qué se deployó (último commit v1.6)
`fix(v1.6-A): BUG-05..07 — delete UX, seminario cards sin imagen, historial por fecha`

---

## Plan v1.7

### v1.7-A — Financiamientos: DB + API (próxima task)

Nuevo módulo que permite a Julio financiar vuelos, visas y viajes a sus clientes.

**Scope:**
- Migración SQL: tablas `financiamientos` + `cuotas_financiamiento`
- API routes: GET/POST `/api/financiamientos`, GET/PATCH `/api/financiamientos/[id]`
- API cuotas: POST `/api/financiamientos/[id]/cuotas`, PATCH `/api/financiamientos/[id]/cuotas/[cuota_id]`
- Inserción en `historial` en cada cambio de estado

**TASK file:** `.planning/TASK-17A-financiamientos-db-api.md`

---

### v1.7-B — Financiamientos: UI

**Scope:**
- Sidebar: nuevo ítem "Financiamientos" (después de Pagos)
- `/financiamientos` — lista con buscador, filtros por estado/concepto, resumen de monto total y pendiente
- `/financiamientos/[id]` — detalle con tabla de cuotas, botón "Registrar pago" por cuota
- Integración en detalle de cliente (`/clientes/[id]`) — sección financiamientos

**TASK file:** `.planning/TASK-17B-financiamientos-ui.md`

---

### v1.7-C — Captura desde Google Sheets (n8n webhook)

**Scope:**
- Endpoint `/api/webhook/solicitud` — recibe datos del formulario y crea PROSPECTO cliente
- n8n workflow: trigger "Hoja de cálculo actualizada" → POST al endpoint → Telegram confirma
- El formulario de Sheets ya existe; solo hace falta conectar el canal

**TASK file:** `.planning/TASK-17C-google-sheets-webhook.md`

---

### v1.7-D — Estabilización final y entrega

**Scope:**
- Paginación server-side en clientes, trámites, pagos
- Responsive móvil completo (sidebar colapsable)
- Actualización `types.ts` con schema real (financiamientos + cuotas)
- README final + documentación para Julio

---

## Decisiones activas

- API routes sobre Server Actions
- Zod validation server-side only; `{ data, error }` en handlers
- Cascada FINALIZADO en lib/visas.ts
- 409 DUPLICATE_CLIENT shape inmutable (Telegram bot lo parsea)
- SEM IDs via RPC
- Bot endpoints siempre via API routes
- Todos los `<select>` nativos requieren `style={{ colorScheme: 'dark' }}`
- Seminarios: query usa `.or('activo.eq.true,activo.is.null')` — null tratado como activo
- Sistema de iconos: Material Symbols (Horizon Vista)
- **Clientes lista: `.neq('estado', 'INACTIVO')` — INACTIVO nunca aparece en lista principal**
- Soft-delete de clientes: sets `estado: 'INACTIVO'` + `activo: false`

## Pendientes conocidos (deuda técnica)

- Tech debt: `{ success: true }` en bulk-update/delete y PagosTable routes
- Sistema de estilos dual: tokens HV parcialmente aplicados
- Sin paginación en listas (v1.7-D)
- Focus rings ausentes en inputs (accesibilidad)
- `verificarAdmin` no es helper compartido

---
*Last updated: 2026-04-10*

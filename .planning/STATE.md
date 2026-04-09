---
gsd_state_version: 1.0
milestone: v1.6
milestone_name: Estabilizacion + Features Core
status: en_progreso
last_updated: "2026-04-09T14:00:00.000Z"
progress:
  fase_actual: v1.6-A
  bugs_open: 3
  bugs_closed: 4
---

# Project State

## Project Reference

See: .planning/PROJECT.md

**Core value:** El admin puede ver en tiempo real el estado de todos sus clientes, visas y pagos desde un dashboard centralizado, sin perder datos por error operativo.
**Current focus:** v1.5 — estabilizar post-redesign (bugs funcionales pendientes)

---

## Current Position

Milestone activo: **v1.6-A** — Bugs UX + Plan de fases completo (2026-04-09)
Milestone anterior: v1.5 Horizon Vista — ✅ ESTABLE (bugs BUG-01..04 cerrados)

### Qué se deployó

Commit: `feat(ux-ui): complete redesign phases F1-F5 — Horizon Vista design system`
Build time: 3m 31s — Estado Dokploy: ✅ Done

**Cambios incluidos:**
- Nuevo sistema de tipografía (Manrope + Inter)
- Tokens de color HV dark (reemplaza hex hardcodeados progresivamente)
- Iconografía Material Symbols
- Dashboard "Panel Central" — bento grid con métricas, chart semanal, próximas citas, próximo seminario
- Clientes — tabla redesignada con dropdowns inline de estado
- Trámites "Expedientes Activos" — chips de PROGRESO (DS-160/PAGO/CAS/EMBAJADA), date pickers inline
- Pagos — badges con dropdown de estado inline
- Sidebar — nuevas secciones "Soporte" y "Cerrar sesión" al fondo

---

## Bugs cerrados post-deploy v1.5 (2026-04-09)

| ID | Página | Bug | Prioridad | Estado | Commits |
|----|--------|-----|-----------|--------|---------|
| BUG-01 | Seminarios | "0 próximos · 0 en historial" — SELECT con columnas inexistentes + query `activo` | 🔴 Alta | ✅ Cerrado | d3dc4f2, 80ff7f4, 8892f91 |
| BUG-02 | Sidebar | Link "Soporte" → 404 | 🟡 Media | ✅ Cerrado | d3dc4f2 |
| BUG-03 | Dashboard | AccionesRapidas siguen visibles | 🟡 Media | ✅ Cerrado | d3dc4f2 |
| BUG-04 | Trámites | Métricas no filtran al click | 🟡 Media | ✅ Cerrado | d3dc4f2 |

Verificado en producción 2026-04-09 en `gojulito.automatizacionestuc.online`.

---

## Dato en BD a corregir

- Seminario `id = b87bee41...` tiene `nombre = "t6"` (dato de prueba). Aparece en el widget "Próximo Seminario" del dashboard. Renombrar en Supabase.

---

## Historial de milestones

| Versión | Nombre | Estado | Fecha |
|---------|--------|--------|-------|
| v1.0 | Core Operativo | ✅ shipped | 2026-03-21 |
| v1.1 | Core Hardening (fases 1-3) | ✅ shipped | 2026-03-22 |
| v1.2 | Canales y Operacion Avanzada (fases 4-9) | ✅ shipped | 2026-03-30 |
| v1.3 | UX Fixes (fase 10) | ✅ shipped | 2026-04-01 |
| v1.4 | Estabilizacion y Entrega | ✅ shipped local / ⚠️ parcial en prod | 2026-04-07 |
| v1.5 | Horizon Vista Design System | 🟡 UI deployada, bugs funcionales abiertos | 2026-04-08 |

---

## Fixes completados en v1.4 (2026-04-07) — estado real

| Fix | Descripcion | Local | Prod |
|-----|-------------|-------|------|
| FIX-01 | Dropdowns oscuros — `colorScheme: 'dark'` en ~46 selects | ✅ | ✅ |
| FIX-02 | Campo fecha_turno condicional en wizard paso 4 | ✅ | ✅ |
| FIX-A | Sidebar "Nuevo Cliente" abre modal | ✅ | ⚠️ Redesign cambió sidebar — revisar comportamiento nuevo |
| FIX-B | Dashboard sin AccionesRapidas | ✅ | ❌ No deployado (BUG-03) |
| FIX-C | Pago de deuda funcional | ✅ | ✅ |
| FIX-D | Seminarios visibles — `.or('activo.eq.true,activo.is.null')` | ✅ | ❌ No deployado (BUG-01) |
| FIX-E | Métricas de trámites clickeables con `?metric=` | ✅ | ❌ No deployado (BUG-04) |
| FIX-F | Ícono ⓘ en columna PROGRESO | ✅ | ⚠️ Redesign rediseñó PROGRESO con chips — equivalente funcional presente |

---

## Decisiones activas

- API routes sobre Server Actions
- Zod validation server-side only; `{ data, error }` en handlers
- Cascada FINALIZADO en lib/visas.ts
- 409 DUPLICATE_CLIENT shape inmutable (Telegram bot lo parsea)
- SEM IDs via RPC
- Bot endpoints siempre via API routes
- Todos los `<select>` nativos requieren `style={{ colorScheme: 'dark' }}` (2026-04-06)
- Seminarios: query usa `.or('activo.eq.true,activo.is.null')` — null tratado como activo (deployado 2026-04-09)
- Sistema de iconos: Material Symbols (Horizon Vista) — reemplaza lucide-react progresivamente
- Sidebar: "Soporte" y "Cerrar sesión" como nuevos items fijos al fondo

## Pendientes conocidos (deuda técnica)

- Tech debt: `{ success: true }` en bulk-update/delete y PagosTable routes (no es `{ data, error }`)
- Sistema de estilos dual: tokens HV parcialmente aplicados — migración incompleta
- Sin paginación en listas (clientes, tramites, pagos)
- Focus rings ausentes en inputs (accesibilidad)
- `verificarAdmin` no es helper compartido — inline en `api/usuarios/route.ts`
- Página `/ayuda` creada — link Soporte funcional (BUG-02 cerrado)
- Fases 11, 12, 14, 15, 16, 17 de v1.4 siguen pendientes (absorbidas en backlog)

---
*Last updated: 2026-04-09*

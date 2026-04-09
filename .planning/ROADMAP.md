# Roadmap: GoJulito

## Milestones

- ✅ **v1.0 Core Operativo** — Shipped 2026-03-21
- ✅ **v1.1 Core Hardening** — Phases 1-3 (shipped 2026-03-22)
- ✅ **v1.2 Canales y Operacion Avanzada** — Phases 4-9 (shipped 2026-03-30)
- ✅ **v1.3 UX Fixes** — Phase 10 (shipped 2026-04-01)
- ✅ **v1.4 Estabilizacion y Entrega** — FIX-01/02 + FIX-A..F (shipped local 2026-04-07 / parcial en prod)
- ✅ **v1.5 Horizon Vista Design System** — UI + bugs funcionales cerrados (2026-04-09)
- 🔲 **v1.6** — Formulario externo, notificaciones, búsqueda global (sin planificar)

---

## v1.5 — Horizon Vista Design System

**Goal:** Migrar el sistema visual al nuevo design system HV. Tipografía Manrope/Inter, tokens de color HV, iconografía Material Symbols, layouts redesignados por página.

**Commit:** `feat(ux-ui): complete redesign phases F1-F5 — Horizon Vista design system`
**Deploy:** 2026-04-08 — ✅ UI completa en producción

### Fases del redesign (F1-F5) — COMPLETADAS

| Fase | Descripción | Status |
|------|-------------|--------|
| F1 | Tokens de color y tipografía — sistema HV base | ✅ |
| F2 | Dashboard "Panel Central" — bento grid, métricas, chart, próximo seminario | ✅ |
| F3 | Sidebar — nueva estructura, Soporte + Cerrar sesión, iconos Material Symbols | ✅ |
| F4 | Tablas y listas — Clientes, Trámites, Pagos redesignados | ✅ |
| F5 | Chips de progreso — DS-160/PAGO/CAS/EMBAJADA en tabla de Trámites | ✅ |

### Bugs post-deploy v1.5 — todos cerrados (2026-04-09)

| ID | Prioridad | Descripción | Estado |
|----|-----------|-------------|--------|
| BUG-01 | 🔴 Alta | Seminarios muestra 0 — SELECT con columnas inexistentes + query `activo` | ✅ Cerrado |
| BUG-02 | 🟡 Media | `/soporte` → 404 — link muerto en sidebar | ✅ Cerrado |
| BUG-03 | 🟡 Media | AccionesRapidas siguen en dashboard | ✅ Cerrado |
| BUG-04 | 🟡 Media | Métricas de trámites no filtran al click | ✅ Cerrado |

### Pendiente v1.5 (no incluido en redesign)

- Fases 11, 12, 14, 15, 16, 17 de v1.4 — absorbidas en backlog v1.6+
- Dato BD: seminario `nombre = "t6"` — renombrar directamente en Supabase

---

## v1.4 — Estabilizacion y Entrega ✅

**Shipped local 2026-04-07. Parcialmente en prod (ver STATE.md).**

### Fase 13: Formularios — Dropdowns + Fecha Turno ✅

Plans:
- [x] 13-01-PLAN.md — FIX-01 colorScheme dark + FIX-02 fecha_turno condicional

### Fase 14-17 + 11-12: Pendientes → absorbidas en backlog

Las siguientes fases fueron planificadas para v1.4 pero no se completaron. Pasan al backlog de v1.6+:

| Fase | Descripción |
|------|-------------|
| 11 | Pagos — Pago Parcial (auto-calculo, toggle archivar remanente) |
| 12 | Calendario Visual (cap de chips, labels compactos) |
| 14 | Seminarios — Visibilidad + Responsive |
| 15 | Dashboard — Header + Chart interactivo |
| 16 | Tablas — Responsive + Badge CAS |
| 17 | Página de Ayuda con instrucciones por sección |

---

## v1.6 — Estabilización + Features Core (planificado 2026-04-09)

**Objetivo:** Completar todas las features funcionales pendientes y dejar el proyecto listo para entrega.

### v1.6-A — Bugs UX post-v1.5 (URGENTE)

| Fix | Descripción | Estado |
|-----|-------------|--------|
| BUG-05 | Clientes: texto modal delete confuso + target pequeño | 🔴 En curso |
| BUG-06 | Seminarios cards: panel imagen placeholder visible | 🔴 En curso |
| BUG-07 | Seminarios historial: muestra inactivos-por-error, sin delete | 🔴 En curso |

### v1.6-B — Fases prioritarias (Julio) ✅ COMPLETADAS (2026-04-09)

| Fase | Descripción | Estado |
|------|-------------|--------|
| F11 | **Pago parcial** — auto-cálculo remanente, toggle archivar como PENDIENTE | ✅ Ya implementado (NuevoPagoModal + PATCH /api/pagos/[id]) |
| F15 | **Dashboard chart interactivo** — hover + click drill-down por día | ✅ WeeklyActivityChart con panel de eventos |
| F17 | **Página /ayuda mejorada** — acordeón por módulo + FAQ con 5 preguntas | ✅ Contenido actualizado |

### v1.6-C — Fases secundarias ✅ COMPLETADAS (2026-04-09)

| Fase | Descripción | Estado |
|------|-------------|--------|
| F12 | **Calendario mejorado** — overflow "+N más" clickeable, DayDetailPopup con todos los eventos del día | ✅ |
| F14 | **Seminarios visibilidad** — botón "Marcar inactivo" directamente en SeminarioCard (admin only) | ✅ |
| F16 | **Badge CAS** — renombrado CITA→CAS en VisaProgressBadges + tooltip actualizado en TramitesTable | ✅ |

### v1.6-D — Infraestructura

| Item | Descripción |
|------|-------------|
| Paginación | Server-side pagination en clientes, tramites, pagos |
| Responsive | Layout móvil completo (sidebar colapsable, tablas scroll horizontal) |
| Deuda técnica | Unificar `{ success }` → `{ data, error }` en bulk routes; focus rings; tokens HV completos |

### v1.6-E — Entrega final

| Feature | Descripción |
|---------|-------------|
| Formulario externo | Página pública `/solicitud` — registro de interesados desde web, sin login |
| Búsqueda global | SearchBar en topbar funcional (clientes + trámites + seminarios) |
| Cierre de proyecto | README final, backup BD, entrega documentación |

---

## Fases completadas (histórico)

<details>
<summary>v1.0 Core Operativo — SHIPPED 2026-03-21</summary>
Auth, dashboard, CRUD completo, historial inmutable, webhooks Telegram/n8n, configuracion.
</details>

<details>
<summary>v1.1 Core Hardening (Phases 1-3) — SHIPPED 2026-03-22</summary>

- [x] Phase 1: Data Integrity (2/2 plans)
- [x] Phase 2: Validation Layer (3/3 plans)
- [x] Phase 3: Error Feedback (1/1 plan)
</details>

<details>
<summary>v1.2 Canales y Operacion Avanzada (Phases 4-9) — SHIPPED 2026-03-30</summary>

- [x] Phase 4: Seminarios Core (1/1 plan)
- [x] Phase 5: Seminarios Asistentes (1/1 plan)
- [x] Phase 6: Bot Telegram Alfred (1/1 plan)
- [x] Phase 7: Calendario y Configuracion (2/2 plans)
- [x] Phase 8: Fixes Julito Feedback (4/4 plans)
- [x] Phase 9: Design System Hardening (5/5 plans)
</details>

<details>
<summary>v1.3 UX Fixes — Phase 10 COMPLETE</summary>

- [x] Phase 10: Dashboard & Modal Fixes (3/3 plans) — completed 2026-04-01
- [ ] Phase 11: Pagos Pago Parcial — moved to backlog
- [ ] Phase 12: Calendario Visual — moved to backlog
</details>

---

## Progress

| Milestone | Fases | Status | Fecha |
|-----------|-------|--------|-------|
| v1.1 | 1-3 | ✅ Complete | 2026-03-22 |
| v1.2 | 4-9 | ✅ Complete | 2026-03-30 |
| v1.3 | 10 | ✅ Complete | 2026-04-01 |
| v1.4 | 13 | ✅ Complete (local) | 2026-04-07 |
| v1.5 | F1-F5 | 🟡 UI deployada, 4 bugs abiertos | 2026-04-08 |
| v1.6 | — | 🔲 Sin planificar | — |

---
*Last updated: 2026-04-08*

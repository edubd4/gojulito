# Roadmap: GoJulito

## Milestones

- ✅ **v1.0 Core Operativo** — Shipped 2026-03-21
- ✅ **v1.1 Core Hardening** — Phases 1-3 (shipped 2026-03-22)
- ✅ **v1.2 Canales y Operacion Avanzada** — Phases 4-9 (shipped 2026-03-30)
- ✅ **v1.3 UX Fixes** — Phase 10 (shipped 2026-04-01)
- ✅ **v1.4 Estabilizacion y Entrega** — FIX-01/02 + FIX-A..F (shipped local 2026-04-07 / parcial en prod)
- 🟡 **v1.5 Horizon Vista Design System** — UI deployada 2026-04-08, bugs funcionales abiertos
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

### Bugs abiertos post-deploy v1.5

| ID | Prioridad | Descripción | Fix requerido |
|----|-----------|-------------|---------------|
| BUG-01 | 🔴 Alta | Seminarios muestra 0 — query sin fix de `activo` | Aplicar `.or('activo.eq.true,activo.is.null')` y commitear |
| BUG-02 | 🟡 Media | `/soporte` → 404 — link muerto en sidebar | Crear página o redirigir |
| BUG-03 | 🟡 Media | AccionesRapidas siguen en dashboard | Eliminar bloque (FIX-B) y commitear |
| BUG-04 | 🟡 Media | Métricas de trámites no filtran al click | Implementar filtro `?metric=` (FIX-E) y commitear |

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

## v1.6 — Backlog (sin planificar)

Candidatos para próximos milestones:

- Formulario externo de registro de clientes (solicitudes desde web)
- Sistema de notificaciones real (push / email)
- Documentos editables por seminario
- Búsqueda global funcional
- Paginación en listas largas
- Página de Ayuda / Soporte integrada
- Métricas interactivas con filtro `?metric=` (FIX-E)
- Pagos parciales y auto-calculo de resto

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

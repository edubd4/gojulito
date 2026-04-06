# Roadmap: GoJulito

## Milestones

- ✅ **v1.0 Core Operativo** — Shipped 2026-03-21 (pre-planning)
- ✅ **v1.1 Core Hardening** — Phases 1-3 (shipped 2026-03-22)
- ✅ **v1.2 Canales y Operacion Avanzada** — Phases 4-9 (shipped 2026-03-30)
- ⚠️ **v1.3 UX Fixes** — Phase 10 complete, phases 11-12 NOT executed (absorbidas por v1.4)
- 🔄 **v1.4 Estabilizacion y Entrega** — Phases 13-17 + 11-12 (en progreso)

---

## v1.4 — Estabilizacion y Entrega

**Goal:** Corregir todos los bugs, completar fases pendientes, agregar ayuda integrada. Entregar estable en PC/tablet/celular.

### Fase 13: Formularios — Dropdowns + Fecha Turno
**Goal**: Todos los selects tienen fondo oscuro. El wizard permite elegir fecha de turno al seleccionar TURNO_ASIGNADO.
**Requirements**: FIX-01, FIX-02
**Plans**: 1 plan

Plans:
- [x] 13-01-PLAN.md — FIX-01 colorScheme dark en ~46 selects (17 archivos) + FIX-02 campo fecha_turno condicional en wizard paso 4

### Fase 14: Seminarios — Visibilidad + Responsive
**Goal**: Seminarios creados aparecen en lista. Dashboard muestra solo activos. Detalle responsive.
**Requirements**: FIX-03, FIX-04, FIX-05
**Plans**: 1 plan
- [ ] Pendiente

### Fase 15: Dashboard — Header + Chart
**Goal**: Busqueda funcional, botones de header con destino, chart con hover interactivo.
**Requirements**: FIX-06, FIX-07, FIX-08, FIX-09
**Plans**: 1 plan
- [ ] Pendiente

### Fase 16: Tablas — Responsive + Badge
**Goal**: Tablas usables en mobile sin scroll excesivo. Badge CAS renombrado.
**Requirements**: FIX-10, FIX-11, FIX-12, FIX-13
**Plans**: 1 plan
- [ ] Pendiente

### Fase 11: Pagos — Pago Parcial (de v1.3)
**Goal**: Auto-calculo de resto, toggle archivar remanente, eliminar checkbox viejo.
**Requirements**: PAG-01, PAG-02, PAG-03
**Plans**: 1 plan (existente: 11-01-PLAN.md)
- [ ] Pendiente

### Fase 12: Calendario — Visual (de v1.3)
**Goal**: Cap de chips, labels compactos, separadores visuales.
**Requirements**: CAL-01, CAL-02, CAL-03, CAL-04
**Plans**: 1 plan
- [ ] Pendiente

### Fase 17: Pagina de Ayuda
**Goal**: Instrucciones didacticas por seccion integradas en la app. Link en sidebar.
**Requirements**: HELP-01, HELP-02
**Plans**: 1 plan
- [ ] Pendiente

---

## Fases completadas (historico)

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
<summary>v1.3 UX Fixes — Phase 10 COMPLETE, 11-12 absorbed into v1.4</summary>

- [x] Phase 10: Dashboard & Modal Fixes (3/3 plans) — completed 2026-04-01
- [ ] Phase 11: Pagos Pago Parcial — moved to v1.4
- [ ] Phase 12: Calendario Visual — moved to v1.4
</details>

## Progress

| Fase | Milestone | Status | Completada |
|------|-----------|--------|------------|
| 1-3 | v1.1 | Complete | 2026-03-22 |
| 4-9 | v1.2 | Complete | 2026-03-30 |
| 10 | v1.3 | Complete | 2026-04-01 |
| 13 | 1/1 | Complete   | 2026-04-06 |
| 14 | v1.4 | Pendiente | — |
| 15 | v1.4 | Pendiente | — |
| 16 | v1.4 | Pendiente | — |
| 11 | v1.4 | Pendiente | — |
| 12 | v1.4 | Pendiente | — |
| 17 | v1.4 | Pendiente | — |

---
*Last updated: 2026-04-06 — Phase 13 planned*

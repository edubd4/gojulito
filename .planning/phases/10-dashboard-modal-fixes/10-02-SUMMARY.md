---
plan: 10-02
phase: 10
subsystem: dashboard
tags: [interactivity, popups, navigation, client-component]
dependency_graph:
  requires: [10-01]
  provides: [DASH-01, DASH-02, DASH-03, DASH-04]
  affects: [app/(dashboard)/page.tsx, components/dashboard/DeudaTableClient.tsx]
tech_stack:
  added: []
  patterns: [client-component-popup, z-index-layering, onClick-state-toggle]
key_files:
  created:
    - components/dashboard/DeudaTableClient.tsx
  modified:
    - app/(dashboard)/page.tsx
decisions:
  - DeudaProxima interface kept in page.tsx (TypeScript inference for Supabase query) and mirrored as export in DeudaTableClient for the client component
  - formatPesos removed from page.tsx imports after inline table extraction — auto-fixed unused var lint error
metrics:
  duration: 5 minutes
  completed: 2026-04-01
  tasks_completed: 3
  files_changed: 2
---

# Phase 10 Plan 02: Dashboard Interactivity — Turnos Fecha Link + Deuda Popups Summary

Dashboard tables are now interactive: Fecha column in Turnos navigates to `/calendario`; Deudas table is a client component with click-to-popup for Cliente and Monto columns, and Vence navigates to `/calendario`.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Change Turnos Fecha column link to /calendario | d9e7d38 |
| 2 | Create DeudaTableClient component with popups | 2cba876 |
| 3 | Replace inline deudas table in page.tsx with DeudaTableClient | b979cbb |

## What Was Built

- `app/(dashboard)/page.tsx` — Fecha column `<Link>` in Turnos table changed to `href="/calendario"`; DeudaProxima interface gained `pago_id: string`; inline deudas table replaced with `<DeudaTableClient deudas={deudas} />`; `diasRestantes` helper removed; `formatPesos` import removed (no longer used in server component)
- `components/dashboard/DeudaTableClient.tsx` — New `'use client'` component that manages popup state for Cliente and Monto columns, with Vence column linking to `/calendario`. Popup pattern (z-[60] overlay + z-[70] card) mirrors CalendarioView's TurnoPopup design exactly

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused formatPesos import from page.tsx**
- **Found during:** Task 3 — build failed with `@typescript-eslint/no-unused-vars` error
- **Issue:** After extracting inline deudas table to DeudaTableClient, `formatPesos` was no longer referenced in page.tsx but still imported
- **Fix:** Removed `formatPesos` from the `lib/utils` import line
- **Files modified:** `app/(dashboard)/page.tsx`
- **Commit:** b979cbb

## Known Stubs

None. All data flows from Supabase views through server component props to DeudaTableClient.

## Self-Check: PASSED

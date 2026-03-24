---
phase: 07-calendario-y-configuracion
plan: 01
subsystem: calendario
tags: [calendar, seminarios, UI, chips, popup]
dependency_graph:
  requires: []
  provides: [SeminarioCalItem type, seminarios in /api/turnos, initialSeminarios prop]
  affects: [app/api/turnos/route.ts, app/(dashboard)/calendario/page.tsx, components/calendario/CalendarioView.tsx]
tech_stack:
  added: []
  patterns: [useMemo for date keyed Map, useState for popup selection, Promise.all for parallel queries]
key_files:
  created: []
  modified:
    - app/api/turnos/route.ts
    - app/(dashboard)/calendario/page.tsx
    - components/calendario/CalendarioView.tsx
decisions:
  - Purple chip color rgba(167,139,250,0.18) bg with #a78bfa text — matches Violet-400 semantic for seminarios, visually distinct from visa (blue/amber) and pago (green/red) chips
  - SeminarioCalItem exported from CalendarioView alongside TurnoItem and PagoCalItem — keeps all calendar types co-located
metrics:
  duration: 664s (~11 min)
  completed_date: "2026-03-24"
  tasks_completed: 2
  files_modified: 3
---

# Phase 07 Plan 01: Seminarios en Calendario Summary

**One-liner:** Purple seminario chips in monthly calendar grid with popup showing sem_id, formatted fecha, modalidad badge, and link to /seminarios/[id], driven by server-side and API-side Supabase queries filtered by month range.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Extend API and page to include seminarios data | 26a96e2 | app/api/turnos/route.ts, app/(dashboard)/calendario/page.tsx |
| 2 | Add seminario chips, popup, and wiring in CalendarioView | 90839f3 | components/calendario/CalendarioView.tsx |

## What Was Built

### Task 1: API + Page

- `app/api/turnos/route.ts`: Added third element to `Promise.all` — queries `seminarios` table with `.eq('activo', true).gte('fecha', inicio).lte('fecha', fin)`. Maps results to `{ id, sem_id, fecha, modalidad }` shape. Returns `{ turnos, pagos, seminarios }`.
- `app/(dashboard)/calendario/page.tsx`: Added fourth element to `Promise.all` with same seminarios query. Added `SeminarioCalItem` to type imports. Maps results and passes `initialSeminarios={seminarios}` prop to `CalendarioView`.

### Task 2: CalendarioView

- Exported `SeminarioCalItem` interface (`id`, `sem_id`, `fecha`, `modalidad`).
- Added `initialSeminarios: SeminarioCalItem[]` to `Props` interface.
- Added `SEMINARIO_CHIP` constant: `{ bg: 'rgba(167,139,250,0.18)', text: '#a78bfa' }`.
- Added `seminarios` state and `seminariosByDate` useMemo (same Map pattern as turnosByDate/pagosByDate).
- Updated `navigateTo` to parse `json.seminarios` and call `setSeminarios`.
- Added `SeminarioPopup` component (same structure as TurnoPopup): shows sem_id, formatted date with calendar icon, modalidad badge, and "Ver seminario" link to `/seminarios/[id]`.
- Renders `SeminarioPopup` when `selectedSeminario` is non-null.
- Adds purple chip buttons in each grid cell for `cellSeminarios`, clicking sets `selectedSeminario`.
- Footer count line extended: shows "· N seminario(s)" when seminarios.length > 0.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — seminarios data is fetched live from Supabase, no hardcoded mock values.

## Self-Check: PASSED

- [x] `app/api/turnos/route.ts` exists and contains `from('seminarios')` and `{ turnos, pagos, seminarios }`
- [x] `app/(dashboard)/calendario/page.tsx` contains `initialSeminarios={seminarios}` and `SeminarioCalItem` import
- [x] `components/calendario/CalendarioView.tsx` contains `export interface SeminarioCalItem`, `SeminarioPopup`, `SEMINARIO_CHIP`, `seminariosByDate`, `setSeminarios`
- [x] Commits 26a96e2 and 90839f3 exist
- [x] `npm run build` passes cleanly after clean `.next` removal

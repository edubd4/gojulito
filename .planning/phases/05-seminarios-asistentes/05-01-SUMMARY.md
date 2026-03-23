---
phase: 05-seminarios-asistentes
plan: 01
subsystem: ui
tags: [seminarios, asistentes, cliente-vinculacion, modal, api]

# Dependency graph
requires:
  - phase: 04-seminarios-core
    provides: AsistentesTable, EditarAsistenteModal, PATCH /api/seminarios/[id]/asistentes/[asistente_id], AgregarAsistenteModal with clienteOptions
provides:
  - PATCH API for seminario asistentes now accepts cliente_id for vincular/desvincular
  - EditarAsistenteModal shows client selector with Sin vincular option
  - Prop chain page -> AsistentesTable -> EditarAsistenteModal passes clientes list
  - Historial entries on vincular (CAMBIO_ESTADO with gj_id) and desvincular (CAMBIO_ESTADO)
affects: [06-future-phases, seminarios feature]

# Tech tracking
tech-stack:
  added: []
  patterns: [conditional body key pattern for nullable fields ('cliente_id' in body), best-effort historial try/catch in PATCH handlers]

key-files:
  created: []
  modified:
    - app/api/seminarios/[id]/asistentes/[asistente_id]/route.ts
    - components/seminarios/EditarAsistenteModal.tsx
    - components/seminarios/AsistentesTable.tsx
    - app/(dashboard)/seminarios/[id]/page.tsx

key-decisions:
  - "Use 'cliente_id' in body (key presence check) instead of body.cliente_id !== undefined — allows null to explicitly desvincular"
  - "Send cliente_id in PATCH only when value changed from original — avoids unnecessary historial entries on saves without client changes"
  - "Historial inserts are best-effort (try/catch) — consistent with existing pago sync pattern"
  - "Client selector uses same clienteOptions list already fetched by page server component — no extra fetch"

patterns-established:
  - "Key-presence check for nullable PATCH fields: if ('field' in body) update.field = body.field ?? null"
  - "Conditional body enrichment in handleSubmit: only include field if changed from original value"

requirements-completed: [SEM-02, SEM-03, SEM-04]

# Metrics
duration: 8min
completed: 2026-03-23
---

# Phase 05 Plan 01: Seminarios Asistentes — Vincular Cliente Summary

**PATCH API and EditarAsistenteModal extended to allow vincular/desvincular a client to an attendee post-creation, closing the SEM-04 gap with historial audit entries**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-03-23T00:39:40Z
- **Completed:** 2026-03-23T00:47:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Extended PATCH endpoint to accept `cliente_id?: string | null`, detecting key presence to distinguish null (desvincular) from absent (unchanged)
- Added historial INSERT for vincular (with gj_id lookup) and desvincular (best-effort, consistent with existing patterns)
- Added client selector dropdown to EditarAsistenteModal with "Sin vincular" option, pre-populated from current client
- Wired `clientes` prop chain: page.tsx → AsistentesTable → EditarAsistenteModal

## Task Commits

1. **Task 1: Extend PATCH API to accept cliente_id with historial** - `ba0662b` (feat)
2. **Task 2: Add client selector to EditarAsistenteModal + wire props** - `cd3335f` (feat)

## Files Created/Modified

- `app/api/seminarios/[id]/asistentes/[asistente_id]/route.ts` - Added cliente_id to PatchBody, update object, and historial INSERT blocks
- `components/seminarios/EditarAsistenteModal.tsx` - Added ClienteOption import, extended interfaces, added client selector field
- `components/seminarios/AsistentesTable.tsx` - Added clientes prop, passes to EditarAsistenteModal
- `app/(dashboard)/seminarios/[id]/page.tsx` - Passes clienteOptions to AsistentesTable

## Decisions Made

- Use `'cliente_id' in body` key-presence check (not `!== undefined`) — allows null to explicitly trigger desvincular
- Only send `cliente_id` in PATCH body when changed from original value in the modal — prevents unnecessary historial entries on ordinary saves
- Historial inserts wrapped in try/catch as best-effort — consistent with the existing pago sync pattern in the same route
- Re-use existing clienteOptions already fetched by the page server component — no extra DB round-trip

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 5 is complete. All SEM-02, SEM-03, SEM-04 requirements fulfilled.
- The admin can now: add attendees with client linking (AgregarAsistenteModal), edit all attendee fields, and vincular/desvincular client post-creation (EditarAsistenteModal).

---
*Phase: 05-seminarios-asistentes*
*Completed: 2026-03-23*

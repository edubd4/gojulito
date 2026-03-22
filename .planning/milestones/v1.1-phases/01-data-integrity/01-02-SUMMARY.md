---
phase: 01-data-integrity
plan: 02
subsystem: api, database
tags: [supabase, soft-delete, historial, clientes, visas, pagos]

# Dependency graph
requires: []
provides:
  - "Bulk-delete endpoint performs soft-delete (INACTIVO) instead of physical DELETE"
  - "Active visas cancelled automatically when client is bulk-deleted"
  - "Historial entries created for each client inactivation and each visa cancellation"
  - "Clientes list shows visa estado based on most-recent active visa priority"
  - "Clientes list shows pago estado with DEUDA > PENDIENTE > PAGADO priority"
affects: [02-validation, 03-ux-fixes]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Soft-delete via update estado=INACTIVO instead of physical DELETE"
    - "Separate queries + in-memory Maps for multi-table aggregation in server components"
    - "Active-first priority for visa estado (EN_PROCESO, TURNO_ASIGNADO, PAUSADA before terminal states)"
    - "DEUDA > PENDIENTE > PAGADO priority for pago estado aggregation"

key-files:
  created: []
  modified:
    - app/api/clientes/bulk-delete/route.ts
    - app/(dashboard)/clientes/page.tsx

key-decisions:
  - "Use Array.from(map.entries()).forEach() instead of for...of on Map due to TypeScript downlevelIteration constraint in tsconfig"
  - "Separate queries (3 total) instead of nested select for correctness — nested selects lack ordering guarantees"
  - "Visa cancellation on bulk-delete is best-effort — client INACTIVO update error-checks but visa cancellation errors are ignored silently to prevent bulk operation failure"

patterns-established:
  - "Soft-delete pattern: update { estado: INACTIVO, updated_at } never DELETE"
  - "Historial dual-insert: one entry per client (usuario_id=user.id) + one per visa (usuario_id=null, origen=sistema)"

requirements-completed: [INTG-01, INTG-02]

# Metrics
duration: 18min
completed: 2026-03-21
---

# Phase 01 Plan 02: Data Integrity Bugs Summary

**Bulk-delete converted to soft-delete with visa cascade cancellation, and clientes list fixed to show correct visa/pago estados via ordered separate queries and priority-based aggregation maps**

## Performance

- **Duration:** 18 min
- **Started:** 2026-03-21T22:10:00Z
- **Completed:** 2026-03-21T22:28:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Bulk-delete now marks clients INACTIVO instead of performing physical DELETE, preserving all data
- Active visas (EN_PROCESO, TURNO_ASIGNADO, PAUSADA) are automatically cancelled when clients are bulk-deleted
- Historial gets one entry per client inactivation and one per visa cancellation with correct origin tracking
- Clientes list now shows the most recent active visa estado (or most recent visa if none active), never a random one
- Clientes list now shows DEUDA > PENDIENTE > PAGADO priority pago estado, not a random payment record

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix bulk-delete to soft-delete with visa cancellation** - `d779e50` (fix)
2. **Task 2: Fix visa and pago estado display in clientes list** - `7573f13` (fix)

**Plan metadata:** committed with state update docs commit

## Files Created/Modified
- `app/api/clientes/bulk-delete/route.ts` - Replaced `.delete()` with soft-delete update, added visa cancellation and dual historial inserts
- `app/(dashboard)/clientes/page.tsx` - Replaced nested select with 3 separate queries, added priority-based Map aggregation for visa and pago estados

## Decisions Made
- Used `Array.from(map.entries()).forEach()` instead of `for...of` on Map because tsconfig targets ES5 and does not have `downlevelIteration` enabled — this avoids a TypeScript compilation error without changing tsconfig
- Used 3 separate queries instead of nested Supabase select because nested selects do not guarantee ordering of child records, which was the root cause of the bug
- Visa cancellation errors on bulk-delete are ignored silently (best-effort) — the client is already INACTIVO at that point, and failing the entire bulk operation due to a visa side-effect would be worse UX than leaving an orphaned active visa

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript Map iteration compile error**
- **Found during:** Task 2 (Fix visa and pago estado display in clientes list)
- **Issue:** `for...of` on `Map<string, string>` fails compilation with "Type can only be iterated through when using the --downlevelIteration flag" because tsconfig targets ES5
- **Fix:** Replaced `for (const [k, v] of map)` with `Array.from(map.entries()).forEach(([k, v]) => {...})` which compiles cleanly
- **Files modified:** app/(dashboard)/clientes/page.tsx
- **Verification:** `npm run build` passed after fix
- **Committed in:** 7573f13 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Required to make the build compile. Logic is identical, only iteration syntax changed.

## Issues Encountered
- OneDrive file locking caused intermittent EPERM errors during `npm run build` on first two attempts. Third attempt succeeded — pre-existing environment issue, not code-related.

## Known Stubs
None — both fixes wire real data from Supabase queries.

## Next Phase Readiness
- INTG-01 and INTG-02 are resolved — data integrity bugs fixed
- Ready for Phase 01 Plan 03: INTG-03 (cascada FINALIZADO helper extraction)
- No blockers

---
*Phase: 01-data-integrity*
*Completed: 2026-03-21*

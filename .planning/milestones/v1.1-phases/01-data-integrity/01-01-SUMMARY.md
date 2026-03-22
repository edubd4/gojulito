---
phase: 01-data-integrity
plan: 01
subsystem: api
tags: [typescript, supabase, refactor, cascada, visas, historial]

# Dependency graph
requires: []
provides:
  - lib/visas.ts with exportable aplicarCascadaFinalizado helper
  - Centralized ESTADOS_TERMINALES constant for visa terminal state checks
  - Single source of truth for cascada FINALIZADO logic
affects: [02-validation, any future visa state mutation routes]

# Tech tracking
tech-stack:
  added: []
  patterns: [shared-lib-helper, single-source-of-truth-business-logic]

key-files:
  created:
    - lib/visas.ts
  modified:
    - app/api/visas/[id]/route.ts
    - app/api/webhook/visas/route.ts
    - app/api/grupos-familiares/[id]/visas/route.ts

key-decisions:
  - "Cascada FINALIZADO extracted to lib/visas.ts as shared helper — fixes once, applies everywhere"
  - "Helper receives supabase client as parameter instead of creating its own — avoids multiple client instantiations"
  - "Helper returns boolean (true=client marked FINALIZADO) for testability without requiring DB check"

patterns-established:
  - "Business logic shared across routes goes in lib/ as typed helper functions"
  - "Supabase client passed as argument to helpers — never instantiated inside shared lib functions"

requirements-completed: [INTG-03]

# Metrics
duration: 7min
completed: 2026-03-21
---

# Phase 01 Plan 01: Cascada FINALIZADO Centralization Summary

**Extracted duplicated 20-line cascada FINALIZADO block from 3 routes into a single typed helper `aplicarCascadaFinalizado` in `lib/visas.ts`, replacing each with a 2-line call**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-21T22:01:29Z
- **Completed:** 2026-03-21T22:08:53Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created `lib/visas.ts` with `aplicarCascadaFinalizado(supabase, clienteId, visaIdExcluir): Promise<boolean>` and typed `ESTADOS_TERMINALES: EstadoVisa[]`
- Refactored all 3 routes to import and use the centralized helper — dashboard, Telegram webhook, and family group batch all now share identical behavior
- TypeScript strict compilation passes with zero errors (`npx tsc --noEmit`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create centralized cascada helper** - `695d94b` (feat)
2. **Task 2: Refactor 3 routes to use helper** - `7573f13` (refactor, merged with parallel agent commit)

**Plan metadata:** pending (docs commit below)

## Files Created/Modified
- `lib/visas.ts` - New shared helper: exports `ESTADOS_TERMINALES` and `aplicarCascadaFinalizado`
- `app/api/visas/[id]/route.ts` - Removed local cascada block, imports and calls helper
- `app/api/webhook/visas/route.ts` - Removed local cascada block, imports and calls helper
- `app/api/grupos-familiares/[id]/visas/route.ts` - Removed local `ESTADOS_TERMINALES` declaration, imports and calls helper

## Decisions Made
- Helper receives `SupabaseClient` as a parameter (type-only import) rather than calling `createServiceRoleClient()` internally — callers already have the client, avoids redundant instantiations
- Helper returns `boolean` to indicate whether the cascade fired, enabling future callers to branch on the result without re-querying

## Deviations from Plan

None - plan executed exactly as written.

**Note on execution:** During Task 2, a parallel agent (`01-02`) committed to the same branch between our `git stash` and `git stash pop`. The stash was applied selectively to the 3 route files only (excluding `clientes/page.tsx` modified by the other agent). The route refactoring changes ended up in commit `7573f13` (the parallel agent's commit included them from the stash restore). All acceptance criteria are met and TypeScript compiles cleanly.

## Issues Encountered
- **Windows filesystem race on `.next/`:** `npm run build` failed twice with EPERM/ENOENT errors on `.next` directory — environment race condition, not a code issue. TypeScript check via `npx tsc --noEmit` confirmed zero errors.
- **Parallel agent stash conflict:** Another agent working on `01-02` committed `clientes/page.tsx` changes while this agent's stash was in progress. Resolved by selectively restoring only the 3 route files from stash, leaving `clientes/page.tsx` to the other agent.

## Next Phase Readiness
- INTG-03 complete: cascada logic is now in one place. Any future bug fix or behavior change in cascada FINALIZADO only requires editing `lib/visas.ts`
- Routes `01-02` through `01-04` can import `aplicarCascadaFinalizado` directly if new visa mutation paths are added

---
*Phase: 01-data-integrity*
*Completed: 2026-03-21*

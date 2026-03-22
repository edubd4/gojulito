---
phase: 02-validation-layer
plan: 02
subsystem: api
tags: [zod, validation, api-routes, webhook, response-shape]

# Dependency graph
requires:
  - phase: 02-validation-layer plan 01
    provides: lib/schemas/clientes.ts, lib/schemas/visas.ts, lib/schemas/pagos.ts with Zod schemas
provides:
  - All 9 POST/PATCH route handlers (6 dashboard + 3 webhook) use Zod safeParse for validation
  - Unified { data: T | null, error: string | null } return shape across all handlers
  - 409 DUPLICATE_CLIENT shape preserved for Telegram bot compatibility
affects: [03-ux-feedback, any feature using clientes/visas/pagos API routes]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "safeParse pattern: raw = await req.json(), then schema.safeParse(raw), return { data: null, error: msg } on failure"
    - "Zod v4 uses .issues not .errors for error access; type issues items explicitly as { message: string }"
    - "Webhook 409 DUPLICATE_CLIENT is an explicit exception to { data, error } pattern - preserved for n8n/Telegram"

key-files:
  created: []
  modified:
    - app/api/clientes/route.ts
    - app/api/clientes/[id]/route.ts
    - app/api/webhook/clientes/route.ts
    - app/api/visas/route.ts
    - app/api/visas/[id]/route.ts
    - app/api/webhook/visas/route.ts
    - app/api/pagos/route.ts
    - app/api/pagos/[id]/route.ts
    - app/api/webhook/pagos/route.ts

key-decisions:
  - "Zod v4 .issues used instead of .errors — version 4.3.6 changed the API; items typed as { message: string } to satisfy TypeScript strict mode"
  - "409 DUPLICATE_CLIENT exception maintained in clientes POST and webhook/clientes POST — Telegram bot parses this specific shape"
  - "GET handlers left unchanged — no body parsing, no return shape change needed"

patterns-established:
  - "All POST/PATCH handlers: try/catch req.json() → safeParse → business logic → { data, error }"
  - "Error format: parsed.error.issues.map((e: { message: string }) => e.message).join(', ')"

requirements-completed: [VAL-01, VAL-02]

# Metrics
duration: 7min
completed: 2026-03-22
---

# Phase 02 Plan 02: Apply Zod Validation to All API Route Handlers Summary

**Zod safeParse validation and unified { data, error } return shape applied to all 9 POST/PATCH route handlers across dashboard and webhook routes**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-03-22T15:33:44Z
- **Completed:** 2026-03-22T15:40:38Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments

- All 6 dashboard POST/PATCH handlers (clientes, visas, pagos) now validate body with Zod safeParse before any business logic
- All 3 webhook POST/PATCH handlers use the same domain schemas as the dashboard handlers
- Every route returns `{ data: T | null, error: string | null }` consistently — except the preserved 409 DUPLICATE_CLIENT exception
- Full `npm run build` passes cleanly with zero TypeScript errors

## Task Commits

1. **Task 1: Clientes routes (dashboard + webhook)** - `8b02acc` (feat)
2. **Task 2: Visas routes (dashboard + webhook)** - `9731901` (feat)
3. **Task 3: Pagos routes (dashboard + webhook)** - `62cc62f` (feat)

## Files Created/Modified

- `app/api/clientes/route.ts` - POST: Zod validation, { data, error }, DUPLICATE_CLIENT preserved
- `app/api/clientes/[id]/route.ts` - PATCH: Zod validation, { data, error }
- `app/api/webhook/clientes/route.ts` - POST: Zod validation, { data, error }, DUPLICATE_CLIENT preserved
- `app/api/visas/route.ts` - POST: Zod validation, { data, error }
- `app/api/visas/[id]/route.ts` - PATCH: Zod validation, { data, error }, business logic preserved
- `app/api/webhook/visas/route.ts` - PATCH: Zod validation, { data, error }, cascada preserved
- `app/api/pagos/route.ts` - POST: Zod validation, { data, error }
- `app/api/pagos/[id]/route.ts` - PATCH: Zod validation, { data, error }
- `app/api/webhook/pagos/route.ts` - POST: Zod validation, { data, error }

## Decisions Made

- Zod v4 (4.3.6) uses `.issues` not `.errors` to access error details — items typed explicitly as `{ message: string }` to pass TypeScript strict mode
- GET handlers intentionally left with their existing return shapes — they don't parse request bodies and are out of scope for this plan
- 409 DUPLICATE_CLIENT exception: preserved exactly in both clientes POST handlers (dashboard + webhook) per D-06 requirement for Telegram bot

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Zod v4 uses .issues not .errors**
- **Found during:** Task 1 (clientes routes) TypeScript check
- **Issue:** Plan specified `parsed.error.errors.map(e => e.message)` but Zod 4.x changed the API to `.issues`; also `e` required explicit typing for strict mode
- **Fix:** Changed all occurrences to `parsed.error.issues.map((e: { message: string }) => e.message)`
- **Files modified:** All 9 route files
- **Verification:** `npx tsc --noEmit` passes, `npm run build` passes
- **Committed in:** 8b02acc (part of Task 1 commit, then applied consistently in Tasks 2 and 3)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug: Zod v4 API difference)
**Impact on plan:** Required fix, discovered immediately on first TypeScript check. Applied consistently across all 9 files. No scope creep.

## Issues Encountered

None beyond the Zod v4 API deviation documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- VAL-01 and VAL-02 are now complete: all endpoints validate with Zod and return `{ data, error }`
- Phase 02 Plan 03 (VAL-03/UX-01) can now implement client-side error display reliably — the consistent server return shape makes it straightforward to propagate validation errors to forms

---
*Phase: 02-validation-layer*
*Completed: 2026-03-22*

## Self-Check: PASSED

- app/api/clientes/route.ts: FOUND
- app/api/visas/route.ts: FOUND
- app/api/pagos/route.ts: FOUND
- .planning/phases/02-validation-layer/02-02-SUMMARY.md: FOUND
- Commit 8b02acc (clientes): FOUND
- Commit 9731901 (visas): FOUND
- Commit 62cc62f (pagos): FOUND

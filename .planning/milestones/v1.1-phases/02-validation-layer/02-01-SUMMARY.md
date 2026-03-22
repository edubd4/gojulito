---
phase: 02-validation-layer
plan: 01
subsystem: api
tags: [zod, validation, schemas, typescript]

# Dependency graph
requires: []
provides:
  - "Zod v4 installed as production dependency"
  - "lib/schemas/clientes.ts — createClienteSchema, patchClienteSchema with inferred types"
  - "lib/schemas/visas.ts — createVisaSchema, patchVisaSchema, webhookVisaPatchSchema with inferred types"
  - "lib/schemas/pagos.ts — createPagoSchema (with visa_id refine), patchPagoSchema with inferred types"
affects: [02-02, 02-03]

# Tech tracking
tech-stack:
  added: ["zod ^4.3.6"]
  patterns: ["Zod schemas in lib/schemas/ per domain, imported by route handlers"]

key-files:
  created:
    - "lib/schemas/clientes.ts"
    - "lib/schemas/visas.ts"
    - "lib/schemas/pagos.ts"
  modified:
    - "package.json"
    - "package-lock.json"

key-decisions:
  - "Zod v4 API uses 'error' string param instead of required_error/invalid_type_error objects"
  - "Enum values extracted to typed const arrays before passing to z.enum() for reuse across schemas"
  - "createPagoSchema uses .refine() to enforce visa_id presence when tipo=VISA, matching existing 422 check in route handler"

patterns-established:
  - "Schema pattern: const values = [...] as const; z.enum(values, 'message') for all enum fields"
  - "All schemas export inferred types: export type CreateXInput = z.infer<typeof createXSchema>"
  - "Webhook schemas are separate from dashboard schemas when the payload shape differs (visa webhook uses visa_id string, not UUID)"

requirements-completed: [VAL-01]

# Metrics
duration: 4min
completed: 2026-03-22
---

# Phase 02 Plan 01: Zod Schemas Foundation Summary

**Zod v4 installed with three domain schema files (clientes, visas, pagos) under lib/schemas/, each exporting create and patch schemas typed from lib/constants.ts enums**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-22T15:26:58Z
- **Completed:** 2026-03-22T15:31:18Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Installed Zod v4 (^4.3.6) as production dependency
- Created lib/schemas/clientes.ts with createClienteSchema and patchClienteSchema
- Created lib/schemas/visas.ts with createVisaSchema, patchVisaSchema, and webhookVisaPatchSchema
- Created lib/schemas/pagos.ts with createPagoSchema (including .refine() for visa_id rule) and patchPagoSchema
- All schemas compile cleanly — build passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Zod and create clientes schema** - `9f96d87` (feat)
2. **Task 2: Create visas and pagos schemas** - `64ff991` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `lib/schemas/clientes.ts` - Zod schemas for clientes create and patch operations
- `lib/schemas/visas.ts` - Zod schemas for visas create, patch, and webhook patch
- `lib/schemas/pagos.ts` - Zod schemas for pagos create (with refine) and patch
- `package.json` - Added zod ^4.3.6 to dependencies
- `package-lock.json` - Lockfile updated

## Decisions Made
- **Zod v4 API change:** Zod v4 removed `required_error`/`invalid_type_error` from enum params — uses `error` string instead. Auto-fixed during Task 1 after TypeScript compilation revealed the API change.
- **Const array pattern:** Extracted enum values to typed `as const` arrays before `z.enum()` for reuse across create and patch schemas in the same file.
- **Webhook schema separation:** webhookVisaPatchSchema in visas.ts has its own shape (uses `visa_id: string.min(1)`, not UUID) to match the existing WebhookVisaPatchBody interface.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Zod v4 enum param API uses 'error', not 'required_error'/'invalid_type_error'**
- **Found during:** Task 1 (Create clientes schema)
- **Issue:** Plan's code template used `{ required_error: '...' }` / `{ invalid_type_error: '...' }` as the second arg to `z.enum()`, but Zod v4 changed this API to accept only `{ error: '...' }` or a plain string
- **Fix:** Replaced all enum param objects with a plain string message (e.g., `z.enum(values, 'Canal es requerido')`)
- **Files modified:** lib/schemas/clientes.ts, lib/schemas/visas.ts, lib/schemas/pagos.ts
- **Verification:** `npx tsc --noEmit` passes cleanly, `npm run build` succeeds
- **Committed in:** 9f96d87 (Task 1 commit), 64ff991 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug in plan's code template from Zod v3→v4 API change)
**Impact on plan:** Required fix for compilation. No scope creep. All schemas match the plan's intended validation logic.

## Issues Encountered
- Zod upgraded to v4.3.6 (plan referenced Zod generally); v4 introduced breaking API changes for `z.enum()` params that required an auto-fix on first compilation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three schema files are ready to import in route handlers (Plan 02-02)
- Schemas cover all POST/PATCH body shapes for clientes, visas, and pagos
- webhookVisaPatchSchema is ready for Plan 02-03 (webhook routes)
- No blockers

---
*Phase: 02-validation-layer*
*Completed: 2026-03-22*

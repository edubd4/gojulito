---
phase: 04-seminarios-core
plan: 01
subsystem: database, api, ui
tags: [supabase, soft-delete, next-js, typescript]

# Dependency graph
requires:
  - phase: v1.0-seminarios
    provides: Existing seminarios CRUD (create, edit, list, detail) from v1.0
provides:
  - seminarios soft delete via activo boolean column
  - PATCH /api/seminarios/[id] supports { activo: false }
  - historial entry logged on seminario inactivation
  - seminarios list filtered to activo=true only
  - InactivarSeminarioButton client component with confirm modal and redirect
affects: [05-telegram-bot, any phase reading seminarios list]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Soft delete with activo boolean — same pattern as clientes and visas"
    - "Inline confirm modal with fixed overlay — replicates ConfirmModal from ClientesTable.tsx"
    - "historial INSERT after state change — CAMBIO_ESTADO tipo, dashboard origen"

key-files:
  created:
    - database/migrations/002_add_activo_seminarios.sql
    - components/seminarios/InactivarSeminarioButton.tsx
  modified:
    - lib/supabase/types.ts
    - app/api/seminarios/[id]/route.ts
    - app/(dashboard)/seminarios/page.tsx
    - app/(dashboard)/seminarios/[id]/page.tsx

key-decisions:
  - "try/catch instead of .catch() for historial insert — Supabase PostgrestFilterBuilder does not expose .catch() method"
  - "historial insert uses try/catch with console.warn on failure — inactivation is the priority, historial is best-effort"
  - "InactivarSeminarioButton created as separate client component in components/seminarios/ — follows same pattern as EditarSeminarioModal and AgregarAsistenteModal"

patterns-established:
  - "Soft delete: activo boolean + .eq('activo', true) filter in list query"
  - "Historial on state change: CAMBIO_ESTADO tipo, best-effort insert (try/catch)"

requirements-completed: [SEM-01]

# Metrics
duration: 15min
completed: 2026-03-23
---

# Phase 04 Plan 01: Seminarios Soft Delete Summary

**Seminario soft delete via activo boolean column: PATCH API extended, list filtered, confirm modal with asistentes count on detail page, historial entry on inactivation**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-23T20:36:00Z
- **Completed:** 2026-03-23T20:51:28Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Migration file adds `activo boolean NOT NULL DEFAULT true` to seminarios table
- PATCH `/api/seminarios/[id]` now accepts `{ activo: false }` and inserts historial entry on inactivation
- Seminarios list page filters by `activo = true`, inactive seminarios disappear silently
- Seminario detail page shows "Marcar inactivo" button with inline confirm modal displaying asistentes count, redirects to `/seminarios` on confirm

## Task Commits

Each task was committed atomically:

1. **Task 1: Migration + API extension + types update** - `894ef03` (feat)
2. **Task 2: Filter active list + inactivar button with confirm modal** - `53ca486` (feat)

## Files Created/Modified

- `database/migrations/002_add_activo_seminarios.sql` - ALTER TABLE seminarios ADD COLUMN activo boolean NOT NULL DEFAULT true
- `lib/supabase/types.ts` - Added seminarios table entry with activo: boolean in Row type
- `app/api/seminarios/[id]/route.ts` - Extended PATCH body type for activo, added if-block + historial INSERT
- `app/(dashboard)/seminarios/page.tsx` - Added .eq('activo', true) to seminarios query
- `components/seminarios/InactivarSeminarioButton.tsx` - New client component with confirm modal and router.push redirect
- `app/(dashboard)/seminarios/[id]/page.tsx` - Added InactivarSeminarioButton import and render in header actions

## Decisions Made

- `try/catch` used for historial insert instead of chained `.catch()` — Supabase's PostgrestFilterBuilder does not expose a `.catch()` method; this was discovered at build time (TypeScript error)
- Inactivation is the priority; historial is best-effort with `console.warn` on failure
- `InactivarSeminarioButton` placed as last button in the header actions area (after edit/agregar) since it is the destructive action — consistent with UX convention

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced .catch() with try/catch for historial insert**
- **Found during:** Task 1 (PATCH handler extension)
- **Issue:** Plan specified `.catch(() => {})` chained on the Supabase insert call. TypeScript build error: `Property 'catch' does not exist on type 'PostgrestFilterBuilder...'`
- **Fix:** Wrapped historial insert in `try { await ... } catch { console.warn(...) }` block
- **Files modified:** `app/api/seminarios/[id]/route.ts`
- **Verification:** `npm run build` exits 0
- **Committed in:** `894ef03` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Necessary fix for compilation. Behavior is identical — historial insert is best-effort, inactivation is not blocked by historial failure. No scope creep.

## Issues Encountered

None beyond the auto-fixed `.catch()` compilation error above.

## User Setup Required

**Database migration required.** The `activo` column must be added to the `seminarios` table before the new code works in production:

1. Open Supabase SQL Editor for your project
2. Run the contents of `database/migrations/002_add_activo_seminarios.sql`:
   ```sql
   ALTER TABLE seminarios ADD COLUMN IF NOT EXISTS activo boolean NOT NULL DEFAULT true;
   ```
3. Verify with: `SELECT column_name FROM information_schema.columns WHERE table_name = 'seminarios' AND column_name = 'activo';`

## Next Phase Readiness

- SEM-01 fully satisfied: seminarios CRUD cycle complete (create, edit, list, soft-delete)
- Ready for Phase 04 next plans (seminario asistentes management or Telegram bot integration)
- No blockers

---
*Phase: 04-seminarios-core*
*Completed: 2026-03-23*

## Self-Check: PASSED

- FOUND: database/migrations/002_add_activo_seminarios.sql
- FOUND: lib/supabase/types.ts (with seminarios entry)
- FOUND: app/api/seminarios/[id]/route.ts (with activo handling)
- FOUND: components/seminarios/InactivarSeminarioButton.tsx
- FOUND: .planning/phases/04-seminarios-core/04-01-SUMMARY.md
- FOUND commit: 894ef03 (Task 1)
- FOUND commit: 53ca486 (Task 2)

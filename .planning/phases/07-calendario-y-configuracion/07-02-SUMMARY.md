---
phase: 07-calendario-y-configuracion
plan: 02
subsystem: auth, ui
tags: [next.js, role-based-access, sidebar, redirect]

# Dependency graph
requires:
  - phase: 07-01
    provides: configuracion page and Sidebar component already in place
provides:
  - Role-based redirect in /configuracion (non-admin users redirected to /)
  - Sidebar filtering that hides /configuracion link for colaboradores
affects: [any future phase touching Sidebar nav or configuracion page]

# Tech tracking
tech-stack:
  added: []
  patterns: [perfil.rol guard before admin queries in server components, role-filtered nav computed inside component using existing prop]

key-files:
  created: []
  modified:
    - app/(dashboard)/configuracion/page.tsx
    - components/dashboard/Sidebar.tsx

key-decisions:
  - "Redirect inserted after perfil null check and BEFORE esAdmin variable — prevents any admin-only queries from running for colaboradores"
  - "visibleNavItems computed inside Sidebar component using existing rol prop — no new props needed"

patterns-established:
  - "Role guard pattern: check perfil.rol !== 'admin' and redirect('/') before any privileged logic in server page components"
  - "Sidebar filtering: derive visible nav from existing rol prop, keep module-level navItems array unchanged"

requirements-completed: [CFG-01, CFG-02]

# Metrics
duration: 8min
completed: 2026-03-24
---

# Phase 7 Plan 2: Configuracion Role Guard Summary

**Admin-only access enforced on /configuracion: redirect for colaboradores and sidebar link hidden via role-filtered navItems**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-24T22:45:00Z
- **Completed:** 2026-03-24T22:53:00Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- `configuracion/page.tsx` now redirects colaboradores to `/` before any admin-only DB queries execute
- `Sidebar.tsx` computes `visibleNavItems` filtering out `/configuracion` for non-admin users
- Admin users retain full access to Mi perfil, Usuarios del sistema, and Precios del servicio sections

## Task Commits

Each task was committed atomically:

1. **Task 1: Add admin-only redirect and hide sidebar link for colaboradores** - `34f4f79` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `app/(dashboard)/configuracion/page.tsx` - Added `if (perfil.rol !== 'admin') redirect('/')` after perfil null check
- `components/dashboard/Sidebar.tsx` - Added `visibleNavItems` computed from `rol` prop, used in nav map

## Decisions Made
- Redirect placed immediately after `if (!perfil) redirect('/login')` and before `const esAdmin = perfil.rol === 'admin'` to ensure no admin queries run for non-admin users.
- `visibleNavItems` computed inside the component body (not at module level) so it reacts to the `rol` prop correctly. No new SidebarProps fields needed.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
Build verification encountered Windows filesystem race conditions (ENOENT/EPERM on `.next` trace files) due to concurrent parallel agent builds. TypeScript and ESLint checks both passed cleanly (`Compiled successfully` + `Linting and checking validity of types` passed). The filesystem errors are environmental, not compilation failures.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - no stubs in modified files.

## Next Phase Readiness
- Phase 07 complete: both plans (calendario view + configuracion role guard) executed
- CFG-01 and CFG-02 requirements satisfied
- No blockers for milestone transition

---
*Phase: 07-calendario-y-configuracion*
*Completed: 2026-03-24*

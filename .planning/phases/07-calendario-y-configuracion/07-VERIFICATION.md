---
phase: 07-calendario-y-configuracion
verified: 2026-03-24T23:10:00Z
status: passed
score: 6/6 must-haves verified
gaps: []
human_verification:
  - test: "Visit /calendario with at least one future seminario in DB"
    expected: "Purple chip (#a78bfa text) appears on the correct day cell; clicking it opens SeminarioPopup with sem_id, formatted date, modalidad badge, and 'Ver seminario' link"
    why_human: "Requires live Supabase data and a browser; chip rendering and popup behavior cannot be verified by static analysis"
  - test: "Log in as a colaborador user and visit /configuracion directly"
    expected: "Browser redirects to / without showing any configuration content"
    why_human: "Redirect behavior requires an active Supabase session with rol='colaborador' — cannot be simulated via grep"
  - test: "Log in as a colaborador and check the sidebar"
    expected: "'Configuracion' link is absent from the nav; all other links remain visible"
    why_human: "Requires browser session; sidebar filtering via visibleNavItems is code-verified but visual confirmation needs a real session"
---

# Phase 07: Calendario y Configuracion — Verification Report

**Phase Goal:** Seminarios visibles en el calendario mensual con chips de color + acceso a /configuracion restringido a admin.
**Verified:** 2026-03-24T23:10:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

The phase goal decomposes into two distinct areas:

1. **CAL-01 / CAL-02** — Calendario shows visa turnos (existing) and upcoming seminarios (new) in the monthly grid as colored chips.
2. **CFG-01 / CFG-02** — /configuracion allows admin to view/edit prices; access is restricted to admin role.

---

## Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | /calendario shows purple chips for seminarios in the monthly grid | VERIFIED | `CalendarioView.tsx` line 727–754: `cellSeminarios.map((s) => <button ... backgroundColor: SEMINARIO_CHIP.bg ... onClick={() => setSelectedSeminario(s)}>` |
| 2 | Clicking a seminario chip opens a popup with sem_id, formatted date, modalidad, and link to /seminarios/[id] | VERIFIED | `SeminarioPopup` function at line 241 renders all four elements; rendered conditionally at line 511: `{selectedSeminario && <SeminarioPopup ... />}` |
| 3 | Navigating months loads seminarios for the new month | VERIFIED | `navigateTo` at line 418–432 fetches `/api/turnos?mes=&anio=`, parses `json.seminarios`, calls `setSeminarios(json.seminarios ?? [])` at line 425 |
| 4 | A colaborador visiting /configuracion is redirected to / | VERIFIED | `configuracion/page.tsx` line 35: `if (perfil.rol !== 'admin') redirect('/')` — placed after perfil null check and before any admin queries |
| 5 | The Configuracion link does not appear in the sidebar for colaboradores | VERIFIED | `Sidebar.tsx` lines 50–52: `visibleNavItems = rol === 'admin' ? navItems : navItems.filter((item) => item.href !== '/configuracion')`, used at line 73 in nav map |
| 6 | An admin can access /configuracion and see precio_visa and precio_seminario | VERIFIED | `configuracion/page.tsx` lines 43–58: queries `configuracion` table, extracts `precio_visa` and `precio_seminario`, passes to `<PreciosForm>` at line 241 |

**Score: 6/6 truths verified**

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/api/turnos/route.ts` | Seminarios query added to GET response | VERIFIED | Line 41: `.from('seminarios')` with `.eq('activo', true).gte('fecha', inicio).lte('fecha', fin)`; line 88: `return NextResponse.json({ turnos, pagos, seminarios })` |
| `app/(dashboard)/calendario/page.tsx` | Server-side seminarios fetch and prop passing | VERIFIED | Lines 39–46: seminarios in `Promise.all`; line 88–93: maps to `SeminarioCalItem[]`; line 102: `initialSeminarios={seminarios}` prop |
| `components/calendario/CalendarioView.tsx` | SeminarioCalItem type, purple chips, SeminarioPopup | VERIFIED | Lines 31–36: `export interface SeminarioCalItem`; line 64: `SEMINARIO_CHIP`; line 241: `function SeminarioPopup`; lines 727–754: chip rendering in grid cells |
| `app/(dashboard)/configuracion/page.tsx` | Role-based redirect for non-admin users | VERIFIED | Line 35: `if (perfil.rol !== 'admin') redirect('/')` — positioned correctly after perfil guard, before admin logic |
| `components/dashboard/Sidebar.tsx` | Filtered navItems hiding /configuracion for non-admin | VERIFIED | Lines 50–52: `visibleNavItems` ternary; line 73: `visibleNavItems.map` used in nav render |

---

## Key Link Verification

### Plan 01 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/api/turnos/route.ts` | `supabase.from('seminarios')` | Supabase query with date range filter | WIRED | Line 41 confirmed by grep |
| `components/calendario/CalendarioView.tsx` | `/api/turnos` | navigateTo fetch, parsing json.seminarios | WIRED | Line 422 casts json type; line 425 calls `setSeminarios(json.seminarios ?? [])` |
| `app/(dashboard)/calendario/page.tsx` | CalendarioView | initialSeminarios prop | WIRED | Line 102: `initialSeminarios={seminarios}` confirmed |

### Plan 02 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/(dashboard)/configuracion/page.tsx` | `redirect('/')` | perfil.rol check before admin queries | WIRED | Line 35: `if (perfil.rol !== 'admin') redirect('/')` confirmed |
| `components/dashboard/Sidebar.tsx` | navItems filter | conditional ternary on rol prop | WIRED | Lines 50–52: `visibleNavItems = rol === 'admin' ? navItems : navItems.filter(item => item.href !== '/configuracion')`. PLAN pattern stated `rol !== 'admin'` — implementation uses logically equivalent ternary. Result: colaboradores get filtered list. |

---

## Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `CalendarioView.tsx` | `seminarios` | `useState(initialSeminarios)` seeded from server; refreshed via `navigateTo` → `/api/turnos` → Supabase `seminarios` table | Yes — live DB query with `activo=true` and date range filter | FLOWING |
| `configuracion/page.tsx` | `precioVisa`, `precioSeminario` | Supabase query on `configuracion` table (`clave`, `valor`), lines 44–58 | Yes — live DB query; `parseInt` of matching row | FLOWING |

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build compiles without errors | `npm run build` | Exit 0; `/calendario` and `/configuracion` both listed as dynamic routes in output | PASS |
| Commit 26a96e2 exists | `git show --stat 26a96e2` | Confirmed — modifies `route.ts` and `calendario/page.tsx` | PASS |
| Commit 90839f3 exists | `git show --stat 90839f3` | Confirmed — modifies `CalendarioView.tsx` (+183 lines) | PASS |
| Commit 34f4f79 exists | `git show --stat 34f4f79` | Confirmed — modifies `configuracion/page.tsx` and `Sidebar.tsx` | PASS |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| CAL-01 | 07-01-PLAN | /calendario shows turnos de visa de los proximos 7 dias (v_turnos_semana) | SATISFIED | Pre-existing; `v_turnos_semana` query in `calendario/page.tsx` line 30 + `turnosSemana` panel in `CalendarioView.tsx`. Not modified by this phase but owned by it. |
| CAL-02 | 07-01-PLAN | /calendario shows fechas de proximos seminarios | SATISFIED | Full implementation in Plan 01: API, page, and view all query and render seminarios |
| CFG-01 | 07-02-PLAN | /configuracion allows admin to view/edit precio_visa and precio_seminario | SATISFIED | `configuracion/page.tsx` lines 43–58 query `configuracion` table; `PreciosForm` rendered with live values |
| CFG-02 | 07-02-PLAN | /configuracion solo accesible por rol admin | SATISFIED | Server-side redirect at line 35 + sidebar filter in Sidebar.tsx |

All 4 requirements mapped to this phase are SATISFIED. No orphaned requirements found.

---

## Anti-Patterns Found

No blockers or warnings found in phase-modified files.

Patterns checked across `app/api/turnos/route.ts`, `app/(dashboard)/calendario/page.tsx`, `components/calendario/CalendarioView.tsx`, `app/(dashboard)/configuracion/page.tsx`, `components/dashboard/Sidebar.tsx`:

- No TODO/FIXME/HACK/PLACEHOLDER comments
- No empty implementations (`return null`, `return {}`, `return []`, `=> {}`)
- No hardcoded static responses standing in for DB queries
- `return []` / `return {}` patterns only appear inside null-coalescing fallbacks (`rawSeminarios ?? []`) which is correct defensive coding, not a stub
- `console.log` not present in any modified files

---

## Human Verification Required

### 1. Seminario chip renders in calendar grid

**Test:** Log in as admin, navigate to /calendario in a month that has at least one seminario with `activo=true` in the DB.
**Expected:** A purple chip labeled with `sem_id` (e.g., `SEM-2026-01`) appears on the correct day cell. Clicking it opens a popup showing sem_id, formatted date (DD/MM/YYYY), modalidad badge (Presencial or Virtual), and "Ver seminario" button linking to `/seminarios/[id]`.
**Why human:** Requires live Supabase session with real seminarios data and a browser.

### 2. Colaborador redirect on /configuracion

**Test:** Log in with a user account where `profiles.rol = 'colaborador'`, then navigate directly to /configuracion.
**Expected:** Immediately redirected to `/` (dashboard) without seeing any configuration content.
**Why human:** Requires an active Supabase session with rol='colaborador'.

### 3. Colaborador sidebar does not show Configuracion link

**Test:** Log in as colaborador, inspect the sidebar navigation.
**Expected:** All nav items visible (Dashboard, Clientes, Tramites, Pagos, Seminarios, Calendario) — "Configuracion" link is absent.
**Why human:** Sidebar filtering is code-verified but visual confirmation requires a browser session.

---

## Summary

Phase 07 achieved its goal. All six observable truths are verified in the actual codebase:

- The calendar's `CalendarioView.tsx` received a complete implementation of seminario chips (purple, `#a78bfa`), a `SeminarioPopup` component, `seminariosByDate` memo, and month-navigation wiring via `navigateTo`. No stubs.
- The `/api/turnos` route and the server-side `CalendarioPage` both issue live Supabase queries against the `seminarios` table with proper `activo=true` and date-range filters.
- `/configuracion` correctly guards with `if (perfil.rol !== 'admin') redirect('/')` placed before any admin-only DB queries.
- `Sidebar.tsx` computes `visibleNavItems` using the existing `rol` prop, hiding `/configuracion` for non-admin users without adding new props.
- `npm run build` compiles cleanly with all routes present.
- All three feature commits (26a96e2, 90839f3, 34f4f79) exist in git history with appropriate diff sizes.

Three items are routed to human verification — all are behavioral/visual and cannot be assessed by static analysis.

---

_Verified: 2026-03-24T23:10:00Z_
_Verifier: Claude (gsd-verifier)_

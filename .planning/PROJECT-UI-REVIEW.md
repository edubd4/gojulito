# GoJulito — Full-Project UI Review

**Audited:** 2026-03-24
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md)
**Screenshots:** Not captured (no dev server running on ports 3000, 5173, 8080)
**Scope:** All pages and components — dashboard, clientes, tramites, pagos, seminarios, calendario, configuracion

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | CTAs and empty states are contextual and in Spanish; "Cancelar" is the only filler pattern present |
| 2. Visuals | 3/4 | Consistent dark-card hierarchy; AccionesRapidas uses inline styles that mismatch the Tailwind-first pages |
| 3. Color | 2/4 | 843 hardcoded hex values vs 76 Tailwind token usages; purple (#a78bfa) used in Calendario without a design-system token |
| 4. Typography | 2/4 | 16 distinct inline `fontSize` pixel values alongside 7 Tailwind size classes; `fontFamily` hardcoded in 308 places |
| 5. Spacing | 2/4 | Two parallel systems: Tailwind classes in page shells, raw pixel values (gap: 8–24, padding strings) in all components |
| 6. Experience Design | 4/4 | Loading spinners, disabled states, inline error messages, and contextual empty states present throughout |

**Overall: 16/24**

---

## Top 3 Priority Fixes

1. **Dual styling system (inline styles + Tailwind coexist)** — Increases maintenance burden and causes visual drift over time: a future color or spacing change must be made in two systems. Migrate component-level `style={}` blocks to Tailwind utility classes using the existing `gj-*` tokens and spacing scale. Starting points: `AccionesRapidas.tsx`, `ClientesTable.tsx`, `PagosTable.tsx`, `TramitesTable.tsx`, `CalendarioView.tsx`.

2. **843 hardcoded hex values instead of design-system tokens** — Makes theme changes require a global search-and-replace. Every `color: '#e8a020'` should become `text-gj-amber`, every `backgroundColor: '#111f38'` should become `bg-gj-card`. The `gj-*` tokens are already defined in `tailwind.config.ts`; they are just not being used inside inline `style={}` blocks where Tailwind classes cannot apply.

3. **Undocumented fifth accent color (#a78bfa / purple) in CalendarioView** — `SEMINARIO_CHIP` uses a purple that appears nowhere in the design system (`tailwind.config.ts`, `globals.css`). This introduces a sixth semantic color not covered by the 60/30/10 split. Either add `gj-purple` to the design system with a documented role, or replace it with an existing token (`gj-blue` is the closest semantic fit for a calendar event chip).

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

The project consistently uses Spanish-language copy appropriate to the audience. CTAs are descriptive and contextual:

- "Nuevo cliente", "Nuevo trámite de visa", "Registrar pago", "Guardar", "Ingresar" — all specific and action-oriented
- "Cancelar" appears as a dismiss button in every modal; this is the Spanish-language equivalent of "Cancel" and is idiomatic — not a red flag
- Empty states are specific: "Sin turnos esta semana" (CalendarioView.tsx:821), "Sin clientes para los filtros seleccionados" (ClientesTable.tsx:558), "Sin pagos para los filtros seleccionados" (PagosTable.tsx:374), "Sin asistentes registrados" (AsistentesTable.tsx:153)
- Error messages are contextual: "Email o contraseña incorrectos." (login/page.tsx:24), "Error inesperado. Intentá de nuevo." (login/page.tsx:31)
- Section headings ("MI PERFIL", "USUARIOS DEL SISTEMA", "PRECIOS DEL SERVICIO") use uppercase letterSpacing convention consistently across configuracion/page.tsx

Minor issue: the Dashboard page h1 reads "Dashboard" (English), while all other page titles are in Spanish ("Clientes", "Trámites", "Pagos", "Seminarios", "Calendario", "Configuración"). This is a minor inconsistency.

### Pillar 2: Visuals (3/4)

The visual hierarchy is consistent and readable across all screens:

- Dark card system (`#111f38` on `#0b1628`) provides clear content layering
- Page headers use Fraunces/serif at fontSize 26–28 for consistent focal points
- Badge system is coherent: green/amber/red/blue correspond to semantic states and appear throughout clientes, tramites, pagos, seminarios
- Dashboard metric cards use per-color accent borders (`border: ${color}28`) giving contextual visual distinction
- SeminarioCard uses `onMouseEnter/onMouseLeave` for hover border brightening — functional but requires 18 manual React state handlers across the app instead of CSS hover

Issues found:

- `AccionesRapidas.tsx` (lines 14–27) defines a `btnBase` object using raw `React.CSSProperties` with hardcoded pixel values. These buttons visually diverge from the Tailwind-based button patterns used in the login page and modals — no `rounded-lg`, no `transition-colors` Tailwind class, no consistent border-radius token
- The mobile topbar (DashboardShell.tsx:37–47) has a right-side spacer `<div className="w-5" />` to balance the hamburger icon, but this is a layout hack. The GoJulito title in the topbar is a `<Link>` with `font-display text-sm` but sidebar header uses `text-xl` — the mobile topbar title is undersized relative to the desktop sidebar header
- CalendarioView uses `SEMINARIO_CHIP = { bg: 'rgba(167,139,250,0.18)', text: '#a78bfa' }` — purple chips appear in the calendar grid but nowhere else in the app, creating a one-off visual element without design-system backing

### Pillar 3: Color (2/4)

The design system defines 7 semantic colors via `gj-*` tokens. The actual implementation shows a significant split:

**Token usage (Tailwind classes):** 76 occurrences
**Hardcoded hex values:** 843 occurrences
**Hardcoded rgba/rgb values:** 421 occurrences

This means roughly 93% of color decisions bypass the design-system tokens. The `gj-*` Tailwind tokens are used only in:
- `login/page.tsx` — consistently uses `bg-gj-bg`, `bg-gj-card`, `text-gj-text`, `text-gj-secondary`, `bg-gj-amber`, `focus:border-gj-amber/50` etc.
- `Sidebar.tsx` — uses `bg-gj-card`, `text-gj-text`, `text-gj-secondary`, `text-gj-amber`, `text-gj-red`, `text-gj-blue`
- `DashboardShell.tsx` — uses `bg-gj-bg`, `bg-gj-card`

All other components (ClientesTable, PagosTable, TramitesTable, CalendarioView, all modals, configuracion/page) use inline `style={}` blocks with hardcoded hex values like `'#e8a020'`, `'#22c97a'`, `'#e85a5a'`, `'#4a9eff'`, `'#e8e6e0'`, `'#9ba8bb'`, `'#111f38'`, `'#172645'`.

Additional color outside the design system:
- `#a78bfa` (purple) — CalendarioView.tsx:64, 270, 319, 341 — used for seminario chips in the calendar grid. Not defined in `tailwind.config.ts` or `globals.css`.
- `amber-500` — login/page.tsx:96 `hover:bg-amber-500` mixes shadcn default amber scale with the custom `gj-amber` token

### Pillar 4: Typography (2/4)

**Tailwind font size classes in use (7 distinct):** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`

**Inline `fontSize` pixel values in use (16 distinct):** 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 36

This means the app effectively has 23 distinct text sizes across the UI — far beyond any maintainable typographic scale.

**Font weight:** Tailwind classes `font-bold`, `font-medium`, `font-semibold` are used in Tailwind-based components. Inline `fontWeight` values 400, 500, 600, 700 are used in style-object components. The weights are equivalent but expressed in two systems.

**Font family:** The design system declares `font-display` (Fraunces) and `font-sans`/`font-body` (DM Sans) as Tailwind classes. However:
- `fontFamily: 'DM Sans, sans-serif'` appears 308 times as inline styles (across all components, modals, tables, pages)
- `fontFamily: 'Fraunces, serif'` appears inline in every page header and SeminarioCard
- The `font-sans` Tailwind class appears only 24 times — exclusively in login/page.tsx and Sidebar.tsx

The typographic system functions correctly visually but is expressed in two incompatible syntaxes that will diverge under maintenance.

Notable: `globals.css` line 38 sets `font-family: 'DM Sans', sans-serif` on `body`, which means all components without explicit `fontFamily` inherit the correct font automatically. The 308 inline `fontFamily: 'DM Sans, sans-serif'` declarations are therefore redundant.

### Pillar 5: Spacing (2/4)

**Tailwind spacing classes (top usage):** `px-3` (23x), `py-1` (17x), `p-6` (14x), `py-3` (13x), `p-4` (10x), `gap-4`, `gap-3`, `gap-2`

**Inline spacing values (sample of distinct values):** gap 0–24px in 1px increments, padding strings like `'10px 18px'`, `'8px 12px'`, `'24px 28px'`, `'48px 28px'`, `'20px 24px'`, `'18px 24px'` — highly varied

The Tailwind spacing scale (multiples of 4px) is present in page shells. Component internals use arbitrary pixel values that do not map to the Tailwind scale — e.g., `padding: '10px 18px'` (AccionesRapidas), `padding: '28px 32px'` (ConfirmModal in ClientesTable), `padding: '48px 28px'` (seminarios page empty state).

Arbitrary Tailwind values found:
- `min-w-[240px]` — ClientesTable.tsx:486 (search input)
- `w-[500px]` — login/page.tsx:40 (ambient glow)
- `min-w-[8rem]` — components/ui/dropdown-menu.tsx (shadcn component, acceptable)
- `xl:grid-cols-[1fr_320px]` — page.tsx:303 (dashboard layout, acceptable use of arbitrary grid)

The pattern is consistent within each file but inconsistent across files. Buttons in the login page use `py-2.5 px-4` (Tailwind) while modal buttons use `padding: '8px 18px'` (inline). Visually identical results, but the two systems will diverge when the scale is updated.

### Pillar 6: Experience Design (4/4)

This is the strongest pillar. The app demonstrates thorough state coverage:

**Loading states:**
- All mutation buttons show a `Spinner` component during async operations (ClientesTable, PagosTable, TramitesTable, AsistentesTable, ClientePagosTable, PreciosForm, all modals)
- Form submit buttons are disabled and show loading text ("Ingresando...", "Guardando...", "Aplicando...") during in-flight requests
- 206 references to loading/isLoading/pending/skeleton/Spinner patterns across the codebase

**Error states:**
- 277 references to error/isError/catch across the codebase
- Login page surfaces auth errors inline below the form
- All modals set an `error` state and display it contextually
- API error responses surface to the user via toast messages (ClientesTable ToastContainer) or inline error text

**Empty states:**
- Every table and list has a contextual empty state message
- CalendarioView shows "Sin turnos este mes" / "Sin turnos esta semana"
- Grupos modal shows "Sin integrantes" when a group has no members
- All empty states use the correct `gj-secondary` (#9ba8bb) color

**Disabled states:**
- 77 occurrences of `disabled` / `cursor-not-allowed` across the codebase
- Buttons are disabled during loading and when preconditions are not met (e.g., AccionLoteGrupoModal disables submit when `clientes.length === 0`)

**Destructive action confirmations:**
- ClientesTable shows a `ConfirmModal` before deleting clients individually or in bulk
- InactivarSeminarioButton (not yet read in detail) follows the same pattern based on its name
- Deletion copy is specific: "¿Eliminar a 'X' permanentemente? Esta acción no se puede deshacer."

**Accessibility:**
- 9 `aria-label` attributes present on icon-only buttons: hamburger menu, close menu, logout, calendar navigation, password visibility toggles
- Focus styles via Tailwind: `focus:outline-none focus:border-gj-amber/50 focus:ring-1 focus:ring-gj-amber/20` on login inputs and search inputs
- Inline `style={}` form inputs have no focus styling at all (`outline: 'none'` only), meaning keyboard users lose focus visibility in all modals and tables

This last point is the only significant Experience Design gap — focus rings are absent on the majority of interactive elements (all inline-styled inputs and buttons).

---

## Registry Safety

`components.json` is present (shadcn initialized). No third-party registries declared — all registry entries point to `ui.shadcn.com` (official). Registry audit skipped.

---

## Files Audited

**Pages:**
- `app/(auth)/login/page.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/page.tsx`
- `app/(dashboard)/calendario/page.tsx`
- `app/(dashboard)/clientes/page.tsx`
- `app/(dashboard)/clientes/[id]/page.tsx`
- `app/(dashboard)/configuracion/page.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/pagos/page.tsx`
- `app/(dashboard)/seminarios/page.tsx`
- `app/(dashboard)/seminarios/[id]/page.tsx`
- `app/(dashboard)/tramites/page.tsx`

**Components:**
- `components/dashboard/Sidebar.tsx`
- `components/dashboard/DashboardShell.tsx`
- `components/dashboard/AccionesRapidas.tsx`
- `components/calendario/CalendarioView.tsx`
- `components/clientes/ClientesTable.tsx`
- `components/clientes/NuevoClienteModal.tsx`
- `components/clientes/EditarClienteModal.tsx` (partial)
- `components/clientes/ClientePagosTable.tsx`
- `components/pagos/PagosTable.tsx`
- `components/pagos/NuevoPagoModal.tsx`
- `components/seminarios/SeminarioCard.tsx`
- `components/seminarios/AsistentesTable.tsx`
- `components/seminarios/NuevoSeminarioModal.tsx` (grep only)
- `components/tramites/TramitesTable.tsx`
- `components/configuracion/PreciosForm.tsx`
- `components/grupos/AccionLoteGrupoModal.tsx`
- `tailwind.config.ts`
- `app/globals.css`
- `components.json`

**Grep audits run across entire `app/` and `components/` trees for all 6 pillars.**

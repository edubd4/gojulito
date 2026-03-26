# Phase 07 — UI Review

**Audited:** 2026-03-24
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md for this phase)
**Screenshots:** Not captured (no dev server running on ports 3000, 5173, or 8080)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Specific, contextual labels throughout; no generic strings detected |
| 2. Visuals | 3/4 | Popup pago lacks a dedicated component, inline styles diverge slightly from TurnoPopup pattern |
| 3. Color | 3/4 | Design tokens used correctly; 169 hardcoded hex values across phase files — acceptable but inconsistent with Tailwind token strategy |
| 4. Typography | 3/4 | Consistent type system in practice; mixing inline fontSize numbers with Tailwind class syntax creates a maintainability gap |
| 5. Spacing | 4/4 | All spacing via inline style props with project-standard values; no arbitrary Tailwind bracket overrides found |
| 6. Experience Design | 4/4 | Loading, error, empty, disabled, and destructive-action confirmation states all handled correctly |

**Overall: 21/24**

---

## Top 3 Priority Fixes

1. **Inline pago popup (CalendarioView.tsx:471-508) vs extracted TurnoPopup/SeminarioPopup components** — Users experience inconsistent popup behavior on mobile (300px vs 320px width, different close-button aria patterns) and the code pattern cannot be reused. Extract a `PagoPopup` function component following the same structure as `TurnoPopup` (dedicated section comment, extracted function, same 320px width, same aria-label on close button).

2. **Hardcoded hex colors instead of design-system references** — With 169 hex occurrences across the phase files, a future brand color change requires touching every file manually. The Tailwind config already defines `gj-amber`, `gj-green`, `gj-red`, `gj-blue`, `gj-text`, `gj-secondary`, `gj-card`, `gj-input`. Where inline styles are mandatory (dynamic values, SVG strokes), use the CSS variable form `var(--color-gj-amber)` rather than duplicating the literal. Priority candidates: `color: '#e8e6e0'` (18 occurrences), `backgroundColor: '#111f38'` (12 occurrences).

3. **`navigateTo` catch block silently swallows errors (CalendarioView.tsx:428-430)** — When month navigation fails, the grid opacity returns to 1 and the user sees the previous month's data with no indication that the fetch failed. Add a minimal inline error indicator (e.g., a `fetchError` state shown as a dismissable banner below the calendar header) so users know why their navigation did not respond.

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)

All user-visible strings are specific and contextual:

- Calendar chips: `sem_id` value (e.g., "SEM-2026-03") — identifies the item without ambiguity.
- Popup CTAs: "Ver seminario", "Ver ficha del cliente" — direct, action-oriented, not generic "Click here" or "OK".
- Loading feedback in forms: "Guardando..." (PreciosForm, CambiarPasswordForm) — progressive, not a spinner-only pattern.
- Save confirmation: "Guardado" with checkmark icon (PreciosForm.tsx:99) — satisfying affordance.
- Empty state in "Esta semana" panel: "Sin turnos esta semana" (CalendarioView.tsx:821) — contextual, not "No data".
- Calendar footer: "Sin turnos este mes" / `N turno(s) en Marzo` (CalendarioView.tsx:765-767) — contextual summary.
- Deletion confirmation: "¿Eliminar?" with "Sí" / "No" (EliminarUsuarioBtn.tsx:33-58) — concise and scannable.
- Section labels: "Mi perfil", "Usuarios del sistema", "Precios del servicio" — clear, domain-specific.

No generic "Submit", "Cancel", "OK", "No results" or "went wrong" strings were found in any phase 7 file.

### Pillar 2: Visuals (3/4)

**What works well:**
- The three chip types (turnos amber/blue/green, pagos green/red, seminarios purple) are visually distinct and semantically clear. The purple choice correctly avoids collision with all existing visa states.
- The `SeminarioPopup` follows the exact same layout structure as `TurnoPopup`: same dimensions (320px), same border radius (14px), same shadow (`0 20px 60px rgba(0,0,0,0.6)`), same header/detail/CTA pattern. Visual consistency is strong.
- Active icon highlight (amber for active sidebar item, CalendarioView.tsx:88) provides clear location feedback.
- "Today" highlight on calendar cells uses amber border `#e8a020` to make the current date immediately scannable.

**Issue:**
- The pago popup (CalendarioView.tsx:471-508) is implemented as inline JSX directly in the main component return, while TurnoPopup and SeminarioPopup are properly extracted functions with section comments. The pago popup also uses `width: 300` instead of the 320px used by both other popups, and its close button has no `aria-label`. This creates subtle visual inconsistency (narrower card) and a structural deviation from the established pattern. Impact: minor visual inconsistency on mobile and accessibility gap on the close button.

### Pillar 3: Color (3/4)

**What works well:**
- The design system is respected: amber for active state and today, blue for turno_asignado, green for pagado, red for deuda/rechazada, purple only for seminarios.
- No accent color overuse — each semantic color maps to exactly one meaning.
- Sidebar uses Tailwind `gj-` tokens correctly (lines 82-116 of Sidebar.tsx): `bg-gj-amber/15 text-gj-amber`, `bg-gj-blue/15 text-gj-blue`.

**Issue:**
- 169 hardcoded hex literals across the phase files (primarily CalendarioView.tsx and configuracion components). The project's `gj-` Tailwind tokens are available but underused in components that rely on inline styles. While inline styles are often forced (e.g., dynamic computed values, `opacity: loading ? 0.6 : 1`), many static hex values like `color: '#e8e6e0'`, `backgroundColor: '#111f38'`, `color: '#9ba8bb'` could reference CSS variables if the project decides to adopt that pattern. For now, the values are consistent and correct — no rogue colors detected — which holds the score at 3 rather than 2.

### Pillar 4: Typography (3/4)

No Tailwind font-size or font-weight classes are used in the phase 7 components — all typography is controlled via inline `style` props with numeric `fontSize` and `fontWeight` values.

Observed `fontSize` values in use across phase 7 files: 10, 11, 12, 13, 14, 15, 16, 22, 26. That is 9 distinct sizes, which exceeds the 4-size guideline. However, 26px and 22px are page/section headings using `font-display` (Fraunces), 15-16px are primary body, 13px is secondary body, and 10-12px are labels/chips/metadata. The hierarchy is coherent in practice even if the raw count is high.

Font families are consistently set: `Fraunces, serif` for headings, `DM Sans, sans-serif` for all body text. No deviations found.

The mixing of inline-style typography with occasional Tailwind classes (e.g., `font-sans` in Sidebar.tsx:81) creates a maintainability inconsistency — a future developer cannot grep Tailwind for a complete picture of font usage.

### Pillar 5: Spacing (4/4)

All spacing uses inline style props with values that map to the project's implicit scale (multiples of 4-8px). No Tailwind arbitrary bracket values like `p-[17px]` were found. Tailwind classes used for spacing are limited to the container responsive padding on configuracion/page.tsx (`p-4 sm:p-6 lg:p-10`) and flex gap on CalendarioView (`gap-6`), both using standard scale values.

Internal component spacing follows consistent patterns:
- Card padding: `24px 28px` (configuracion sections), `22px 24px` (popups)
- Chip padding: `2px 5px` (all three chip types)
- Section gaps: `gap: 20-24` for form rows, `gap: 10` for popup detail rows

No arbitrary spacing that would create visual jitter found.

### Pillar 6: Experience Design (4/4)

**Loading states:**
- CalendarioView: `loading` state drives `opacity: 0.6` on the calendar grid and `disabled` on both nav arrow buttons during month fetch (lines 548, 558, 576).
- PreciosForm/PreciosRow: `loading` drives "Guardando..." label, `cursor: not-allowed`, and `opacity: 0.7` on the Guardar button.
- CambiarPasswordForm and CrearUsuarioModal: same pattern — buttons disabled and labeled during async operations.

**Error states:**
- PreciosForm: inline "Error al guardar" feedback after failed PATCH.
- CambiarPasswordForm: field-level red error messages under each input.
- CrearUsuarioModal: `serverError` state displays API error message in the modal.
- CalendarioView: silent catch is the only gap (see Top Priority Fixes #3).

**Empty states:**
- "Esta semana" panel: "Sin turnos esta semana" when `turnosSemana.length === 0`.
- Calendar footer: "Sin turnos este mes" when `turnos.length === 0`.

**Disabled / destructive states:**
- EliminarUsuarioBtn: two-step confirmation ("¿Eliminar?" → "Sí" / "No") before DELETE executes.
- ToggleUsuario: esMismoCuenta disables self-deactivation.
- EditarUsuarioModal: esMismaCuenta prop used to guard self-edit destructive paths.
- Redirect guard in configuracion/page.tsx (`if (perfil.rol !== 'admin') redirect('/')`) prevents unauthorized access at the server component level, not just UI level.
- Sidebar visibleNavItems filter hides /configuracion for colaboradores — navigation is clean.

Registry audit: no third-party shadcn registries referenced in UI-SPEC.md (absent) or CONTEXT.md. Audit skipped.

---

## Files Audited

- `c:/Users/edu_i/OneDrive/Documentos/Proyectos2026/gojulito/components/calendario/CalendarioView.tsx`
- `c:/Users/edu_i/OneDrive/Documentos/Proyectos2026/gojulito/app/(dashboard)/calendario/page.tsx`
- `c:/Users/edu_i/OneDrive/Documentos/Proyectos2026/gojulito/app/api/turnos/route.ts`
- `c:/Users/edu_i/OneDrive/Documentos/Proyectos2026/gojulito/app/(dashboard)/configuracion/page.tsx`
- `c:/Users/edu_i/OneDrive/Documentos/Proyectos2026/gojulito/components/dashboard/Sidebar.tsx`
- `c:/Users/edu_i/OneDrive/Documentos/Proyectos2026/gojulito/components/configuracion/PreciosForm.tsx`
- `c:/Users/edu_i/OneDrive/Documentos/Proyectos2026/gojulito/components/configuracion/EliminarUsuarioBtn.tsx`
- `c:/Users/edu_i/OneDrive/Documentos/Proyectos2026/gojulito/components/configuracion/CambiarPasswordForm.tsx` (grepped)
- `c:/Users/edu_i/OneDrive/Documentos/Proyectos2026/gojulito/components/configuracion/CrearUsuarioModal.tsx` (grepped)
- `.planning/phases/07-calendario-y-configuracion/07-01-PLAN.md`
- `.planning/phases/07-calendario-y-configuracion/07-01-SUMMARY.md`
- `.planning/phases/07-calendario-y-configuracion/07-02-PLAN.md`
- `.planning/phases/07-calendario-y-configuracion/07-02-SUMMARY.md`
- `.planning/phases/07-calendario-y-configuracion/07-CONTEXT.md`

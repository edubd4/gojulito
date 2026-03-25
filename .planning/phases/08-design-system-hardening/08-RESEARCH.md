# Phase 8: Design System Hardening - Research

**Researched:** 2026-03-25
**Domain:** Tailwind CSS token migration, inline style removal, accessibility (focus rings)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

1. **Alcance de la migración** — Migración completa de todos los componentes (no parcial). Scope:
   - `components/clientes/` (5 archivos)
   - `components/pagos/` (5 archivos)
   - `components/seminarios/` (7 archivos)
   - `components/tramites/` (2 archivos)
   - `components/visas/` (2 archivos)
   - `components/configuracion/` (9 archivos)
   - `components/grupos/` (1 archivo)
   - `components/calendario/CalendarioView.tsx`
   - `app/(dashboard)/` pages que tengan style inline
   - Excluir `components/ui/` — fuera de scope

2. **Estrategia de migración** — Reemplazar `style={}` directamente por clases Tailwind `gj-*`. Sin CSS variables intermedias.
   | Hex | Token Tailwind |
   |-----|---------------|
   | `#0b1628` | `bg-gj-bg` |
   | `#111f38` | `bg-gj-card` |
   | `#172645` | `bg-gj-input` |
   | `#e8a020` | `text-gj-amber` / `bg-gj-amber` / `border-gj-amber` |
   | `#22c97a` | `text-gj-green` / `bg-gj-green` |
   | `#e85a5a` | `text-gj-red` / `bg-gj-red` |
   | `#4a9eff` | `text-gj-blue` / `bg-gj-blue` |
   | `#e8e6e0` | `text-gj-text` |
   | `#9ba8bb` | `text-gj-secondary` |
   | `#a78bfa` | `text-gj-seminario` / `bg-gj-seminario` (nuevo token) |

3. **Nuevo token** — `gj-seminario: '#a78bfa'` registrado en `tailwind.config.ts`

4. **Focus rings** — Agregar `focus:ring-2 focus:ring-gj-amber focus:outline-none` a todos los inputs/textareas que hoy tienen `outline: 'none'`

5. **Estilos sin equivalente Tailwind** — Usar clases Tailwind estándar (`text-sm`, `p-2`, etc.) para spacing/typography. Mantener `style={}` solo para `boxShadow` complejos y valores sin mapeo natural.

6. **Prioridad de planes:**
   1. 08-01: `tailwind.config.ts`
   2. 08-02: `components/pagos/`
   3. 08-03: `components/clientes/`
   4. 08-04: `components/seminarios/` + `components/tramites/` + `components/visas/`
   5. 08-05: `components/configuracion/` + `components/grupos/` + `components/calendario/`

### Claude's Discretion
None specified — all decisions are locked.

### Deferred Ideas (OUT OF SCOPE)
- Documentar el design system en un `DESIGN-SYSTEM.md`
- Migrar a CSS Modules
- Agregar Storybook
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DS-01 | No existen ocurrencias de `style=` con valores de color hex en ningún componente (0 hex literals en style props) | Audit completo: todos los archivos con hex en style props identificados por grupo |
| DS-02 | Todos los colores usan clases `gj-*` de Tailwind | Mapeo token→clase verificado contra tailwind.config.ts actual |
| DS-03 | El color `#a78bfa` está registrado como `gj-seminario` en `tailwind.config.ts` | tailwind.config.ts auditado — token ausente, cambio puntual identificado |
| DS-04 | Todos los inputs y textareas tienen `focus:ring-2 focus:ring-gj-amber` visible | Todos los archivos con `outline: 'none'` en inputStyle identificados |
</phase_requirements>

---

## Summary

El codebase tiene un sistema de estilos dual: `components/ui/` y `components/dashboard/Sidebar.tsx` usan 100% clases Tailwind `gj-*`, mientras que el 95% restante (35 componentes + 8 páginas) usa exclusivamente `style={}` con hex hardcodeados. El patrón dominante es un objeto `inputStyle` compartido definido al tope del archivo (con `outline: 'none'`, `backgroundColor: '#172645'`, etc.) que se extiende con `{...inputStyle, colorScheme: 'dark'}` en date pickers.

La migración es mecánica y repetitiva: cada archivo tiene entre 1 y 3 mapeos de hex a clases `gj-*`. La excepción son las BADGE maps dinámicas (objetos `BADGE_ESTADO_*`) que mapean ENUMs a colores en runtime — estas tienen su propia estrategia. Hay dos propiedades CSS que no tienen equivalente Tailwind directo y DEBEN permanecer en `style={}`: `colorScheme: 'dark'` (date pickers en dark mode) y `boxShadow` complejos con valores custom.

El token `gj-seminario` no existe en `tailwind.config.ts` — es el único cambio de configuración requerido. El objeto `gj` en tailwind.config.ts ya define todos los demás tokens necesarios.

**Primary recommendation:** Migrar archivo por archivo siguiendo el patrón Sidebar (clases Tailwind puras), preservando `colorScheme: 'dark'` en date inputs como el único `style={}` válido para colores.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 3.x (existente) | Utility classes `gj-*` | Ya configurado con todos los tokens |
| TypeScript | strict (existente) | Type safety en clases | Evita `any` en className |

No se instalan dependencias nuevas. Esta fase es una refactorización de presentación pura.

**Tailwind token verification (against tailwind.config.ts):**
```
gj.bg:        '#0b1628' ✓ present
gj.card:      '#111f38' ✓ present
gj.input:     '#172645' ✓ present
gj.amber:     '#e8a020' ✓ present
gj.green:     '#22c97a' ✓ present
gj.red:       '#e85a5a' ✓ present
gj.blue:      '#4a9eff' ✓ present
gj.text:      '#e8e6e0' ✓ present
gj.secondary: '#9ba8bb' ✓ present
gj.seminario: '#a78bfa' ✗ MISSING — add in plan 08-01
```

---

## Architecture Patterns

### Reference Pattern: Sidebar.tsx (100% Tailwind — objetivo)

Sidebar.tsx y `app/(auth)/login/page.tsx` son los únicos componentes que ya usan el patrón objetivo. En ellos no existe ningún `style={}` con colores. Todos los colores son clases como `bg-gj-bg`, `text-gj-amber`, `border-gj-input/30`, etc.

### Pattern 1: Reemplazo directo de inputStyle object

**What:** El patrón más común en el codebase es un objeto `inputStyle: React.CSSProperties` definido top-level en cada componente modal. Cada archivo repite exactamente los mismos valores.

**Before:**
```typescript
const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#172645',
  color: '#e8e6e0',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 14,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}
// Applied as: <input style={inputStyle} />
// Extended as: <input type="date" style={{ ...inputStyle, colorScheme: 'dark' }} />
```

**After:**
```typescript
// No inputStyle object — usar className directamente
const inputClass = "w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none box-border"

// Para date inputs (el único caso que conserva style):
<input type="date" className={inputClass} style={{ colorScheme: 'dark' }} />
```

**Files with inputStyle pattern:**
- `components/pagos/NuevoPagoModal.tsx` — `inputStyle` + `labelStyle`
- `components/pagos/DetallePagoModal.tsx` — `inputStyle`
- `components/pagos/CambiarEstadoPagoDialog.tsx` — `inputStyle`
- `components/pagos/FechaVencimientoDialog.tsx` — inline en JSX
- `components/clientes/NuevoClienteModal.tsx` — `inputStyle`
- `components/clientes/EditarClienteModal.tsx` — `inputStyle`
- `components/clientes/RegistrarPagoModal.tsx` — `inputStyle`
- `components/clientes/AgregarNotaModal.tsx` — `inputStyle`
- `components/seminarios/NuevoSeminarioModal.tsx` — `inputStyle`
- `components/seminarios/EditarSeminarioModal.tsx` — `inputStyle`
- `components/seminarios/AgregarAsistenteModal.tsx` — `inputStyle`
- `components/seminarios/EditarAsistenteModal.tsx` — `inputStyle`
- `components/tramites/NuevoTramiteModal.tsx` — `inputStyle`
- `components/visas/IniciarVisaModal.tsx` — `inputStyle`
- `components/visas/EditarVisaModal.tsx` — `inputStyle`
- `components/configuracion/CrearUsuarioModal.tsx` — `inputStyle`
- `components/configuracion/EditarUsuarioModal.tsx` — `inputStyle`
- `components/configuracion/NuevoGrupoModal.tsx` — `inputStyle`
- `components/configuracion/CambiarPasswordForm.tsx` — `inputStyle`
- `components/configuracion/PreciosForm.tsx` — `inputStyle` (sin boxSizing)
- `components/configuracion/EditarNombreForm.tsx` — `inputStyle` (sin boxSizing)
- `components/grupos/AccionLoteGrupoModal.tsx` — `inputStyle`

### Pattern 2: BADGE maps dinámicos (caso especial)

**What:** Los BADGE maps definen colores como strings que se pasan dinámicamente a `style={{ color, backgroundColor: bg }}`. Este patrón aparece en 9 componentes.

**Why it's complex:** El color se determina en runtime según el estado del objeto. No se puede usar una clase Tailwind estática porque Tailwind purga clases no conocidas en build time. La solución aprobada en CONTEXT.md es mantener el objeto BADGE (con hex strings) y seguir pasando `style={{ color, backgroundColor: bg }}` para estos elementos de badge — ya que los hex en esos style props son colores de tokens conocidos leídos desde el mapa.

**IMPORTANTE:** El CONTEXT.md dice "0 hex literals en style props". Esto aplica a hex hardcodeados directamente en el JSX. La estrategia para los BADGE maps requiere aclaración: o bien (a) convertir los BADGE maps a clases Tailwind usando un mapa de string a className, o (b) interpretar que los hex en maps constantes no son "inline hardcodeados". Ver sección Open Questions.

**Alternative approach for BADGE maps:**
```typescript
// En lugar de:
const BADGE_ESTADO: Record<EstadoPago, { color: string; bg: string; label: string }> = {
  PAGADO: { color: '#22c97a', bg: 'rgba(34,201,122,0.15)', label: 'Pagado' },
}
// <span style={{ color: BADGE.color, backgroundColor: BADGE.bg }}>

// Usar clases Tailwind dinámicas:
const BADGE_ESTADO: Record<EstadoPago, { textClass: string; bgClass: string; label: string }> = {
  PAGADO: { textClass: 'text-gj-green', bgClass: 'bg-gj-green/15', label: 'Pagado' },
}
// <span className={`${BADGE.textClass} ${BADGE.bgClass}`}>
```

Nota: `bg-gj-green/15` usa la notación de opacidad de Tailwind (`/15` = 15% opacity). Esto requiere que el color esté definido como hex en tailwind.config.ts (que es el caso actual), no como HSL.

**Files with BADGE map pattern:**
- `components/pagos/PagosTable.tsx` — `BADGE_ESTADO`, `BADGE_TIPO`
- `components/clientes/ClientesTable.tsx` — `BADGE_ESTADO_CLIENTE`, `BADGE_ESTADO_VISA`, `BADGE_ESTADO_PAGO`
- `components/tramites/TramitesTable.tsx` — similar
- `components/seminarios/AsistentesTable.tsx` — similar
- `components/seminarios/SeminarioCard.tsx` — `BADGE_MODALIDAD`
- `components/calendario/CalendarioView.tsx` — `CHIP`, `BADGE`, `SEMINARIO_CHIP`
- `components/clientes/ClientePagosTable.tsx` — BADGE inline
- `components/grupos/AccionLoteGrupoModal.tsx` — BADGE inline

### Pattern 3: Modal overlay container (repetitivo)

**What:** Todos los modales custom tienen el mismo par de `style={}` en el overlay backdrop y el contenedor modal.

**Before:**
```typescript
<div style={{ position: 'fixed', inset: 0, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.55)' }} />
<div style={{
  position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  zIndex: 70, backgroundColor: '#111f38', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16, ...
  boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
}} />
```

**After:**
```typescript
<div className="fixed inset-0 z-[60] bg-black/55" />
<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-card border border-white/10 rounded-2xl w-[90%] max-w-[480px] max-h-[90vh] overflow-y-auto font-sans"
  style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
/>
```

El `boxShadow` custom permanece en `style={}` — no tiene equivalente Tailwind directo para sombras de magnitud específica.

### Pattern 4: Page-level layout containers (app/(dashboard)/)

**What:** Cada página dashboard repite el mismo wrapper div con colores inline.

**Before:**
```typescript
<div className="p-4 sm:p-6 lg:p-8" style={{ backgroundColor: '#0b1628', minHeight: '100%' }}>
```

**After:**
```typescript
<div className="p-4 sm:p-6 lg:p-8 bg-gj-bg min-h-full">
```

**Files affected:**
- `app/(dashboard)/clientes/page.tsx`
- `app/(dashboard)/tramites/page.tsx`
- `app/(dashboard)/seminarios/page.tsx`
- `app/(dashboard)/seminarios/[id]/page.tsx`
- `app/(dashboard)/clientes/[id]/page.tsx`
- `app/(dashboard)/configuracion/page.tsx`
- `app/(dashboard)/pagos/page.tsx`

### Pattern 5: labelStyle objects

**What:** Many modals define a `labelStyle` object for form labels alongside `inputStyle`.

**Before:**
```typescript
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: '#9ba8bb', textTransform: 'uppercase',
  letterSpacing: '0.05em', marginBottom: 4,
  fontFamily: 'DM Sans, sans-serif',
}
```

**After:**
```typescript
const labelClass = "block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans"
```

### Special Cases That Must Keep `style={}`

1. **`colorScheme: 'dark'`** — No Tailwind equivalent. Required on all `<input type="date">` and `<input type="datetime-local">` to render the date picker chrome in dark mode. Keep as: `style={{ colorScheme: 'dark' }}`.

2. **`boxShadow` custom values** — Tailwind shadow utilities (`shadow-lg`, `shadow-2xl`) don't match the specific `0 24px 80px rgba(0,0,0,0.7)` or `0 8px 40px rgba(0,0,0,0.6)` values used for modals. Keep these as `style={{ boxShadow: '...' }}`.

3. **`accentColor`** — Used on checkboxes in 4 components to set the checkbox/radio button color. There is a Tailwind v3 `accent-*` utility class: `accent-gj-amber`. This CAN be migrated.

4. **Dynamic border with opacity derivation** — In `IniciarVisaModal.tsx` and others: `borderColor: errors.fecha_turno ? '#e85a5a' : 'rgba(255,255,255,0.1)'`. This is a conditional dynamic style. Approach: use conditional className — `border-gj-red` vs `border-white/10`.

5. **`gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))'`** — No direct Tailwind class. Keep as `style={}`.

6. **Dynamic select with badge background** — In `ClientesTable.tsx` line 705: a select element uses `BADGE_ESTADO_CLIENTE[c.estado].bg` as backgroundColor to visually match the status badge. This requires runtime styling based on the current value. This specific case MUST remain in `style={}` OR be refactored with a data-attribute + CSS approach.

### Anti-Patterns to Avoid

- **Purge-unsafe dynamic classes:** Never build className strings like `` `text-gj-${color}` `` — Tailwind purges unused classes at build time. Only use complete, static class strings.
- **Mixing style= and className= for the same property:** Once you add `bg-gj-card` to className, remove `backgroundColor: '#111f38'` from style.
- **Missing box-border:** The current `inputStyle` has `boxSizing: 'border-box'` — in Tailwind add `box-border` to className.

---

## Complete File Audit

### components/pagos/ (5 files)

| File | Hex in style= | outline:none | colorScheme:dark | BADGE map | Special |
|------|--------------|-------------|-----------------|-----------|---------|
| `NuevoPagoModal.tsx` | `#172645`, `#e8e6e0`, `#e8a020`, `#9ba8bb`, `#e85a5a`, `#22c97a`, `#0b1628`, `#111f38` | inputStyle | 2 date inputs | No (uses hex inline in panels) | `accentColor: '#e8a020'`, `rgba(232,160,32,0.08)` amber panel, `rgba(232,90,90,0.08)` red panel |
| `PagosTable.tsx` | `#172645`, `#e8e6e0`, `#e8a020`, `#22c97a`, `#e85a5a`, `#4a9eff`, `#111f38` | inputStyle | multiple date | BADGE_ESTADO + BADGE_TIPO | boxShadow dropdowns |
| `DetallePagoModal.tsx` | same set | inputStyle | 2 date inputs | No | boxShadow |
| `CambiarEstadoPagoDialog.tsx` | same set | inputStyle | 1 date input | No | boxShadow |
| `FechaVencimientoDialog.tsx` | same set | inline (no inputStyle var) | 1 date input | No | boxShadow |

### components/clientes/ (5 files)

| File | Hex in style= | outline:none | colorScheme:dark | BADGE map | Special |
|------|--------------|-------------|-----------------|-----------|---------|
| `NuevoClienteModal.tsx` | full set | inputStyle | 1 date input | No | — |
| `EditarClienteModal.tsx` | full set | inputStyle | 1 date input | No | — |
| `RegistrarPagoModal.tsx` | full set | inputStyle | 2 date inputs | No | Dynamic borderColor on error |
| `AgregarNotaModal.tsx` | full set | inputStyle | No | No | `rgba(155,168,187,0.35)` border |
| `ClientesTable.tsx` | full set | inline style | No | BADGE_ESTADO_CLIENTE/VISA/PAGO | Dynamic select bg=badge color (complex), `accentColor: '#e8a020'` |
| `ClientePagosTable.tsx` | full set | No | No | BADGE inline | boxShadow dropdown |

### components/seminarios/ (7 files)

| File | Hex in style= | outline:none | colorScheme:dark | BADGE map |
|------|--------------|-------------|-----------------|-----------|
| `NuevoSeminarioModal.tsx` | full set | inputStyle | 1 date | No |
| `EditarSeminarioModal.tsx` | full set | inputStyle | 1 date | No |
| `AgregarAsistenteModal.tsx` | full set | inputStyle | 1 date | No |
| `EditarAsistenteModal.tsx` | full set | inputStyle | No | No |
| `AsistentesTable.tsx` | full set | No | No | BADGE inline | boxShadow dropdown |
| `InactivarSeminarioButton.tsx` | partial | No | No | No | boxShadow modal |
| `SeminarioCard.tsx` | full set | No | No | BADGE_MODALIDAD | hover state uses JS |

### components/tramites/ (2 files)

| File | Hex in style= | outline:none | colorScheme:dark | BADGE map |
|------|--------------|-------------|-----------------|-----------|
| `NuevoTramiteModal.tsx` | full set | inputStyle | 1 date | No |
| `TramitesTable.tsx` | full set | inputStyle | 3 date inputs | BADGE_ESTADO inline | boxShadow dropdown |

### components/visas/ (2 files)

| File | Hex in style= | outline:none | colorScheme:dark | BADGE map | Special |
|------|--------------|-------------|-----------------|-----------|---------|
| `IniciarVisaModal.tsx` | full set | inputStyle | 2 date | No | Dynamic borderColor errors, `accentColor` on radio |
| `EditarVisaModal.tsx` | full set | inputStyle | 3 date | No | Dynamic borderColor errors |

### components/configuracion/ (9 files — all have style= with hex)

All 9 files: `GruposFamiliaresCard.tsx`, `NuevoGrupoModal.tsx`, `CrearUsuarioModal.tsx`, `EditarUsuarioModal.tsx`, `EditarNombreForm.tsx`, `CambiarPasswordForm.tsx`, `PreciosForm.tsx`, `ToggleUsuario.tsx`, `EliminarUsuarioBtn.tsx`

Common pattern: same `inputStyle` object + structural divs with `backgroundColor: '#111f38'`, `color: '#9ba8bb'`, etc.

### components/grupos/ (1 file)

`AccionLoteGrupoModal.tsx` — inputStyle, BADGE inline, colorScheme:dark, boxShadow

### components/calendario/ (1 file)

`CalendarioView.tsx` — most complex file. Contains:
- CHIP map: `{ bg: '#e8a020', text: '#0b1628' }` etc. for all visa states
- BADGE map similar structure
- `SEMINARIO_CHIP = { bg: 'rgba(167,139,250,0.18)', text: '#a78bfa' }` — this is the gj-seminario color
- Complex tooltip/popup overlays with absolute positioning + boxShadow
- No inputStyle (no inputs in this component)

### components/dashboard/ (1 file)

`AccionesRapidas.tsx` — `btnBase` style object with layout properties. Button colors: `backgroundColor: '#e8a020'`, `backgroundColor: 'rgba(74,158,255,0.12)'`, etc.

### app/(dashboard)/ pages (8 files with style=)

All pages have the same pattern: `style={{ backgroundColor: '#0b1628', minHeight: '100%' }}` on root div. `app/(dashboard)/clientes/[id]/page.tsx` has extensive style= usage including SVG `stroke` colors — those are SVG attributes technically using hex on stroke= prop.

**Note on SVG stroke:** In `app/(dashboard)/clientes/[id]/page.tsx`, SVG icons use `stroke="#e8a020"` etc. as SVG attributes (not CSS style props). These map to token values but the constraint "0 hex literals in style props" technically does not cover SVG attribute syntax. This needs planner clarification — either migrate to `stroke="currentColor"` + text color class, or leave as SVG attributes.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark date picker | Custom date input component | `style={{ colorScheme: 'dark' }}` on native date input | Only way to control browser-native date picker chrome |
| Badge component with dynamic colors | Runtime className builder | Static BADGE map with Tailwind class strings | Tailwind purges dynamic classnames |
| Hover state on SeminarioCard | JS onMouseEnter/onMouseLeave | Tailwind `hover:` variants | SeminarioCard currently uses JS state for hover border — migrate to `hover:border-white/14` |

**Key insight:** Tailwind's build-time purging means you CANNOT concatenate class names from variables. All class strings must be complete and static.

---

## Common Pitfalls

### Pitfall 1: Tailwind Purge with Dynamic Class Names
**What goes wrong:** Developer writes `` className={`bg-gj-${color}`} `` — Tailwind removes the class because it's not found as a static string.
**Why it happens:** Tailwind scans source files for class name strings during build.
**How to avoid:** Always use complete class strings: `'bg-gj-amber'`, `'bg-gj-green'` etc. — never build them from parts.
**Warning signs:** Class appears in source but has no effect in browser.

### Pitfall 2: Missing `box-border` When Removing boxSizing
**What goes wrong:** Input padding/size changes unexpectedly after removing `style={{ boxSizing: 'border-box' }}`.
**Why it happens:** Default browser box-sizing is `content-box`. The `inputStyle` objects had `boxSizing: 'border-box'` explicitly.
**How to avoid:** Add `box-border` to the input className. (Tailwind's `*` reset already applies `box-border` globally via `*, ::before, ::after { box-sizing: border-box }` — so this is likely a non-issue but worth verifying.)
**Warning signs:** Input appears wider than expected.

### Pitfall 3: colorScheme Lost on Date Inputs
**What goes wrong:** After migration, date picker chrome reverts to browser default (light) appearance.
**Why it happens:** `colorScheme: 'dark'` has no Tailwind equivalent and is commonly forgotten during migration.
**How to avoid:** Every `<input type="date">` and `<input type="datetime-local">` must keep `style={{ colorScheme: 'dark' }}` even after all other styles are migrated to className.
**Warning signs:** Date input shows white calendar popup on dark background.

### Pitfall 4: BADGE Map Migration Breaks Tailwind Purge
**What goes wrong:** Converting BADGE maps from hex strings to Tailwind class strings like `'text-gj-green'`, then building a ternary from parts.
**Why it happens:** Developer might write `const cls = `text-gj-${estado.toLowerCase()}``.
**How to avoid:** Full class strings in the map object, not computed.
**Warning signs:** Badge has no color in production build.

### Pitfall 5: `rgba(X,Y,Z, 0.N)` Has No Direct Tailwind Token
**What goes wrong:** Pattern `rgba(232,160,32,0.08)` used for panel backgrounds (amber notification panels in NuevoPagoModal, etc.) has no token in tailwind.config.ts.
**Why it happens:** These are 8% opacity versions of gj-amber — used for subtle alert panels.
**How to avoid:** Use Tailwind opacity modifier: `bg-gj-amber/8`. Tailwind supports arbitrary opacity values with `/[N]` syntax for defined colors.
**Note:** Verify `bg-gj-amber/8` vs `bg-gj-amber/[8%]` syntax — both work in Tailwind v3.

### Pitfall 6: `border: '1px solid rgba(255,255,255,0.1)'` — White with opacity
**What goes wrong:** This pattern is everywhere. It's NOT in tailwind.config.ts but IS a standard Tailwind utility.
**How to avoid:** Use `border border-white/10`. This is already used in Sidebar.tsx and some ClientesTable filter inputs — it's the established pattern.

### Pitfall 7: Dynamic select background in ClientesTable
**What goes wrong:** Line 705 in ClientesTable.tsx applies `backgroundColor: BADGE_ESTADO_CLIENTE[c.estado].bg` to a select element to make it visually match the status badge. After migration, this dynamic background cannot be a static Tailwind class.
**How to avoid:** Two options: (a) keep this specific `style={}` application (it reads from a constant, not a raw hex literal) — discuss with planner; or (b) refactor to use CSS custom property or data-attribute approach. This is the most complex migration case in the codebase.

---

## Hex Inventory (Unique Values Found)

All hex/rgba values found in `style={}` props across the codebase, with token mapping:

| Value | Token | Tailwind Class Pattern |
|-------|-------|----------------------|
| `#0b1628` | `gj-bg` | `bg-gj-bg`, `text-gj-bg` |
| `#111f38` | `gj-card` | `bg-gj-card` |
| `#172645` | `gj-input` | `bg-gj-input` |
| `#e8a020` | `gj-amber` | `text-gj-amber`, `bg-gj-amber`, `border-gj-amber` |
| `#22c97a` | `gj-green` | `text-gj-green`, `bg-gj-green` |
| `#e85a5a` | `gj-red` | `text-gj-red`, `bg-gj-red` |
| `#4a9eff` | `gj-blue` | `text-gj-blue`, `bg-gj-blue` |
| `#e8e6e0` | `gj-text` | `text-gj-text` |
| `#9ba8bb` | `gj-secondary` | `text-gj-secondary` |
| `#a78bfa` | `gj-seminario` (NEW) | `text-gj-seminario`, `bg-gj-seminario` |
| `rgba(255,255,255,0.1)` | — | `border-white/10`, `bg-white/10` |
| `rgba(255,255,255,0.07)` | — | `border-white/[7%]` or `border-white/10` |
| `rgba(255,255,255,0.08)` | — | `border-white/[8%]` |
| `rgba(255,255,255,0.12)` | — | `border-white/[12%]` |
| `rgba(255,255,255,0.14)` | — | `border-white/[14%]` |
| `rgba(0,0,0,0.55)` | — | `bg-black/55` |
| `rgba(0,0,0,0.7)` | — | keep as `style={}` (boxShadow context) |
| `rgba(232,160,32,0.08)` | gj-amber/8 | `bg-gj-amber/[8%]` |
| `rgba(232,160,32,0.15)` | gj-amber/15 | `bg-gj-amber/15` |
| `rgba(232,160,32,0.3)` | gj-amber/30 | `border-gj-amber/30` |
| `rgba(34,201,122,0.15)` | gj-green/15 | `bg-gj-green/15` |
| `rgba(34,201,122,0.12)` | gj-green/12 | `bg-gj-green/[12%]` |
| `rgba(34,201,122,0.25)` | gj-green/25 | `border-gj-green/25` |
| `rgba(232,90,90,0.08)` | gj-red/8 | `bg-gj-red/[8%]` |
| `rgba(232,90,90,0.12)` | gj-red/12 | `bg-gj-red/[12%]` |
| `rgba(232,90,90,0.15)` | gj-red/15 | `bg-gj-red/15` |
| `rgba(232,90,90,0.25)` | gj-red/25 | `border-gj-red/25` |
| `rgba(232,90,90,0.3)` | gj-red/30 | `border-gj-red/30` |
| `rgba(74,158,255,0.15)` | gj-blue/15 | `bg-gj-blue/15` |
| `rgba(74,158,255,0.12)` | gj-blue/12 | `bg-gj-blue/[12%]` |
| `rgba(74,158,255,0.25)` | gj-blue/25 | `border-gj-blue/25` |
| `rgba(74,158,255,0.5)` | gj-blue/50 | `border-gj-blue/50` |
| `rgba(155,168,187,0.15)` | gj-secondary/15 | `bg-gj-secondary/15` |
| `rgba(155,168,187,0.35)` | gj-secondary/35 | `border-gj-secondary/35` |
| `rgba(167,139,250,0.18)` | gj-seminario/18 | `bg-gj-seminario/[18%]` (after adding token) |
| `rgba(232,160,32,0.40)` (derived in template literal `${color}40`) | — | See note below |

**Note on hex alpha (`${BADGE_ESTADO_CLIENTE[c.estado].color}40`):** ClientesTable.tsx line 705 builds a border color using template literal `${color}40` (hex with appended alpha `40` = 25% opacity). This is a hex alpha shorthand. This is part of the complex dynamic select case — cannot be statically replaced.

**Confirmed no unknown hex values:** All 10 base hex colors map to existing or new gj-* tokens. No rogue colors found.

---

## Code Examples

### tailwind.config.ts change (Plan 08-01)
```typescript
// Source: tailwind.config.ts (verified against current file)
gj: {
  bg: "#0b1628",
  card: "#111f38",
  input: "#172645",
  amber: "#e8a020",
  green: "#22c97a",
  red: "#e85a5a",
  blue: "#4a9eff",
  text: "#e8e6e0",
  secondary: "#9ba8bb",
  seminario: "#a78bfa",  // ADD THIS LINE — chips de seminario en calendario
},
```

### Migrated inputStyle + label pattern
```typescript
// Remove the inputStyle object entirely.
// In JSX, use className strings:

// Standard input/select/textarea:
className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none box-border"

// Date input (keeps style= for colorScheme only):
className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none"
style={{ colorScheme: 'dark' }}

// Label:
className="block text-xs font-semibold text-gj-secondary uppercase tracking-wide mb-1 font-sans"

// Cursor pointer for select:
className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-sans focus:ring-2 focus:ring-gj-amber focus:outline-none cursor-pointer"
```

### Migrated BADGE map (using class strings)
```typescript
// Before:
const BADGE_ESTADO: Record<EstadoPago, { label: string; color: string; bg: string }> = {
  PAGADO: { label: 'Pagado', color: '#22c97a', bg: 'rgba(34,201,122,0.15)' },
}
// <span style={{ color: b.color, backgroundColor: b.bg }}>

// After:
const BADGE_ESTADO: Record<EstadoPago, { label: string; classes: string }> = {
  PAGADO:    { label: 'Pagado',    classes: 'text-gj-green bg-gj-green/15'    },
  DEUDA:     { label: 'Deuda',     classes: 'text-gj-red bg-gj-red/15'        },
  PENDIENTE: { label: 'Pendiente', classes: 'text-gj-amber bg-gj-amber/15'    },
}
// <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${BADGE_ESTADO[estado].classes}`}>
```

### Migrated modal container
```typescript
// Backdrop:
<div className="fixed inset-0 z-[60] bg-black/55" onClick={() => onOpenChange(false)} />

// Modal panel:
<div
  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-card border border-white/10 rounded-2xl w-[90%] max-w-[480px] max-h-[90vh] overflow-y-auto font-sans"
  style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}
  onClick={(e) => e.stopPropagation()}
>
```

### Migrated accentColor (checkboxes)
```typescript
// Before:
<input type="checkbox" style={{ accentColor: '#e8a020', cursor: 'pointer', width: 16, height: 16 }} />

// After (Tailwind v3 has accent-* utilities):
<input type="checkbox" className="accent-gj-amber cursor-pointer w-4 h-4" />
```

### Migrated SeminarioCard hover state
```typescript
// Before (JS state for hover):
const [hovered, setHovered] = useState(false)
<div
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  style={{ border: `1px solid ${hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}` }}
>

// After (Tailwind hover:):
<div className="border border-white/[6%] hover:border-white/[14%] transition-colors cursor-pointer bg-gj-card rounded-xl p-5 sm:p-6">
// Remove useState for hover
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS-in-JS inline styles | Tailwind utility classes | Established in project (Sidebar pattern) | Visual consistency, purging, dark theme tokens |
| `rgba(R,G,B,opacity)` | `bg-gj-{color}/{opacity}` | Tailwind v3+ | Cleaner, token-based opacity |

---

## Open Questions

1. **BADGE maps with dynamic select background (ClientesTable.tsx:705)**
   - What we know: A `<select>` uses `backgroundColor: BADGE_ESTADO_CLIENTE[c.estado].bg` to visually indicate the current status
   - What's unclear: Whether DS-01 ("0 hex literals in style props") requires eliminating this (it reads from a constant map, not a raw hex literal)
   - Recommendation: Planner decision — option A: keep this `style={}` application (reads from constant, not raw hex) and document exception; option B: use CSS custom properties or switch to a separate visible badge + hidden native select approach

2. **SVG stroke attributes in `app/(dashboard)/clientes/[id]/page.tsx`**
   - What we know: SVG icons use `stroke="#e8a020"` etc. as SVG element attributes (not CSS `style={}` props)
   - What's unclear: Whether DS-01 ("0 hex literals in style props") covers SVG attribute syntax
   - Recommendation: Planner should clarify scope. If SVGs are in scope, migrate to `stroke="currentColor"` with `text-gj-amber` parent class.

3. **Tailwind opacity modifier precision (e.g., `/[8%]` vs `/8`)**
   - What we know: Tailwind v3 supports both `bg-gj-amber/8` (shorthand, 8/100) and `bg-gj-amber/[8%]` (arbitrary)
   - What's unclear: Whether `bg-gj-amber/8` rounds correctly in all browsers (it's 8%)
   - Recommendation: Use shorthand `/N` for common multiples (15, 25, 50), arbitrary `/[N%]` for odd values (7%, 8%, 12%, 18%). Both are valid in Tailwind v3.

---

## Environment Availability

Step 2.6: SKIPPED (no external dependencies — pure frontend refactoring with existing Tailwind setup).

---

## Validation Architecture

No automated test suite configured (per CLAUDE.md). Validation is `npm run build` producing a clean TypeScript compile.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — `npm run build` (tsc + Next.js) |
| Config file | `tsconfig.json` |
| Quick run command | `npm run build` |
| Full suite command | `npm run build` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DS-01 | 0 hex in style= | grep audit | `grep -r "#[0-9a-fA-F]\{3,8\}" components/ --include="*.tsx" -l` (expect 0 matches in style props) | manual |
| DS-02 | All colors use gj-* classes | visual review | `npm run build` | N/A |
| DS-03 | gj-seminario in tailwind.config.ts | file check | `grep "gj-seminario" tailwind.config.ts` | N/A |
| DS-04 | focus:ring visible on inputs | visual review | `npm run build` | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` — TypeScript must compile clean
- **Per wave merge:** `npm run build` — same
- **Phase gate:** Build clean + manual visual check of modals in browser

### Wave 0 Gaps
None — no new test files needed. Build verification is sufficient per CLAUDE.md conventions.

---

## Project Constraints (from CLAUDE.md)

- No tocar `components/ui/` — fuera de scope (creados manualmente)
- TypeScript strict — no `any`
- `npm run build` debe compilar limpio tras cada plan
- No cambiar lógica de negocio, solo presentación/estilos
- shadcn CLI incompatible con Node 18 — todos los componentes en components/ui/ fueron creados manualmente
- ENUMs: usar exactamente los strings de `lib/constants.ts`
- No eliminar registros, no tocar n8n/Telegram, no modificar DB schema

---

## Sources

### Primary (HIGH confidence)
- Direct file audit — `tailwind.config.ts`, all 43 component/page files with `style={}` — source of truth for all findings
- Sidebar.tsx — reference implementation for 100% Tailwind pattern

### Secondary (MEDIUM confidence)
- Tailwind v3 documentation (opacity modifier syntax `/N` and `/[N%]`) — verified against established usage patterns in the codebase
- CONTEXT.md locked decisions — all migration strategy decisions are pre-resolved

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — tailwind.config.ts read directly, tokens verified
- Architecture: HIGH — all component files audited directly from source
- Pitfalls: HIGH — colorScheme and purge issues are well-documented in Tailwind ecosystem
- Hex inventory: HIGH — grep audit across entire components/ and app/(dashboard)/ directories

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (stable codebase, no external dependencies)

---
phase: 09-design-system-hardening
plan: 04
status: completed
completed_at: "2026-03-30"
files_modified: 11
files_created: 0
---

# Plan 09-04 Summary: Migración seminarios/ + tramites/ + visas/ a Tailwind gj-*

## What was done

Migración completa de 11 archivos distribuidos en `components/seminarios/`, `components/tramites/` y `components/visas/`. Se eliminaron todos los objetos `inputStyle`/`labelStyle`, todos los hex/rgba en `style={}`, y se migraron los BADGE maps al patrón `{ classes, label }`.

### Archivos migrados

| Archivo | Cambios clave |
|---|---|
| `seminarios/NuevoSeminarioModal.tsx` | inputStyle/labelStyle → className, focus rings, colores hex → gj-* |
| `seminarios/EditarSeminarioModal.tsx` | inputStyle/labelStyle → className, focus rings, hex → gj-* |
| `seminarios/AgregarAsistenteModal.tsx` | inputStyle/labelStyle → className, hex → gj-* |
| `seminarios/EditarAsistenteModal.tsx` | inputStyle/labelStyle → className, hex → gj-* |
| `seminarios/InactivarSeminarioButton.tsx` | hex → gj-*, boxShadow kept |
| `seminarios/SeminarioCard.tsx` | hover JS state → Tailwind `hover:border-white/[14%]`, BADGE_MODALIDAD → classes |
| `seminarios/AsistentesTable.tsx` | BADGE maps (PAGO, CONVIRTIO, MODALIDAD) → classes, Spinner hex → Tailwind |
| `tramites/TramitesTable.tsx` | BADGE_VISA → classes, Spinner hex → Tailwind |
| `visas/IniciarVisaModal.tsx` | inputStyle/labelStyle → className, error borders → conditional border-gj-red, accentColor → accent-gj-amber |
| `visas/EditarVisaModal.tsx` | inputStyle/labelStyle → className, error borders → conditional border-gj-red, ESTADO_COLORS → ESTADO_DOT con clases Tailwind |
| `visas/NuevoTramiteModal.tsx` | inputStyle/labelStyle → className, hex → gj-*, date inputs con colorScheme:dark |

### Cambios especiales

**SeminarioCard — hover state migrado a Tailwind:**
- Antes: `useState(false)` + `onMouseEnter/onMouseLeave` + `style={{ border: hovered ? ... : ... }}`
- Después: `className="border border-white/[6%] hover:border-white/[14%] transition-colors"`

**Spinners (AsistentesTable + TramitesTable):**
- Antes: `style={{ border: '2px solid rgba(...)', borderTopColor: '#22c97a' }}`
- Después: `className="border-2 border-white/10 border-t-gj-green"` / `border-t-gj-blue`

**EditarVisaModal — dot dinámico:**
- Antes: `ESTADO_COLORS` con hex + `style={{ backgroundColor: estadoColor }}`
- Después: `ESTADO_DOT` con clases Tailwind + `className={estadoDotClass}`

**Error borders (IniciarVisaModal + EditarVisaModal):**
- Antes: `style={{ ...inputStyle, borderColor: errors.campo ? '#e85a5a' : ... }}`
- Después: `className={`... ${errors.campo ? 'border-gj-red' : 'border-white/10'}`}`

### Lo que permaneció como style={}

- `colorScheme: 'dark'` — date inputs (requerido por el browser)
- `boxShadow` — modals y dropdowns con sombras complejas
- `gridColumn: '1 / -1'` — grid span sin equivalente directo en Tailwind
- `minHeight` / `minWidth` — layout constraints puntuales (textareas, tables)

## Test results

- `npm run build` ✅ compilado sin errores TypeScript
- Grep final de hex/color en style props ✅ PASS: no disallowed style props

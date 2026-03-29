---
phase: 09-design-system-hardening
plan: 03
status: completed
completed_at: "2026-03-28"
files_modified: 6
files_created: 0
---

# Plan 09-03 Summary: Migración components/clientes/ a Tailwind gj-*

## What was done

Migración completa de los 6 archivos de `components/clientes/`.

### Archivos migrados

- **NuevoClienteModal.tsx** — `inputStyle`/`labelStyle`/`requiredStar` eliminados, todo migrado a `gj-*`
- **EditarClienteModal.tsx** — ídem; `ESTADO_COLORS` reemplazado por `ESTADO_DOT_COLOR` para el dot indicator (único caso con backgroundColor dinámico justificado)
- **RegistrarPagoModal.tsx** — success overlay, form fields y footer migrados; error border usa `border-gj-red` condicional
- **AgregarNotaModal.tsx** — migración limpia; `border-gj-secondary/35`
- **ClientePagosTable.tsx** — `BADGE_PAGO` restructurado a `{ label, classes }`; `SmallBadge` acepta `classes`; `boxShadow` preservado en dropdown
- **ClientesTable.tsx** — 3 BADGE maps restructurados; `Badge` component actualizado; select inline de estado reemplazado con clases estáticas `bg-gj-input`; `accentColor` → `accent-gj-amber`

### Lo que permaneció como style={}
- `colorScheme: 'dark'` en date inputs
- `boxShadow` en dropdowns y toasts
- `minWidth: 600` en tabla (constraint responsivo)
- `backgroundColor` dinámico en `ESTADO_DOT_COLOR` (dot indicator de EditarClienteModal — valor dinámico en runtime)

## Test results

- `npm run build` ✅ compilado sin errores TypeScript — 28/28 páginas generadas

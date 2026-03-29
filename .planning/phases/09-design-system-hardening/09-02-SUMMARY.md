---
phase: 09-design-system-hardening
plan: 02
status: completed
completed_at: "2026-03-28"
files_modified: 5
files_created: 0
---

# Plan 09-02 Summary: Migración components/pagos/ a Tailwind gj-*

## What was done

Migración completa de los 5 archivos de `components/pagos/` eliminando inline `style={}` con hex y reemplazando con clases Tailwind `gj-*`.

### Archivos migrados

- **NuevoPagoModal.tsx** — `inputStyle`/`labelStyle` eliminados, reemplazados por `inputClass`/`labelClass` string constants. Backdrop y panel con clases Tailwind. `accentColor` → `accent-gj-amber`. Date inputs mantienen `style={{ colorScheme: 'dark' }}`. Modal panel mantiene `boxShadow` en style.
- **PagosTable.tsx** — `BADGE_ESTADO` y `BADGE_TIPO` migrados de `{ color, bg, label }` a `{ classes, label }`. Tabla, filtros y dropdowns migrados a clases `gj-*`. `SmallBadge` component actualizado para aceptar prop `classes`.
- **DetallePagoModal.tsx** — BADGE maps migrados. Modal panel y secciones de detalle con clases Tailwind.
- **CambiarEstadoPagoDialog.tsx** — Dialog migrado completo a clases `gj-*`.
- **FechaVencimientoDialog.tsx** — DialogContent/DialogHeader/DialogTitle con className-based styling.

### Patrones aplicados

- `inputStyle` object → `inputClass` string const con `focus:ring-2 focus:ring-gj-amber focus:outline-none`
- `labelStyle` object → `labelClass` string const
- Backdrop modal: `className="fixed inset-0 z-[60] bg-black/55"`
- Panel modal: `className="fixed top-1/2 left-1/2 ... bg-gj-card border border-white/10 rounded-2xl"`
- Solo permanecen como `style={}`: `boxShadow` (modales) y `colorScheme: 'dark'` (date inputs) y `gridTemplateColumns` (grids complejos)

## Test results

- `npm run build` ✅ compilado sin errores TypeScript

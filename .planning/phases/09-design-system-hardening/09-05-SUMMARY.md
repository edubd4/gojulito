---
phase: 09-design-system-hardening
plan: 05
status: completed
completed_at: "2026-03-30"
files_modified: 21
files_created: 0
---

# Plan 09-05 Summary: Migración final — configuracion/ + calendario/ + grupos/ + páginas app/

## What was done

Migración completa de los últimos archivos con inline styles. Después de este plan, toda la codebase fuera de `components/ui/` usa exclusivamente tokens Tailwind `gj-*` para colores. Phase 09 DS-01, DS-02, DS-03, DS-04 completamente satisfechos.

### Archivos migrados

- `configuracion/` (10 archivos incl. NuevoUsuarioTrigger): inputStyle/labelStyle → className, focus rings, hex → gj-*
- `grupos/AccionLoteGrupoModal.tsx`: BADGE_VISA → classes pattern, inputStyle → className
- `dashboard/AccionesRapidas.tsx`: btnBase eliminado, botones → bg-gj-amber / bg-gj-blue/[12%] / bg-gj-green/[12%]
- `app/(dashboard)/*.tsx` (7 páginas): root div → bg-gj-bg min-h-full, hex → gj-*
- `app/(dashboard)/page.tsx`: BADGE_VISA → classes, urgColor → urgClassName condicional, METRIC_CARDS → METRIC_COLOR_MAP Tailwind
- `calendario/CalendarioView.tsx`: CHIP/BADGE/SEMINARIO_CHIP → classes, SEMINARIO_CHIP_CLASSES = 'text-gj-seminario bg-gj-seminario/[18%]'

### Lo que permaneció como style={}

- `colorScheme: 'dark'` — date inputs
- `boxShadow` — modals, tooltips, popups
- `gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))'` — grid responsive sin equivalente Tailwind
- SVG `stroke="#..."` — atributos SVG, fuera de scope DS-01

## Test results

- `npm run build` compilado sin errores TypeScript

---
phase: 13-formularios-dropdowns-fecha-turno
plan: 01
subsystem: ui
tags: [react, tailwind, select, colorscheme, wizard, form]

# Dependency graph
requires: []
provides:
  - "colorScheme dark en todos los selects del sistema (46+ selects en 13 archivos)"
  - "Campo fecha_turno condicional en wizard paso 4 — visible solo cuando TURNO_ASIGNADO"
  - "WizardData.fecha_turno enviado a /api/visas al crear tramite con TURNO_ASIGNADO"
affects: [fase-14, fase-15, fase-16]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "style={{ colorScheme: 'dark' }} en cada <select> nativo para evitar override del OS en Chrome/Edge"
    - "Campo condicional JSX con patron {condicion && <div>...</div>} para mostrar/ocultar inputs"

key-files:
  created: []
  modified:
    - "components/clientes/ClientesTable.tsx"
    - "components/clientes/EditarClienteModal.tsx"
    - "components/clientes/NuevoClienteModal.tsx"
    - "components/configuracion/EditarUsuarioModal.tsx"
    - "components/pagos/NuevoPagoModal.tsx"
    - "components/pagos/PagosTable.tsx"
    - "components/seminarios/AgregarAsistenteModal.tsx"
    - "components/seminarios/EditarAsistenteModal.tsx"
    - "components/seminarios/LogisticaSection.tsx"
    - "components/tramites/TramitesTable.tsx"
    - "components/visas/EditarVisaModal.tsx"
    - "components/visas/IniciarVisaModal.tsx"
    - "components/visas/NuevoTramiteModal.tsx"
    - "components/tramites/NuevoTramiteWizard.tsx"
    - "components/tramites/steps/StepVisaDS160.tsx"

key-decisions:
  - "Se agrego colorScheme al select estado_pago en AgregarAsistenteModal aunque el plan lo omitia — archivo real no tenia el prop (alineado con intencion del plan)"

patterns-established:
  - "Todos los <select> nativos requieren style={{ colorScheme: 'dark' }} para consistencia visual en dark theme"
  - "Campos condicionales en wizard: {data.campo === 'VALOR' && (<div>...</div>)}"

requirements-completed: [FIX-01, FIX-02]

# Metrics
duration: 12min
completed: 2026-04-06
---

# Phase 13 Plan 01: Formularios Dropdowns + Fecha Turno Summary

**style colorScheme dark agregado a 40+ selects en 13 archivos y campo fecha_turno condicional en wizard paso 4 con envio a /api/visas**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-06T22:27:40Z
- **Completed:** 2026-04-06T22:39:40Z
- **Tasks:** 2 de 3 completados (Task 3 es checkpoint humano pendiente)
- **Files modified:** 15

## Accomplishments

- FIX-01: Todos los `<select>` en 13 archivos ahora tienen `style={{ colorScheme: 'dark' }}` — elimina el fondo blanco del OS en Chrome/Edge
- FIX-02: Wizard paso 4 muestra campo "Fecha del Turno" condicionalmente cuando se selecciona TURNO_ASIGNADO, y lo oculta cuando se selecciona EN_PROCESO
- Build Next.js pasa sin errores TypeScript despues de ambos fixes

## Task Commits

Cada task fue commiteado atomicamente:

1. **Task 1: FIX-01 — colorScheme dark en todos los selects** - `93c8bbd` (fix)
2. **Task 2: FIX-02 — campo fecha_turno en wizard paso 4** - `c187682` (fix)
3. **Task 3: Checkpoint verificacion visual** - pendiente aprobacion humana

## Files Created/Modified

- `components/clientes/ClientesTable.tsx` — 9 selects: 4 filtros, 2 inline tabla, 3 barra masiva
- `components/clientes/EditarClienteModal.tsx` — 4 selects: provincia, canal, estado, grupo_familiar
- `components/clientes/NuevoClienteModal.tsx` — 3 selects: provincia, canal, grupo_familiar
- `components/configuracion/EditarUsuarioModal.tsx` — 1 select: rol
- `components/pagos/NuevoPagoModal.tsx` — 4 selects: cliente, tipo, visa, estado
- `components/pagos/PagosTable.tsx` — 2 selects: estado filtro, tipo filtro
- `components/seminarios/AgregarAsistenteModal.tsx` — 4 selects: cliente, modalidad, estado_pago, convirtio
- `components/seminarios/EditarAsistenteModal.tsx` — 4 selects: modalidad, estado_pago, convirtio, cliente
- `components/seminarios/LogisticaSection.tsx` — 2 selects: tipo, estado
- `components/tramites/TramitesTable.tsx` — 2 selects: estado filtro, grupo filtro
- `components/visas/EditarVisaModal.tsx` — 1 select: estado visa
- `components/visas/IniciarVisaModal.tsx` — 1 select: estado inicial
- `components/visas/NuevoTramiteModal.tsx` — 3 selects: canal, cliente, estadoVisa
- `components/tramites/NuevoTramiteWizard.tsx` — WizardData.fecha_turno, INITIAL_DATA, handleStep4Submit
- `components/tramites/steps/StepVisaDS160.tsx` — campo date condicional TURNO_ASIGNADO

## Decisions Made

- Se agrego `colorScheme: 'dark'` al select `estado_pago` en `AgregarAsistenteModal` aunque el plan lo marcaba como "ya tiene colorScheme" — al leer el archivo real el select no tenia el prop (era el `input type="date"` adyacente el que lo tenia). Alineado con la intencion del plan.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Agregado colorScheme al select estado_pago en AgregarAsistenteModal**
- **Found during:** Task 1 (FIX-01 — colorScheme dark en todos los selects)
- **Issue:** El plan decia que el select en ~290 ya tenia colorScheme, pero al leer el archivo real el select `estado_pago` (linea 290) no tenia el prop. El que tenia colorScheme era el `input type="date"` en linea 322.
- **Fix:** Se agrego `style={{ colorScheme: 'dark' }}` al select `estado_pago` como correcto segun la intencion del plan
- **Files modified:** components/seminarios/AgregarAsistenteModal.tsx
- **Verification:** Build pasa sin errores
- **Committed in:** 93c8bbd (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug de conteo en el plan)
**Impact on plan:** Fix menor alineado con intencion del plan. No hay scope creep.

## Issues Encountered

None — ambos tasks ejecutados sin bloqueos.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- FIX-01 y FIX-02 completos y commiteados
- Pendiente verificacion visual por parte del usuario (Task 3 checkpoint)
- Una vez aprobado, se puede proceder a fase 14

## Known Stubs

None — todos los cambios son funcionales. El campo fecha_turno se envia a la API al crear el tramite.

---

*Phase: 13-formularios-dropdowns-fecha-turno*
*Completed: 2026-04-06 (pendiente checkpoint Task 3)*

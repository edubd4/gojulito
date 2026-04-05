---
phase: 11-pagos-pago-parcial
plan: 01
status: complete
completed_at: "2026-04-04"
files_modified:
  - components/pagos/NuevoPagoModal.tsx
---

# Plan 11-01 Summary — Partial Payment Flow

## What was built

Reworked `NuevoPagoModal.tsx` to support partial payment flow:

- **Removed**: `registrarDeuda`, `montoDeuda`, `fechaVencDeuda`, `notasDeuda` state and all associated JSX (old "También registrar deuda pendiente" checkbox block)
- **Added**: `archivarResto` state (default `true`)
- **Added**: `formatPesos` import from `@/lib/utils`
- **Desglose panel**: Inside the amber debt panel, when `resolverDeuda=true` and `monto > 0`:
  - If `monto < deuda`: shows 3-column grid (Total / Pagado / Resto) with "Archivar deuda restante ($X)" toggle checked by default
  - If `monto >= deuda`: shows green "Pago completo — cancela la deuda" indicator
- **handleSubmit**: After the main PATCH succeeds, if `archivarResto=true` and `resto > 0`, creates a second POST to `/api/pagos` with `estado: 'PENDIENTE'` and no `fecha_vencimiento_deuda` (excludes it from `v_deudas_proximas`)

## Verification

- All 15 acceptance criteria PASS (fecha_vencimiento_deuda check was on remainder body only — confirmed absent)
- `npm run build` exits 0 with no TypeScript errors

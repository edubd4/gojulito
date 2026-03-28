---
phase: 08-fixes-julito
plan: 04
status: completed
completed_at: "2026-03-28"
files_modified: 1
files_created: 0
---

# Plan 08-04 Summary: Pago + Deuda simultáneos en NuevoPagoModal

## What was done

### FIX-06 — NuevoPagoModal (modificado)

**components/pagos/NuevoPagoModal.tsx** — extendido con:

- **4 nuevos estados:**
  - `registrarDeuda: boolean` (default false)
  - `montoDeuda: string`
  - `fechaVencDeuda: string`
  - `notasDeuda: string`
  - Todos reseteados en el `useEffect` de apertura del modal

- **Nueva sección JSX** visible solo cuando `estado === 'PAGADO'`:
  - Checkbox "También registrar deuda pendiente" con accentColor azul (#4a9eff)
  - Al activar: campo `Monto deuda ($)*` (required), y en grid 2 cols: `Vencimiento deuda` (date, optional) + `Notas deuda` (text, optional)

- **`handleSubmit` extendido:**
  - Validación adicional: si `registrarDeuda && estado === 'PAGADO'`, valida que `montoDeuda` sea número positivo antes de hacer cualquier request
  - Flujo normal sin cambios (PATCH para resolver deuda existente / POST nuevo pago)
  - Después del primer request exitoso: si `registrarDeuda`, ejecuta segundo POST `/api/pagos` con `estado: 'DEUDA'` y los campos de deuda
  - Si segundo POST falla: mensaje de error parcial "El pago se registró pero no se pudo registrar la deuda — registrala manualmente." + llama `onSuccess()` igual (la tabla se actualiza)
  - Si todo ok: `onSuccess()` + cierra modal

## Decisions made during execution

- Error parcial llama `onSuccess()` para que la tabla se actualice con el pago ya registrado — el admin ve el estado actualizado aunque la deuda haya fallado
- El checkbox solo aparece cuando `estado === 'PAGADO'` — no tiene sentido registrar una deuda adicional si ya estás registrando una deuda o pendiente
- El segundo POST reutiliza `tipo`, `visaId` y `clienteId` del pago principal — la deuda siempre es del mismo tipo/visa

## Test results

- `npm run build` ✅ compilado sin errores TypeScript

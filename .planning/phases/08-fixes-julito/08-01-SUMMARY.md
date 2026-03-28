---
phase: 08-fixes-julito
plan: 01
status: completed
completed_at: "2026-03-28"
commit: 89699e4
files_modified: 5
---

# Plan 08-01 Summary: Estado ACTIVO default + Validación real visa_id

## What was done

### FIX-01 — Estado ACTIVO por defecto al crear cliente

**lib/schemas/clientes.ts**
- `estado` en `createClienteSchema` pasó de `z.enum(..., 'Estado es requerido')` (requerido) a `z.enum(...).optional()`
- El campo ya no rechaza requests que no envíen estado (el bot Telegram ya no necesita enviarlo)

**app/api/clientes/route.ts**
- `estado: body.estado` → `estado: 'ACTIVO'` hardcodeado en el objeto `insert`
- El dashboard siempre crea clientes como ACTIVO independientemente del body

**app/api/webhook/clientes/route.ts**
- Mismo cambio: `estado: body.estado` → `estado: 'ACTIVO'`
- El bot Telegram ya no pregunta ni envía el estado al crear un cliente

### FIX-02 — Validación real de visa_id en pagos

**app/api/pagos/route.ts**
- Agregado bloque de validación después de `createServiceRoleClient()` y antes de generar el pago_id
- Si `body.visa_id` está presente: query a `visas` para verificar existencia y ownership
- 404 si la visa no existe: `"La visa indicada no existe. Primero registrá el trámite de visa para este cliente."`
- 422 si la visa no pertenece al cliente: `"La visa no pertenece a este cliente."`

**app/api/webhook/pagos/route.ts**
- Mismo bloque de validación con mensaje más descriptivo para el bot:
- 404: `"No se puede registrar el pago: el cliente no tiene un trámite de visa registrado. Primero creá el trámite."`

## Decisions made during execution

- Ninguna decisión nueva — implementación siguió exactamente el CONTEXT

## Test results

- `npm run build` ✅ sin errores ni warnings

## Key links verified

- `lib/schemas/clientes.ts` → `estado` optional ✅
- `app/api/clientes/route.ts` → `estado: 'ACTIVO'` ✅
- `app/api/webhook/clientes/route.ts` → `estado: 'ACTIVO'` ✅
- `app/api/pagos/route.ts` → visa validation block ✅
- `app/api/webhook/pagos/route.ts` → visa validation block ✅

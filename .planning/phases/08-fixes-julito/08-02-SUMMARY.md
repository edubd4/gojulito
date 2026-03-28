---
phase: 08-fixes-julito
plan: 02
status: completed
completed_at: "2026-03-28"
commit: 7b9a67b
files_modified: 3
---

# Plan 08-02 Summary: Cards navegables + Estados simplificados en UI

## What was done

### FIX-03 — Cards del dashboard clickeables

**app/(dashboard)/page.tsx**
- Agregado campo `href` a cada elemento de `METRIC_CARDS`:
  - Clientes activos → `/clientes`
  - Visas en proceso → `/tramites`
  - Turnos esta semana → `/calendario`
  - Deudas próximas → `/pagos`
- `<div>` de cada card reemplazado por `<Link href={href}>` de Next.js
- Clases `hover:brightness-110` para feedback visual de interactividad
- `textDecoration: 'none'` y `display: 'block'` para mantener el layout

### FIX-04 — Estados de cliente simplificados en UI

**components/clientes/NuevoClienteModal.tsx**
- Eliminado campo "Estado cliente" del formulario completo
- Eliminado `estado` de `FormState` interface y `EMPTY_FORM`
- Eliminada constante `ESTADO_COLORS` y variable `estadoActual`
- Eliminado import de `EstadoCliente` (ya no se usa)
- `body` enviado al POST ya no incluye `estado` (server hardcodea ACTIVO vía FIX-01)

**components/clientes/EditarClienteModal.tsx**
- Select de estado muestra solo `ACTIVO` y `FINALIZADO`
- Si `form.estado === 'PROSPECTO'` → select muestra ACTIVO (normalización de registros viejos)
- Si `form.estado === 'INACTIVO'` → option INACTIVO visible pero `disabled` (soft-delete, no editable)
- `estadoColor` con fallback a `ESTADO_COLORS['ACTIVO']` para colores no mapeados

## Decisions made during execution

- PROSPECTO mapea a ACTIVO en el select value (no en el field) — si el user guarda sin cambiar estado, se guarda ACTIVO
- INACTIVO se muestra como disabled solo si el cliente ya lo tiene — no hay forma de "activar" un cliente inactivo desde este modal

## Test results

- `npm run build` ✅ compilado sin errores

## Key links verified

- `app/(dashboard)/page.tsx` → cards como `<Link>` ✅
- `NuevoClienteModal.tsx` → sin campo estado ✅
- `EditarClienteModal.tsx` → solo ACTIVO/FINALIZADO en select ✅

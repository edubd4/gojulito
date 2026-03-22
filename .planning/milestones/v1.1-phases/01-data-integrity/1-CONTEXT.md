# Phase 1: Data Integrity - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Corregir tres bugs de integridad de datos:
1. Bulk-delete realiza DELETE físico en lugar de soft-delete
2. La lista de clientes muestra estado de visa y pago incorrecto (sin ordering, resultado aleatorio)
3. La lógica de cascada FINALIZADO está duplicada en 3 rutas

No incluye validación Zod ni feedback de errores — eso es Phase 2 y 3.

</domain>

<decisions>
## Implementation Decisions

### INTG-01: Bulk-delete → soft-delete
- Cambiar `.delete().in('id', ids)` por `.update({ estado: 'INACTIVO' }).in('id', ids)`
- Al marcar un cliente INACTIVO en bulk, también marcar sus visas activas (EN_PROCESO, TURNO_ASIGNADO, PAUSADA) como CANCELADA
- Registrar en historial: una entrada por cliente marcado INACTIVO

### INTG-02: Estado de visa en lista de clientes
- Mostrar la visa activa más reciente (EN_PROCESO, TURNO_ASIGNADO, PAUSADA) — la de mayor `created_at` entre las no-terminales
- Si no hay visa activa, mostrar el estado de la visa más reciente (aunque sea terminal: APROBADA, RECHAZADA, CANCELADA)
- Si no hay visas en absoluto, mostrar `null`
- La query anidada actual `visas ( estado )` no tiene ordering garantizado — se debe cambiar a una query separada con `order('created_at', { ascending: false })`

### INTG-02: Estado de pago en lista de clientes
- Priority logic: si algún pago del cliente es DEUDA → mostrar DEUDA
- Si no hay DEUDA: si alguno es PENDIENTE → mostrar PENDIENTE
- Si todos son PAGADO → mostrar PAGADO
- Si no hay pagos → mostrar `null`
- Igual que visas: la query anidada actual no tiene ordering — cambiar a query separada

### INTG-03: Cascada FINALIZADO — helper centralizado
- Extraer la lógica duplicada a `lib/visas.ts` (función `aplicarCascadaFinalizado(supabase, clienteId, visaIdExcluir)`)
- Reemplazar las 3 copias actuales:
  - `app/api/visas/[id]/route.ts:127-153`
  - `app/api/webhook/visas/route.ts:106-133`
  - `app/api/grupos-familiares/[id]/visas/route.ts:173-198`
- La función también inserta en historial (mismo mensaje actual: "Cliente marcado como FINALIZADO...")

### Claude's Discretion
- Nombre exacto del archivo helper (`lib/visas.ts` o similar)
- Implementación de la query de pagos (puede ser JS reduce o múltiples queries)
- Manejo de errores dentro de la cascada de bulk-delete (si un cliente falla, ¿continúa con el resto?)

</decisions>

<specifics>
## Specific Ideas

- El bulk-delete al cancelar visas activas debe insertar historial por cada visa cancelada, no solo por el cliente
- La prioridad DEUDA > PENDIENTE > PAGADO refleja lo más importante para Julio en el listado: ver deudas primero

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.

### Requirements
- `REQUIREMENTS.md` §Data Integrity — INTG-01, INTG-02, INTG-03

### Código afectado (leer antes de planificar)
- `app/api/clientes/bulk-delete/route.ts` — contiene el DELETE físico (línea 41-44)
- `app/(dashboard)/clientes/page.tsx` — contiene la query con `visas[0]`/`pagos[0]` sin ordering (líneas 22-54)
- `app/api/visas/[id]/route.ts` — contiene cascada FINALIZADO (líneas 127-153)
- `app/api/webhook/visas/route.ts` — segunda copia de la cascada (líneas 106-133)
- `app/api/grupos-familiares/[id]/visas/route.ts` — tercera copia de la cascada (líneas 173-198)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `createServiceRoleClient()` — ya usado en todas las rutas afectadas, patrón establecido
- `historial` INSERT — patrón existente, replicar para las nuevas entradas (visa cancelada, cliente INACTIVO)
- `ESTADOS_TERMINALES` ya definido como constante en `grupos-familiares/[id]/visas/route.ts:5` — el helper debe definirlo una sola vez

### Established Patterns
- Soft-delete: ya existe `bulk-update/route.ts` que actualiza estado de clientes — el bulk-delete debe seguir el mismo patrón
- `historial` INSERT: `{ cliente_id, visa_id?, tipo, descripcion, origen, usuario_id }` — usar `origen: 'sistema'` para acciones automáticas

### Integration Points
- El helper de cascada recibe `supabase` como parámetro (no puede usar `createServiceRoleClient()` internamente porque la instancia ya existe en el caller)
- La página de clientes es un Server Component — la query corregida también debe ser server-side, no una API call

</code_context>

<deferred>
## Deferred Ideas

- Cancelar visas al marcar cliente INACTIVO de forma individual (no bulk) — no está en scope de INTG-01, posible Phase 2 enhancement
- Mostrar badge de "múltiples visas activas" en el listado — fuera de scope

</deferred>

---

*Phase: 01-data-integrity*
*Context gathered: 2026-03-21*

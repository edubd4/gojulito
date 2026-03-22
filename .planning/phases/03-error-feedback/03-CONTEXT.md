# Phase 3: Error Feedback - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Garantizar que los tres flujos de **edición** de clientes, visas y pagos muestren feedback de error claro y nunca fallen silenciosamente. El scope es estrictamente las modals de edición:

- `EditarClienteModal` — ya correctamente migrada en Phase 2 (verificar)
- `EditarVisaModal` — usa patrón viejo (`json.success`), necesita fix
- `DetallePagoModal` — usa patrón viejo (`json.success` + `json.pago`), necesita fix

**Fuera de scope:** operaciones inline de tablas (PagosTable, TramitesTable, ClientePagosTable), flujos de creación (NuevoPagoModal, IniciarVisaModal, NuevoClienteModal).

</domain>

<decisions>
## Implementation Decisions

### Component scope
- **D-01:** Solo tres componentes en scope: `EditarClienteModal`, `EditarVisaModal`, `DetallePagoModal`
- **D-02:** Las operaciones inline de tablas quedan fuera — demasiado riesgo de romper flujos que funcionan (PagosTable, TramitesTable, ClientePagosTable, ClientesTable)
- **D-03:** `NuevoPagoModal` queda fuera — usa patrón viejo pero funciona, no es un flujo de edición
- **D-04:** `EditarClienteModal` ya fue migrada en Phase 2 — solo verificar que cumple el UAT de Phase 3

### Fix de error check
- **D-05:** Cambiar `!json.success` → `json.error` en `EditarVisaModal` y `DetallePagoModal`
- **D-06:** Patrón correcto: `if (!res.ok || json.error) { setServerError(json.error ?? 'mensaje fallback') }`
- **D-07:** El formulario debe quedar abierto con los datos ingresados en caso de error (no llamar `onSuccess()` ni cerrar el modal)

### Optimistic updates
- **D-08:** Usar `json.data` para leer datos actualizados (el API retorna `{ data: pago, error: null }`)
- **D-09:** `EditarVisaModal` usa `router.refresh()` en el success path — no tiene optimistic update, solo fix el error check
- **D-10:** `DetallePagoModal` lee `json.pago?.fecha_pago`, `json.pago?.fecha_vencimiento_deuda` — cambiar a `json.data?.fecha_pago`, `json.data?.fecha_vencimiento_deuda`
- **D-11:** No mezclar `json.data` y `router.refresh()` en el mismo componente; si `json.data` tiene todos los campos necesarios, usarlo; si no, `router.refresh()`

### Error display pattern
- **D-12:** No estandarizar ahora — cada componente conserva su patrón actual (inline `serverError` state en modals)
- **D-13:** Estandarización entre tablas (inline vs toasts) es mejora futura, no Phase 3

### Claude's Discretion
- Mensaje de fallback exacto en caso de que `json.error` sea null (`'Error al actualizar'` es aceptable)
- Si `DetallePagoModal` necesita `router.refresh()` adicional después de update exitoso (para sincronizar historial), Claude decide

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above.

### Requirements
- `.planning/REQUIREMENTS.md` §UX / Feedback — UX-01: criterio de aceptación exacto

### Componentes en scope (leer antes de planificar)
- `components/visas/EditarVisaModal.tsx` — línea 148: `if (!res.ok || !json.success)` — error check a corregir
- `components/pagos/DetallePagoModal.tsx` — línea 128: `if (!res.ok || !json.success)`, líneas 138-139: `json.pago?.fecha_pago` — ambos a corregir
- `components/clientes/EditarClienteModal.tsx` — línea 195: ya usa `json.error` — solo verificar

### API routes (para entender el shape de respuesta)
- `app/api/visas/[id]/route.ts` — PATCH retorna `{ data: visa, error: null }` en éxito
- `app/api/pagos/[id]/route.ts` — PATCH retorna `{ data: pago, error: null }` en éxito
- `app/api/clientes/[id]/route.ts` — PATCH retorna `{ data: cliente, error: null }` en éxito

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `serverError` state pattern — ya establecido en EditarClienteModal y EditarVisaModal: `const [serverError, setServerError] = useState('')`
- Display de error inline — bloque rojo condicional en modals, `{serverError && (<div style={{ backgroundColor: 'rgba(232,90,90,0.12)', ... }}>{serverError}</div>)}`

### Established Patterns
- Error check correcto (Phase 2): `if (!res.ok || json.error) { setServerError(json.error ?? 'fallback') }`
- Error check roto (viejo): `if (!res.ok || !json.success) { setServerError(json.error ?? 'fallback') }` — `json.success` siempre undefined → siempre muestra error
- Success path: `router.refresh()` luego `onSuccess()` o cierre del modal

### Integration Points
- `EditarVisaModal` llama `app/api/visas/[id]` PATCH → `{ data: visa, error: null }`
- `DetallePagoModal` llama `app/api/pagos/[id]` PATCH → `{ data: pago, error: null }`
- `EditarClienteModal` llama `app/api/clientes/[id]` PATCH → `{ data: cliente, error: null }`

</code_context>

<specifics>
## Specific Ideas

- La regresión más crítica es `DetallePagoModal`: actualmente muestra "Error al guardar" en TODOS los saves (exitosos o no), porque `json.success` es siempre `undefined` con el nuevo API shape
- `EditarVisaModal` también está roto de la misma forma
- El fix en ambos casos es mínimo: cambiar el check de `json.success` a `json.error`

</specifics>

<deferred>
## Deferred Ideas

- Estandarización de error display: inline errorMsg vs toasts entre tablas — mejora futura
- Migración de NuevoPagoModal al patrón `{ data, error }` — futura fase de cleanup
- Operaciones inline de tablas (PagosTable, TramitesTable) — fuera de scope de Phase 3

</deferred>

---

*Phase: 03-error-feedback*
*Context gathered: 2026-03-22*

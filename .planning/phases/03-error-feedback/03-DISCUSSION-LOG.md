# Phase 3: Error Feedback - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-22
**Phase:** 03-error-feedback
**Areas discussed:** Component scope, Optimistic update fix, Error display pattern, Creaciones (scope)

---

## Component Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Solo modals de edición | EditarClienteModal, EditarVisaModal, DetallePagoModal | ✓ |
| Incluir tablas inline | PagosTable, TramitesTable, ClientePagosTable también | |

**User's choice:** Solo las modals de edición. Operaciones inline de tablas quedan fuera — demasiado riesgo de romper flujos que funcionan.

---

## Optimistic Update Fix

| Option | Description | Selected |
|--------|-------------|----------|
| Usar json.data | Leer json.data para actualizaciones optimistas | ✓ |
| router.refresh() siempre | Re-fetch completo en lugar de update optimista | |
| Mixto | json.data donde posible, refresh como fallback | |

**User's choice:** Usar `json.data`. Si `json.data` no tiene los campos necesarios, usar `router.refresh()` como fallback. No mezclar los dos patrones en el mismo componente.

---

## Error Display Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Dejar patrón actual | Cada componente conserva su patrón (inline/toast) | ✓ |
| Estandarizar a inline | Todos usan inline errorMsg block | |
| Estandarizar a toasts | Todos usan toast notifications | |

**User's choice:** No estandarizar en esta fase. El riesgo de romper tablas que funcionan no vale la pena. Registrar como mejora futura.

---

## Creaciones (NuevoPagoModal)

| Option | Description | Selected |
|--------|-------------|----------|
| Fuera de scope | Solo edición — NuevoPagoModal no se toca | ✓ |
| Incluir | Migrar también flujos de creación | |

**User's choice:** NuevoPagoModal queda fuera. Foco estrictamente en edición. Funciona con el patrón viejo, no tocarlo en esta fase.

---

## Claude's Discretion

- Mensaje de fallback exacto cuando `json.error` es null
- Si `DetallePagoModal` necesita `router.refresh()` adicional después de update exitoso

## Deferred Ideas

- Estandarización inline vs toasts entre tablas — mejora futura
- Migración de NuevoPagoModal al patrón `{ data, error }` — futura fase de cleanup

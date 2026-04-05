# Phase 11: Pagos — Pago Parcial - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Rework `NuevoPagoModal` para que cuando el usuario ingresa un monto menor a la deuda existente, el modal calcule y muestre el resto automáticamente en tiempo real, y ofrezca un toggle para archivar el remanente como `PENDIENTE` sin fecha de vencimiento.

**Fuera de scope:** cambios en otras partes del flujo de pagos, nuevas rutas, cambios a PagosTable, o modificaciones a otras vistas.

</domain>

<decisions>
## Implementation Decisions

### UI — Panel de desglose
- **D-01:** El panel de cálculo (total / pagado / resto) se extiende **dentro del panel amber existente** (el de "Deuda pendiente"), no en una sección separada.
- **D-02:** El panel de desglose solo aparece cuando `resolverDeuda === true` AND `deudaDelTipo` existe AND `estado === 'PAGADO'` AND el usuario ha ingresado un monto > 0.
- **D-03:** Estructura del desglose (dentro del panel amber, después del checkbox "Cancelar deuda"):
  - Fila con 3 columnas: **Total** (deudaDelTipo.monto) | **Pagado** (monto ingresado) | **Resto** (deudaDelTipo.monto - monto)
  - Solo aparece cuando hay un monto válido en el input
- **D-04:** El toggle "Archivar deuda restante ($X)" aparece debajo del desglose, pero **solo cuando resto > 0** (monto < deuda total).

### UX — Toggle default
- **D-05:** El toggle "Archivar deuda restante" arranca **ON por defecto** cuando el resto > 0 aparece por primera vez. Esto evita pérdida accidental de datos.
- **D-06:** El toggle es un `<input type="checkbox">` con `accent-gj-amber`, mismo estilo que el "Cancelar deuda" existente.
- **D-07:** Label dinámico: "Archivar deuda restante ($X)" donde $X es el resto formateado con `toLocaleString('es-AR')`.

### UX — Monto ≥ deuda (pago completo)
- **D-08:** Cuando `monto >= deudaDelTipo.monto`, el panel amber muestra un indicador verde "Pago completo" en lugar del desglose y el toggle. El toggle se oculta completamente.
- **D-09:** Indicador verde: texto `text-gj-green font-semibold text-xs` con mensaje "Pago completo — cancela la deuda" (o similar).

### Lógica — PAG-03: eliminar checkbox viejo
- **D-10:** El bloque `registrarDeuda` (state + JSX lines 356-407 en NuevoPagoModal.tsx) se **elimina completamente**. No hay reemplazo — el nuevo flujo automático de PAG-01/PAG-02 lo reemplaza.
- **D-11:** Los estados eliminados: `registrarDeuda`, `montoDeuda`, `fechaVencDeuda`, `notasDeuda`. También el `useEffect` de reset para estos.

### Lógica — Creación del segundo pago (PENDIENTE)
- **D-12:** Cuando `archivarResto === true` y `resto > 0`, en el submit se hace:
  1. PATCH `/api/pagos/${deudaDelTipo.id}` con monto parcial y `estado: 'PAGADO'`
  2. POST `/api/pagos` con `{ cliente_id, tipo, monto: resto, fecha_pago, estado: 'PENDIENTE' }` — **sin** `fecha_vencimiento_deuda`
  Si la visa es tipo VISA, también incluir `visa_id` en ambos calls.
- **D-13:** El pago PENDIENTE sin `fecha_vencimiento_deuda` **ya está excluido** de `v_deudas_proximas` porque la vista filtra `p.fecha_vencimiento_deuda IS NOT NULL`. No requiere migración.

### Claude's Discretion
- Animaciones de transición en el desglose (fade-in cuando aparece resto)
- Colores exactos del indicador "Pago completo" — usar `gj-green` existente
- Manejo de edge case: monto = 0 antes de ingresar → no mostrar desglose, solo el panel amber normal

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Modal a modificar
- `components/pagos/NuevoPagoModal.tsx` — archivo principal a reworkear. El bloque amber de deuda existente está en líneas ~216-262. El checkbox a eliminar está en líneas ~356-407.

### Vistas DB (sin cambios requeridos)
- `v_deudas_proximas` — ya filtra `p.fecha_vencimiento_deuda IS NOT NULL`. Un pago PENDIENTE sin fecha queda automáticamente excluido. No se necesita migración.

### API endpoints (ya existen)
- `app/api/pagos/route.ts` — POST para crear nuevo pago
- `app/api/pagos/[id]/route.ts` — PATCH para actualizar pago existente

### Design System
- `CLAUDE.md` — tokens gj-* (gj-amber, gj-green, gj-text, gj-secondary), convenciones de color
- Patrón de checkbox: `w-4 h-4 accent-gj-amber cursor-pointer` (ya en el modal)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `resolverDeuda` state (bool) — controla si se hace PATCH o POST. La nueva lógica de `archivarResto` se agrega sobre este patrón.
- `deudaDelTipo` computation — ya calcula `deudas.find((d) => d.tipo === tipo)`. El nuevo desglose toma `deudaDelTipo.monto` como "Total".
- `formatPesos()` en `lib/utils.ts` — disponible para formatear montos (alternativa a `.toLocaleString('es-AR')`).

### Established Patterns
- Panels informativos: `bg-gj-amber/[8%] border border-gj-amber/30 rounded-lg px-3 py-2.5 text-[13px]` (panel deuda existente)
- Checkbox inline: `<label className="flex items-center gap-1.5 cursor-pointer">` (ya en el modal)
- Grid 3 columnas para desglose: puede usar `display: grid; grid-template-columns: 1fr 1fr 1fr`

### Integration Points
- El bloque JSX del panel amber (líneas ~222-246) se extiende, no se reemplaza
- El handler `handleSubmit` se modifica para: usar `archivarResto` en lugar de `registrarDeuda`, y crear pago PENDIENTE con `estado: 'PENDIENTE'` sin `fecha_vencimiento_deuda`

</code_context>

<specifics>
## Specific Ideas

- El label del toggle incluye el monto dinámico: "Archivar deuda restante ($600)" — se actualiza en tiempo real
- El indicador de "Pago completo" usa `text-gj-green` para coherencia con el badge system
- El desglose se oculta cuando monto está vacío (no cuando es 0) — evitar confusión mientras el usuario tipea

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---
*Phase: 11-pagos-pago-parcial*
*Context gathered: 2026-04-01 via /gsd:discuss-phase 11*

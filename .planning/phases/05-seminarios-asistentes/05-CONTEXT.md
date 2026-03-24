# Phase 5: Seminarios — Asistentes - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

El admin puede registrar y gestionar asistentes de cada seminario: agregar, editar datos operativos, registrar conversión a cliente de visa, y vincular/cambiar el cliente asociado después de la creación.

**Importante — estado del codebase:** La mayor parte de Phase 5 ya existe desde v1.0. El planner DEBE auditar el código existente antes de crear tareas nuevas.

Lo que ya está construido y NO necesita rehacerse:
- `AgregarAsistenteModal` — formulario completo: nombre, teléfono, provincia, modalidad, estado_pago, monto, convirtio, cliente_id (búsqueda por nombre/GJ-ID) ✅
- `EditarAsistenteModal` — edita modalidad, estado_pago, monto, convirtio, provincia ✅
- `AsistentesTable` — tabla con todos los campos + badges + botón editar ✅
- `POST /api/seminarios/[id]/asistentes` — creación completa: auto-crea cliente si no hay cliente_id, genera pago, inserta historial ✅
- `PATCH /api/seminarios/[id]/asistentes/[asistente_id]` — edición de modalidad, estado_pago, monto, convirtio, provincia; sincroniza pago al marcar PAGADO ✅
- Página de detalle `/seminarios/[id]` — renderiza AsistentesTable + AgregarAsistenteModal con clienteOptions ✅

Lo que FALTA (el único gap real para cumplir SEM-04 post-creación):
- `EditarAsistenteModal` no soporta `cliente_id` — no se puede vincular un asistente a un cliente después de la creación
- `PATCH /api/seminarios/[id]/asistentes/[asistente_id]` no acepta `cliente_id` en el body

</domain>

<decisions>
## Implementation Decisions

### Auditoría de lo existente

- **D-01:** El planner debe verificar que los 5 success criteria de Phase 5 están cumplidos por el código existente antes de crear tareas. Si algún criterio no está satisfecho (más allá del gap de SEM-04 ya identificado), debe crear tarea específica.

### Vincular cliente post-creación — UX

- **D-02:** Agregar campo `cliente_id` dentro del **`EditarAsistenteModal` existente** — no crear un componente separado.
  - Si el asistente ya tiene un cliente vinculado: mostrar el cliente actual (GJ-ID + nombre) con opción de cambiar.
  - Si no tiene: mostrar el campo vacío como opcional.
  - Mismo patrón visual que el selector de cliente en `AgregarAsistenteModal`.

- **D-03:** El selector usa la **misma lista `clienteOptions`** que ya pasa la página de detalle a otros modales.
  - Pasar `clientes: ClienteOption[]` como prop adicional a `EditarAsistenteModal`.
  - No hay fetch extra — la lista llega desde el server component de la página de detalle.
  - Buscar por nombre o GJ-XXXX (igual que `AgregarAsistenteModal`).

### Vincular cliente post-creación — Comportamiento al cambiar

- **D-04:** Si el asistente ya tiene `cliente_id` y se cambia a otro:
  - Actualizar solo `cliente_id` en `seminario_asistentes`.
  - **No mover ni reasignar pagos existentes** — edge case poco frecuente, lógica de reasignación fuera de scope.
  - El pago que ya existe en el cliente anterior queda como está.

- **D-05:** Si el asistente tenía `cliente_id: null` y se vincula por primera vez:
  - Actualizar `cliente_id` en `seminario_asistentes`.
  - **No crear pago retroactivo** — si el pago no se creó al momento de agregar el asistente, no se crea ahora. Evita duplicados y lógica compleja.

### Vincular cliente post-creación — Backend

- **D-06:** Extender `PATCH /api/seminarios/[id]/asistentes/[asistente_id]` para aceptar `cliente_id?: string | null` en el body.
  - Si `cliente_id` está en el body: actualizar el campo.
  - Insertar entrada en `historial` cuando se vincula/cambia:
    - `tipo: 'CAMBIO_ESTADO'`
    - `descripcion: 'Asistente vinculado a cliente [GJ-ID]'`
    - `origen: 'dashboard'`, `usuario_id: user.id`
    - `cliente_id`: usar el nuevo `cliente_id` (el asistente ahora pertenece a ese cliente)
  - Si `cliente_id: null` (desvincular): actualizar campo, insertar historial con `descripcion: 'Asistente desvinculado de cliente'`.

### Claude's Discretion

- Estilo visual del campo de cliente en `EditarAsistenteModal` — consistente con los demás campos del modal (mismo `inputStyle`, `labelStyle`).
- Posición del campo de cliente dentro del modal — al final de los campos existentes (campo menos frecuente de cambiar).
- Label del campo: "Cliente vinculado" o "Vincular a cliente".

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Código existente a auditar antes de planear

- `components/seminarios/EditarAsistenteModal.tsx` — modal a extender con campo cliente_id
- `components/seminarios/AgregarAsistenteModal.tsx` — patrón de búsqueda/selector de cliente a replicar en Editar
- `app/(dashboard)/seminarios/[id]/page.tsx` — página de detalle que pasa clienteOptions a modales
- `app/api/seminarios/[id]/asistentes/[asistente_id]/route.ts` — PATCH handler a extender con cliente_id
- `components/seminarios/AsistentesTable.tsx` — tabla de asistentes (verificar que pasa clienteOptions a EditarAsistenteModal)

### Success Criteria a verificar (SEM-02, SEM-03, SEM-04)

- `SEM-02`: agregar asistente con nombre, teléfono, provincia, modalidad, estado_pago, monto → ya en AgregarAsistenteModal
- `SEM-03`: registrar convirtio (SI/NO/EN_SEGUIMIENTO) → ya en AgregarAsistenteModal y EditarAsistenteModal
- `SEM-04`: vincular asistente a cliente existente → parcial — AgregarAsistenteModal ✅, EditarAsistenteModal ❌ (gap a cerrar)

### No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `ClienteOption` interface (`AgregarAsistenteModal.tsx`) — `{ id, gj_id, nombre, telefono, provincia, grupo_familiar_id }` — prop tipo para el selector de clientes
- Selector de cliente en `AgregarAsistenteModal` — busca por nombre o GJ-ID, filtra la lista en tiempo real, muestra GJ-ID + nombre
- `inputStyle`, `labelStyle` en `EditarAsistenteModal` — reutilizar para el nuevo campo de cliente
- La página de detalle ya pasa `clienteOptions` a `AgregarAsistenteModal` y a `AsistentesTable` — mismo prop disponible para `EditarAsistenteModal`

### Established Patterns

- Historial INSERT en PATCH handlers: `tipo`, `descripcion`, `origen: 'dashboard'`, `usuario_id: user.id`
- Props pattern de modales en la página de detalle: server component pasa lista de opciones al momento del render
- `AsistentesTable` ya recibe `seminarioId` y `seminarioModalidad` y los pasa a `EditarAsistenteModal` — agregar `clientes` al mismo patrón

### Integration Points

- `AsistentesTable` → `EditarAsistenteModal`: agregar prop `clientes: ClienteOption[]`
- `app/(dashboard)/seminarios/[id]/page.tsx`: pasar `clienteOptions` también a `AsistentesTable` (si no lo hace ya)
- `PATCH /api/seminarios/[id]/asistentes/[asistente_id]`: agregar `cliente_id` al `PatchBody` interface y al bloque `update`

</code_context>

<specifics>
## Specific Ideas

- El campo de cliente en `EditarAsistenteModal` debe mostrar el cliente actualmente vinculado si `asistente.cliente_id` no es null — mostrar "GJ-XXXX — Nombre" en el valor por defecto del selector.
- Desvincular un cliente (poner `cliente_id: null`) debe ser posible — una opción "Sin vincular" en el dropdown.

</specifics>

<deferred>
## Deferred Ideas

- Agregar tipos formales para `seminario_asistentes` en `lib/supabase/types.ts` — no bloquea el uso real, diferido.
- Lógica de precio para grupo familiar en `AgregarAsistenteModal` — ya existe, no modificar.
- Crear pago retroactivo al vincular cliente post-creación — demasiados edge cases, fuera de scope.
- Reasignar pago al cambiar de cliente — lógica compleja, fuera de scope.

</deferred>

---

*Phase: 05-seminarios-asistentes*
*Context gathered: 2026-03-23*

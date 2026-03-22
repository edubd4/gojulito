# Roadmap: GoJulito

## Milestones

- ✅ **v1.0 Core Operativo** - Shipped 2026-03-21 (pre-planning)
- 🚧 **v1.1 Core Hardening** - Phases 1-3 (in progress)

## Phases

<details>
<summary>✅ v1.0 Core Operativo - SHIPPED 2026-03-21 (pre-planning, no formal phases)</summary>

Auth, dashboard, CRUD completo (clientes, visas, pagos, seminarios), historial inmutable, webhooks Telegram/n8n, configuración. Shipped without formal planning process.

</details>

### 🚧 v1.1 Core Hardening (In Progress)

**Milestone Goal:** Corregir bugs de integridad de datos, centralizar validación con Zod, estandarizar el patrón de retorno `{ data, error }` y garantizar que los errores sean siempre visibles al usuario.

- [ ] **Phase 1: Data Integrity** - Corregir bugs de integridad: soft-delete en bulk, estado de visa/pago correcto en lista, cascada FINALIZADO centralizada
- [x] **Phase 2: Validation Layer** - Agregar Zod en todos los handlers POST/PATCH, estandarizar retorno `{ data, error }` en todos los API routes, mostrar errores de servidor en formularios (completed 2026-03-22)
- [x] **Phase 3: Error Feedback** - Garantizar que toda acción de edición muestre feedback de error claro y nunca falle silenciosamente (completed 2026-03-22)

## Phase Details

### Phase 1: Data Integrity
**Goal**: Los datos del sistema son confiables: el bulk-delete nunca borra físicamente, la lista de clientes muestra el estado real de visa y pago, y la lógica de cascada FINALIZADO opera desde un único lugar.
**Depends on**: Nothing (first phase)
**Requirements**: INTG-01, INTG-02, INTG-03
**Success Criteria** (what must be TRUE):
  1. El admin selecciona varios clientes y usa bulk-delete: los registros quedan marcados como INACTIVO en la base de datos, sin filas eliminadas físicamente.
  2. La lista de clientes muestra el estado de visa activo correcto (ej: EN_PROCESO, APROBADA) y el estado de pago correcto (ej: DEUDA, PAGADO) para cada cliente, sin valores incorrectos por agregación.
  3. Al aprobar o rechazar una visa, la cascada FINALIZADO al cliente ocurre desde un helper centralizado, tanto desde el API route de visas como desde el webhook de Telegram, produciendo el mismo resultado en ambos paths.
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Centralizar cascada FINALIZADO en helper compartido (lib/visas.ts)
- [x] 01-02-PLAN.md — Fix bulk-delete soft-delete y estados de visa/pago en lista de clientes

### Phase 2: Validation Layer
**Goal**: Todos los endpoints de escritura validan inputs con Zod antes de ejecutar, retornan `{ data, error }` de forma consistente, y los formularios del dashboard muestran los errores del servidor al usuario.
**Depends on**: Phase 1
**Requirements**: VAL-01, VAL-02, VAL-03
**Success Criteria** (what must be TRUE):
  1. Al enviar un formulario de creación o edición con datos inválidos (campo requerido vacío, tipo incorrecto), el servidor retorna un error de validación descriptivo con status 400 — no un 500 ni un error silencioso.
  2. Todos los API route handlers (clientes, visas, pagos, seminarios — POST y PATCH) retornan exactamente `{ data: T | null, error: string | null }`, sin variaciones de forma entre rutas.
  3. Los formularios de crear cliente, editar cliente, registrar pago y cambiar estado de visa muestran el mensaje de error del servidor inline cuando la validación falla, sin recargar la página.
**Plans**: 3 plans
Plans:
- [x] 02-01-PLAN.md — Instalar Zod y crear schemas de dominio (clientes, visas, pagos)
- [x] 02-02-PLAN.md — Aplicar Zod safeParse + estandarizar { data, error } en los 9 route handlers
- [x] 02-03-PLAN.md — Actualizar formularios del frontend para leer { data, error }

### Phase 3: Error Feedback
**Goal**: Ninguna acción de edición falla silenciosamente: el usuario siempre recibe feedback visual claro cuando una operación no puede completarse.
**Depends on**: Phase 2
**Requirements**: UX-01
**Success Criteria** (what must be TRUE):
  1. Al editar un cliente con un valor inválido (ej: teléfono duplicado), el usuario ve un mensaje de error claro en la UI — no un spinner que se detiene sin explicación ni un formulario que se cierra como si hubiera tenido éxito.
  2. Al editar una visa o un pago y ocurrir un error de red o de servidor, aparece un mensaje de error visible; el formulario permanece abierto con los datos ingresados.
  3. No existe ningún flujo de edición (clientes, visas, pagos) donde un error cause que la UI quede en estado inconsistente sin notificar al usuario.
**Plans**: 1 plan
Plans:
- [x] 03-01-PLAN.md — Fix error check en EditarVisaModal y DetallePagoModal (json.success -> json.error)

## Progress

**Execution Order:** 1 → 2 → 3

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Data Integrity | v1.1 | 2/2 | Complete | 2026-03-21 |
| 2. Validation Layer | v1.1 | 3/3 | Complete   | 2026-03-22 |
| 3. Error Feedback | v1.1 | 1/1 | Complete   | 2026-03-22 |

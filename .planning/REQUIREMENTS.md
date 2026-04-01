# Requirements: GoJulito v1.3

**Defined:** 2026-03-31
**Core Value:** El admin puede ver en tiempo real el estado de todos sus clientes, visas y pagos desde un dashboard centralizado, sin perder datos por error operativo.

## v1.3 Requirements

### DB — Fixes de base de datos

- [ ] **DB-01**: Las vistas `v_turnos_semana` y `v_deudas_proximas` incluyen `cliente_id` y los aliases correctos (`nombre_cliente`, `estado_visa`) para que los links del dashboard funcionen

### DASH — Dashboard UX

- [x] **DASH-01**: Al hacer click en la columna Fecha de la tabla "Turnos esta semana", navega a `/calendario`
- [x] **DASH-02**: Al hacer click en la columna Cliente de la tabla "Deudas próximas", aparece un popup con resumen del cliente (nombre, gj_id) y botón "Ver ficha"
- [x] **DASH-03**: Al hacer click en la columna Monto de la tabla "Deudas próximas", aparece un popup con detalle de la deuda (pago_id, monto, fecha de vencimiento)
- [x] **DASH-04**: Al hacer click en la columna Vence de la tabla "Deudas próximas", navega a `/calendario`

### MODAL — Modales UX

- [x] **MODAL-01**: El select de "Buscar cliente existente" en NuevoTramiteModal se cierra tras seleccionar una opción

### PAG — Pagos — Flujo de pago parcial

- [ ] **PAG-01**: En NuevoPagoModal, cuando el monto ingresado es menor a la deuda total, el panel muestra el total, el monto pagado y el resto calculado automáticamente en tiempo real
- [ ] **PAG-02**: En NuevoPagoModal, cuando hay un resto pendiente, el usuario puede activar "Archivar deuda restante" para crear el remanente como `PENDIENTE` sin fecha de vencimiento (no aparece en deudas próximas del dashboard)
- [ ] **PAG-03**: El checkbox "También registrar deuda pendiente" es eliminado del modal y reemplazado por el flujo automático de PAG-01/PAG-02

### CAL — Calendario — Mejoras visuales

- [ ] **CAL-01**: Los chips de pagos en las celdas del calendario muestran un máximo de 2, con "+X más" para el overflow
- [ ] **CAL-02**: El label de los chips de pago muestra el monto de forma compacta (`$400`, `$1.2k`) en vez del nombre del cliente
- [ ] **CAL-03**: Los chips de seminario muestran `Sem · Pres.` o `Sem · Virt.` en vez del `sem_id` crudo
- [ ] **CAL-04**: Hay un separador visual entre las secciones de turnos, pagos y seminarios dentro de cada celda del calendario

---

## Future Requirements

- Navegación directa a una fecha específica al clickear en el calendario desde el dashboard
- Popup de pago con botón "Registrar pago" inline desde el calendario

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Migración a Server Actions | Sin beneficio para este scope; diferido |
| Tests automatizados | Sin setup de testing; diferido a milestone dedicado |
| Paginación de listas | Volumen actual (<200 registros) no lo justifica |
| Nuevo campo `archivada` en DB | Innecesario — `PENDIENTE` sin fecha no aparece en `v_deudas_proximas` |

---

## Traceability

<!-- Filled by roadmapper -->

| REQ-ID | Phase | Status |
|--------|-------|--------|
| DB-01 | Phase 10 | Pending |
| DASH-01 | Phase 10 | Complete |
| DASH-02 | Phase 10 | Complete |
| DASH-03 | Phase 10 | Complete |
| DASH-04 | Phase 10 | Complete |
| MODAL-01 | Phase 10 | Complete |
| PAG-01 | Phase 11 | Pending |
| PAG-02 | Phase 11 | Pending |
| PAG-03 | Phase 11 | Pending |
| CAL-01 | Phase 12 | Pending |
| CAL-02 | Phase 12 | Pending |
| CAL-03 | Phase 12 | Pending |
| CAL-04 | Phase 12 | Pending |

**Coverage:**
- v1.3 requirements: 13 total
- Mapped to phases: 13 / 13

---
*Requirements defined: 2026-03-31*
*Last updated: 2026-03-31 — v1.3 started*

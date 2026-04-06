# Requirements: GoJulito v1.4

**Defined:** 2026-04-06
**Core Value:** El admin puede ver en tiempo real el estado de todos sus clientes, visas y pagos desde un dashboard centralizado, sin perder datos por error operativo.

## v1.4 Requirements

### FIX — Bugs de estabilizacion

- [x] **FIX-01**: Todos los `<select>` tienen `style={{ colorScheme: 'dark' }}` (46 selects en 18 archivos)
- [x] **FIX-02**: Wizard paso 4 muestra campo fecha_turno cuando estado = TURNO_ASIGNADO
- [ ] **FIX-03**: POST seminarios incluye `activo: true` — aparecen en lista al crearse
- [ ] **FIX-04**: Dashboard filtra seminario proximo por `activo: true`
- [ ] **FIX-05**: Seminario detalle layout responsive (flex-col lg:flex-row)
- [ ] **FIX-06**: Barra busqueda header es input funcional → /tramites?q=
- [ ] **FIX-07**: Boton notificaciones → link a /tramites
- [ ] **FIX-08**: Boton ayuda → link a /ayuda
- [ ] **FIX-09**: Chart semanal con hover interactivo
- [ ] **FIX-10**: TramitesTable responsive — ocultar columnas en mobile
- [ ] **FIX-11**: ClientesTable responsive — ocultar columnas en mobile
- [ ] **FIX-12**: PagosTable responsive — ocultar columnas en mobile
- [ ] **FIX-13**: Badge CAS → CITA

### PAG — Pagos (de v1.3, no ejecutado)

- [ ] **PAG-01**: Auto-calculo de resto en NuevoPagoModal
- [ ] **PAG-02**: Toggle archivar deuda restante como PENDIENTE sin fecha
- [ ] **PAG-03**: Eliminar checkbox viejo de deuda pendiente

### CAL — Calendario (de v1.3, no ejecutado)

- [ ] **CAL-01**: Max 2 chips de pago por celda, "+X mas" para overflow
- [ ] **CAL-02**: Label compacto de monto en chips ($400, $1.2k)
- [ ] **CAL-03**: Chips seminario muestran modalidad (Sem · Pres.)
- [ ] **CAL-04**: Separador visual entre tipos de eventos por celda

### HELP — Ayuda integrada

- [ ] **HELP-01**: Pagina /ayuda con instrucciones por seccion (dashboard, clientes, tramites, pagos, seminarios, calendario, config, telegram)
- [ ] **HELP-02**: Link a /ayuda en sidebar

## Traceability

| REQ-ID | Fase | Status |
|--------|------|--------|
| FIX-01 | 13 | Pendiente |
| FIX-02 | 13 | Pendiente |
| FIX-03 | 14 | Pendiente |
| FIX-04 | 14 | Pendiente |
| FIX-05 | 14 | Pendiente |
| FIX-06 | 15 | Pendiente |
| FIX-07 | 15 | Pendiente |
| FIX-08 | 15 | Pendiente |
| FIX-09 | 15 | Pendiente |
| FIX-10 | 16 | Pendiente |
| FIX-11 | 16 | Pendiente |
| FIX-12 | 16 | Pendiente |
| FIX-13 | 16 | Pendiente |
| PAG-01 | 11 | Pendiente |
| PAG-02 | 11 | Pendiente |
| PAG-03 | 11 | Pendiente |
| CAL-01 | 12 | Pendiente |
| CAL-02 | 12 | Pendiente |
| CAL-03 | 12 | Pendiente |
| CAL-04 | 12 | Pendiente |
| HELP-01 | 17 | Pendiente |
| HELP-02 | 17 | Pendiente |

**Coverage:** 22 requirements → 22 mapped to phases

## Out of Scope

| Feature | Reason |
|---------|--------|
| Sistema de notificaciones real | Diferido a v1.5 |
| Documentos editables por seminario | Diferido a v1.5 |
| Busqueda global | Diferido a v1.5 |
| Server Actions | Sin beneficio |
| Tests automatizados | Sin setup |

---
*Last updated: 2026-04-06*

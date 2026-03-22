# Requirements: GoJulito

**Defined:** 2026-03-21
**Core Value:** El admin puede ver en tiempo real el estado de todos sus clientes, visas y pagos desde un dashboard centralizado, sin perder datos por error operativo.

## v1.1 Requirements

Requirements for Core Hardening milestone. Each maps to roadmap phases.

### Data Integrity

- [x] **INTG-01**: El bulk-delete de clientes marca registros como INACTIVO en lugar de ejecutar DELETE físico
- [x] **INTG-02**: La lista de clientes muestra el estado de visa activo y de pago correcto para cada cliente
- [x] **INTG-03**: La lógica de cascada FINALIZADO está centralizada en un helper compartido y funciona correctamente en todos los paths (API de visas, webhooks)

### Validation

- [x] **VAL-01**: Los endpoints POST y PATCH de clientes, visas y pagos validan el body con un Zod schema antes de procesar
- [x] **VAL-02**: Todos los API route handlers retornan `{ data: T | null, error: string | null }` de forma consistente
- [x] **VAL-03**: Los formularios del cliente (crear, editar, registrar pago) muestran los errores de validación del servidor al usuario

### UX / Feedback

- [x] **UX-01**: Toda acción de edición (clientes, visas, pagos) muestra un mensaje de error claro cuando falla, sin fallar silenciosamente

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Performance

- **PERF-01**: Paginación en lista de clientes (evitar carga ilimitada)
- **PERF-02**: Paginación en lista de visas/tramites
- **PERF-03**: Paginación en lista de pagos
- **PERF-04**: Queries paralelas en detalle de cliente (Promise.all)

### Testing

- **TEST-01**: Suite de tests para API routes críticos (visas, pagos)
- **TEST-02**: Tests de integración para la cascada FINALIZADO

### Security

- **SEC-01**: Comparación timing-safe en validateApiKey()
- **SEC-02**: Restricción de lectura en tabla `configuracion` para rol colaborador

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Migración a Server Actions | Sin beneficio para este scope; evita reescritura masiva sin ganancia de producto |
| Zod en client-side | Validación server-side es suficiente para seguridad; no justifica complejidad adicional |
| Real-time updates (Supabase subscriptions) | Complejidad alta; refresh manual es aceptable para el volumen actual |
| Mobile app | Web-first; canal Telegram cubre casos móvil |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INTG-01 | Phase 1 | Done (01-02) |
| INTG-02 | Phase 1 | Done (01-02) |
| INTG-03 | Phase 1 | Complete |
| VAL-01 | Phase 2 | Complete |
| VAL-02 | Phase 2 | Complete |
| VAL-03 | Phase 2 | Complete |
| UX-01 | Phase 3 | Complete |

**Coverage:**
- v1.1 requirements: 7 total
- Mapped to phases: 7
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 — traceability filled after roadmap creation*

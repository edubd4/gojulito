# Requirements: GoJulito v1.2

**Defined:** 2026-03-23
**Core Value:** El admin puede ver en tiempo real el estado de todos sus clientes, visas y pagos desde un dashboard centralizado, sin perder datos por error operativo.

## v1.2 Requirements

### Seminarios

- [x] **SEM-01**: El admin puede crear, editar y eliminar (soft) ediciones de seminario con IDs SEM-YYYY-NN generados via RPC
- [x] **SEM-02**: El admin puede agregar asistentes a un seminario con campos: nombre, teléfono, provincia, modalidad (PRESENCIAL/VIRTUAL), estado_pago (PAGADO/DEUDA/PENDIENTE), monto
- [x] **SEM-03**: El admin puede registrar si un asistente convirtió a cliente de visa (SI/NO/EN_SEGUIMIENTO)
- [x] **SEM-04**: El admin puede vincular un asistente a un cliente existente (cliente_id nullable, búsqueda opcional)

### Bot Telegram (Alfred)

- [x] **BOT-01**: Existe tabla `telegram_historial` con columna `message` tipo JSONB (requerido por n8n `memoryPostgresChat` v1.3)
- [ ] **BOT-02**: El endpoint `GET /api/webhook/clientes` soporta búsqueda por `nombre`, `telefono` y `gj_id`, y retorna `id`, `gj_id`, `nombre`, `estado`, `visas[]`, `pagos[]`
- [x] **BOT-03**: El flujo n8n `agente_gojulito.json` está documentado con instrucciones de importación y configuración de credenciales

### Calendario

- [ ] **CAL-01**: La página `/calendario` muestra los turnos de visa de los próximos 7 días (datos de `v_turnos_semana`)
- [ ] **CAL-02**: La página `/calendario` muestra las fechas de los próximos seminarios

### Configuración

- [x] **CFG-01**: La página `/configuracion` permite al admin ver y editar `precio_visa` y `precio_seminario` desde la tabla `configuracion`
- [x] **CFG-02**: La página `/configuracion` solo es accesible por usuarios con rol `admin`

## Future Requirements

### Seminarios

- **SEM-F01**: Exportar lista de asistentes a CSV
- **SEM-F02**: Enviar mensaje masivo por Telegram a asistentes de un seminario

### Bot Telegram

- **BOT-F01**: El bot puede consultar y listar asistentes de un seminario
- **BOT-F02**: El bot puede agregar asistentes a un seminario

## Out of Scope

| Feature | Reason |
|---------|--------|
| Acceso directo del bot a Supabase | El bot siempre pasa por los endpoints webhook; nunca accede a DB directamente |
| Modificar schema existente sin migración | Todas las adiciones van en `database/migrations/` |
| Paginación | Volumen actual (<200 registros) no justifica complejidad — diferido |
| Tests automatizados | Sin setup de testing en el proyecto; diferido a milestone dedicado |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEM-01 | Phase 4 | Complete |
| SEM-02 | Phase 5 | Complete |
| SEM-03 | Phase 5 | Complete |
| SEM-04 | Phase 5 | Complete |
| BOT-01 | Phase 6 | Complete |
| BOT-02 | Phase 6 | Pending |
| BOT-03 | Phase 6 | Complete |
| CAL-01 | Phase 7 | Pending |
| CAL-02 | Phase 7 | Pending |
| CFG-01 | Phase 7 | Complete |
| CFG-02 | Phase 7 | Complete |

**Coverage:**
- v1.2 requirements: 11 total
- Mapped to phases: 11 ✓
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-23*
*Last updated: 2026-03-23 — traceability updated after roadmap creation*

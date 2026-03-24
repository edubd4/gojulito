# Roadmap: GoJulito

## Milestones

- ✅ **v1.0 Core Operativo** — Shipped 2026-03-21 (pre-planning)
- ✅ **v1.1 Core Hardening** — Phases 1-3 (shipped 2026-03-22)
- 🚧 **v1.2 Canales y Operación Avanzada** — Phases 4-7 (in progress)

## Phases

<details>
<summary>✅ v1.0 Core Operativo — SHIPPED 2026-03-21 (pre-planning, no formal phases)</summary>

Auth, dashboard, CRUD completo (clientes, visas, pagos, seminarios), historial inmutable, webhooks Telegram/n8n, configuración. Shipped without formal planning process.

</details>

<details>
<summary>✅ v1.1 Core Hardening (Phases 1-3) — SHIPPED 2026-03-22</summary>

- [x] Phase 1: Data Integrity (2/2 plans) — completed 2026-03-21
- [x] Phase 2: Validation Layer (3/3 plans) — completed 2026-03-22
- [x] Phase 3: Error Feedback (1/1 plan) — completed 2026-03-22

</details>

### 🚧 v1.2 Canales y Operación Avanzada (In Progress)

**Milestone Goal:** Completar la operación sin abrir el dashboard — seminarios con gestión real de asistentes, bot Telegram Alfred funcional con AI Agent, vista de calendario, y configuración de precios desde la app.

## Phase Details

### Phase 4: Seminarios — Core
**Goal**: El admin puede gestionar ediciones de seminario con IDs legibles generados via RPC
**Depends on**: Phase 3
**Requirements**: SEM-01
**Success Criteria** (what must be TRUE):
  1. El admin puede crear un seminario nuevo y ver su ID en formato SEM-YYYY-NN
  2. El admin puede editar los datos de un seminario existente (fecha, precio, modalidad, descripción)
  3. El admin puede marcar un seminario como inactivo (soft delete) desde la lista
  4. La lista de seminarios muestra todos los campos clave sin errores de carga
**Plans**: 1 plan
Plans:
- [x] 04-01-PLAN.md — Soft delete seminarios (migration + API + filtered list + inactivar button)
**UI hint**: yes

### Phase 5: Seminarios — Asistentes
**Goal**: El admin puede registrar y gestionar asistentes de cada seminario, incluyendo su conversión a cliente de visa
**Depends on**: Phase 4
**Requirements**: SEM-02, SEM-03, SEM-04
**Success Criteria** (what must be TRUE):
  1. El admin puede agregar un asistente a un seminario con nombre, teléfono, provincia, modalidad, estado_pago y monto
  2. El admin puede registrar el campo convirtio (SI/NO/EN_SEGUIMIENTO) para cada asistente
  3. El admin puede vincular un asistente a un cliente existente buscando por nombre o ID
  4. Un asistente sin cliente vinculado puede existir con cliente_id en NULL (campo opcional)
  5. La lista de asistentes de un seminario muestra todos sus campos correctamente
**Plans**: 1 plan
Plans:
- [x] 05-01-PLAN.md — Vincular cliente post-creacion (PATCH API + EditarAsistenteModal + prop wiring)
**UI hint**: yes

### Phase 6: Bot Telegram Alfred
**Goal**: El bot Alfred tiene la infraestructura de memoria y endpoints correctos para operar como AI Agent funcional
**Depends on**: Phase 3
**Requirements**: BOT-01, BOT-02, BOT-03
**Success Criteria** (what must be TRUE):
  1. Existe la tabla telegram_historial con columna message de tipo JSONB en la base de datos
  2. El endpoint GET /api/webhook/clientes acepta búsqueda por nombre, telefono y gj_id
  3. El endpoint GET /api/webhook/clientes retorna id, gj_id, nombre, estado, visas[] y pagos[] en su respuesta
  4. Existe documentación con pasos para importar agente_gojulito.json en n8n y configurar credenciales
**Plans**: 1 plan
Plans:
- [x] 06-01-PLAN.md — Bot Telegram Alfred migration, webhook endpoint, and n8n setup docs

### Phase 7: Calendario y Configuracion
**Goal**: El admin puede ver turnos y seminarios próximos en una vista de calendario, y gestionar precios desde la app
**Depends on**: Phase 4
**Requirements**: CAL-01, CAL-02, CFG-01, CFG-02
**Success Criteria** (what must be TRUE):
  1. La página /calendario muestra los turnos de visa de los próximos 7 días usando datos de v_turnos_semana
  2. La página /calendario muestra las fechas de los próximos seminarios
  3. El admin puede ver y editar precio_visa y precio_seminario desde la página /configuracion
  4. Un usuario con rol colaborador no puede acceder a /configuracion (redireccionado o bloqueado)
**Plans**: 2 plans
Plans:
- [ ] 07-01-PLAN.md — Seminarios en el calendario (API + page + CalendarioView con chips purpura y popup)
- [x] 07-02-PLAN.md — Control de acceso a /configuracion (redirect admin-only + ocultar link sidebar)
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 4 → 5 → 6 → 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Data Integrity | v1.1 | 2/2 | Complete | 2026-03-21 |
| 2. Validation Layer | v1.1 | 3/3 | Complete | 2026-03-22 |
| 3. Error Feedback | v1.1 | 1/1 | Complete | 2026-03-22 |
| 4. Seminarios — Core | v1.2 | 1/1 | Complete   | 2026-03-23 |
| 5. Seminarios — Asistentes | v1.2 | 1/1 | Complete | 2026-03-23 |
| 6. Bot Telegram Alfred | v1.2 | 1/1 | Complete | 2026-03-24 |
| 7. Calendario y Configuracion | v1.2 | 1/2 | In Progress|  |

# Roadmap: GoJulito

## Milestones

- ✅ **v1.0 Core Operativo** — Shipped 2026-03-21 (pre-planning)
- ✅ **v1.1 Core Hardening** — Phases 1-3 (shipped 2026-03-22)
- ✅ **v1.2 Canales y Operación Avanzada** — Phases 4-9 (shipped 2026-03-30)

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

### ✅ v1.2 Canales y Operación Avanzada — SHIPPED 2026-03-30

**Milestone Goal:** Completar la operación sin abrir el dashboard — seminarios con gestión real de asistentes, bot Telegram Alfred funcional con AI Agent, vista de calendario, configuración de precios desde la app, y design system 100% Tailwind gj-*.

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
- [x] 07-01-PLAN.md — Seminarios en el calendario (API + page + CalendarioView con chips purpura y popup)
- [x] 07-02-PLAN.md — Control de acceso a /configuracion (redirect admin-only + ocultar link sidebar)
**UI hint**: yes

### Phase 8: Fixes Julito Feedback
**Goal**: Corregir los problemas operativos reportados por Julito Correa tras el uso en producción — estado ACTIVO por defecto, validación real de pagos de visa, cards del dashboard navegables, registro en un paso desde VISA, y pago + deuda simultáneos
**Depends on**: Phase 7
**Requirements**: FIX-01, FIX-02, FIX-03, FIX-04, FIX-05, FIX-06
**Success Criteria** (what must be TRUE):
  1. Al crear un cliente (dashboard o bot), el estado siempre es ACTIVO — el bot nunca pregunta el estado
  2. Un pago de tipo VISA falla con error descriptivo si el cliente no tiene visa registrada
  3. Las 4 cards del dashboard son clickeables y navegan a la sección correspondiente
  4. Desde /tramites se puede crear un cliente nuevo y su visa en un solo modal sin ir a /clientes
  5. En NuevoPagoModal se puede registrar un pago PAGADO y una DEUDA en el mismo submit
  6. Los dropdowns de estado de cliente solo muestran ACTIVO y FINALIZADO
**Plans**: 4 plans
Plans:
- [x] 08-01-PLAN.md — FIX-01 + FIX-02: Estado ACTIVO default + validación real visa_id en pagos
- [x] 08-02-PLAN.md — FIX-03 + FIX-04: Cards clickeables + simplificar estados de cliente en UI
- [x] 08-03-PLAN.md — FIX-05: Registro en un paso desde sección VISA (IniciarVisaModal con modo nuevo cliente)
- [x] 08-04-PLAN.md — FIX-06: Pago + Deuda simultáneos en NuevoPagoModal
**UI hint**: yes

### Phase 9: Design System Hardening
**Goal**: Todos los componentes usan exclusivamente clases Tailwind `gj-*` — cero hex hardcodeados, cero `style={}` inline, focus rings visibles en inputs, y el color púrpura de seminarios registrado como token oficial
**Depends on**: Phase 8
**Requirements**: DS-01, DS-02, DS-03, DS-04
**Success Criteria** (what must be TRUE):
  1. No existen ocurrencias de `style=` con valores de color hex en ningún componente (0 hex literals en style props)
  2. Todos los colores usan clases `gj-*` de Tailwind: `text-gj-amber`, `bg-gj-card`, `border-gj-input`, etc.
  3. El color `#a78bfa` está registrado como `gj-seminario` en `tailwind.config.ts`
  4. Todos los inputs y textareas tienen `focus:ring-2 focus:ring-gj-amber` visible (sin `outline: none` sin reemplazo)
**Plans**: 5 plans
Plans:
- [x] 09-01-PLAN.md — Add gj-seminario token to tailwind.config.ts
- [x] 09-02-PLAN.md — Migrate components/pagos/ (5 files) — BADGE maps + inputStyle + focus rings
- [x] 09-03-PLAN.md — Migrate components/clientes/ (6 files) — BADGE maps + conditional error borders
- [x] 09-04-PLAN.md — Migrate components/seminarios/ + tramites/ + visas/ (11 files) — hover state refactor + accentColor
- [x] 09-05-PLAN.md — Migrate components/configuracion/ + grupos/ + calendario/ + dashboard + app pages
**UI hint**: yes

---

### v1.3 UX Fixes & Calendar

**Milestone Goal:** Corregir los puntos de fricción operativa reportados tras v1.2 — vistas de DB rotas, popups faltantes en el dashboard, flujo de pago parcial claro, y calendario más legible. Sin cambios de schema invasivos, solo fixes focalizados.

### Phase 10: Dashboard & Modal Fixes
**Goal**: El dashboard muestra datos correctos con navegación funcional y popups de cliente/deuda; el modal de trámites cierra el select al seleccionar
**Depends on**: Phase 9
**Requirements**: DB-01, DASH-01, DASH-02, DASH-03, DASH-04, MODAL-01
**Success Criteria** (what must be TRUE):
  1. Las vistas `v_turnos_semana` y `v_deudas_proximas` incluyen `cliente_id`, `nombre_cliente` y `estado_visa` con aliases correctos
  2. Hacer click en la columna Fecha de "Turnos esta semana" navega a `/calendario`
  3. Hacer click en columna Cliente de "Deudas próximas" muestra popup con nombre, gj_id y botón "Ver ficha"
  4. Hacer click en columna Monto o Vence de "Deudas próximas" muestra popup de detalle de deuda o navega a `/calendario` respectivamente
  5. El select de cliente en NuevoTramiteModal se cierra inmediatamente tras seleccionar una opción
**Plans**: 3 plans
Plans:
- [x] 10-01-PLAN.md — DB-01: Supabase migration recreate v_turnos_semana + v_deudas_proximas con cliente_id y aliases
- [x] 10-02-PLAN.md — DASH-01 + DASH-04: Columnas Fecha/Vence navegan a /calendario; Deudas table como client component con popups Cliente y Monto (DASH-02 + DASH-03)
- [x] 10-03-PLAN.md — MODAL-01: Remover size={Math.min(5,...)} del select en NuevoTramiteModal.tsx
**UI hint**: yes

### Phase 11: Pagos — Pago Parcial
**Goal**: NuevoPagoModal calcula el resto automáticamente y permite archivar la deuda remanente como PENDIENTE sin fecha
**Depends on**: Phase 10
**Requirements**: PAG-01, PAG-02, PAG-03
**Success Criteria** (what must be TRUE):
  1. Al ingresar un monto menor a la deuda total, el panel muestra total / pagado / resto calculado en tiempo real
  2. El checkbox "También registrar deuda pendiente" ya no existe en el modal
  3. Cuando hay resto pendiente, el toggle "Archivar deuda restante" crea un segundo pago con estado PENDIENTE y sin fecha_vencimiento
  4. Un pago PENDIENTE sin fecha_vencimiento no aparece en la tabla "Deudas próximas" del dashboard
**Plans**: 1 plan
Plans:
- [ ] 11-01-PLAN.md — PAG-01 + PAG-02 + PAG-03: Rework NuevoPagoModal — auto-calc resto, toggle archivar remanente, eliminar checkbox viejo
**UI hint**: yes

### Phase 12: Calendario — Visual
**Goal**: Las celdas del calendario son legibles con cap de chips, labels compactos y separadores de sección
**Depends on**: Phase 10
**Requirements**: CAL-01, CAL-02, CAL-03, CAL-04
**Success Criteria** (what must be TRUE):
  1. Las celdas del calendario muestran máximo 2 chips de pago, con "+X más" cuando hay overflow
  2. Los chips de pago muestran el monto en formato compacto (`$400`, `$1.2k`) en lugar del nombre del cliente
  3. Los chips de seminario muestran `Sem · Pres.` o `Sem · Virt.` en lugar del sem_id crudo
  4. Hay un separador visual entre las secciones turnos / pagos / seminarios dentro de cada celda
**Plans**: 1 plan (estimado)
Plans:
- [ ] 12-01-PLAN.md — CAL-01 + CAL-02 + CAL-03 + CAL-04: Rework CalendarioView.tsx — chip cap, compact labels, section separators
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Data Integrity | v1.1 | 2/2 | Complete | 2026-03-21 |
| 2. Validation Layer | v1.1 | 3/3 | Complete | 2026-03-22 |
| 3. Error Feedback | v1.1 | 1/1 | Complete | 2026-03-22 |
| 4. Seminarios — Core | v1.2 | 1/1 | Complete | 2026-03-23 |
| 5. Seminarios — Asistentes | v1.2 | 1/1 | Complete | 2026-03-23 |
| 6. Bot Telegram Alfred | v1.2 | 1/1 | Complete | 2026-03-24 |
| 7. Calendario y Configuracion | v1.2 | 2/2 | Complete | 2026-03-24 |
| 8. Fixes Julito Feedback | v1.2 | 4/4 | Complete | 2026-03-28 |
| 9. Design System Hardening | v1.2 | 5/5 | Complete | 2026-03-30 |
| 10. Dashboard & Modal Fixes | v1.3 | 3/3 | Complete    | 2026-04-01 |
| 11. Pagos — Pago Parcial | v1.3 | 0/1 | Pending | — |
| 12. Calendario — Visual | v1.3 | 0/1 | Pending | — |

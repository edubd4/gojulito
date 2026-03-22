# Milestones

## v1.1 Core Hardening (Shipped: 2026-03-22)

**Phases completed:** 3 phases, 6 plans, 13 tasks

**Key accomplishments:**

- Extracted duplicated 20-line cascada FINALIZADO block from 3 routes into a single typed helper `aplicarCascadaFinalizado` in `lib/visas.ts`, replacing each with a 2-line call
- Bulk-delete converted to soft-delete with visa cascade cancellation, and clientes list fixed to show correct visa/pago estados via ordered separate queries and priority-based aggregation maps
- Zod v4 installed with three domain schema files (clientes, visas, pagos) under lib/schemas/, each exporting create and patch schemas typed from lib/constants.ts enums
- Zod safeParse validation and unified { data, error } return shape applied to all 9 POST/PATCH route handlers across dashboard and webhook routes
- Four form components (NuevoClienteModal, EditarClienteModal, RegistrarPagoModal, IniciarVisaModal) updated to read `json.error` instead of `!json.success`, wiring server validation error messages to the user-visible `serverError` state
- Fixed silent failure bug in EditarVisaModal and DetallePagoModal by migrating from !json.success to json.error, completing { data, error } API shape alignment across all three edit modals

---

## v1.0 — Core Operativo (Shipped, pre-planning)

**Status:** Shipped (sin planning formal)
**Shipped:** 2026-03-21 (retroactivo — codebase existente al iniciar GSD)

**What shipped:**

- Auth completa con Supabase (login, sesión, roles admin/colaborador)
- Dashboard con métricas en tiempo real (v_metricas, v_turnos_semana, v_deudas_proximas)
- CRUD completo: clientes, visas, pagos, seminarios
- Máquina de estados para visas con cascada a cliente
- Generación de IDs legibles via RPC (GJ-XXXX, VISA-XXXX, PAG-XXXX, SEM-YYYY-XX)
- Detección de duplicados por teléfono y DNI
- Historial inmutable como audit log
- Webhooks para integración Telegram/n8n
- Gestión de usuarios y configuración (admin only)

**Known issues carried into v1.1:**

- Bulk-delete hace hard DELETE en lugar de soft delete
- Lista de clientes muestra estado de visa/pago incorrecto
- Edición inline falla silenciosamente sin feedback al usuario
- Sin validación Zod (manual en cada route handler)
- Sin patrón `{ data, error }` consistente
- Cascada FINALIZADO duplicada en 3+ lugares

---

## v1.1 — Core Hardening (Current)

**Status:** In progress
**Started:** 2026-03-21

**Goal:** Corregir bugs de integridad, agregar Zod, estandarizar retornos.

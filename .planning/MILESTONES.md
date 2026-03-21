# Milestones

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

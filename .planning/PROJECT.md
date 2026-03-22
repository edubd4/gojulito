# GoJulito

## What This Is

App web de gestión operativa para Julio Correa. Centraliza trámites de visa norteamericana y seminarios de viaje. Los usuarios son el admin (Julio) y sus colaboradores. El bot de Telegram via n8n actúa como canal alternativo de entrada de datos.

## Core Value

El admin puede ver en tiempo real el estado de todos sus clientes, visas y pagos desde un dashboard centralizado, sin perder datos por error operativo.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Auth con Supabase — login, sesión persistente, roles (admin/colaborador) — v1.0
- ✓ Dashboard con métricas en tiempo real (v_metricas, v_turnos_semana, v_deudas_proximas) — v1.0
- ✓ Gestión de clientes — CRUD, familia, notas, soft delete, GJ-XXXX IDs, detección de duplicados — v1.0
- ✓ Gestión de visas — CRUD, máquina de estados, cascada a cliente (FINALIZADO), VISA-XXXX IDs — v1.0
- ✓ Gestión de pagos — crear/listar/actualizar estado, tipos VISA y SEMINARIO, PAG-XXXX IDs — v1.0
- ✓ Gestión de seminarios — CRUD, asistentes, SEM-YYYY-XX IDs — v1.0
- ✓ Configuración — gestión de usuarios (admin), precios, cambio de contraseña — v1.0
- ✓ Webhooks Telegram/n8n — clientes, visas, pagos, resumen vía API key — v1.0
- ✓ Historial inmutable — audit log INSERT-only en toda operación de estado — v1.0
- ✓ **INTG-01**: Bulk delete marca clientes como INACTIVO (soft delete, no hard DELETE) — Validated in Phase 01: data-integrity
- ✓ **INTG-02**: Lista de clientes muestra el estado de visa y pago correcto (sin agregación incorrecta) — Validated in Phase 01: data-integrity
- ✓ **INTG-03**: Cascada FINALIZADO extraída a helper compartido y funciona en todos los paths — Validated in Phase 01: data-integrity
- ✓ **VAL-01**: Todos los endpoints CREATE/UPDATE validan inputs con Zod schema — Validated in Phase 02: validation-layer
- ✓ **VAL-02**: Todos los API routes retornan `{ data, error }` consistentemente — Validated in Phase 02: validation-layer
- ✓ **VAL-03**: Los formularios muestran errores de validación del servidor al usuario — Validated in Phase 02: validation-layer

### Active

<!-- Current scope. Building toward these. -->

- [ ] **UX-01**: Las acciones de edición muestran feedback de error cuando fallan (sin fallas silenciosas)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Migración a Server Actions — App Router API routes funcionan bien; cambio arquitectónico sin beneficio inmediato
- Paginación de listas — volumen actual (<200 registros) no justifica la complejidad; diferido a v1.2
- Tests automatizados — no hay setup de testing; diferido a milestone dedicado
- Zod en el cliente — validación client-side básica es suficiente; Zod va en los handlers del servidor

## Context

- **Codebase existente**: todo el código de v1.0 está en producción con bugs documentados en `.planning/codebase/CONCERNS.md`
- **Bugs conocidos**: bulk-delete hace hard DELETE, lista de clientes muestra estado incorrecto, edición silenciosa sin feedback
- **Tech debt**: validación manual en cada route handler (sin Zod), sin patrón de retorno consistente, cascada FINALIZADO duplicada en 3+ lugares
- **Restricción Node**: 18.18.1 — shadcn CLI incompatible, todos los componentes UI creados manualmente
- **Base de datos**: Supabase con RLS; SERVICE_ROLE_KEY solo en servidor; historial es inmutable

## Constraints

- **Tech stack**: Next.js 14 App Router, TypeScript strict (no `any`), Tailwind + gj-* tokens — no cambiar
- **Supabase**: SERVICE_ROLE_KEY solo server-side; ANON key respeta RLS — no exponer en cliente
- **Historial**: INSERT only, nunca UPDATE ni DELETE — regla de negocio crítica
- **Soft delete**: nunca usar DELETE real; marcar INACTIVO o deleted_at
- **Componentes UI**: editar directamente en `components/ui/`, no usar shadcn CLI
- **ENUMs**: usar exactamente los strings de `lib/constants.ts`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| API routes sobre Server Actions | No hay beneficio real para este scope; evita reescritura masiva | — Pending |
| Zod en handlers del servidor | Centraliza validación en el único lugar que importa para seguridad | ✓ Shipped Phase 02 |
| `{ data, error }` en todos los routes | Consistencia para el cliente; facilita manejo de errores en forms | ✓ Shipped Phase 02 |
| Cascada FINALIZADO como helper | Elimina deuda técnica de lógica duplicada en 3 places | ✓ Shipped Phase 01 |

## Current Milestone: v1.1 Core Hardening

**Goal:** Corregir bugs de integridad de datos, agregar validación Zod en todos los API routes y estandarizar el patrón de retorno `{ data, error }`.

**Target features:**
- Bugs: bulk-delete soft, estado correcto en lista, feedback en edición
- Validación: Zod en todos los handlers de CREATE/UPDATE
- Consistencia: patrón `{ data, error }` unificado

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 — Phase 02 (validation-layer) complete*

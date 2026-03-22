# GoJulito

## What This Is

App web de gestión operativa para Julio Correa. Centraliza trámites de visa norteamericana y seminarios de viaje. Los usuarios son el admin (Julio) y sus colaboradores. El bot de Telegram via n8n actúa como canal alternativo de entrada de datos.

## Core Value

El admin puede ver en tiempo real el estado de todos sus clientes, visas y pagos desde un dashboard centralizado, sin perder datos por error operativo.

## Current State

**v1.1 shipped 2026-03-22.** Codebase hardened: todos los bugs de integridad de datos corregidos, validación Zod en todos los handlers, patrón `{ data, error }` unificado, y los formularios de edición muestran errores de servidor de forma visible.

Stack: Next.js 14 App Router + TypeScript strict + Supabase + Tailwind gj-* tokens. Node 18.18.1 (restricción conocida: shadcn CLI incompatible).

No known active bugs. Tech debt residual: algunos routes menores fuera del scope de v1.1 siguen retornando `{ success: true }` (PagosTable, ClientePagosTable, bulk-update/delete — anotado para v1.2).

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
- ✓ **INTG-01**: Bulk delete marca clientes como INACTIVO (soft delete, no hard DELETE) — v1.1
- ✓ **INTG-02**: Lista de clientes muestra el estado de visa y pago correcto (sin agregación incorrecta) — v1.1
- ✓ **INTG-03**: Cascada FINALIZADO extraída a helper compartido y funciona en todos los paths — v1.1
- ✓ **VAL-01**: Todos los endpoints CREATE/UPDATE validan inputs con Zod schema — v1.1
- ✓ **VAL-02**: Todos los API routes retornan `{ data, error }` consistentemente — v1.1
- ✓ **VAL-03**: Los formularios muestran errores de validación del servidor al usuario — v1.1
- ✓ **UX-01**: Las acciones de edición muestran feedback de error cuando fallan (sin fallas silenciosas) — v1.1

### Active

<!-- Current scope. Define with /gsd:new-milestone for v1.2 -->

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Migración a Server Actions — App Router API routes funcionan bien; cambio arquitectónico sin beneficio inmediato
- Paginación de listas — volumen actual (<200 registros) no justifica la complejidad; diferido a v1.2
- Tests automatizados — no hay setup de testing; diferido a milestone dedicado
- Zod en el cliente — validación client-side básica es suficiente; Zod va en los handlers del servidor

## Context

- **v1.1 shipped**: todos los bugs de integridad corregidos; Zod + `{ data, error }` en todos los handlers de escritura; formularios de edición muestran errores del servidor
- **Tech debt residual**: `{ success: true }` persiste en bulk-update/delete y routes de PagosTable — fuera del scope v1.1, anotar para v1.2
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
| API routes sobre Server Actions | No hay beneficio real para este scope; evita reescritura masiva | ✓ Confirmed v1.1 |
| Zod en handlers del servidor | Centraliza validación en el único lugar que importa para seguridad | ✓ Shipped v1.1 |
| `{ data, error }` en todos los routes | Consistencia para el cliente; facilita manejo de errores en forms | ✓ Shipped v1.1 |
| Cascada FINALIZADO como helper | Elimina deuda técnica de lógica duplicada en 3 places | ✓ Shipped v1.1 |
| Zod v4 API — `.issues` no `.errors` | Zod v4 cambió la API; `.issues` es el array correcto en strict mode | ✓ Applied v1.1 |
| `json.error` check vs `!json.success` | `json.success` siempre truthy con `{ data, error }` shape — `json.error` es el check correcto | ✓ Applied v1.1 |
| 409 DUPLICATE_CLIENT shape inmutable | El bot de Telegram parsea esta forma específica; no puede cambiar | ✓ Preserved v1.1 |

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
*Last updated: 2026-03-22 — v1.1 Core Hardening complete*

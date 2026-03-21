# State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-21)

**Core value:** El admin puede ver en tiempo real el estado de todos sus clientes, visas y pagos desde un dashboard centralizado, sin perder datos por error operativo.
**Current focus:** Milestone v1.1 — Core Hardening

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-03-21 — Milestone v1.1 started

## Accumulated Context

- El codebase de v1.0 existe completo en producción
- Los bugs documentados están en `.planning/codebase/CONCERNS.md`
- Arquitectura: API routes (no Server Actions) — decisión confirmada
- Validación: agregar Zod a handlers existentes, no migrar arquitectura
- Patrón de retorno `{ data, error }` a implementar en todos los routes
- shadcn CLI incompatible con Node 18.18.1 — editar components/ui/ manualmente
- ENUMs deben ser exactamente los strings de lib/constants.ts

---
plan: 10-01
phase: 10
status: complete
completed: 2026-04-01
---

# Summary: Recreate DB Views with cliente_id and Aliases

## What was built

Applied a Supabase DB migration that dropped and recreated `v_turnos_semana` and `v_deudas_proximas` with the correct column names expected by the TypeScript interfaces in `app/(dashboard)/page.tsx`.

**Root cause:** `CREATE OR REPLACE VIEW` cannot rename existing columns — the old views had `gj_id` where `cliente_id` was expected and `nombre`/`estado` instead of `nombre_cliente`/`estado_visa`. Used `DROP VIEW IF EXISTS` + `CREATE VIEW` to bypass the constraint.

## Key files

### key-files.created
- (none — DB migration only, no code changes)

### key-files.modified
- (none)

## Verification

- `v_turnos_semana` columns confirmed: `visa_id`, `cliente_id`, `gj_id`, `nombre_cliente`, `telefono`, `fecha_turno`, `estado_visa`
- `v_deudas_proximas` columns confirmed: `pago_id`, `cliente_id`, `gj_id`, `nombre_cliente`, `telefono`, `monto`, `fecha_vencimiento_deuda`, `dias_restantes`
- No code changes were needed — TypeScript interfaces already matched the new column names

## Decisions

- Used `DROP VIEW IF EXISTS` instead of `ALTER VIEW RENAME COLUMN` — simpler and idempotent given no downstream views depend on these
- Migration applied via Supabase MCP `apply_migration` (not manually)

## Self-Check: PASSED

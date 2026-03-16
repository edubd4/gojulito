# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is this project

**GoJulito** — operational management web app for Julio Correa. Manages US visa applications and travel seminars.

- Users: `admin` (Julio) and `colaborador` (assistant)
- Channels: Next.js dashboard + Telegram bot (via n8n on same VPS)

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
npm run start    # Run production build locally
```

No test suite configured. Verify with `npm run build` before considering a task done.

> **Node version:** 18.18.1. shadcn CLI is incompatible — all `components/ui/` components were created manually.

## Architecture

### Route groups

- `app/(auth)/` — public routes (only `/login`)
- `app/(dashboard)/` — protected routes, all require auth via `middleware.ts`
- `app/api/` — API routes using `createServiceRoleClient()` for DB writes

`middleware.ts` checks Supabase session on every request: unauthenticated → `/login`, authenticated on `/login` → `/`.

### Data fetching pattern

- **Server components** fetch from Supabase directly using `lib/supabase/server.ts`
- **Client components** call internal API routes (`app/api/`) — never Supabase directly
- Never use `lib/supabase/client.ts` (browser client) for sensitive queries

### Key lib files

| File | Purpose |
|------|---------|
| `lib/supabase/server.ts` | `createServerClient()` (ANON key) + `createServiceRoleClient()` (SERVICE_ROLE key) |
| `lib/supabase/client.ts` | `createClient()` for browser — auth only |
| `lib/supabase/types.ts` | Auto-generated Supabase Database types |
| `lib/constants.ts` | All business ENUMs as TypeScript const objects |
| `lib/utils.ts` | `cn()`, `formatPesos()` (ARS), `formatFecha()` (DD/MM/YYYY) |

### Database schema (Supabase/PostgreSQL)

Main tables: `profiles`, `clientes`, `visas`, `credenciales`, `pagos`, `grupos_familiares`, `seminarios`, `seminario_asistentes`, `historial`

Available views: `v_clientes_activos`, `v_deudas_proximas`, `v_turnos_semana`, `v_metricas`

**`historial`** is an immutable audit log — only INSERT, never UPDATE or DELETE.

### Human-readable IDs

Generated in API routes, not by Supabase:
- Clientes: `GJ-0001`
- Visas: `VISA-0001`
- Pagos: `PAG-0001`
- Seminarios: `SEM-2026-01`

## ENUMs — use exactly these strings (from `lib/constants.ts`)

```
estado_cliente:  PROSPECTO | ACTIVO | FINALIZADO | INACTIVO
estado_visa:     EN_PROCESO | TURNO_ASIGNADO | APROBADA | RECHAZADA | PAUSADA | CANCELADA
estado_pago:     PAGADO | DEUDA | PENDIENTE
canal_ingreso:   SEMINARIO | WHATSAPP | INSTAGRAM | REFERIDO | CHARLA | OTRO
tipo_servicio:   VISA | SEMINARIO
modalidad_sem:   PRESENCIAL | VIRTUAL
convirtio_visa:  SI | NO | EN_SEGUIMIENTO
tipo_evento:     CAMBIO_ESTADO | PAGO | NOTA | TURNO_ASIGNADO | ALERTA | NUEVO_CLIENTE
rol_usuario:     admin | colaborador
```

## Design system

Dark theme. Tailwind custom colors use `gj-` prefix (defined in `tailwind.config.ts`):
- Backgrounds: `gj-bg` (#0b1628), `gj-card` (#111f38), `gj-input` (#172645)
- Accents: `gj-amber` (#e8a020), `gj-green` (#22c97a), `gj-red` (#e85a5a), `gj-blue` (#4a9eff)
- Text: `gj-text` (#e8e6e0), `gj-secondary` (#9ba8bb)

Fonts: `font-display` (Fraunces, titles) + `font-sans` (DM Sans, body)

Badge colors: ACTIVO/PAGADO/APROBADA → green | EN_PROCESO → amber | DEUDA/PAUSADA/RECHAZADA → red | TURNO_ASIGNADO → blue

## Security rules — never break

1. `credenciales` table: only `rol=admin` can read it
2. Check user role in every sensitive API route
3. `SUPABASE_SERVICE_ROLE_KEY` only on server-side — never in browser or client components
4. Deletions: admin only
5. `historial`: INSERT only, never UPDATE or DELETE

## Coding rules

- TypeScript strict — no `any`
- `async/await` always, never `.then()`
- Always insert into `historial` after important state changes
- One feature per task
## Contexto de negocio — no modificar sin consultar

- No eliminar registros — marcar como INACTIVO (soft delete)
- No tocar integraciones con n8n/Telegram existentes
- No modificar schema de DB existente — crear migraciones nuevas
- No tocar `components/ui/` — fueron creados manualmente (shadcn CLI incompatible)
- `credenciales` tiene datos reales de clientes — máximo cuidado

## Badge colors por estado

- Verde:  ACTIVO | PAGADO | APROBADA
- Amber:  EN_PROCESO
- Rojo:   PAUSADA | DEUDA | RECHAZADA  
- Azul:   TURNO_ASIGNADO
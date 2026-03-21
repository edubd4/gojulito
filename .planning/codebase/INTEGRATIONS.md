# External Integrations

**Analysis Date:** 2026-03-21

## APIs & External Services

**Automation / Bot Platform:**
- n8n — Workflow automation platform running on the same VPS. Connects the Telegram bot to this Next.js app via webhook API routes.
  - SDK/Client: None (HTTP calls from n8n to Next.js webhook routes)
  - Auth: `x-api-key` header validated via `lib/auth-m2m.ts` `validateApiKey()`
  - Env var: `N8N_API_KEY`

**Messaging:**
- Telegram Bot — User-facing bot operated through n8n. Allows Julio to query and update data (clients, visas, payments) without opening the dashboard.
  - Integration point: n8n calls Next.js webhook routes on the bot's behalf
  - No direct Telegram SDK in this codebase — n8n handles bot protocol

**Fonts:**
- Google Fonts (via `next/font/google`) — Loads Fraunces and DM Sans at build time with `display: swap`
  - Configured in `app/layout.tsx`
  - No API key required

## Data Storage

**Databases:**
- Supabase (PostgreSQL) — Primary data store for all application data
  - Connection (public): `NEXT_PUBLIC_SUPABASE_URL`
  - ANON client: `lib/supabase/server.ts` `createServerClient()` — used in server components and middleware for session-aware queries with RLS
  - Service role client: `lib/supabase/server.ts` `createServiceRoleClient()` — used in all `app/api/` routes, bypasses RLS
  - Browser client: `lib/supabase/client.ts` `createClient()` — auth only, never for sensitive queries
  - Types: `lib/supabase/types.ts` (manually maintained, regenerate with `npx supabase gen types typescript`)

**Main Tables:**
- `profiles` — User accounts with roles (`admin` | `colaborador`)
- `clientes` — Client records (soft-delete only, mark as INACTIVO)
- `visas` — Visa application records
- `credenciales` — Sensitive client credential data (admin-only read via RLS)
- `pagos` — Payment records
- `grupos_familiares` — Family group associations
- `seminarios` — Seminar event records
- `seminario_asistentes` — Seminar attendance join table
- `historial` — Immutable audit log (INSERT only, never UPDATE or DELETE)
- `configuracion` — Key-value config store (keys: `precio_visa`, `precio_seminario`)

**Database Views:**
- `v_clientes_activos` — Filtered active clients
- `v_deudas_proximas` — Upcoming payment debts
- `v_turnos_semana` — Appointment schedule for the week
- `v_metricas` — Dashboard metrics aggregate

**Database Functions:**
- `generate_readable_id(prefix, table_name, id_column)` — RPC called from API routes to generate human-readable IDs (e.g., `GJ-0001`, `VISA-0001`, `PAG-0001`, `SEM-2026-01`)

**File Storage:**
- Local filesystem only — No cloud file storage integration detected

**Caching:**
- None — No Redis or in-memory cache layer detected

## Authentication & Identity

**Auth Provider:**
- Supabase Auth — Cookie-based session management via `@supabase/ssr`
  - Implementation: `middleware.ts` intercepts all requests, calls `supabase.auth.getUser()` to validate session
  - Public routes: `/login`, `/_next/*`, `/api/auth/*`
  - Webhook routes: `/api/webhook/*` — bypass session auth, use API key auth instead
  - Login page: `app/(auth)/login/page.tsx`
  - On unauthenticated: redirect to `/login`
  - On authenticated accessing `/login`: redirect to `/`

**M2M Auth (Webhook Routes):**
- API Key authentication via `x-api-key` header
- Validator: `lib/auth-m2m.ts` `validateApiKey(request)`
- Used by all routes under `app/api/webhook/`
- Secret stored in: `N8N_API_KEY` env var (server-side only)

## Monitoring & Observability

**Error Tracking:**
- None detected — No Sentry, Datadog, or similar integration

**Logs:**
- `console.error` / `console.log` (standard Node.js stdout)
- Application-level audit log in `historial` table — tracks state changes, payments, notes, and new client creation with `origen` field (`'telegram'` | `'sistema'` | dashboard user)

## CI/CD & Deployment

**Hosting:**
- VPS (self-hosted) — Same server runs this Next.js app and the n8n instance

**CI Pipeline:**
- None detected — No GitHub Actions, CircleCI, or similar config files found

**Build verification:**
- `npm run build` — used manually to confirm no TypeScript or build errors before considering a task done

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (public, exposed to browser)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (public, exposed to browser)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only — never expose to client)
- `N8N_API_KEY` — Shared secret for n8n → webhook authentication (server-side only)

**Secrets location:**
- `.env.local` — gitignored, local development secrets

## Webhooks & Callbacks

**Incoming (consumed by this app from n8n/Telegram bot):**
- `GET/POST /api/webhook/clientes` — Query or create clients from Telegram (`app/api/webhook/clientes/route.ts`)
- `GET/PATCH /api/webhook/visas` — Query or update visa status from Telegram (`app/api/webhook/visas/route.ts`)
- `GET /api/webhook/pagos` — Query payment records from Telegram (`app/api/webhook/pagos/route.ts`)
- `GET /api/webhook/resumen` — Fetch dashboard metrics summary for Telegram (`app/api/webhook/resumen/route.ts`)
- All webhook routes require `x-api-key` header matching `N8N_API_KEY`

**Outgoing:**
- None detected — This app does not push outbound webhooks; n8n/Telegram polling is handled externally

---

*Integration audit: 2026-03-21*

# Architecture

**Analysis Date:** 2026-03-21

## Pattern Overview

**Overall:** Next.js App Router with layered server/client separation

**Key Characteristics:**
- Server Components fetch data directly from Supabase; Client Components call internal API routes
- All protected routes live under the `(dashboard)` route group, gated by `middleware.ts`
- Two Supabase clients: `createServerClient()` (ANON key, respects RLS) and `createServiceRoleClient()` (SERVICE_ROLE key, bypasses RLS) — service role is used for all DB writes and privileged reads
- Webhook routes under `/api/webhook/` use API key auth (`x-api-key`) instead of session-based auth
- `historial` table serves as an immutable audit log; every significant state change inserts a record

## Layers

**Auth & Routing Guard:**
- Purpose: Intercept every request, validate Supabase session, redirect accordingly
- Location: `middleware.ts`
- Contains: Session check via `createServerClient`, redirect logic
- Depends on: `@supabase/ssr`, env vars `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Used by: All requests except `_next/static`, images, and `/api/webhook/*`

**Public Route Group (auth):**
- Purpose: Unauthenticated pages
- Location: `app/(auth)/`
- Contains: Login page only (`app/(auth)/login/page.tsx`)
- Depends on: `lib/supabase/client.ts` (browser client) — the only place the browser client is used for auth
- Used by: Unauthenticated users

**Protected Route Group (dashboard):**
- Purpose: All operational dashboard pages
- Location: `app/(dashboard)/`
- Contains: Layout with sidebar + topbar, and all feature pages
- Depends on: `lib/supabase/server.ts`, `components/dashboard/`, feature components
- Used by: Authenticated users only

**Dashboard Layout:**
- Purpose: Wraps all dashboard pages with sidebar navigation and mobile topbar
- Location: `app/(dashboard)/layout.tsx`
- Contains: Auth double-check, profile fetch, renders `DashboardShell`
- Depends on: `createServerClient()`, `DashboardShell`, `Rol` type from `lib/constants`
- Used by: All dashboard pages as parent layout

**Server Page Components:**
- Purpose: Fetch data from Supabase and pass typed props to client components
- Location: `app/(dashboard)/[route]/page.tsx`
- Contains: Data fetching (Supabase queries), role checks, data transformation into typed arrays
- Depends on: `createServiceRoleClient()`, `createServerClient()`, feature components
- Used by: Next.js router

**API Route Handlers (internal):**
- Purpose: Handle mutations from client components; protected by session auth
- Location: `app/api/[resource]/route.ts` and `app/api/[resource]/[id]/route.ts`
- Contains: Auth check, validation, `createServiceRoleClient()` writes, `historial` inserts
- Depends on: `lib/supabase/server.ts`, `lib/constants.ts`
- Used by: Client components via `fetch()`

**Webhook Route Handlers (external):**
- Purpose: Serve n8n/Telegram bot integration; auth via API key, no session
- Location: `app/api/webhook/clientes/`, `app/api/webhook/visas/`, `app/api/webhook/pagos/`, `app/api/webhook/resumen/`
- Contains: `validateApiKey()` call, `createServiceRoleClient()` queries/inserts
- Depends on: `lib/auth-m2m.ts`, `lib/supabase/server.ts`
- Used by: n8n workflows on same VPS

**Client Feature Components:**
- Purpose: Interactive UI — tables, modals, forms — that call API routes for mutations
- Location: `components/[feature]/`
- Contains: `'use client'` directive, local state, `fetch()` calls to `/api/` routes
- Depends on: `lib/utils.ts`, `lib/constants.ts`, `components/ui/`
- Used by: Server page components (receive data as props)

**Shared UI Primitives:**
- Purpose: Reusable headless UI components (manually created, shadcn-style)
- Location: `components/ui/`
- Contains: `badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `input.tsx`, `label.tsx`, `sheet.tsx`, `table.tsx`
- Depends on: `lib/utils.ts` (`cn()`), Tailwind
- Used by: All feature components

**Library / Utilities:**
- Purpose: Supabase clients, business constants, shared helpers
- Location: `lib/`
- Contains: `supabase/server.ts`, `supabase/client.ts`, `supabase/types.ts`, `constants.ts`, `utils.ts`, `auth-m2m.ts`, `provincias.ts`
- Depends on: Nothing internal
- Used by: All layers above

## Data Flow

**User reads data (Server Component flow):**

1. Browser requests a dashboard route
2. `middleware.ts` checks Supabase session cookie; unauthenticated → redirect `/login`
3. `app/(dashboard)/layout.tsx` double-checks auth, fetches user profile, renders `DashboardShell`
4. Page server component runs: calls `createServiceRoleClient()` to query Supabase tables/views
5. Data is transformed into typed props and passed to client components
6. Client component renders HTML with initial data — no client-side fetch needed for reads

**User mutates data (Client Component → API route flow):**

1. User action in client component (e.g., submit modal form)
2. Client component calls `fetch('/api/[resource]', { method: 'POST/PATCH/DELETE', body: JSON })`
3. API route handler calls `createServerClient().auth.getUser()` to verify session
4. Route uses `createServiceRoleClient()` to write to Supabase (bypasses RLS)
5. Route inserts into `historial` table for audit trail
6. Client component receives response, calls `router.refresh()` to re-run server component

**Webhook / Telegram bot flow:**

1. n8n workflow sends HTTP request with `x-api-key` header to `/api/webhook/[resource]`
2. Route calls `validateApiKey(req)` — compares header against `N8N_API_KEY` env var
3. Route uses `createServiceRoleClient()` directly (no session)
4. Inserts record + writes to `historial` with `origen: 'telegram'`

**Authentication flow:**

1. User submits login form in `app/(auth)/login/page.tsx`
2. `createClient()` (browser) calls `supabase.auth.signInWithPassword()`
3. Supabase sets session cookie
4. `router.push('/')` triggers `middleware.ts` which now finds a valid session

## Key Abstractions

**Human-Readable IDs:**
- Purpose: Business-facing identifiers separate from UUIDs (e.g., `GJ-0001`, `VISA-0001`)
- Generated by: Supabase RPC `generate_readable_id(prefix, table_name, id_column)` called inside API routes — atomic, no race conditions
- Tables: `clientes` (prefix `GJ`), `visas` (prefix `VISA`), `pagos` (prefix `PAG`), `seminarios` (prefix `SEM-YYYY`)

**Business ENUMs:**
- Purpose: Typed string constants for all domain states
- Location: `lib/constants.ts`
- Pattern: `as const` objects with exported union types (e.g., `EstadoCliente`, `EstadoVisa`)
- Rule: Use these exact strings everywhere — DB, API bodies, component props

**Historial (Audit Log):**
- Purpose: Immutable chronological log of all significant events
- Table: `historial` — INSERT only, never UPDATE or DELETE
- Fields: `cliente_id`, `visa_id?`, `tipo` (TipoEvento), `descripcion`, `origen` (`dashboard`|`telegram`|`sistema`), `usuario_id?`
- Written by: Every API route handler after state changes; cascade logic in visa state transitions also writes automatically

**Supabase Views:**
- Purpose: Pre-computed queries for dashboard performance
- Views: `v_clientes_activos`, `v_deudas_proximas`, `v_turnos_semana`, `v_metricas`
- Used by: Dashboard page server component (`app/(dashboard)/page.tsx`)

**Role-Based Access:**
- Purpose: Admin vs colaborador capability split
- Check pattern in API routes: fetch `profiles.rol` from Supabase using `createServiceRoleClient()`, compare to `'admin'`
- Admin-only operations: user management (`/api/usuarios`), bulk delete, reading `credenciales` table
- Helper: `verificarAdmin()` utility function in `app/api/usuarios/route.ts` (inline, not shared lib)

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every request
- Responsibilities: HTML shell, font loading (DM Sans, Fraunces), global CSS

**Middleware:**
- Location: `middleware.ts`
- Triggers: Every non-static request
- Responsibilities: Session validation, auth redirects, webhook passthrough

**Dashboard Root Page:**
- Location: `app/(dashboard)/page.tsx`
- Triggers: GET `/`
- Responsibilities: Fetches all dashboard metrics in parallel (`Promise.all`), renders KPI cards, turnos, deudas, historial

**Login Page:**
- Location: `app/(auth)/login/page.tsx`
- Triggers: GET `/login`
- Responsibilities: Renders login form, handles `signInWithPassword` via browser Supabase client

## Error Handling

**Strategy:** Each layer handles its own errors locally; no global error boundary used

**Patterns:**
- API routes: return `NextResponse.json({ error: '...' }, { status: NNN })` — no throw
- Server page components: use `notFound()` from `next/navigation` for missing records; missing data results in empty arrays / null coalescing
- Client components: catch `fetch` errors and set local error state, display inline messages
- Supabase query errors: destructured as `{ data, error }` — check `error` before using `data`
- Duplicate client detection: API returns `{ error: 'DUPLICATE_CLIENT', cliente_existente: {...} }` with 409 so client can offer to navigate to existing record

## Cross-Cutting Concerns

**Logging:** No structured logging system — errors surface via Supabase query error objects; `historial` table serves as the business-level event log
**Validation:** Input validation is manual in each API route (required field checks, type guards with typed interfaces); no shared validation schema library (e.g., Zod not detected)
**Authentication:** Dual-client pattern — `createServerClient()` for session reads, `createServiceRoleClient()` for all writes; webhook routes use `validateApiKey()` from `lib/auth-m2m.ts`
**Soft Deletes:** Clients and related entities use `estado: 'INACTIVO'` instead of physical deletes; queries filter out `INACTIVO` records

---

*Architecture analysis: 2026-03-21*

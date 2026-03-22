# Codebase Structure

**Analysis Date:** 2026-03-21

## Directory Layout

```
gojulito/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Public route group
│   │   └── login/page.tsx        # Login page (client component)
│   ├── (dashboard)/              # Protected route group
│   │   ├── layout.tsx            # Dashboard shell layout (auth + profile fetch)
│   │   ├── page.tsx              # Root dashboard page (/)
│   │   ├── calendario/page.tsx   # Calendar view
│   │   ├── clientes/
│   │   │   ├── page.tsx          # Clients list page
│   │   │   └── [id]/page.tsx     # Client detail page
│   │   ├── configuracion/page.tsx# Settings page
│   │   ├── dashboard/page.tsx    # Redirect → / (legacy route)
│   │   ├── pagos/page.tsx        # Payments page
│   │   ├── seminarios/
│   │   │   ├── page.tsx          # Seminars list page
│   │   │   └── [id]/page.tsx     # Seminar detail page
│   │   └── tramites/page.tsx     # Visa procedures page
│   ├── api/                      # API route handlers
│   │   ├── clientes/
│   │   │   ├── route.ts          # GET list, POST create
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts      # GET one, PATCH, DELETE
│   │   │   │   └── notas/route.ts# POST add note
│   │   │   ├── bulk-delete/route.ts
│   │   │   └── bulk-update/route.ts
│   │   ├── configuracion/route.ts# GET/PATCH system config (prices)
│   │   ├── grupos-familiares/
│   │   │   ├── route.ts          # GET list, POST create
│   │   │   └── [id]/
│   │   │       ├── route.ts      # PATCH, DELETE
│   │   │       └── visas/route.ts# GET visas for group
│   │   ├── pagos/
│   │   │   ├── route.ts          # GET list, POST create
│   │   │   └── [id]/route.ts     # PATCH, DELETE
│   │   ├── perfil/route.ts       # GET/PATCH current user profile
│   │   ├── seminarios/
│   │   │   ├── route.ts          # GET list, POST create
│   │   │   └── [id]/
│   │   │       ├── route.ts      # GET one, PATCH, DELETE
│   │   │       └── asistentes/
│   │   │           ├── route.ts              # GET list, POST add
│   │   │           └── [asistente_id]/route.ts # PATCH, DELETE
│   │   ├── turnos/route.ts       # GET upcoming appointments
│   │   ├── usuarios/route.ts     # GET/POST/PATCH/DELETE users (admin only)
│   │   ├── visas/
│   │   │   ├── route.ts          # POST create visa
│   │   │   └── [id]/route.ts     # PATCH update visa
│   │   └── webhook/              # External integrations (n8n/Telegram)
│   │       ├── clientes/route.ts # GET search, POST create via bot
│   │       ├── pagos/route.ts    # POST register payment via bot
│   │       ├── resumen/route.ts  # GET summary for bot
│   │       └── visas/route.ts    # GET/PATCH visa via bot
│   ├── fonts/                    # Local font files (if any)
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout (fonts, HTML shell)
├── components/
│   ├── calendario/
│   │   └── CalendarioView.tsx    # Calendar client component
│   ├── clientes/
│   │   ├── AgregarNotaModal.tsx
│   │   ├── ClientePagosTable.tsx
│   │   ├── ClientesTable.tsx     # Main clients table (filterable, selectable)
│   │   ├── EditarClienteModal.tsx
│   │   ├── NuevoClienteModal.tsx
│   │   └── RegistrarPagoModal.tsx
│   ├── configuracion/
│   │   ├── CambiarPasswordForm.tsx
│   │   ├── CrearUsuarioModal.tsx
│   │   ├── EditarNombreForm.tsx
│   │   ├── EditarUsuarioModal.tsx
│   │   ├── EliminarUsuarioBtn.tsx
│   │   ├── GruposFamiliaresCard.tsx
│   │   ├── NuevoGrupoModal.tsx
│   │   ├── NuevoUsuarioTrigger.tsx
│   │   ├── PreciosForm.tsx
│   │   └── ToggleUsuario.tsx
│   ├── dashboard/
│   │   ├── AccionesRapidas.tsx   # Quick action buttons on dashboard
│   │   ├── DashboardShell.tsx    # Layout shell (sidebar + topbar) — client
│   │   └── Sidebar.tsx           # Navigation sidebar — client
│   ├── grupos/
│   │   └── AccionLoteGrupoModal.tsx
│   ├── pagos/
│   │   ├── CambiarEstadoPagoDialog.tsx
│   │   ├── DetallePagoModal.tsx
│   │   ├── FechaVencimientoDialog.tsx
│   │   ├── NuevoPagoModal.tsx
│   │   └── PagosTable.tsx
│   ├── seminarios/
│   │   ├── AgregarAsistenteModal.tsx
│   │   ├── AsistentesTable.tsx
│   │   ├── EditarAsistenteModal.tsx
│   │   ├── EditarSeminarioModal.tsx
│   │   ├── NuevoSeminarioModal.tsx
│   │   └── SeminarioCard.tsx
│   ├── shared/                   # (empty — reserved for cross-feature shared components)
│   ├── tramites/
│   │   ├── NuevoTramiteModal.tsx
│   │   └── TramitesTable.tsx
│   ├── ui/                       # Primitive UI components (DO NOT modify via CLI)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── sheet.tsx
│   │   └── table.tsx
│   └── visas/
│       ├── EditarVisaModal.tsx
│       └── IniciarVisaModal.tsx
├── database/
│   └── migrations/               # SQL migration files (applied manually to Supabase)
│       └── 001_add_modalidad_ambas.sql
├── docs/                         # Project documentation
├── hooks/                        # Custom React hooks (currently empty/minimal)
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # createClient() — browser auth only
│   │   ├── server.ts             # createServerClient() + createServiceRoleClient()
│   │   └── types.ts              # Auto-generated Supabase Database types
│   ├── auth-m2m.ts               # validateApiKey() for webhook routes
│   ├── constants.ts              # All business ENUMs as TypeScript const objects
│   ├── provincias.ts             # Argentine provinces list
│   └── utils.ts                  # cn(), formatPesos(), formatFecha()
├── middleware.ts                 # Auth guard — runs on every non-static request
├── next.config.mjs
├── tailwind.config.ts            # Custom gj-* color tokens, font variables
├── tsconfig.json
├── package.json
└── CLAUDE.md                     # Project instructions for AI coding agents
```

## Directory Purposes

**`app/(auth)/`:**
- Purpose: Public pages that do not require authentication
- Contains: Login page only
- Key files: `app/(auth)/login/page.tsx`

**`app/(dashboard)/`:**
- Purpose: All protected operational pages
- Contains: One `page.tsx` per feature, dynamic `[id]` detail pages, shared `layout.tsx`
- Key files: `app/(dashboard)/layout.tsx`, `app/(dashboard)/page.tsx`

**`app/api/`:**
- Purpose: REST-style API endpoints for client-side mutations
- Contains: Route handlers exporting `GET`, `POST`, `PATCH`, `DELETE` functions
- Key files: `app/api/visas/[id]/route.ts` (state machine + cascade logic), `app/api/usuarios/route.ts` (admin-only user management)

**`app/api/webhook/`:**
- Purpose: Inbound webhook endpoints for n8n/Telegram integration
- Contains: API-key-authenticated routes mirroring dashboard functionality
- Key files: `app/api/webhook/clientes/route.ts`, `app/api/webhook/visas/route.ts`

**`components/[feature]/`:**
- Purpose: All interactive UI for a given domain entity
- Contains: Tables, modals, forms — always `'use client'` components
- Pattern: Feature name matches the dashboard route (e.g., `components/clientes/` for `/clientes`)

**`components/ui/`:**
- Purpose: Primitive design system components (shadcn-compatible, manually created)
- Contains: Headless UI building blocks
- **Rule: Never add or modify via shadcn CLI — Node 18.18.1 is incompatible. Edit files directly.**

**`components/dashboard/`:**
- Purpose: Global shell components used by `app/(dashboard)/layout.tsx`
- Key files: `DashboardShell.tsx` (main layout wrapper), `Sidebar.tsx` (navigation)

**`lib/supabase/`:**
- Purpose: Supabase client factory functions
- Rule: Use `createServerClient()` for session reads; use `createServiceRoleClient()` for all DB writes; never use `createClient()` (browser) in server-side code

**`lib/`:**
- Purpose: Shared utilities and business constants
- Rule: `constants.ts` is the single source of truth for all ENUM strings

**`database/migrations/`:**
- Purpose: SQL migration files for schema changes applied manually to Supabase
- Pattern: Sequential numbering `NNN_description.sql`
- Note: No migration runner — apply via Supabase dashboard SQL editor

**`hooks/`:**
- Purpose: Custom React hooks
- Currently: Minimal / not heavily used; candidate for shared fetch/state logic

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML shell, font injection
- `middleware.ts`: Auth guard, runs before every page render
- `app/(dashboard)/page.tsx`: Main dashboard (home route `/`)
- `app/(auth)/login/page.tsx`: Login form

**Configuration:**
- `tailwind.config.ts`: Custom color tokens (`gj-bg`, `gj-card`, `gj-amber`, etc.) and font variables
- `tsconfig.json`: Path alias `@/` → project root
- `next.config.mjs`: Next.js config
- `lib/constants.ts`: All business ENUM values (single source of truth)

**Core Logic:**
- `lib/supabase/server.ts`: Two Supabase client factories
- `lib/auth-m2m.ts`: Webhook API key validation
- `lib/utils.ts`: `cn()`, `formatPesos()`, `formatFecha()`
- `app/api/visas/[id]/route.ts`: Visa state machine with cascade to client status

**Data Models:**
- `lib/supabase/types.ts`: Auto-generated Database types from Supabase

## Naming Conventions

**Files:**
- Page components: `page.tsx` (Next.js convention)
- Layout components: `layout.tsx`
- API handlers: `route.ts`
- Feature components: `PascalCase.tsx` matching their purpose (e.g., `NuevoClienteModal.tsx`, `ClientesTable.tsx`)
- UI primitives: `kebab-case.tsx` (e.g., `dropdown-menu.tsx`)
- Lib files: `camelCase.ts` (e.g., `auth-m2m.ts`, `provincias.ts`)

**Directories:**
- Route groups: `(kebab-case)` with parentheses
- Dynamic segments: `[id]` or `[asistente_id]` for nested resources
- Feature components: `lowercase` plural matching route name (e.g., `clientes/`, `seminarios/`)

**Components:**
- All feature components: `PascalCase` — name reflects action + entity + type (e.g., `NuevoClienteModal`, `EditarVisaModal`, `ClientesTable`)
- Modals: suffix `Modal`
- Tables: suffix `Table`
- Forms: suffix `Form`
- Dialogs (inline confirmations): suffix `Dialog`
- Buttons with built-in logic: suffix `Btn`

**TypeScript:**
- Interfaces: `PascalCase` with descriptive names (e.g., `ClienteRow`, `VisaDetalle`)
- Props interfaces: named `Props` inline or exported with component name (e.g., `DashboardShellProps`)
- ENUM types: exported from `lib/constants.ts` (e.g., `EstadoCliente`, `EstadoVisa`)

## Where to Add New Code

**New dashboard page:**
- Route: `app/(dashboard)/[feature]/page.tsx` — server component, fetches data with `createServiceRoleClient()`
- Components: `components/[feature]/` directory

**New API endpoint:**
- Standard (session auth): `app/api/[resource]/route.ts` — follow the pattern: `createServerClient()` for auth check, then `createServiceRoleClient()` for DB operations
- Webhook (API key auth): `app/api/webhook/[resource]/route.ts` — call `validateApiKey(req)` first

**New interactive component:**
- Location: `components/[feature]/[ComponentName].tsx`
- Must start with `'use client'`
- Must call API routes (never Supabase directly)
- After mutations, call `router.refresh()` or `window.location.reload()` to re-run server components

**New UI primitive:**
- Location: `components/ui/[name].tsx`
- Create manually — do not use shadcn CLI

**New business constant / ENUM:**
- Location: `lib/constants.ts` — add `as const` object and exported union type

**New utility function:**
- Shared helpers: `lib/utils.ts`
- Supabase-specific: `lib/supabase/server.ts` or `lib/supabase/client.ts`

**New database migration:**
- Location: `database/migrations/NNN_description.sql`
- Apply manually via Supabase SQL editor — no automated runner

## Special Directories

**`.planning/`:**
- Purpose: AI agent planning documents and codebase analysis
- Generated: No (maintained manually + by agents)
- Committed: Yes

**`.agent/`:**
- Purpose: GSD agent tooling (skills, workflows, templates)
- Generated: Yes (by GSD setup)
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output and cache
- Generated: Yes
- Committed: No

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-03-21*

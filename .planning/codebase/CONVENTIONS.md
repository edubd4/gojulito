# Coding Conventions

**Analysis Date:** 2026-03-21

## Naming Patterns

**Files:**
- React components: PascalCase — `NuevoClienteModal.tsx`, `ClientesTable.tsx`, `EditarVisaModal.tsx`
- Next.js pages: lowercase — `page.tsx`, `layout.tsx`, `route.ts`
- Lib utilities: camelCase — `utils.ts`, `constants.ts`, `auth-m2m.ts`
- Supabase clients: descriptive kebab directories — `lib/supabase/server.ts`, `lib/supabase/client.ts`

**Functions:**
- Event handlers: camelCase prefixed with `handle` — `handleSubmit`, `handleDelete`
- Helper functions: camelCase — `validate()`, `formatFecha()`, `formatPesos()`
- Async API handlers: named exports matching HTTP verb — `GET`, `POST`, `PATCH`, `DELETE`
- Server components: default exports using PascalCase page name — `ClientesPage`, `ConfiguracionPage`

**Variables:**
- camelCase throughout — `serverError`, `clienteDuplicado`, `isAdmin`
- Boolean state: prefixed with `is`/`es` — `isAdmin`, `esAdmin`, `loading`
- DB insert objects: descriptive name suffixed with type — `insert`, `updateData`, `body`

**Types/Interfaces:**
- PascalCase — `ClienteRow`, `FormState`, `Props`, `PatchBody`
- Local interfaces defined at file top, before component
- ENUM const objects: SCREAMING_SNAKE_CASE — `ESTADO_CLIENTE`, `CANAL_INGRESO`
- Derived union types: PascalCase from const — `EstadoCliente`, `CanalIngreso`

**Constants:**
- Module-level display maps: SCREAMING_SNAKE_CASE prefixed with `BADGE_` — `BADGE_ESTADO_CLIENTE`, `BADGE_VISA`
- Style objects: camelCase with `Style` suffix — `inputStyle`, `labelStyle`, `requiredStar`
- Empty form state: `EMPTY_FORM` (screaming snake)
- Terminal state arrays: `ESTADOS_TERMINALES`

## Code Style

**Formatting:**
- No Prettier config detected — relies on ESLint only
- Single quotes for imports, double quotes in JSX string attrs
- Trailing commas present in multi-line objects/arrays
- 2-space indentation consistently

**Linting:**
- Config: `.eslintrc.json` — extends `next/core-web-vitals` and `next/typescript`
- No additional custom rules beyond Next.js defaults
- `no-any` enforced via TypeScript strict mode (never use `any`)
- Empty `catch {}` blocks are permitted when intentional (e.g., `lib/supabase/server.ts` cookie setAll)

## Import Organization

**Order (consistently observed):**
1. Next.js framework imports — `import { NextRequest, NextResponse } from 'next/server'`, `import { redirect } from 'next/navigation'`
2. Internal lib imports — `import { createServiceRoleClient } from '@/lib/supabase/server'`
3. Internal type imports — `import type { EstadoCliente } from '@/lib/constants'`
4. Internal component imports — `import NuevoClienteModal from '@/components/clientes/NuevoClienteModal'`
5. React hooks — `import { useState, useEffect } from 'react'`

**Path Aliases:**
- `@/` maps to project root — used exclusively, no relative `../../` paths
- `import type` used consistently for type-only imports

**Directive placement:**
- `'use client'` directive on first line before all imports in client components
- `export const dynamic = 'force-dynamic'` at top of server pages that need fresh data

## Error Handling

**API Routes — standard pattern:**
```typescript
// 1. Auth check first
const authClient = await createServerClient()
const { data: { user } } = await authClient.auth.getUser()
if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

// 2. Parse body with try/catch
let body: BodyType
try {
  body = await req.json() as BodyType
} catch {
  return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
}

// 3. Validate required fields
if (!body.campo?.trim()) {
  return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
}

// 4. DB error inline
const { data, error } = await supabase.from('tabla').insert(...)
if (error) return NextResponse.json({ error: error.message }, { status: 500 })
```

**Client Components — fetch pattern:**
```typescript
try {
  const res = await fetch('/api/endpoint', { method: 'POST', ... })
  const json = await res.json() as ResponseType
  if (!res.ok || !json.success) {
    setServerError(json.error ?? 'Error genérico')
    return
  }
  // success path
} catch {
  setServerError('Error de conexión')
} finally {
  setLoading(false)
}
```

**Error display in forms:**
- Field-level: `errors.campo` state object, shown as `<span style={{ color: '#e85a5a' }}>`
- Server-level: `serverError` string state, shown as a red banner div
- Duplicate detection: separate `clienteDuplicado` state for 409 responses

**Not present:**
- No global error boundary
- No centralized error logger
- Empty `catch {}` used for intentionally swallowed errors (cookie setAll in server client)

## Logging

**Framework:** None (no logging library)

**Patterns:**
- No `console.log` calls in source files
- Audit trail via `historial` table INSERT after every important state change
- `historial` fields: `cliente_id`, `visa_id?`, `tipo` (TIPO_EVENTO enum), `descripcion`, `origen` ('dashboard' | 'telegram' | 'sistema'), `usuario_id` (null for system-originated)

## Comments

**When to Comment:**
- Single-line Spanish comments explaining non-obvious business logic: `// Cascada: visa terminal → cliente FINALIZADO si no quedan visas activas`
- Section dividers with ASCII art: `// ─── Types ───`, `// ─── Badge data ───`
- Brief inline notes before important operations: `// Verificar duplicados por teléfono o DNI`
- No JSDoc/TSDoc used anywhere

## ENUMs Usage

**Pattern — always import from `lib/constants.ts`, never hardcode strings:**
```typescript
import type { EstadoCliente, CanalIngreso } from '@/lib/constants'
import { ESTADO_CLIENTE, TIPO_EVENTO } from '@/lib/constants'

// Correct: use const object
tipo: TIPO_EVENTO.NUEVO_CLIENTE

// Correct: use string literal only when assigning to typed field
estado: 'PROSPECTO' as EstadoCliente

// Wrong: raw string without type
estado: 'PROSPECTO'
```

## Form Design Pattern

**State:**
- Single `form` state object typed as `FormState` interface
- `EMPTY_FORM` constant for reset
- `errors` as `Partial<Record<keyof FormState, string>>`
- Generic `set<K>(field, value)` helper to update one field and clear its error

**Validation:**
- Synchronous `validate()` function returns boolean, sets `errors` state
- Called at start of `handleSubmit` — return early if invalid

**Inline style objects:**
- Reusable style constants defined at module level (`inputStyle`, `labelStyle`)
- Component-specific overrides spread over base: `{ ...inputStyle, borderColor: errors.nombre ? '#e85a5a' : ... }`
- Tailwind classes used in `components/ui/` primitives; raw inline styles used in feature components

## Module Design

**Exports:**
- Default export for page components and modal components
- Named exports for types and interfaces that other files import: `export interface ClienteRow`, `export type { GrupoFamiliarOption }`
- No barrel `index.ts` files

**Client vs Server boundary:**
- Pages: default export async server components, import client components
- Client components: `'use client'` + named default export function
- API routes: named HTTP verb exports only (`GET`, `POST`, `PATCH`, `DELETE`)

## Security Patterns

**Every API route (non-webhook) must:**
1. Verify session with `createServerClient()` + `auth.getUser()`
2. Use `createServiceRoleClient()` for DB writes (bypasses RLS correctly)
3. Check `rol === 'admin'` before destructive or admin-only operations

**Webhook routes must:**
1. Call `validateApiKey(req)` from `lib/auth-m2m.ts` as first operation
2. Use `createServiceRoleClient()` — no user session available

**Never:**
- Use `lib/supabase/client.ts` for data queries (auth only)
- Expose `SUPABASE_SERVICE_ROLE_KEY` or `N8N_API_KEY` in client components

---

*Convention analysis: 2026-03-21*

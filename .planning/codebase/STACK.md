# Technology Stack

**Analysis Date:** 2026-03-21

## Languages

**Primary:**
- TypeScript 5.x - All application code (`.ts`, `.tsx` files across `app/`, `lib/`, `components/`)

**Secondary:**
- CSS (via Tailwind utility classes) - Styling throughout

## Runtime

**Environment:**
- Node.js 18.18.1 (pinned constraint — shadcn CLI is incompatible with this version)

**Package Manager:**
- npm (inferred from `package.json` and absence of yarn/pnpm lockfiles)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 14.2.35 (App Router) - Full-stack React framework, handles routing, API routes, middleware, SSR/RSC

**UI:**
- React 18.x - Component rendering
- Tailwind CSS 3.4.1 - Utility-first styling with custom `gj-` color tokens
- Radix UI primitives (Dialog `^1.1.15`, DropdownMenu `^2.1.16`, Label `^2.1.8`, Slot `^1.2.4`) - Accessible headless UI components
- lucide-react `^0.577.0` - Icon library

**Build/Dev:**
- TypeScript compiler (via Next.js build pipeline) - Type checking with strict mode
- ESLint 8.x with `eslint-config-next 14.2.35` - Linting
- PostCSS 8.x - CSS processing for Tailwind

## Key Dependencies

**Critical:**
- `@supabase/supabase-js ^2.78.0` - Core Supabase client for DB queries and auth
- `@supabase/ssr ^0.9.0` - Supabase SSR integration for Next.js (cookie-based session management in middleware and server components)

**UI Utilities:**
- `class-variance-authority ^0.7.1` - Typed component variant generation (used in `components/ui/`)
- `clsx ^2.1.1` - Conditional class composition
- `tailwind-merge ^3.5.0` - Merges Tailwind classes without conflicts (used in `lib/utils.ts` `cn()`)

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Strict mode enabled (`"strict": true`)
- Path alias: `@/*` maps to project root `./`
- Module resolution: `bundler` (Next.js optimized)

**Tailwind:**
- Config: `tailwind.config.ts`
- Dark mode: class-based (`darkMode: ["class"]`)
- Custom color palette under `gj` namespace: `gj-bg` (#0b1628), `gj-card` (#111f38), `gj-input` (#172645), `gj-amber` (#e8a020), `gj-green` (#22c97a), `gj-red` (#e85a5a), `gj-blue` (#4a9eff), `gj-text` (#e8e6e0), `gj-secondary` (#9ba8bb)
- Custom fonts: `font-display` (Fraunces, serif) and `font-body` (DM Sans, sans-serif)

**ESLint:**
- Config: `.eslintrc.json`
- Extends: `next/core-web-vitals` and `next/typescript`

**Next.js:**
- Config: `next.config.mjs` (minimal — no custom config applied)

**Environment:**
- `.env.local` present — contains secrets (never read)
- Required public vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Required server-only vars: `SUPABASE_SERVICE_ROLE_KEY`, `N8N_API_KEY`

## Platform Requirements

**Development:**
- Node.js 18.18.1 exactly (shadcn CLI breaks on this version — all `components/ui/` created manually)
- `npm run dev` — starts Next.js dev server
- `npm run build` — production build (used to verify correctness, no test suite)

**Production:**
- Deployment target: VPS (same server runs n8n for Telegram bot integration)
- `npm run start` — runs compiled production build

---

*Stack analysis: 2026-03-21*

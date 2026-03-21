# Testing

## Status

**No test suite configured.** The project explicitly omits automated tests.

> From CLAUDE.md: "No test suite configured. Verify with `npm run build` before considering a task done."

## Verification Strategy

The primary quality gate is a clean production build:

```bash
npm run build   # Must pass — TypeScript errors and build failures surface here
npm run lint    # ESLint check
```

## What to Test Manually

### Auth flow
- Login → redirected to dashboard
- Unauthenticated request → redirected to `/login`
- Authenticated user on `/login` → redirected to `/`

### API routes
- All `app/api/` routes require `createServiceRoleClient()` for DB writes
- Sensitive routes (deletions, user management) require `rol=admin` check
- Webhook routes require `validateApiKey()` from `lib/auth-m2m.ts`

### Data integrity
- Human-readable IDs (`GJ-XXXX`, `VISA-XXXX`, `PAG-XXXX`, `SEM-YYYY-NN`) generated correctly
- ENUMs match exactly the strings in `lib/constants.ts`
- `historial` table receives INSERT after state changes (never UPDATE/DELETE)

### RLS / security
- `credenciales` table only readable by `rol=admin`
- `SUPABASE_SERVICE_ROLE_KEY` never exposed to client components
- `N8N_API_KEY` only used server-side

## If a Test Suite Is Added

Recommended stack for this project:
- **Unit/integration:** Vitest (compatible with Next.js 14, Node 18)
- **E2E:** Playwright
- **DB mocking:** Use real Supabase test project — avoid mocks (prod/test divergence risk)

Test file conventions to follow:
- Co-locate unit tests: `lib/utils.test.ts` next to `lib/utils.ts`
- API route tests: `app/api/*/route.test.ts`
- Component tests: `components/**/*.test.tsx`

## Coverage Priorities (if added)

1. `lib/utils.ts` — `formatPesos()`, `formatFecha()`, `cn()`
2. `lib/auth-m2m.ts` — `validateApiKey()` edge cases
3. API routes — happy path + auth guard checks
4. Human-readable ID generation logic

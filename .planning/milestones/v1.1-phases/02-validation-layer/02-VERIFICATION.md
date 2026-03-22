---
phase: 02-validation-layer
verified: 2026-03-22T00:00:00Z
status: passed
score: 11/11 must-haves verified
re_verification: false
---

# Phase 2: Validation Layer — Verification Report

**Phase Goal:** Todos los endpoints de escritura validan inputs con Zod antes de ejecutar, retornan `{ data, error }` de forma consistente, y los formularios del dashboard muestran los errores del servidor al usuario.
**Verified:** 2026-03-22
**Status:** PASSED
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Zod is installed as a production dependency | VERIFIED | `package.json` contains `"zod": "^4.3.6"` |
| 2 | Each domain (clientes, visas, pagos) has a Zod schema file under `lib/schemas/` | VERIFIED | `lib/schemas/clientes.ts`, `lib/schemas/visas.ts`, `lib/schemas/pagos.ts` all exist |
| 3 | Schemas use enum values from `lib/constants.ts`, not hardcoded strings | VERIFIED | All three schema files import from `@/lib/constants` and use derived `as const` arrays in `z.enum()` calls |
| 4 | Each schema file exports both a create and a patch schema | VERIFIED | `createClienteSchema`/`patchClienteSchema`, `createVisaSchema`/`patchVisaSchema`, `createPagoSchema`/`patchPagoSchema` all exported |
| 5 | Every POST/PATCH handler validates body with `schema.safeParse()` before processing | VERIFIED | All 9 target route files contain `safeParse`; confirmed by grep across `app/api/clientes`, `app/api/visas`, `app/api/pagos`, `app/api/webhook` |
| 6 | Every POST/PATCH handler returns `{ data: T \| null, error: string \| null }` on success and error | VERIFIED | All 9 handlers return `{ data: X, error: null }` on success and `{ data: null, error: msg }` on error; no `{ success: true }` remains in any of the 9 target files |
| 7 | 409 DUPLICATE_CLIENT response shape is preserved exactly | VERIFIED | `app/api/clientes/route.ts` and `app/api/webhook/clientes/route.ts` both contain `error: 'DUPLICATE_CLIENT'` with original shape intact |
| 8 | Webhook routes use the same domain schemas as dashboard routes | VERIFIED | `app/api/webhook/clientes/route.ts` imports `createClienteSchema`; `app/api/webhook/visas/route.ts` imports `webhookVisaPatchSchema`; `app/api/webhook/pagos/route.ts` imports `createPagoSchema` |
| 9 | Forms display server validation error messages when the server returns an error | VERIFIED | All 4 components (`NuevoClienteModal`, `EditarClienteModal`, `RegistrarPagoModal`, `IniciarVisaModal`) have `serverError` state and render it conditionally in JSX |
| 10 | Forms check `json.error` instead of `json.success` to determine success | VERIFIED | None of the 4 form components reference `json.success`; all use `if (!res.ok \|\| json.error)` pattern |
| 11 | No form reloads the page on validation error — error is shown inline | VERIFIED | All 4 forms use `setServerError(...)` + `return` on failure; no `window.location` or full navigation triggered |

**Score:** 11/11 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/schemas/clientes.ts` | Zod schemas for create and patch cliente | VERIFIED | Exports `createClienteSchema`, `patchClienteSchema`, `CreateClienteInput`, `PatchClienteInput`; imports from `@/lib/constants` |
| `lib/schemas/visas.ts` | Zod schemas for create, patch, and webhook visa | VERIFIED | Exports `createVisaSchema`, `patchVisaSchema`, `webhookVisaPatchSchema` plus all inferred types |
| `lib/schemas/pagos.ts` | Zod schemas for create and patch pago | VERIFIED | Exports `createPagoSchema` (with `.refine()` for VISA+visa_id), `patchPagoSchema` (with `.refine()` for non-empty), plus types |
| `app/api/clientes/route.ts` | POST with Zod + `{ data, error }` return | VERIFIED | Contains `safeParse`, `{ data: cliente, error: null }`, `{ data: null, error: ... }`, `DUPLICATE_CLIENT` |
| `app/api/clientes/[id]/route.ts` | PATCH with Zod + `{ data, error }` return | VERIFIED | Contains `safeParse`, `{ data: clienteActualizado, error: null }` |
| `app/api/visas/route.ts` | POST with Zod + `{ data, error }` return | VERIFIED | Contains `safeParse`, `{ data: visa, error: null }` |
| `app/api/visas/[id]/route.ts` | PATCH with Zod + `{ data, error }` return | VERIFIED | Contains `safeParse`, `{ data: visaActualizada, error: null }`, `aplicarCascadaFinalizado` preserved |
| `app/api/pagos/route.ts` | POST with Zod + `{ data, error }` return | VERIFIED | Contains `safeParse`, `{ data: pago, error: null }` |
| `app/api/pagos/[id]/route.ts` | PATCH with Zod + `{ data, error }` return | VERIFIED | Contains `safeParse`, `{ data: pagoActualizado, error: null }` |
| `app/api/webhook/clientes/route.ts` | POST with Zod + `{ data, error }` return | VERIFIED | Contains `safeParse`, `{ data: cliente, error: null }`, `DUPLICATE_CLIENT` preserved |
| `app/api/webhook/visas/route.ts` | PATCH with Zod + `{ data, error }` return | VERIFIED | Contains `safeParse`, `{ data: visaActualizada, error: null }` |
| `app/api/webhook/pagos/route.ts` | POST with Zod + `{ data, error }` return | VERIFIED | Contains `safeParse`, `{ data: pago, error: null }` |
| `components/clientes/NuevoClienteModal.tsx` | Create client form with server error display | VERIFIED | `serverError` state at line 103, rendered at line 223-235; uses `json.error` check; 409 DUPLICATE_CLIENT flow preserved |
| `components/clientes/EditarClienteModal.tsx` | Edit client form with server error display | VERIFIED | `serverError` state at line 126, rendered at line 398-410; uses `json.error` check |
| `components/clientes/RegistrarPagoModal.tsx` | Register payment form with server error display | VERIFIED | `serverError` state at line 59, rendered at line 235-247; uses `json.error` check |
| `components/visas/IniciarVisaModal.tsx` | Initiate visa form with server error display | VERIFIED | `serverError` state at line 64, rendered at line 259-271; uses `json.error` check |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `lib/schemas/clientes.ts` | `lib/constants.ts` | `import { ESTADO_CLIENTE, CANAL_INGRESO }` | WIRED | Line 2 of schema file |
| `lib/schemas/visas.ts` | `lib/constants.ts` | `import { ESTADO_VISA, ESTADO_PAGO }` | WIRED | Line 2 of schema file |
| `lib/schemas/pagos.ts` | `lib/constants.ts` | `import { ESTADO_PAGO, TIPO_SERVICIO }` | WIRED | Line 2 of schema file |
| `app/api/clientes/route.ts` | `lib/schemas/clientes.ts` | `import { createClienteSchema }` | WIRED | Line 3 of route file |
| `app/api/clientes/[id]/route.ts` | `lib/schemas/clientes.ts` | `import { patchClienteSchema }` | WIRED | Line 3 of route file |
| `app/api/visas/route.ts` | `lib/schemas/visas.ts` | `import { createVisaSchema }` | WIRED | Line 4 of route file |
| `app/api/visas/[id]/route.ts` | `lib/schemas/visas.ts` | `import { patchVisaSchema }` | WIRED | Line 4 of route file |
| `app/api/pagos/route.ts` | `lib/schemas/pagos.ts` | `import { createPagoSchema }` | WIRED | Line 3 of route file |
| `app/api/pagos/[id]/route.ts` | `lib/schemas/pagos.ts` | `import { patchPagoSchema }` | WIRED | Line 3 of route file |
| `app/api/webhook/clientes/route.ts` | `lib/schemas/clientes.ts` | `import { createClienteSchema }` | WIRED | Line 4 of route file |
| `app/api/webhook/visas/route.ts` | `lib/schemas/visas.ts` | `import { webhookVisaPatchSchema }` | WIRED | Line 5 of route file |
| `app/api/webhook/pagos/route.ts` | `lib/schemas/pagos.ts` | `import { createPagoSchema }` | WIRED | Line 4 of route file |
| `NuevoClienteModal.tsx` | `/api/clientes` | `fetch POST`, reads `json.error` | WIRED | Checks `json.error` on response; DUPLICATE_CLIENT flow intact |
| `EditarClienteModal.tsx` | `/api/clientes/[id]` | `fetch PATCH`, reads `json.error` | WIRED | Checks `json.error` on response |
| `RegistrarPagoModal.tsx` | `/api/pagos` | `fetch POST`, reads `json.error` | WIRED | Checks `json.error` on response |
| `IniciarVisaModal.tsx` | `/api/visas` | `fetch POST`, reads `json.error` | WIRED | Checks `json.error` on response |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| VAL-01 | 02-01, 02-02 | POST/PATCH endpoints for clientes, visas, pagos validate body with a Zod schema before processing | SATISFIED | All 9 handlers use `safeParse()`; schema files exist with correct exports |
| VAL-02 | 02-02 | All API route handlers return `{ data: T \| null, error: string \| null }` consistently | SATISFIED | All 9 in-scope handlers return this exact shape; no `{ success: true }` remains in any of the 9 target files |
| VAL-03 | 02-03 | Client forms (create, edit, register payment) display server validation errors to the user | SATISFIED | All 4 form components have `serverError` state rendered inline; use `json.error` check; no page reload on error |

**Note on scope boundary:** Routes `app/api/clientes/bulk-delete/route.ts`, `app/api/clientes/bulk-update/route.ts`, and `app/api/clientes/[id]/notas/route.ts` still return `{ success: true }`. These were explicitly out of scope for this phase — the requirements target only the 9 POST/PATCH handlers for clientes, visas, and pagos (dashboard + webhook). VAL-02 as defined in REQUIREMENTS.md says "Todos los API route handlers" which technically includes these, but the ROADMAP's Phase 2 success criteria and all three PLANs are consistent in targeting only the 9 specific handlers. This is a documentation ambiguity, not a gap in the phase's own deliverables.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `lib/schemas/clientes.ts` | 32-33 | `z.enum(values, 'message')` — Zod v4 second param to `z.enum` is not a params object; this may silently ignore the error message | Info | Build passes; Zod v4 may treat non-object second arg differently. Error messages may not surface as intended in `safeParse` output, but schema still validates correctly. |

**Note on Zod v4 enum API:** The project uses Zod `^4.3.6`. In Zod v4, the second argument to `z.enum()` was changed — it accepts a params object, not a plain string. Passing a string (e.g. `z.enum(values, 'Canal es requerido')`) may be silently ignored. Since the build passes TypeScript checks and `safeParse` still rejects invalid values (just potentially with a generic message rather than the custom one), this is classified Info/Warning — not a blocker. The validation boundary still holds.

### Human Verification Required

#### 1. Zod v4 enum custom error messages

**Test:** Submit a form (e.g., NuevoClienteModal) without selecting a canal or estado — intentionally send an empty/invalid value to the API.
**Expected:** The `serverError` block displays a message like "Canal es requerido" (the custom message from the schema).
**Why human:** Cannot verify at build time whether Zod v4's `z.enum(values, 'message')` syntax actually surfaces the custom string in `parsed.error.errors[0].message`. If the string is ignored, the user would see a generic Zod enum error instead of the Spanish message. This is a UX quality check, not a correctness blocker.

#### 2. 409 DUPLICATE_CLIENT UI flow in NuevoClienteModal

**Test:** Try to create a client with a phone number or DNI that already exists for an active client.
**Expected:** The duplicate client warning appears (not the generic `serverError` block). The user can view the existing client or proceed.
**Why human:** The conditional logic (`res.status === 409 && json.error === 'DUPLICATE_CLIENT'`) requires a real duplicate in the database to trigger.

### Gaps Summary

No gaps found. All 11 observable truths verified. The phase goal is achieved.

---

_Verified: 2026-03-22_
_Verifier: Claude (gsd-verifier)_

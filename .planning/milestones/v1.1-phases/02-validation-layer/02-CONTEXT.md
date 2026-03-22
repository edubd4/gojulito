# Phase 2: Validation Layer - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Agregar Zod en todos los handlers POST/PATCH de clientes, visas y pagos. Estandarizar el retorno `{ data, error }` en esos mismos routes. Asegurar que los formularios del dashboard muestren los errores del servidor al usuario. No incluye GET, ni seminarios, ni grupos-familiares, ni perfil, ni configuracion.

</domain>

<decisions>
## Implementation Decisions

### Zod schema location
- **D-01:** Los schemas Zod viven en `lib/schemas/` — uno por dominio: `lib/schemas/clientes.ts`, `lib/schemas/visas.ts`, `lib/schemas/pagos.ts`
- **D-02:** Razón: los schemas son lógica de dominio, no de routing. El webhook y el dashboard comparten los mismos campos — colocarlos junto a la ruta los duplicaría.
- **D-03:** Los schemas se importan desde cualquier route que los necesite (dashboard y webhook).

### Retorno `{ data, error }`
- **D-04:** Solo POST y PATCH — los GET quedan igual (parámetros de query son strings simples, no necesitan Zod).
- **D-05:** Forma estándar para éxito: `{ data: T, error: null }`. Forma estándar para error: `{ data: null, error: string }`.
- **D-06:** Excepción para 409 DUPLICATE_CLIENT: mantener la forma especial actual `{ error: 'DUPLICATE_CLIENT', message: string, cliente_existente: {...} }` — el bot de Telegram depende de ese shape. No tocar.
- **D-07:** Estandarizar todos los demás casos de POST/PATCH a `{ data, error }` — incluyendo el 401, 404, 422, 500.

### Scope de routes
- **D-08:** En scope: `app/api/clientes/route.ts` (POST), `app/api/clientes/[id]/route.ts` (PATCH), `app/api/visas/route.ts` (POST), `app/api/visas/[id]/route.ts` (PATCH), `app/api/pagos/route.ts` (POST), `app/api/pagos/[id]/route.ts` (PATCH), `app/api/webhook/visas/route.ts` (POST), `app/api/webhook/pagos/route.ts` (POST), `app/api/webhook/clientes/route.ts` (POST).
- **D-09:** Fuera de scope: seminarios, grupos-familiares, perfil, configuracion, turnos, asistentes. No están en los requisitos de esta fase.

### Error granularity en el frontend
- **D-10:** Single error message por formulario — no per-field server errors. Los formularios ya tienen `serverError` state y muestran un bloque de error rojo. No rediseñar UX.
- **D-11:** El frontend solo necesita leer `json.error` o `json.data` — que es lo que ya hacen los formularios existentes (con `json.success` como intermediario). Actualizar las comprobaciones de `json.success` a `json.data !== null` donde aplique.

### Claude's Discretion
- Mensajes de error específicos de Zod (qué tan detallados son los mensajes de validación)
- Si un schema parse falla, si retornar el primer error o todos concatenados
- Nombre exacto de las funciones de parsing en los schemas (`.parse`, `.safeParse`, etc.)

</decisions>

<specifics>
## Specific Ideas

- Los webhooks de Telegram usan el mismo schema de dominio que el dashboard — el schema de `visas` se importa tanto desde `app/api/visas/route.ts` como desde `app/api/webhook/visas/route.ts`.
- No rediseñar los formularios existentes — solo asegurar que leer `json.error` funcione con el nuevo retorno.

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above.

### Requirements
- `.planning/REQUIREMENTS.md` §Validation — VAL-01, VAL-02, VAL-03 con criterios exactos de aceptación

### Routes in scope
- `app/api/clientes/route.ts` — POST crear cliente (con el caso especial 409)
- `app/api/clientes/[id]/route.ts` — PATCH editar cliente
- `app/api/visas/route.ts` — POST crear visa
- `app/api/visas/[id]/route.ts` — PATCH cambiar estado visa
- `app/api/pagos/route.ts` — POST registrar pago
- `app/api/pagos/[id]/route.ts` — PATCH cambiar estado pago
- `app/api/webhook/visas/route.ts` — POST webhook visa desde Telegram
- `app/api/webhook/pagos/route.ts` — POST webhook pago desde Telegram
- `app/api/webhook/clientes/route.ts` — POST webhook cliente desde Telegram

### Schemas to create
- `lib/schemas/clientes.ts` — schema Zod para crear y editar clientes
- `lib/schemas/visas.ts` — schema Zod para crear y editar visas
- `lib/schemas/pagos.ts` — schema Zod para crear y editar pagos

### Forms that read server errors (for VAL-03 verification)
- `components/clientes/NuevoClienteModal.tsx` — ya tiene `serverError` state
- `components/clientes/EditarClienteModal.tsx` — ya tiene `serverError` state
- `components/clientes/RegistrarPagoModal.tsx` — ya tiene `serverError` state
- `components/visas/IniciarVisaModal.tsx` — verificar si tiene error handling

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/constants.ts` — ENUMs TypeScript (`EstadoVisa`, `EstadoPago`, `CanalIngreso`, etc.) — usar como base para los `.enum()` de Zod en los schemas
- `lib/supabase/types.ts` — tipos generados de Supabase — pueden informar los tipos de los schemas pero no reemplazarlos

### Established Patterns
- Validación manual actual: `if (!body.campo?.trim()) return NextResponse.json({ error: '...' }, { status: 400 })` — reemplazar con `safeParse` de Zod
- Cast actual: `body = await req.json() as SomeInterface` — reemplazar con `schema.safeParse(await req.json())`
- Retorno de error actual: `NextResponse.json({ error: msg }, { status: N })` — mantener el status HTTP, cambiar solo el body a `{ data: null, error: msg }`
- Retorno de éxito actual: `NextResponse.json({ success: true, cliente })` — cambiar a `NextResponse.json({ data: cliente, error: null })`

### Integration Points
- Los formularios leen `json.error` en el catch — ya compatibles con `{ data, error }`. Solo necesitan dejar de verificar `json.success` y pasar a verificar `json.data !== null` o `res.ok`.
- El webhook de Telegram (via n8n) lee el body de respuesta — la forma especial 409 debe permanecer intacta.
- Zod no está instalado — requiere `npm install zod` como primera tarea.

</code_context>

<deferred>
## Deferred Ideas

- Per-field server errors en formularios (highlight de input específico) — no necesario en esta fase, D-10
- Zod en client-side — explícitamente fuera de scope (REQUIREMENTS.md Out of Scope)
- Zod en seminarios, grupos-familiares, perfil, configuracion — diferido a fase futura o v1.2

</deferred>

---

*Phase: 02-validation-layer*
*Context gathered: 2026-03-21*

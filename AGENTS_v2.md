# AGENTS.md — GoJulito

> Leé este archivo completo antes de tocar cualquier archivo.

---

## Qué es este proyecto

GoJulito — app web de gestión operativa para Julio Correa.
Acompaña trámites de visa norteamericana y organiza seminarios de viaje.

Usuarios: admin (Julio) y colaborador (asistente).
Canales: dashboard web (Next.js) + bot Telegram (n8n).

---

## Stack

- Next.js 14 App Router + TypeScript
- Supabase (PostgreSQL + Auth)
- Tailwind CSS + shadcn/ui
- Deployment: Dokploy en VPS Hostinger (147.93.36.119)
- n8n en mismo VPS para automatizaciones y bot Telegram (Alfred)

---

## Estructura de carpetas

```
app/
  (auth)/login/page.tsx
  (dashboard)/
    layout.tsx
    page.tsx
    clientes/page.tsx + [id]/page.tsx
    tramites/page.tsx + [id]/page.tsx
    pagos/page.tsx
    seminarios/page.tsx
    calendario/page.tsx
    configuracion/page.tsx
  api/
    clientes/route.ts       ← dashboard (requiere sesión)
    visas/route.ts          ← dashboard (requiere sesión)
    pagos/route.ts          ← dashboard (requiere sesión)
    metricas/route.ts       ← dashboard (requiere sesión)
    webhook/
      clientes/route.ts     ← M2M vía x-api-key (GET buscar, POST crear)
      visas/route.ts        ← M2M vía x-api-key (GET buscar, PATCH actualizar estado)
      pagos/route.ts        ← M2M vía x-api-key (POST registrar pago)
      resumen/route.ts      ← M2M vía x-api-key (GET métricas + turnos + deudas)
lib/
  supabase/client.ts
  supabase/server.ts
  auth-m2m.ts              ← validateApiKey() para rutas webhook
  constants.ts
  utils.ts
hooks/
components/
  ui/        (shadcn — creados manualmente, no usar CLI)
  dashboard/
  clientes/
  shared/
database/schema.sql
```

---

## Variables de entorno (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://xonzhjorzjcyyujzgel.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
N8N_API_KEY=...            ← clave secreta para autenticar requests de n8n
```

Nunca exponer SERVICE_ROLE_KEY ni N8N_API_KEY al browser.

---

## Autenticación — dos patrones

### 1. Dashboard (usuarios humanos)
Rutas bajo `app/(dashboard)/` y `app/api/clientes|visas|pagos|metricas`.
- `middleware.ts` verifica sesión Supabase en cada request
- API routes usan `createServerClient()` para verificar el user, luego `createServiceRoleClient()` para DB

### 2. M2M / Webhook (n8n → Next.js)
Rutas bajo `app/api/webhook/`.
- `middleware.ts` bypasea `/api/webhook/*` sin verificar sesión
- Autenticación vía header `x-api-key` comparado con `process.env.N8N_API_KEY`
- Implementado en `lib/auth-m2m.ts`:

```ts
export function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get('x-api-key')
  return !!apiKey && apiKey === process.env.N8N_API_KEY
}
```

---

## Webhook API — endpoints para n8n

### GET /api/webhook/clientes
Buscar clientes. Query params: `nombre`, `telefono`, `gj_id` (al menos uno).
Responde: `{ clientes: [...] }` con visas y pagos embebidos.

### POST /api/webhook/clientes
Crear cliente. Body requerido: `nombre`, `telefono`, `canal`, `estado`.
Opcionales: `email`, `dni`, `fecha_nac`, `provincia`, `grupo_familiar_id`, `observaciones`.
Detecta duplicados por teléfono/DNI → devuelve 409 con `error: 'DUPLICATE_CLIENT'`.
Genera `GJ-XXXX` via RPC. Inserta en historial con `origen: 'telegram'`.

### GET /api/webhook/visas
Buscar visas. Query params: `cliente_id` o `visa_id` (al menos uno).
Responde: `{ visas: [...] }` con datos del cliente embebidos.

### PATCH /api/webhook/visas
Actualizar estado de visa. Body requerido: `visa_id`, `estado`.
Opcionales: `fecha_turno` (solo si estado=TURNO_ASIGNADO), `notas`.
Cascada: si la visa queda en estado terminal (APROBADA/RECHAZADA/CANCELADA) y no quedan
visas activas, el cliente pasa automáticamente a FINALIZADO.

### POST /api/webhook/pagos
Registrar pago. Body requerido: `cliente_id`, `tipo`, `monto`, `fecha_pago`, `estado`.
`visa_id` es requerido si `tipo === 'VISA'`.
Opcional: `fecha_vencimiento_deuda` (si estado=DEUDA), `notas`.
Genera `PAG-XXXX` via RPC.

### GET /api/webhook/resumen
Resumen operativo. Sin parámetros.
Responde: `{ metricas, turnos, deudas }` consultando las tres vistas de DB.

---

## Schema de base de datos

### Tablas principales

- `profiles` — usuarios del sistema (extiende auth.users). Campos: id, email, nombre, rol, activo
- `grupos_familiares` — agrupa clientes de una misma familia. Campos: id, nombre, notas, created_at
- `clientes` — una fila por persona. Campos: id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, provincia, grupo_familiar_id (FK nullable), created_by, created_at, updated_at
- `visas` — trámites de visa. Campos: id, visa_id, cliente_id (FK), ds160, email_portal, estado, orden_atencion, fecha_turno, fecha_aprobacion, fecha_vencimiento, notas
- `credenciales` — contraseñas del portal consular. Solo admin. Campos: id, visa_id (FK), password_portal, notas
- `pagos` — un registro por cobro. Campos: id, pago_id, cliente_id (FK), visa_id (FK nullable), tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas
- `seminarios` — ediciones del seminario. Campos: id, sem_id, nombre, fecha, modalidad, precio (integer, default 0), notas
- `seminario_asistentes` — vincula clientes con seminarios. Campos: id, seminario_id (FK), cliente_id (FK nullable), nombre, telefono, provincia, modalidad, estado_pago, monto, convirtio
- `historial` — log inmutable de eventos. Campos: id, cliente_id, visa_id, tipo, descripcion, metadata (JSONB), origen, usuario_id, created_at
- `configuracion` — key-value store de configuración. Campos: id, clave (unique), valor (text), descripcion, updated_at. Claves actuales: `precio_visa`, `precio_seminario`
- `telegram_historial` — historial de conversaciones del bot. Campos: id (serial), session_id (varchar 255), message (JSONB), created_at. **El tipo JSONB es requerido por n8n.**

### Vistas disponibles

- `v_clientes_activos` — clientes ACTIVO/PROSPECTO con su visa activa y totales de pago
- `v_deudas_proximas` — deudas con vencimiento en los próximos 30 días
- `v_turnos_semana` — turnos de visa en los próximos 7 días
- `v_metricas` — conteos de visas por estado (EN_PROCESO, TURNO_ASIGNADO, APROBADA, RECHAZADA, PAUSADA)

---

## ENUMs — usar exactamente estos valores

estado_cliente: PROSPECTO | ACTIVO | FINALIZADO | INACTIVO
estado_visa: EN_PROCESO | TURNO_ASIGNADO | APROBADA | RECHAZADA | PAUSADA | CANCELADA
estado_pago: PAGADO | DEUDA | PENDIENTE
canal_ingreso: SEMINARIO | WHATSAPP | INSTAGRAM | REFERIDO | CHARLA | OTRO
tipo_servicio: VISA | SEMINARIO
modalidad_sem: PRESENCIAL | VIRTUAL
convirtio_visa: SI | NO | EN_SEGUIMIENTO
tipo_evento: CAMBIO_ESTADO | PAGO | NOTA | TURNO_ASIGNADO | ALERTA | NUEVO_CLIENTE
rol_usuario: admin | colaborador

---

## IDs legibles

Clientes: GJ-0001 | Visas: VISA-0001 | Pagos: PAG-0001 | Seminarios: SEM-2026-01 | Grupos: sin ID legible (usar nombre)

Generados via RPC `generate_readable_id(prefix, table_name, id_column)` en Supabase.

---

## Bot Telegram — Alfred (n8n)

Flow: `Telegram Trigger → Switch → AI Agent (Tools Agent) → Send text message`

El Switch distingue mensajes de texto de mensajes de voz (que pasan por transcripción antes del agente).

**Sub-nodos del AI Agent:**
- `Anthropic Chat Model` — Claude (claude-sonnet o claude-opus)
- `Postgres Chat Memory` — persiste historial en `telegram_historial` (session_id = chat.id de Telegram)
- Herramientas HTTP (una por endpoint webhook): `buscar_cliente`, `crear_cliente`, `buscar_visa`, `actualizar_visa`, `registrar_pago`, `resumen_operativo`

**Credencial Postgres para memoria:** `gojulitotestev1`
- Host: Transaction Pooler de Supabase (aws-1-us-east-2.pooler.supabase.com)
- Puerto: 6543
- SSL: Disable (el pooler cifra internamente — no cambiar)
- `message` column: **JSONB** (no TEXT — error "Got unexpected type: undefined" si se usa TEXT)

---

## Seguridad — nunca romper

1. Tabla `credenciales`: solo rol=admin puede leerla
2. Verificar rol en cada API route sensible del dashboard
3. `SERVICE_ROLE_KEY` solo en server, nunca en browser
4. `N8N_API_KEY` solo en server — validar con `validateApiKey()` en cada webhook route
5. Eliminaciones: solo admin (soft delete — marcar INACTIVO, nunca DELETE real)
6. `historial`: nunca se edita ni borra, solo INSERT

---

## Diseño

Colores dark theme:
- Fondo: #0b1628 | Cards: #111f38 | Inputs: #172645
- Amber: #e8a020 | Verde: #22c97a | Rojo: #e85a5a | Azul: #4a9eff
- Texto: #e8e6e0 | Texto2: #9ba8bb

Tipografías: Fraunces (títulos) + DM Sans (cuerpo)

Badges: ACTIVO/PAGADO/APROBADA=verde | EN_PROCESO=amber | PAUSADA/DEUDA=rojo | RECHAZADA=rojo | TURNO_ASIGNADO=azul

---

## GitHub

Repo: https://github.com/edubd4/gojulito
Branch principal: main

---

## Reglas de trabajo

- TypeScript estricto, nunca any
- async/await siempre, nunca .then()
- Siempre insertar en historial después de cambios importantes
- Un TASK.md por sesión, una sola feature por tarea
- Server components para queries a Supabase, nunca desde el cliente
- Usar lib/supabase/server.ts en server components y API routes
- No modificar components/ui/ — creados manualmente (shadcn CLI incompatible con Node 18)
- No eliminar registros — soft delete (marcar INACTIVO)
- No modificar schema de DB existente — crear migraciones en database/migrations/

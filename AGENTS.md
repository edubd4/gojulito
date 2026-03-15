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
- n8n en mismo VPS para automatizaciones y Telegram bot

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
    clientes/route.ts
    visas/route.ts
    pagos/route.ts
    metricas/route.ts
lib/
  supabase/client.ts
  supabase/server.ts
  constants.ts
  utils.ts
hooks/
components/
  ui/        (shadcn)
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
```

Nunca exponer SERVICE_ROLE_KEY al browser.

---

## Schema de base de datos

### Tablas principales

- `profiles` — usuarios del sistema (extiende auth.users). Campos: id, email, nombre, rol, activo
- `grupos_familiares` — agrupa clientes de una misma familia. Campos: id, nombre, notas, created_at
- `clientes` — una fila por persona. Campos: id, gj_id, nombre, telefono, email, dni, fecha_nac, canal, estado, observaciones, grupo_familiar_id (FK nullable), created_by, created_at, updated_at
- `visas` — trámites de visa. Campos: id, visa_id, cliente_id (FK), ds160, email_portal, estado, orden_atencion, fecha_turno, fecha_aprobacion, fecha_vencimiento, notas
- `credenciales` — contraseñas del portal consular. Solo admin. Campos: id, visa_id (FK), password_portal, notas
- `pagos` — un registro por cobro. Campos: id, pago_id, cliente_id (FK), visa_id (FK nullable), tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, referencia_grupo, notas
- `seminarios` — ediciones del seminario. Campos: id, sem_id, nombre, fecha, modalidad, notas
- `seminario_asistentes` — vincula clientes con seminarios. Campos: id, seminario_id (FK), cliente_id (FK nullable), nombre, telefono, provincia, modalidad, estado_pago, monto, convirtio
- `historial` — log inmutable de eventos. Campos: id, cliente_id, visa_id, tipo, descripcion, metadata (JSONB), origen, usuario_id, created_at

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

---

## Seguridad — nunca romper

1. Tabla credenciales: solo rol=admin puede leerla
2. Verificar rol en cada API route sensible
3. SERVICE_ROLE_KEY solo en server, nunca en browser
4. Eliminaciones: solo admin
5. historial: nunca se edita ni borra, solo INSERT

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

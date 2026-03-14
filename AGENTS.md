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

## ENUMs — usar exactamente estos valores

estado_cliente: PROSPECTO | ACTIVO | FINALIZADO | INACTIVO
estado_visa: EN_PROCESO | TURNO_ASIGNADO | APROBADA | RECHAZADA | PAUSADA | CANCELADA
estado_pago: PAGADO | DEUDA | PENDIENTE
canal_ingreso: SEMINARIO | WHATSAPP | INSTAGRAM | REFERIDO | CHARLA | OTRO
tipo_servicio: VISA | SEMINARIO
modalidad_sem: PRESENCIAL | VIRTUAL
convirtio_visa: SI | NO | EN_SEGUIMIENTO
tipo_evento: CAMBIO_ESTADO | PAGO | NOTA | TURNO_ASIGNADO | ALERTA | NUEVO_CLIENTE

---

## IDs legibles

Clientes: GJ-0001 | Visas: VISA-0001 | Pagos: PAG-0001 | Seminarios: SEM-2026-01

---

## Seguridad — nunca romper

1. Tabla credenciales: solo rol=admin puede leerla
2. Verificar rol en cada API route sensible
3. SERVICE_ROLE_KEY solo en server, nunca en browser
4. Eliminaciones: solo admin

---

## Diseño

Colores dark theme:
- Fondo: #0b1628 | Cards: #111f38 | Inputs: #172645
- Amber: #e8a020 | Verde: #22c97a | Rojo: #e85a5a | Azul: #4a9eff
- Texto: #e8e6e0 | Texto2: #9ba8bb

Tipografías: Fraunces (títulos) + DM Sans (cuerpo)

Badges: ACTIVO/PAGADO/APROBADA=verde | EN_PROCESO=amber | PAUSADA/DEUDA=rojo

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

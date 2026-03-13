# AGENTS.md — GoJulito

> Este archivo es para Claude Code y cualquier agente de IA que trabaje en este proyecto.
> Leelo completo antes de tocar cualquier archivo.

---

## Qué es este proyecto

**GoJulito** es una aplicación web de gestión operativa para Julio Correa, un consultor
independiente que acompaña a personas en trámites de visa norteamericana y organiza
seminarios de viaje.

**Dos tipos de usuario:**
- `admin` → Julio Correa. Ve todo, incluyendo credenciales del portal consular USCIS.
- `colaborador` → Asistente. Ve clientes y trámites. No ve credenciales. No puede eliminar.

**Dos canales de operación:**
- Este dashboard web (Next.js)
- Un bot de Telegram que lee/escribe en la misma base de datos vía n8n

---

## Stack tecnológico

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Frontend + Backend | Next.js 14 (App Router) | Un solo repo |
| Base de datos | Supabase (PostgreSQL) | También maneja auth |
| Auth | Supabase Auth | Email/password. Roles en tabla profiles |
| Deployment | Dokploy (VPS Hostinger) | IP: 147.93.36.119 |
| Automatización | n8n (mismo VPS) | Se conecta a Supabase directamente |
| Bot Telegram | n8n + Claude API | Canal operativo para Julio |
| Estilos | Tailwind CSS | Solo clases utilitarias |
| Componentes | shadcn/ui | Instalados bajo /components/ui |

---

## Estructura del proyecto

```
gojulito/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # sidebar + topbar compartido
│   │   ├── page.tsx                # dashboard principal con métricas
│   │   ├── clientes/
│   │   │   ├── page.tsx            # tabla de clientes con filtros
│   │   │   └── [id]/page.tsx       # perfil completo del cliente
│   │   ├── tramites/
│   │   │   ├── page.tsx            # pipeline de visas
│   │   │   └── [id]/page.tsx       # detalle del trámite
│   │   ├── pagos/page.tsx
│   │   ├── seminarios/page.tsx
│   │   ├── calendario/page.tsx
│   │   └── configuracion/page.tsx  # solo admin
│   ├── api/
│   │   ├── clientes/route.ts
│   │   ├── visas/route.ts
│   │   ├── pagos/route.ts
│   │   └── metricas/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn components
│   ├── dashboard/                  # métricas, alertas, pipeline
│   ├── clientes/                   # tabla, filtros, modal
│   ├── visas/                      # pipeline, cards
│   └── shared/                     # badge, spinner, empty-state
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # cliente browser
│   │   ├── server.ts               # cliente server (SSR)
│   │   └── types.ts                # tipos generados del schema
│   ├── utils.ts
│   └── constants.ts                # ENUM values
├── hooks/
│   ├── use-auth.ts
│   ├── use-clientes.ts
│   └── use-metricas.ts
├── database/
│   └── schema.sql
├── docs/
│   └── api.md
├── .env.local.example
├── AGENTS.md
└── README.md
```

---

## Variables de entorno

Siempre usar .env.local para desarrollo. Nunca hardcodear valores.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

SUPABASE_SERVICE_ROLE_KEY solo se usa en API routes del servidor, nunca en el cliente.

---

## Convenciones de naming

### IDs legibles
- Clientes:    GJ-0001, GJ-0002...
- Visas:       VISA-0001, VISA-0002...
- Pagos:       PAG-0001, PAG-0002...
- Seminarios:  SEM-2026-01, SEM-2026-02...

### Archivos
- Componentes: PascalCase → ClienteRow.tsx
- Hooks: use-nombre.ts
- API routes: siempre route.ts dentro de su carpeta

### Código
- TypeScript estricto. Siempre tipar. Nunca any.
- Funciones async/await, nunca .then().catch() encadenado.
- Errores siempre con try/catch y respuesta tipada.

---

## ENUM values — usar exactamente estos strings

### estado_cliente
PROSPECTO | ACTIVO | FINALIZADO | INACTIVO

### estado_visa
EN_PROCESO | TURNO_ASIGNADO | APROBADA | RECHAZADA | PAUSADA | CANCELADA

### estado_pago
PAGADO | DEUDA | PENDIENTE

### canal_ingreso
SEMINARIO | WHATSAPP | INSTAGRAM | REFERIDO | CHARLA | OTRO

### tipo_servicio
VISA | SEMINARIO

### modalidad_sem
PRESENCIAL | VIRTUAL

### convirtio_visa
SI | NO | EN_SEGUIMIENTO

### tipo_evento (historial)
CAMBIO_ESTADO | PAGO | NOTA | TURNO_ASIGNADO | ALERTA | NUEVO_CLIENTE

---

## Reglas de seguridad — NUNCA ROMPER

### 1. Credenciales del portal consular USCIS
- NUNCA se devuelven al cliente (browser)
- Solo se leen en API routes del servidor con SUPABASE_SERVICE_ROLE_KEY
- Siempre verificar rol === 'admin' antes de acceder a tabla credenciales
- Si el usuario es colaborador y pide credenciales: responder 403

### 2. Verificar rol en endpoints sensibles
```typescript
// Patrón obligatorio en API routes de credenciales:
const { data: profile } = await supabaseServer
  .from('profiles')
  .select('rol')
  .eq('id', user.id)
  .single()

if (profile?.rol !== 'admin') {
  return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
}
```

### 3. Supabase clients
- Browser components: usar lib/supabase/client.ts (anon key)
- Server components y API routes: usar lib/supabase/server.ts (service role key para admin ops)
- Nunca usar service role key en componentes cliente

### 4. Eliminación de datos
- Siempre verificar rol antes de DELETE
- Preferir soft delete: campo activo=false en lugar de eliminar registros
- El historial NUNCA se elimina

---

## Patrones de código obligatorios

### API Route estándar
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { data, error } = await supabase.from('clientes').select('*')
    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
```

### Insertar en historial (siempre después de cambios importantes)
```typescript
await supabase.from('historial').insert({
  cliente_id: clienteId,
  visa_id: visaId,           // nullable
  tipo: 'CAMBIO_ESTADO',
  descripcion: 'Visa VISA-0001 cambió de EN_PROCESO a TURNO_ASIGNADO',
  metadata: { estado_anterior: 'EN_PROCESO', estado_nuevo: 'TURNO_ASIGNADO' },
  origen: 'dashboard',
  usuario_id: user.id
})
```

### Formato de moneda (siempre en pesos argentinos)
```typescript
// usar esta función de lib/utils.ts
export function formatPesos(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount)
}
```

---

## Diseño y UI

### Paleta de colores (dark theme — igual al prototipo HTML)
- Fondo principal:  #0b1628
- Fondo cards:      #111f38
- Fondo input:      #172645
- Borde:            rgba(255,255,255,0.07)
- Amber (acento):   #e8a020
- Verde (éxito):    #22c97a
- Rojo (alerta):    #e85a5a
- Azul (info):      #4a9eff
- Texto principal:  #e8e6e0
- Texto secundario: #9ba8bb

### Tipografías
- Display/títulos: Fraunces (Google Fonts)
- Cuerpo: DM Sans (Google Fonts)

### Badges de estado
- ACTIVO / PAGADO / APROBADA → verde
- EN_PROCESO / TURNO_ASIGNADO / PENDIENTE → amber
- PAUSADA / DEUDA / RECHAZADA → rojo
- FINALIZADO → azul
- INACTIVO / CANCELADA → gris

---

## Flujo de autenticación

1. Usuario entra a cualquier ruta del dashboard
2. Middleware verifica sesión de Supabase
3. Si no hay sesión → redirect a /login
4. En /login se hace signInWithPassword de Supabase
5. Después del login → redirect a /
6. El perfil del usuario (con rol) se carga desde tabla profiles

### Middleware (app/middleware.ts)
Proteger todas las rutas bajo /(dashboard)/.
Dejar pasar /(auth)/login sin verificación.

---

## Conexión con n8n (Telegram bot)

n8n corre en el mismo VPS y se conecta a Supabase con:
- Supabase URL: desde .env del VPS
- Supabase Service Role Key: acceso completo para el bot de Julio (admin)

El bot de Telegram puede:
- Leer cualquier tabla (SELECT)
- Insertar en clientes, visas, pagos, historial
- Actualizar estados
- NO puede eliminar registros

Cuando n8n hace una operación, inserta en historial con origen='telegram'.

---

## Cómo hacer migraciones

Si el schema cambia después del deploy inicial:
1. Agregar el SQL de la migración en database/migrations/YYYY-MM-DD-descripcion.sql
2. Correrlo manualmente en el SQL Editor de Supabase
3. Actualizar database/schema.sql con el estado final
4. Actualizar lib/supabase/types.ts con los nuevos tipos
5. Commitear todo junto con el código que usa los nuevos campos

---

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Generar tipos de Supabase (requiere Supabase CLI)
npx supabase gen types typescript --project-id TU_PROJECT_ID > lib/supabase/types.ts

# Linting
npm run lint
```

---

## Lo que NO hacer

- No usar Pages Router. Este proyecto usa App Router exclusivamente.
- No crear componentes cliente cuando el servidor alcanza.
- No fetchear datos directamente desde componentes cliente sin pasar por API routes.
- No usar localStorage para datos del negocio.
- No exponer SUPABASE_SERVICE_ROLE_KEY al browser bajo ningún concepto.
- No inventar nuevos valores para los ENUMs. Usar exactamente los definidos arriba.
- No eliminar registros de historial bajo ninguna circunstancia.
- No modificar el schema de base de datos sin crear el archivo de migración primero.

---

## Contexto de negocio (para el agente)

GoJulito trabaja principalmente con clientes de Argentina (Tucumán y otras provincias).
Los montos son en pesos argentinos (ARS). Los trámites son visas B1/B2 de EEUU.
El portal consular es travel.state.gov (USCIS).
Los DS-160 tienen formato AA00XXXXX.
Los seminarios son eventos presenciales/virtuales donde Julio explica el proceso de visa.
La tasa de conversión seminario → visa es la métrica más importante del negocio.

# Supabase Patterns — GoJulito

Mejores prácticas de Supabase para este proyecto. Seguir siempre este patrón.

---

## Los tres clientes — cuándo usar cada uno

### 1. `createServerClient()` — ANON key + cookies

```ts
import { createServerClient } from '@/lib/supabase/server'

const authClient = await createServerClient()
const { data: { user } } = await authClient.auth.getUser()
```

**Único uso permitido:** verificar sesión (`auth.getUser()`).
**Nunca:** hacer queries de datos con este cliente — usa RLS y el usuario puede no tener permisos.
**Dónde:** server components y API routes, siempre como primer paso.

---

### 2. `createServiceRoleClient()` — SERVICE_ROLE key

```ts
import { createServiceRoleClient } from '@/lib/supabase/server'

const supabase = await createServiceRoleClient()
```

**Uso:** todas las queries y mutations de datos (SELECT, INSERT, UPDATE).
**Bypasea RLS completamente** — la seguridad la implementa el código, no la DB.
**Nunca:** usarlo antes de verificar la sesión con `createServerClient()`.
**Nunca:** importarlo en componentes cliente o archivos con `'use client'`.
**Solo en:** `app/api/**` y server components (`app/(dashboard)/**`).

---

### 3. `createClient()` — browser, ANON key

```ts
import { createClient } from '@/lib/supabase/client'
```

**Único uso permitido:** flujo de login (`auth.signInWithPassword`, `auth.signOut`).
**Nunca:** queries de datos desde el browser — llamar a las API routes internas (`/api/...`).
**Dónde:** solo en `app/(auth)/login/page.tsx` o hooks de auth en cliente.

---

## Patrón estándar de API route

Todo API route sigue este orden exacto:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // 1. Verificar sesión — siempre primero
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // 2. Parsear y validar body
  let body: MiTipo
  try {
    body = await req.json() as MiTipo
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  if (!body.campo_requerido) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  // 3. Operaciones de DB — serviceRole
  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('tabla')
    .insert({ ... })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 4. Insertar en historial si corresponde
  await supabase.from('historial').insert({ ... })

  // 5. Respuesta
  return NextResponse.json({ success: true, data })
}
```

---

## Patrón estándar de server component

```ts
import { notFound } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export default async function MiPage({ params }: { params: { id: string } }) {
  // 1. Verificar sesión
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) notFound() // o redirect('/login') — middleware ya debería cubrir esto

  // 2. Queries de datos
  const supabase = await createServiceRoleClient()

  const { data: rawCliente, error } = await supabase
    .from('clientes')
    .select('id, gj_id, nombre, estado')
    .eq('id', params.id)
    .single()

  if (error || !rawCliente) notFound()

  // 3. Tipar manualmente (ver sección de tipos)
  const cliente = rawCliente as ClienteDetalle

  return <div>{cliente.nombre}</div>
}
```

---

## Manejo de errores

### Errores de query

```ts
// select único — puede no encontrar
const { data, error } = await supabase.from('clientes').select('*').eq('id', id).single()
if (error || !data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

// select múltiple — nunca da error si está vacío, solo array vacío
const { data: rows } = await supabase.from('pagos').select('*').eq('cliente_id', id)
const pagos = rows ?? []

// maybeSingle — cuando puede o no existir (no es error si no hay resultado)
const { data: visa } = await supabase
  .from('visas')
  .select('*')
  .eq('cliente_id', id)
  .neq('estado', 'CANCELADA')
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle()
// visa puede ser null — no es error

// insert/update — siempre verificar
const { data: nuevo, error: insertError } = await supabase
  .from('clientes')
  .insert({ ... })
  .select()
  .single()
if (insertError || !nuevo) {
  return NextResponse.json({ error: insertError?.message ?? 'Error al crear' }, { status: 500 })
}
```

### Errores de body en API routes

```ts
// Siempre envolver req.json() en try/catch — puede lanzar si el body no es JSON válido
let body: MiTipo
try {
  body = await req.json() as MiTipo
} catch {
  return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
}
```

### No propagar errores internos al cliente

```ts
// MAL — expone detalles internos
return NextResponse.json({ error: error.message }, { status: 500 })

// BIEN para errores esperados (validación, not found)
return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })

// Aceptable para errores de DB (app interna, usuario de confianza)
if (error) return NextResponse.json({ error: error.message }, { status: 500 })
```

---

## Tipos y `lib/supabase/types.ts`

> **Advertencia:** `lib/supabase/types.ts` está **desincronizado** con el schema real de la DB.
> Los field names son distintos (ej: `codigo` vs `gj_id`, `apellido` vs el nombre completo en un campo).
> **No usar** `Database['public']['Tables']['clientes']['Row']` para tipar queries — genera errores de tipos falsos.

### Patrón actual: interfaces locales + cast

```ts
// Definir interfaces propias en el archivo que las usa
interface ClienteDetalle {
  id: string
  gj_id: string
  nombre: string
  telefono: string | null
  email: string | null
  estado: EstadoCliente
  // ... solo los campos que se seleccionan
}

// Castear el resultado de Supabase
const { data: rawCliente } = await supabase
  .from('clientes')
  .select('id, gj_id, nombre, telefono, email, estado')
  .eq('id', id)
  .single()

const cliente = rawCliente as ClienteDetalle
```

### Usar ENUMs de `lib/constants.ts` para tipos de negocio

```ts
import type { EstadoCliente, EstadoVisa, EstadoPago, CanalIngreso, TipoEvento } from '@/lib/constants'

// Los ENUMs son la fuente de verdad — no repetirlos como strings literales
interface ClienteRow {
  estado: EstadoCliente   // 'PROSPECTO' | 'ACTIVO' | 'FINALIZADO' | 'INACTIVO'
  canal: CanalIngreso     // 'SEMINARIO' | 'WHATSAPP' | 'INSTAGRAM' | ...
}
```

### `Record<string, unknown>` para inserts dinámicos

```ts
// Cuando el objeto de insert se construye condicionalmente
const insert: Record<string, unknown> = {
  gj_id,
  nombre: body.nombre.trim(),
  estado: body.estado,
}

// Agregar campos opcionales solo si tienen valor
if (body.email?.trim()) insert.email = body.email.trim()
if (body.fecha_nac) insert.fecha_nac = body.fecha_nac
if (body.grupo_familiar_id) insert.grupo_familiar_id = body.grupo_familiar_id
```

---

## Generación de IDs secuenciales

Patrón estándar para `GJ-XXXX`, `VISA-XXXX`, `PAG-XXXX`:

```ts
// Buscar el máximo existente
const { data: maxRow } = await supabase
  .from('clientes')
  .select('gj_id')
  .order('gj_id', { ascending: false })
  .limit(1)
  .maybeSingle()

// Calcular el siguiente
let nextNum = 1
if (maxRow?.gj_id) {
  const match = (maxRow.gj_id as string).match(/^GJ-(\d+)$/)
  if (match) nextNum = parseInt(match[1], 10) + 1
}
const gj_id = `GJ-${String(nextNum).padStart(4, '0')}`
// → "GJ-0001", "GJ-0042", "GJ-0100"
```

> Este patrón es adecuado porque GoJulito es una herramienta interna de baja concurrencia.
> En sistemas de alta concurrencia habría que usar una secuencia de DB o un lock.

Prefijos por tabla:
- `clientes` → `GJ-XXXX`
- `visas` → `VISA-XXXX`
- `pagos` → `PAG-XXXX`
- `seminarios` → `SEM-YYYY-NN` (año + número)

---

## `historial` — tabla inmutable de auditoría

```ts
// Siempre INSERT, nunca UPDATE ni DELETE
await supabase.from('historial').insert({
  cliente_id: 'uuid-del-cliente',       // requerido
  visa_id: 'uuid-de-la-visa',           // opcional — solo si el evento es de visa
  tipo: 'CAMBIO_ESTADO',                // TipoEvento — ver lib/constants.ts
  descripcion: 'Estado cambiado de X a Y',
  origen: 'dashboard',                  // 'dashboard' | 'telegram' | 'sistema'
  usuario_id: user.id,                  // id del usuario autenticado
  // metadata: { ... }                  // opcional — JSONB para datos extra
})
```

### Cuándo insertar en historial

| Acción | tipo | ¿cuándo? |
|---|---|---|
| Crear cliente | `NUEVO_CLIENTE` | siempre |
| Cambiar estado de cliente | `CAMBIO_ESTADO` | solo si el estado efectivamente cambió |
| Iniciar visa | `CAMBIO_ESTADO` | siempre al crear |
| Cambiar estado de visa | `CAMBIO_ESTADO` | solo si cambió |
| Asignar turno | `TURNO_ASIGNADO` | adicionalmente a CAMBIO_ESTADO cuando estado=TURNO_ASIGNADO |
| Registrar pago | `PAGO` | siempre |
| Agregar nota | `NOTA` | siempre (el insert en historial ES la acción) |

---

## Queries con JOIN (relaciones embebidas)

```ts
// Traer visa con datos del cliente
const { data } = await supabase
  .from('visas')
  .select('*, clientes(id, nombre, gj_id)')
  .order('created_at', { ascending: false })

// El resultado de la relación puede ser objeto o array según la cardinalidad
// Para FK many-to-one (visa → cliente): Supabase devuelve objeto, a veces array de un elemento
const cliente = Array.isArray(row.clientes)
  ? (row.clientes[0] as { id: string; nombre: string; gj_id: string } | undefined)
  : (row.clientes as { id: string; nombre: string; gj_id: string } | null)

// Para relaciones one-to-many (cliente → visas): siempre array
const { data } = await supabase
  .from('clientes')
  .select('id, nombre, visas(estado), pagos(estado)')
```

---

## Seguridad — reglas que nunca se rompen

### 1. SERVICE_ROLE_KEY solo en servidor

```ts
// MAL — en client component
'use client'
import { createServiceRoleClient } from '@/lib/supabase/server' // Error de runtime

// BIEN — solo en server o API route
import { createServiceRoleClient } from '@/lib/supabase/server'
export async function GET() { ... }
```

### 2. Verificar sesión antes de cualquier operación

```ts
// MAL — operar sin verificar quién es el usuario
const supabase = await createServiceRoleClient()
await supabase.from('clientes').update({ ... })

// BIEN — primero el user, siempre
const authClient = await createServerClient()
const { data: { user } } = await authClient.auth.getUser()
if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
const supabase = await createServiceRoleClient()
```

### 3. `credenciales` — solo rol admin

```ts
// En cualquier route que lea credenciales:
const { data: profile } = await supabase
  .from('profiles')
  .select('rol')
  .eq('id', user.id)
  .single()

if (profile?.rol !== 'admin') {
  return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
}
```

### 4. Eliminaciones — solo admin

```ts
// Mismo patrón: verificar rol antes de DELETE o soft-delete (marcar INACTIVO)
if (profile?.rol !== 'admin') {
  return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
}
```

### 5. Nunca DELETE real — solo soft delete

```ts
// MAL
await supabase.from('clientes').delete().eq('id', id)

// BIEN — soft delete
await supabase.from('clientes').update({ estado: 'INACTIVO' }).eq('id', id)
```

---

## RLS en este proyecto

`createServiceRoleClient()` bypasea RLS completamente. Esto es intencional:
- La app es interna, usuarios son `admin` y `colaborador` de confianza
- La seguridad se implementa en las API routes (verificación de sesión + rol)
- RLS no está configurada en tablas — no depender de políticas de RLS para seguridad

**Consecuencia:** toda query con serviceRole es irrestricta. El código es el guardián.

---

## Anti-patrones

```ts
// MAL — query desde componente cliente directo a Supabase
'use client'
const supabase = createClient()
const { data } = await supabase.from('clientes').select('*') // bypasea nuestros guards

// BIEN — fetch a API route interna
const res = await fetch('/api/clientes')
const { clientes } = await res.json()

// MAL — usar createServerClient para datos
const client = await createServerClient() // solo tiene ANON key
await client.from('clientes').insert({ ... }) // puede fallar por RLS o permisos

// BIEN
const supabase = await createServiceRoleClient()
await supabase.from('clientes').insert({ ... })

// MAL — ignorar el error de insert
const { data } = await supabase.from('pagos').insert({ ... }).select().single()
// si falla, data es null y code explota más adelante sin contexto

// BIEN
const { data, error } = await supabase.from('pagos').insert({ ... }).select().single()
if (error || !data) return NextResponse.json({ error: error?.message ?? 'Error' }, { status: 500 })

// MAL — tipos de Database (desincronizados)
import type { Database } from '@/lib/supabase/types'
type Cliente = Database['public']['Tables']['clientes']['Row'] // campos incorrectos

// BIEN — interfaz local con los campos reales
interface ClienteDetalle { id: string; gj_id: string; nombre: string; ... }
```

---

## Variables de entorno

| Variable | Tipo | Dónde se usa |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | pública | cliente + servidor |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pública | cliente + servidor (ANON) |
| `SUPABASE_SERVICE_ROLE_KEY` | **secreta** | solo servidor — nunca exponer |

```ts
// Acceder en servidor
process.env.SUPABASE_SERVICE_ROLE_KEY  // disponible en API routes y server components

// En cliente (browser)
process.env.NEXT_PUBLIC_SUPABASE_URL   // disponible (prefijo NEXT_PUBLIC_)
// process.env.SUPABASE_SERVICE_ROLE_KEY  → undefined en browser — correcto
```

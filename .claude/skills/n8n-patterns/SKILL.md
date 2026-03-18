# n8n Patterns — GoJulito

Patrones y referencias para el bot Telegram (Alfred) y las rutas webhook de n8n.

---

## Arquitectura del canal n8n ↔ Next.js

```
Telegram → n8n (VPS 147.93.36.119) → Next.js webhook routes → Supabase
                                      (x-api-key header)
```

n8n llama a los endpoints internos de Next.js usando `N8N_API_KEY` como autenticación.
Next.js valida con `validateApiKey()` de `lib/auth-m2m.ts`.
`middleware.ts` bypasea `/api/webhook/*` sin verificar sesión de Supabase.

---

## Patrón estándar de webhook route

Toda route bajo `app/api/webhook/` sigue este orden:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

export async function GET(req: NextRequest) {
  // 1. Validar API key — siempre primero
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // 2. Leer parámetros
  const { searchParams } = req.nextUrl
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Parámetro requerido: id' }, { status: 400 })
  }

  // 3. DB — siempre serviceRole (no hay sesión de usuario)
  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase.from('tabla').select('*').eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: data ?? [] })
}
```

**Diferencia clave con rutas de dashboard:** no hay `createServerClient()` ni `auth.getUser()` —
la autenticación es la API key, no la sesión de usuario.

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/webhook/clientes` | Buscar por `nombre`, `telefono`, `gj_id` |
| POST | `/api/webhook/clientes` | Crear cliente (detecta duplicados por tel/DNI → 409) |
| GET | `/api/webhook/visas` | Buscar por `cliente_id` o `visa_id` |
| PATCH | `/api/webhook/visas` | Actualizar estado (con cascada a FINALIZADO) |
| POST | `/api/webhook/pagos` | Registrar pago (requiere `visa_id` si tipo=VISA) |
| GET | `/api/webhook/resumen` | Métricas + turnos + deudas (sin params) |

---

## Testear endpoints desde curl

```bash
# Buscar cliente
curl "https://gojulito.com/api/webhook/clientes?nombre=Eduardo" \
  -H "x-api-key: TU_N8N_API_KEY"

# Crear cliente
curl -X POST "https://gojulito.com/api/webhook/clientes" \
  -H "x-api-key: TU_N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Perez","telefono":"3815123456","canal":"WHATSAPP","estado":"PROSPECTO"}'

# Resumen operativo
curl "https://gojulito.com/api/webhook/resumen" \
  -H "x-api-key: TU_N8N_API_KEY"

# Actualizar estado de visa
curl -X PATCH "https://gojulito.com/api/webhook/visas" \
  -H "x-api-key: TU_N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"visa_id":"VISA-0001","estado":"TURNO_ASIGNADO","fecha_turno":"2026-04-10"}'
```

---

## Flow de Telegram — estructura del agente Alfred

```
Telegram Trigger
  → Switch (Rules)
      → [texto] → AI Agent1
      → [voz]   → Get a file → Transcribe a recording → AI Agent1
  → Send a text message
```

**AI Agent1 (Tools Agent):**
- **Chat Model:** Anthropic (Claude)
- **Memory:** Postgres Chat Memory (`telegram_historial`, key = `chat.id`)
- **Tools:** buscar_cliente · crear_cliente · buscar_visa · actualizar_visa · registrar_pago · resumen_operativo

**Prompt base del agente:**
```
Responderás a esto:
{{ $json.message.text }}  {{ $json.text }}
{{ $now.format('yyyy-MM-dd') }}
```

El `$json.text` cubre el caso de mensajes de voz (transcripción). `$now.format` inyecta la fecha actual.

---

## Tabla `telegram_historial` — schema requerido

**CRÍTICO:** La columna `message` debe ser `JSONB`, no `TEXT`.
n8n's `PostgresChatMessageHistory` inserta objetos JSON directamente.
Usar `TEXT` produce `"Got unexpected type: undefined"` en la segunda ejecución.

```sql
CREATE TABLE telegram_historial (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_telegram_historial_session_id ON telegram_historial(session_id);
ALTER TABLE telegram_historial DISABLE ROW LEVEL SECURITY;
```

Para verificar que el bot está guardando memoria:
```sql
SELECT session_id, count(*) FROM telegram_historial GROUP BY session_id;
```

---

## Credencial Postgres en n8n (`gojulitotestev1`)

| Campo | Valor |
|-------|-------|
| Host | `aws-1-us-east-2.pooler.supabase.com` (Transaction Pooler) |
| Puerto | `6543` |
| Database | `postgres` |
| User | `postgres.ixonzhjorzjcyyujzgel` |
| SSL | **Disable** (el pooler cifra internamente — no cambiar) |

**Por qué SSL Disable:** El Transaction Pooler de Supabase maneja TLS a nivel de infraestructura.
Los modos "Allow" y "Require" de n8n fallan porque el certificado del pooler no es compatible
con el cliente SSL de n8n. Es seguro dejarlo en Disable.

---

## Variables de entorno en n8n

Las herramientas HTTP del agente usan `N8N_API_KEY` hardcodeado en los headers del nodo HTTP Request.
Si se regenera la clave, actualizar en todos los nodos herramienta del flow **y** en `.env.local` de Next.js.

---

## Diagnóstico de problemas comunes

### Bot no responde (cuelga)
1. Verificar que `telegram_historial` existe con schema correcto (`message JSONB`)
2. Verificar credencial `gojulitotestev1` — connection test debe pasar
3. Ver logs en n8n → Executions del workflow

### "Got unexpected type: undefined"
Columna `message` es `TEXT` en lugar de `JSONB`.
Fix: `DROP TABLE telegram_historial` + recrear con schema correcto.

### Primera ejecución ok, segunda falla
Mismo problema: tipo de columna incorrecto. El pool bug original (n8n < v1.88) producía *cuelgue*,
no error. Si hay error, es el tipo de columna.

### Herramienta no encontrada por el agente
Revisar el nombre y descripción del nodo herramienta en n8n — Claude decide qué tool usar
basándose en el nombre y la descripción. Hacerlos explícitos y específicos.

---

## Anti-patrones

```ts
// MAL — webhook route sin validar API key
export async function GET(req: NextRequest) {
  const supabase = await createServiceRoleClient() // expuesto sin auth
  ...
}

// BIEN
export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  ...
}

// MAL — usar createServerClient() en webhook route
// No hay sesión de usuario en requests de n8n
const authClient = await createServerClient()
const { data: { user } } = await authClient.auth.getUser() // siempre null

// BIEN — solo serviceRole en webhook routes
const supabase = await createServiceRoleClient()
```

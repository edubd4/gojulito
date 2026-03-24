# Configuración del Agente Alfred en n8n

Guía para importar y activar el agente Telegram Alfred (`agente_gojulito.json`) en una instancia de n8n.

## Prerequisitos

Antes de comenzar, asegúrate de tener:

- Una instancia de n8n con acceso a la base de datos de Supabase (PostgreSQL)
- Un bot de Telegram creado en [@BotFather](https://t.me/BotFather) con el token disponible
- Acceso al Supabase SQL Editor del proyecto GoJulito
- Las credenciales de conexión a Supabase (host, base de datos, usuario, contraseña)

---

## Paso 1: Prerequisitos de entorno

Verificar que n8n tiene conectividad de red hacia Supabase. El agente usa conexión directa a PostgreSQL (no via API REST de Supabase).

## Paso 2: Aplicar la migración en Supabase

Ejecutar el siguiente SQL en el **Supabase SQL Editor** del proyecto GoJulito:

```sql
CREATE TABLE IF NOT EXISTS telegram_historial (
  id         BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  message    JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telegram_historial_session_id
  ON telegram_historial (session_id);
```

**Verificación:** Confirmar que la tabla fue creada ejecutando:

```sql
SELECT * FROM telegram_historial LIMIT 1;
```

Si no retorna error, la migración fue aplicada correctamente.

> **Nota:** Esta tabla es gestionada directamente por n8n. No agregar columnas adicionales.

## Paso 3: Importar el agente en n8n

1. Abrir n8n y navegar a **Workflows**
2. Hacer clic en **Add Workflow** → **Import from file**
3. Seleccionar el archivo `Gojulitofiles/agente_gojulito.json`
4. El workflow se importa con el nombre "GoJulito Alfred Agent" (o similar)

> El JSON incluye todos los nodos preconfigurados: Telegram Trigger, AI Agent, Postgres Chat Memory, y todas las herramientas HTTP de GoJulito.

## Paso 4: Configurar credencial PostgreSQL

El agente requiere una credencial PostgreSQL con el nombre `gojulitotestev1`.

En n8n → **Credentials** → **Add Credential** → **PostgreSQL**:

| Campo | Valor |
|-------|-------|
| Name | `gojulitotestev1` |
| Host | Valor de `SUPABASE_DB_HOST` (panel Supabase → Settings → Database → Host) |
| Database | `postgres` |
| User | `postgres` |
| Password | Contraseña de la base de datos de Supabase |
| Port | `5432` (o `6543` para connection pooling) |
| SSL | Activado |

> **Importante:** Al importar el JSON, n8n no transfiere credenciales entre instancias. El nodo `Postgres Chat Memory` usa el credential id `CMXFQs4C0p2xTkc4` del JSON original — este id debe ser reasignado a la nueva credencial `gojulitotestev1` creada en este paso. Hacer clic en el nodo y seleccionar la credencial recién creada.

## Paso 5: Configurar credencial Telegram Bot

En n8n → **Credentials** → **Add Credential** → **Telegram**:

| Campo | Valor |
|-------|-------|
| Name | `gojulito_bot` |
| Access Token | Token del bot obtenido de @BotFather |

Asignar esta credencial al nodo **Telegram Trigger** y al nodo de respuesta de Telegram en el workflow.

## Paso 6: Configurar credencial OpenAI

En n8n → **Credentials** → **Add Credential** → **OpenAI**:

| Campo | Valor |
|-------|-------|
| Name | (cualquier nombre descriptivo, ej. `openai-gojulito`) |
| API Key | Clave de API de OpenAI |

Esta credencial se usa para el nodo de LLM (GPT) del AI Agent y para la transcripción de mensajes de audio de Telegram.

## Paso 7: Configurar GOJULITO_API_KEY en los nodos HTTP Request

Cada nodo **HTTP Request** del agente (las herramientas que consultan GoJulito) requiere el header de autenticación `x-api-key`.

**Valor a usar:** El valor de `N8N_API_KEY` en el archivo `.env.local` del proyecto GoJulito.

Para cada nodo HTTP Request en el workflow:
1. Abrir el nodo
2. En **Headers** → agregar header:
   - **Name:** `x-api-key`
   - **Value:** el valor de `N8N_API_KEY`

> **Nota de seguridad:** Este valor no debe compartirse. Es el secreto que autentica al bot contra los endpoints webhook de GoJulito.

## Paso 8: Activar el workflow

1. Verificar que todos los nodos muestran sus credenciales asignadas (sin íconos de error)
2. Hacer clic en **Activate** (toggle superior derecho del workflow)
3. Enviar un mensaje de prueba al bot de Telegram
4. Verificar en n8n → **Executions** que la ejecución fue exitosa

---

## Notas técnicas

### Mapeo de sesión (session_id)

El nodo `Postgres Chat Memory` usa el `chat.id` de Telegram como identificador de sesión:

```
sessionKey: ={{ $('Telegram Trigger').item.json.message.chat.id }}
```

Este valor se almacena como `TEXT` en la columna `session_id` de `telegram_historial`. Cada conversación individual de Telegram tiene su propio historial separado.

### Ventana de contexto

El parámetro `contextWindowLength: 20` limita el historial recuperado a las últimas 20 entradas por sesión. La tabla crece con el uso; no hay limpieza automática configurada.

---

*Última actualización: 2026-03-24*

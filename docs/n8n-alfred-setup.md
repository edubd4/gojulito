# Configuracion del Agente Alfred v2 en n8n

Guia para importar y activar el agente Telegram Alfred (`agente_gojulito.json`) en una instancia de n8n.

## Prerequisitos

Antes de comenzar, asegurate de tener:

- Una instancia de n8n con acceso a la base de datos de Supabase (PostgreSQL)
- Un bot de Telegram creado en [@BotFather](https://t.me/BotFather) con el token disponible
- Acceso al Supabase SQL Editor del proyecto GoJulito
- Las credenciales de conexion a Supabase (host, base de datos, usuario, contrasena)

---

## Paso 1: Prerequisitos de entorno

Verificar que n8n tiene conectividad de red hacia Supabase. El agente usa conexion directa a PostgreSQL (no via API REST de Supabase).

## Paso 2: Aplicar la migracion en Supabase

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

## Paso 3: Importar el agente en n8n

1. Abrir n8n y navegar a **Workflows**
2. Hacer clic en **Add Workflow** > **Import from file**
3. Seleccionar el archivo `docs/n8n-workflow-referencia.json`
4. El workflow se importa con el nombre "agente_gojulito"

## Paso 4: Configurar credencial PostgreSQL

El agente requiere una credencial PostgreSQL para la memoria del chat.

En n8n > **Credentials** > **Add Credential** > **PostgreSQL**:

| Campo | Valor |
|-------|-------|
| Name | `gojulitotestev1` |
| Host | Supabase > Settings > Database > Transaction pooler host |
| Database | `postgres` |
| User | `postgres.{PROJECT_ID}` |
| Password | Contrasena de la base de datos de Supabase |
| Port | `6543` |
| SSL | Segun configuracion del proyecto |

## Paso 5: Configurar credencial Telegram Bot

En n8n > **Credentials** > **Add Credential** > **Telegram**:

| Campo | Valor |
|-------|-------|
| Name | `gojulito_bot` |
| Access Token | Token del bot obtenido de @BotFather |

## Paso 6: Configurar credencial Anthropic (Claude)

En n8n > **Credentials** > **Add Credential** > **Anthropic**:

| Campo | Valor |
|-------|-------|
| Name | `gojulito_test` |
| API Key | Clave de API de Anthropic |

## Paso 7: Configurar x-api-key en los nodos HTTP Request

Cada nodo **HTTP Request** del agente requiere el header `x-api-key`.

**Valor:** El valor de `N8N_API_KEY` en las variables de entorno del proyecto GoJulito.

## Paso 8: Activar el workflow

1. Verificar que todos los nodos muestran sus credenciales asignadas
2. Hacer clic en **Activate**
3. Enviar un mensaje de prueba al bot de Telegram
4. Verificar en n8n > **Executions** que la ejecucion fue exitosa

---

## Herramientas del Agente Alfred v2

### Herramientas de Clientes
| Herramienta | Metodo | Endpoint | Descripcion |
|-------------|--------|----------|-------------|
| `buscar_cliente` | GET | `/api/webhook/clientes` | Busca por nombre, telefono o gj_id. Retorna visas y pagos |
| `crear_cliente` | POST | `/api/webhook/clientes` | Crea cliente nuevo con deduplicacion |
| `editar_cliente` | PATCH | `/api/webhook/clientes` | Edita datos o cambia estado del cliente |

### Herramientas de Visas
| Herramienta | Metodo | Endpoint | Descripcion |
|-------------|--------|----------|-------------|
| `buscar_visa` | GET | `/api/webhook/visas` | Consulta visas por cliente_id o visa_id |
| `crear_visa` | POST | `/api/webhook/visas` | Inicia tramite de visa para un cliente |
| `actualizar_visa` | PATCH | `/api/webhook/visas` | Cambia estado, fecha de turno, notas |

### Herramientas de Pagos
| Herramienta | Metodo | Endpoint | Descripcion |
|-------------|--------|----------|-------------|
| `registrar_pago` | POST | `/api/webhook/pagos` | Registra un cobro nuevo |
| `actualizar_pago` | PATCH | `/api/webhook/pagos` | Salda deuda o actualiza estado de pago |

### Herramientas de Financiamientos
| Herramienta | Metodo | Endpoint | Descripcion |
|-------------|--------|----------|-------------|
| `consultar_financiamiento` | GET | `/api/webhook/financiamientos` | Financiamientos activos de un cliente con cuotas |
| `pagar_cuota` | PATCH | `/api/webhook/financiamientos` | Registra pago de cuota. Auto-completa si todas pagadas |

### Herramientas de Seminarios
| Herramienta | Metodo | Endpoint | Descripcion |
|-------------|--------|----------|-------------|
| `consultar_seminarios` | GET | `/api/webhook/seminarios` | Lista seminarios activos o detalle con asistentes |
| `registrar_asistente` | POST | `/api/webhook/seminarios` | Agrega asistente a un seminario |

### Herramientas de Configuracion
| Herramienta | Metodo | Endpoint | Descripcion |
|-------------|--------|----------|-------------|
| `consultar_precios` | GET | `/api/webhook/configuracion` | Precios actuales de visa y seminario |
| `resumen_operativo` | GET | `/api/webhook/resumen` | Metricas, turnos de la semana, deudas proximas |

---

## System Prompt del Agente (v2)

```
IDENTIDAD
Sos Alfred, el asistente operativo de GoJulito. Trabajas exclusivamente para Julio Correa, que gestiona tramites de visa norteamericana y seminarios de viaje.

Tu funcion es ser la memoria operativa del negocio: consultas datos reales, registras operaciones con confirmacion, y generas resumenes claros. No inventas datos. Si no encontras algo en la base de datos, lo decis.

DIRECTIVAS OPERATIVAS
1. Nunca inventes IDs, nombres ni estados. Siempre consulta la base de datos primero.
2. Antes de crear o modificar cualquier dato, confirma con Julio lo que vas a hacer.
3. Si Julio menciona un cliente por nombre, buscalo primero con buscar_cliente antes de cualquier otra accion.
4. Para cambiar el estado de una visa, primero busca al cliente, obtene el visa_id, y recien entonces actualiza.
5. Siempre responde en espanol, de forma concisa y directa.
6. Nunca menciones credenciales del portal consular ni contrasenas.

FLUJO DE CONFIRMACION
Ante operaciones de escritura (crear, registrar, cambiar estado, pagar cuota):
1. Mostra un resumen de lo que vas a hacer
2. Pedi confirmacion: "Confirmo?"
3. Solo ejecuta despues de recibir "si", "dale", "confirma" o equivalente

ESTADOS VALIDOS
- Cliente: PROSPECTO | ACTIVO | FINALIZADO | INACTIVO
- Visa: EN_PROCESO | TURNO_ASIGNADO | APROBADA | RECHAZADA | PAUSADA | CANCELADA
- Pago: PAGADO | DEUDA | PENDIENTE | FINANCIADO
- Cuota: PAGADO | PENDIENTE | VENCIDO
- Financiamiento: ACTIVO | COMPLETADO | CANCELADO

FORMATO DE RESPUESTA
- Sin markdown, sin asteriscos, sin listas largas
- Respuestas cortas por defecto
- Para resumenes: usar emojis simples como separadores visuales
- Fechas siempre en formato DD/MM/YYYY
- Montos siempre con $ y formato argentino

HERRAMIENTAS DISPONIBLES Y CUANDO USARLAS

resumen_operativo → Resumen del dia, metricas, turnos de la semana, deudas proximas
buscar_cliente → SIEMPRE antes de cualquier operacion sobre un cliente
crear_cliente → Registrar un cliente nuevo
editar_cliente → Cambiar estado, telefono, email u otros datos de un cliente existente
buscar_visa → Consultar tramite de visa de un cliente
crear_visa → Iniciar un nuevo tramite de visa para un cliente
actualizar_visa → Cambiar estado de visa, cargar fecha de turno
registrar_pago → Registrar un cobro nuevo
actualizar_pago → Saldar una deuda existente o cambiar estado de un pago
consultar_financiamiento → Ver financiamientos activos y estado de cuotas de un cliente
pagar_cuota → Registrar el pago de una cuota de financiamiento
consultar_seminarios → Ver seminarios activos, asistentes y recaudacion
registrar_asistente → Agregar una persona como asistente a un seminario
consultar_precios → Ver precios actuales de visa y seminario

SECUENCIA OBLIGATORIA PARA OPERACIONES
1. Si mencionan un nombre → buscar_cliente primero
2. Si necesitas el visa_id → viene del resultado de buscar_cliente (campo visas[0].visa_id)
3. Si necesitas el cliente_id para un pago → viene del resultado de buscar_cliente (campo id)
4. Si necesitas el gj_id → viene del resultado de buscar_cliente (campo gj_id)
5. Para financiamientos → primero buscar_cliente para obtener gj_id, luego consultar_financiamiento
6. Para seminarios → consultar_seminarios primero para obtener sem_id
7. Nunca uses IDs inventados o asumidos

EJEMPLOS DE RESPUESTA
Consulta rapida: "Rolando (GJ-0003) — Visa TURNO_ASIGNADO para el 19/03. Deuda pendiente: $400."
Confirmacion: "Voy a registrar pago de $500 PAGADO para Rolando (GJ-0003). Confirmo?"
Resumen: "Hoy 17/03: 4 clientes activos | 2 turnos esta semana | 1 deuda proxima"
Financiamiento: "Rolando tiene financiamiento FIN-0001 (VUELO): 3/6 cuotas pagadas, faltan $45.000"
Seminario: "SEM-2026-01 Mendoza: 12 asistentes, $180.000 recaudados"
```

---

## Notas tecnicas

### Mapeo de sesion (session_id)

El nodo `Postgres Chat Memory` usa el `chat.id` de Telegram como identificador de sesion:

```
sessionKey: ={{ $('Telegram Trigger').item.json.message.chat.id }}
```

### Ventana de contexto

El parametro `contextWindowLength: 20` limita el historial recuperado a las ultimas 20 entradas por sesion.

---

*Ultima actualizacion: 2026-04-16*

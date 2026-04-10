# TASK-17C — Captura desde Google Sheets via n8n

## Antes de empezar
Leer `AGENTS_v2.md` (o `CLAUDE.md`) para entender el stack y reglas del proyecto.

---

## Contexto

Julio tiene un formulario de Google Forms que guarda respuestas en una Google Sheet. Cuando alguien completa el formulario (interesado en visa o seminario), los datos quedan en la planilla pero Julio tiene que pasarlos a mano a GoJulito.

La idea es automatizar eso: cada vez que llega una nueva fila a la Sheet, n8n la detecta y la envía al sistema como un nuevo cliente PROSPECTO. Todo en automático.

n8n ya está corriendo en el mismo VPS.

---

## Objetivo

Crear el endpoint webhook `/api/webhook/solicitud` que recibe los datos del formulario (enviados por n8n) y crea automáticamente un cliente PROSPECTO en Supabase.

---

## Qué hacer

### 1. Endpoint: `POST /api/webhook/solicitud`

Archivo: `app/api/webhook/solicitud/route.ts`

**Autenticación:**
Igual que los otros webhooks del proyecto — validar `x-api-key` header usando `validateApiKey(request)` de `lib/auth-m2m.ts`.

**Body esperado (lo que n8n va a enviar):**
```typescript
interface SolicitudWebhookBody {
  nombre: string
  apellido?: string
  email?: string
  telefono?: string
  provincia?: string
  tipo_consulta?: 'VISA' | 'SEMINARIO' | 'OTRO'   // mapea a canal_ingreso
  notas?: string         // cualquier info extra del formulario
  origen?: string        // ej: "google-forms" para el historial
}
```

**Lógica:**

1. Validar que al menos `nombre` esté presente (campo mínimo requerido)
2. Verificar si ya existe un cliente con el mismo teléfono o email (para evitar duplicados)
   - Si existe → retornar `{ success: false, code: 'DUPLICATE', cliente_id: existing.id }` con status 200 (no 409, para que n8n no lo marque como error)
3. Generar `gj_id` siguiendo el mismo patrón que `/api/clientes` (GJ-XXXX)
4. Insertar en `clientes`:
   - `estado: 'PROSPECTO'`
   - `canal_ingreso: tipo_consulta === 'SEMINARIO' ? 'SEMINARIO' : tipo_consulta === 'VISA' ? 'WHATSAPP' : 'OTRO'` (o simplificar según lo que tenga el form)
   - `activo: true`
5. Insertar en `historial`:
   ```typescript
   {
     cliente_id: nuevoCliente.id,
     tipo: 'NUEVO_CLIENTE',
     descripcion: `Cliente captado via formulario Google Sheets (${origen ?? 'google-forms'})${notas ? ' — ' + notas : ''}`,
     origen: 'sistema',
     usuario_id: null,
   }
   ```
6. Retornar:
   ```typescript
   { success: true, cliente_id: nuevoCliente.id, gj_id: nuevoCliente.gj_id }
   ```

**Manejo de errores:**
- Body inválido o sin `nombre` → 400
- Error de DB → 500 con `{ success: false, error: message }`
- Siempre retornar JSON

---

### 2. Instrucciones para configurar n8n

Crear el archivo `.planning/INSTRUCCIONES-N8N-SHEETS.md` con los pasos exactos para que Eduardo pueda configurar el workflow en n8n:

```markdown
# Configurar n8n: Google Sheets → GoJulito

## Workflow en n8n

1. **Trigger:** "Google Sheets Trigger"
   - Evento: "Row Added"
   - Sheet ID: [copiar de la URL de la hoja]
   - Sheet Name: [nombre de la hoja con las respuestas]
   - Poll interval: cada 5 minutos

2. **Nodo HTTP Request:** POST a GoJulito
   - Method: POST
   - URL: https://gojulito.automatizacionestuc.online/api/webhook/solicitud
   - Headers: { "x-api-key": "[N8N_API_KEY del .env]", "Content-Type": "application/json" }
   - Body (JSON):
     {
       "nombre": "{{ $json['Nombre'] }}",
       "apellido": "{{ $json['Apellido'] }}",
       "email": "{{ $json['Email'] }}",
       "telefono": "{{ $json['Teléfono'] }}",
       "provincia": "{{ $json['Provincia'] }}",
       "tipo_consulta": "VISA",
       "origen": "google-forms"
     }
   Nota: ajustar los nombres de campo según los encabezados reales de la Sheet.

3. **Nodo Telegram (opcional):** Notificar a Julio
   - Chat ID: [el chat de Julio]
   - Mensaje: "✅ Nuevo prospecto captado: {{ $json.body.nombre }} — {{ $json.body.gj_id }}"

4. Activar el workflow.
```

---

### 3. (Opcional, si el tiempo lo permite) Página de solicitudes pendientes

Crear una vista simple `/solicitudes` (o una sección en el dashboard) que muestre los clientes con `estado = 'PROSPECTO'` y `canal_ingreso = 'OTRO'` u otros canales externos, para que Julio los procese.

Alternativamente, el dashboard ya tiene una métrica de prospectos — con esto es suficiente por ahora.

---

## Reglas técnicas

- Usar `validateApiKey(request)` de `lib/auth-m2m.ts` — nunca exponer el endpoint sin auth
- Usar `createServiceRoleClient()` para todas las operaciones de DB
- No asumir que todos los campos del formulario estarán presentes — todo opcional excepto `nombre`
- La detección de duplicados debe ser case-insensitive para email y normalizar espacios en teléfono
- No borrar datos de la Sheet — solo leer y crear en GoJulito
- Nunca retornar status 4xx o 5xx por "ya existe" — n8n lo trataría como error de workflow

---

## Definition of done

- [ ] `POST /api/webhook/solicitud` funciona con body mínimo (`nombre` solo)
- [ ] Crea cliente PROSPECTO en Supabase con datos del formulario
- [ ] Detecta y rechaza duplicados por email o teléfono (sin 409)
- [ ] Inserta en historial con origen 'sistema'
- [ ] `npm run build` sin errores
- [ ] TypeScript sin errores (`npx tsc --noEmit`)
- [ ] Archivo `INSTRUCCIONES-N8N-SHEETS.md` creado con pasos claros

---

## NO hacer

- No instalar librerías de Google Sheets — n8n hace el trabajo de leer la Sheet
- No crear formulario público — el form de Google ya existe
- No tocar `components/ui/`
- No modificar otros webhooks existentes
- No retornar 409 para duplicados (rompe n8n workflows)

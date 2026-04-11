# Configurar n8n: Google Sheets → GoJulito

## Prerequisitos

- n8n corriendo en el VPS
- Credencial de Google Sheets configurada en n8n
- Variable `N8N_API_KEY` del `.env` de GoJulito

---

## Workflow en n8n

### 1. Trigger: Google Sheets Trigger

- **Evento:** Row Added
- **Sheet ID:** copiar de la URL de la hoja (el ID largo entre `/d/` y `/edit`)
- **Sheet Name:** nombre de la pestaña con las respuestas (ej: "Respuestas de formulario 1")
- **Poll interval:** cada 5 minutos

### 2. Nodo HTTP Request: POST a GoJulito

- **Method:** POST
- **URL:** `https://gojulito.automatizacionestuc.online/api/webhook/solicitud`
- **Headers:**
  - `x-api-key`: `[N8N_API_KEY del .env]`
  - `Content-Type`: `application/json`
- **Body (JSON):**

```json
{
  "nombre": "{{ $json['Nombre'] }}",
  "apellido": "{{ $json['Apellido'] }}",
  "email": "{{ $json['Email'] }}",
  "telefono": "{{ $json['Teléfono'] }}",
  "provincia": "{{ $json['Provincia'] }}",
  "tipo_consulta": "VISA",
  "origen": "google-forms"
}
```

> **Nota:** Ajustar los nombres de campo (`$json['Nombre']`, etc.) según los encabezados reales de la Google Sheet. El nombre exacto de cada columna se puede ver en la salida del trigger de n8n.

### 3. Nodo Telegram (opcional): Notificar a Julio

- **Chat ID:** el chat de Julio (consultarle)
- **Mensaje:**

```
✅ Nuevo prospecto captado: {{ $json.body.nombre }} — {{ $json.body.gj_id }}
```

### 4. Activar el workflow

---

## Respuestas del endpoint

| Caso | Status | Respuesta |
|------|--------|-----------|
| Creado OK | 200 | `{ "success": true, "cliente_id": "...", "gj_id": "GJ-XXXX" }` |
| Duplicado (email/tel) | 200 | `{ "success": false, "code": "DUPLICATE", "cliente_id": "...", "gj_id": "GJ-XXXX" }` |
| Sin nombre | 400 | `{ "success": false, "error": "El campo nombre es requerido" }` |
| Sin API key | 401 | `{ "success": false, "error": "No autorizado" }` |

> Los duplicados retornan 200 (no 409) para que n8n no lo marque como error de workflow.

---

## Campos opcionales

Solo `nombre` es obligatorio. Todos los demás campos son opcionales:
- `apellido` — se concatena con nombre
- `email` — usado para detección de duplicados
- `telefono` — normalizado (se eliminan espacios y guiones), usado para duplicados
- `provincia` — texto libre
- `tipo_consulta` — `VISA` | `SEMINARIO` | `OTRO` (mapea al canal de ingreso)
- `notas` — información extra del formulario
- `origen` — por defecto `google-forms`, se registra en historial

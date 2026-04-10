# TASK-17A — Financiamientos: DB + API

## Antes de empezar
Leer `AGENTS_v2.md` (o `CLAUDE.md`) para entender el stack y reglas del proyecto.

---

## Contexto

GoJulito necesita un nuevo módulo de **Financiamientos**: Julio financia a sus clientes vuelos, visas y viajes, y necesita registrar el monto total, el concepto, y las cuotas o formas de devolución acordadas.

No existe nada de esto en la DB todavía. Este task crea las tablas y los API routes. La UI va en TASK-17B.

---

## Objetivo

Crear la infraestructura de datos (migración SQL) y los API routes para el módulo de Financiamientos, siguiendo exactamente el mismo patrón que `pagos` y `visas`.

---

## Qué hacer

### 1. Migración SQL

Crear el archivo `/database/migrations/006_financiamientos.sql` con:

**Tabla `financiamientos`:**
```sql
CREATE TABLE IF NOT EXISTS financiamientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  financiamiento_id TEXT UNIQUE NOT NULL,         -- ej: FIN-0001
  cliente_id UUID NOT NULL REFERENCES clientes(id),
  concepto TEXT NOT NULL CHECK (concepto IN ('VUELO', 'VISA', 'VIAJE', 'OTRO')),
  descripcion TEXT,
  monto_total INTEGER NOT NULL CHECK (monto_total > 0),
  estado TEXT NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'COMPLETADO', 'CANCELADO')),
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Tabla `cuotas_financiamiento`:**
```sql
CREATE TABLE IF NOT EXISTS cuotas_financiamiento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  financiamiento_id UUID NOT NULL REFERENCES financiamientos(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,                        -- número de cuota (1, 2, 3...)
  monto INTEGER NOT NULL CHECK (monto > 0),
  fecha_vencimiento DATE NOT NULL,
  fecha_pago DATE,
  estado TEXT NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PAGADO', 'VENCIDO')),
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**RLS básico:**
```sql
ALTER TABLE financiamientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuotas_financiamiento ENABLE ROW LEVEL SECURITY;

-- Solo usuarios autenticados pueden leer
CREATE POLICY "auth_read_financiamientos" ON financiamientos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_read_cuotas" ON cuotas_financiamiento
  FOR SELECT USING (auth.role() = 'authenticated');
```

**Importante:** Aplicar la migración en Supabase usando el MCP de Supabase (herramienta `apply_migration`).

---

### 2. Función para generar `financiamiento_id`

En `/app/api/financiamientos/route.ts`, al crear un nuevo financiamiento, generar el ID así (igual que se hace con GJ-XXXX para clientes):

```typescript
// Query el último financiamiento para obtener el siguiente número
const { data: ultimo } = await supabase
  .from('financiamientos')
  .select('financiamiento_id')
  .order('created_at', { ascending: false })
  .limit(1)
  .single()

const siguienteNum = ultimo
  ? parseInt(ultimo.financiamiento_id.replace('FIN-', '')) + 1
  : 1

const financiamiento_id = `FIN-${String(siguienteNum).padStart(4, '0')}`
```

---

### 3. API Routes

#### `GET/POST /api/financiamientos`

Archivo: `/app/api/financiamientos/route.ts`

**GET** — lista todos los financiamientos activos con nombre del cliente y resumen de cuotas:
```
SELECT financiamientos.*, clientes.nombre, clientes.apellido, clientes.gj_id
FROM financiamientos
JOIN clientes ON financiamientos.cliente_id = clientes.id
WHERE financiamientos.activo = true
ORDER BY financiamientos.created_at DESC
```
Incluir también el conteo de cuotas pagadas vs. total.

**POST** — crea un nuevo financiamiento + cuotas en una sola operación:

Body esperado:
```typescript
{
  cliente_id: string
  concepto: 'VUELO' | 'VISA' | 'VIAJE' | 'OTRO'
  descripcion?: string
  monto_total: number
  cuotas: Array<{
    monto: number
    fecha_vencimiento: string  // ISO date YYYY-MM-DD
    notas?: string
  }>
}
```

Validaciones:
- `cliente_id` requerido y que el cliente exista
- `concepto` debe ser uno de los valores válidos
- `monto_total > 0`
- `cuotas` debe tener al menos 1 elemento
- La suma de `cuotas[].monto` no necesita igualar `monto_total` (puede ser parcial)

Después de crear, insertar en `historial`:
```typescript
{
  cliente_id,
  tipo: 'NOTA',
  descripcion: `Financiamiento ${financiamiento_id} creado — ${concepto} — $${monto_total.toLocaleString('es-AR')}`,
  origen: 'dashboard',
  usuario_id: user.id,
}
```

---

#### `GET/PATCH /api/financiamientos/[id]`

Archivo: `/app/api/financiamientos/[id]/route.ts`

**GET** — detalle completo: financiamiento + cuotas + datos del cliente.

**PATCH** — actualiza estado del financiamiento (`ACTIVO` | `COMPLETADO` | `CANCELADO`).
Solo admin puede cancelar.
Insertar en historial al cambiar estado.

---

#### `POST /api/financiamientos/[id]/cuotas`

Archivo: `/app/api/financiamientos/[id]/cuotas/route.ts`

**POST** — agrega una cuota extra al financiamiento (número = MAX(numero) + 1 automático).

---

#### `PATCH /api/financiamientos/[id]/cuotas/[cuota_id]`

Archivo: `/app/api/financiamientos/[id]/cuotas/[cuota_id]/route.ts`

**PATCH** — registra el pago de una cuota:
```typescript
// Si estado = 'PAGADO', actualizar fecha_pago = hoy
{
  estado: 'PAGADO' | 'PENDIENTE' | 'VENCIDO',
  fecha_pago?: string,
  notas?: string,
}
```

Después de marcar como PAGADO, verificar si **todas** las cuotas están PAGADAS → si sí, actualizar el financiamiento a `COMPLETADO` automáticamente + insertar en historial.

---

### 4. Actualizar `lib/supabase/types.ts`

Agregar los tipos de las dos tablas nuevas al final del objeto `Tables`, siguiendo el mismo patrón de las tablas existentes.

---

## Reglas técnicas

- `async/await` siempre, nunca `.then()`
- TypeScript estricto — no `any`
- `createServiceRoleClient()` para todas las operaciones de escritura
- `createServerClient()` solo para autenticar al usuario
- Solo admin puede crear, editar y cancelar financiamientos
- Colaborador puede leer y registrar pagos de cuotas
- Siempre insertar en `historial` después de cambios importantes
- Usar `formatPesos()` de `lib/utils.ts` para mostrar montos
- El schema de RLS debe seguir el patrón de las tablas existentes

---

## Definition of done

- [ ] Migración SQL aplicada en Supabase (verificar con `list_tables`)
- [ ] `GET /api/financiamientos` retorna lista correcta
- [ ] `POST /api/financiamientos` crea financiamiento + cuotas + historial
- [ ] `PATCH /api/financiamientos/[id]/cuotas/[cuota_id]` registra pago y auto-completa si corresponde
- [ ] `npm run build` sin errores
- [ ] TypeScript sin errores (`npx tsc --noEmit`)

---

## NO hacer

- No crear UI todavía — eso va en TASK-17B
- No modificar tablas existentes (clientes, pagos, visas)
- No tocar `components/ui/`
- No usar `.then()`
- No usar `any`
- No hacer eliminaciones físicas (usar `activo: false` para cancelar)

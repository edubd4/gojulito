# TASK-17B — Financiamientos: UI

## Antes de empezar
Leer `AGENTS_v2.md` (o `CLAUDE.md`) para entender el stack y reglas del proyecto.
Este task depende de TASK-17A (DB + API ya deben estar listos).

---

## Contexto

El backend de financiamientos ya está listo (TASK-17A). Este task construye la interfaz de usuario completa: sidebar, lista, detalle, y una sección en el perfil de cliente.

---

## Objetivo

Crear todas las páginas y componentes del módulo Financiamientos. El usuario (Julio) debe poder:
1. Ver todos los financiamientos activos con un resumen de estado
2. Crear un nuevo financiamiento para un cliente, cargando concepto, monto total y cuotas
3. Ver el detalle de un financiamiento con sus cuotas
4. Registrar el pago de una cuota individualmente

---

## Qué hacer

### 1. Sidebar — agregar ítem Financiamientos

Archivo: `components/layout/Sidebar.tsx` (o donde esté definido el sidebar).

Agregar después del ítem "Pagos":
- Label: "Financiamientos"
- Ícono: Material Symbol `account_balance` (consistente con el resto)
- Ruta: `/financiamientos`

---

### 2. Página lista `/financiamientos`

Archivo: `app/(dashboard)/financiamientos/page.tsx` (Server Component)

**Layout:**
- Header: "Financiamientos" + contador + botón "+ Nuevo" (solo admin)
- Stats row: tarjetas con total activos, monto total en cartera, monto cobrado, monto pendiente
- Tabla de financiamientos

**Tabla — columnas:**
| # | Cliente | Concepto | Monto Total | Cuotas | Cobrado | Pendiente | Estado | Acciones |
|---|---------|----------|-------------|--------|---------|-----------|--------|----------|

- **Concepto** → badge: VUELO (azul), VISA (amber), VIAJE (verde), OTRO (gris)
- **Estado** → badge: ACTIVO (amber), COMPLETADO (verde), CANCELADO (rojo/gris)
- **Cuotas** → "3/5" (3 pagadas de 5)
- **Acciones** → ícono ojo (ver detalle)
- Click en fila → navega a `/financiamientos/[id]`

**Query server-side:**
```typescript
const { data } = await supabase
  .from('financiamientos')
  .select(`
    id, financiamiento_id, concepto, descripcion, monto_total, estado, created_at,
    clientes ( id, gj_id, nombre, apellido ),
    cuotas_financiamiento ( id, estado, monto )
  `)
  .eq('activo', true)
  .order('created_at', { ascending: false })
```

---

### 3. Modal "Nuevo Financiamiento"

Componente: `components/financiamientos/NuevoFinanciamientoModal.tsx` (Client Component)

**Pasos del formulario (wizard de 2 pasos):**

**Paso 1 — Datos generales:**
- Búsqueda de cliente (dropdown con búsqueda — igual que en NuevoClienteModal si ya existe algo similar)
- Concepto: select (VUELO / VISA / VIAJE / OTRO)
- Descripción: textarea (opcional)
- Monto total: input numérico (en ARS)

**Paso 2 — Cuotas:**
- Lista editable de cuotas: cada cuota tiene monto + fecha_vencimiento + notas (opcional)
- Botón "+ Agregar cuota"
- Botón "✕" para eliminar cuota
- Resumen al pie: suma de cuotas vs. monto total (con indicador si difiere)
- El usuario puede acordar cuotas que no sumen exactamente el total (es flexible)

**Submit:** POST `/api/financiamientos`

---

### 4. Página detalle `/financiamientos/[id]`

Archivo: `app/(dashboard)/financiamientos/[id]/page.tsx` (Server Component)
Componente tabla: `components/financiamientos/CuotasTable.tsx` (Client Component)

**Layout:**

Header:
- `FIN-0001` (código) + nombre del cliente (link a `/clientes/[id]`)
- Badge de estado del financiamiento
- Concepto + descripción
- Monto total

Tabla de cuotas:

| # | Vence | Monto | Estado | Fecha Pago | Notas | Acción |
|---|-------|-------|--------|------------|-------|--------|
| 1 | 15/04/2026 | $50.000 | PENDIENTE | — | — | [Registrar pago] |
| 2 | 15/05/2026 | $50.000 | PAGADO | 10/04/2026 | — | — |

- Estado PENDIENTE → badge amber + botón "Registrar pago"
- Estado PAGADO → badge verde, sin botón
- Estado VENCIDO → badge rojo + botón "Registrar pago" igual

**Registrar pago:** al hacer click en "Registrar pago" de una cuota, se abre un mini-modal de confirmación con:
- Monto de la cuota (pre-llenado, no editable)
- Fecha de pago (date picker, default hoy)
- Notas opcionales
- Botón confirmar → PATCH `/api/financiamientos/[id]/cuotas/[cuota_id]`

---

### 5. Sección en `/clientes/[id]`

En la página de detalle del cliente, agregar una sección "Financiamientos" (colapsable o directamente visible).

Mostrar:
- Lista compacta de financiamientos del cliente (concepto, monto total, estado, cuotas X/Y)
- Link "Ver detalle" → `/financiamientos/[id]`

Si el cliente no tiene financiamientos, mostrar estado vacío limpio.

---

## Diseño — reglas

- Usar colores `gj-*` siempre (no hexadecimales hardcodeados)
- Fuente: `font-display` para títulos, `font-sans` para body
- Badges: mismo patrón que el resto del sistema (`inline-block px-2 py-0.5 rounded text-xs font-semibold`)
- Cards y tablas: `bg-gj-surface-low border border-white/[7%] rounded-xl`
- Inputs y selects: `bg-gj-input text-gj-text border border-white/10 rounded-lg`
- Todos los `<select>` nativos: `style={{ colorScheme: 'dark' }}`
- No usar componentes de `components/ui/` — hacer inline o con clases Tailwind

**Colores de badge por concepto:**
- VUELO → `text-gj-blue bg-gj-blue/15`
- VISA → `text-gj-amber bg-gj-amber/15`
- VIAJE → `text-gj-green bg-gj-green/15`
- OTRO → `text-gj-secondary bg-gj-secondary/15`

**Colores de badge por estado financiamiento:**
- ACTIVO → `text-gj-amber bg-gj-amber/15`
- COMPLETADO → `text-gj-green bg-gj-green/15`
- CANCELADO → `text-gj-secondary bg-gj-secondary/15`

---

## Reglas técnicas

- `async/await` siempre, nunca `.then()`
- TypeScript estricto — no `any`
- Server Components para data fetching, Client Components para interacción
- Client Components llaman a API routes, nunca a Supabase directamente
- `router.refresh()` después de mutaciones exitosas
- Toast de confirmación o error (igual que ClientesTable)

---

## Definition of done

- [ ] Ítem "Financiamientos" visible en sidebar y navega correctamente
- [ ] Lista `/financiamientos` muestra datos reales con stats y tabla
- [ ] Modal "Nuevo Financiamiento" crea correctamente con cuotas
- [ ] Detalle `/financiamientos/[id]` muestra cuotas y permite registrar pago
- [ ] Auto-completar financiamiento funciona cuando todas las cuotas están PAGADAS
- [ ] Sección en `/clientes/[id]` muestra financiamientos del cliente
- [ ] `npm run build` sin errores
- [ ] TypeScript sin errores (`npx tsc --noEmit`)

---

## NO hacer

- No modificar tablas o API routes (eso es TASK-17A)
- No tocar `components/ui/`
- No usar colores hardcodeados — siempre `gj-*`
- No crear archivos CSS separados
- No instalar librerías nuevas

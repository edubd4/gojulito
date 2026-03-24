# Phase 7: Calendario y Configuración - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

El admin puede ver turnos de visa y fechas de seminarios en una vista de calendario mensual, y gestionar precios desde la app. La página /configuracion es exclusiva para admin.

**Importante — estado del codebase:** La mayoría de Phase 7 ya existe. El planner DEBE auditar el código existente antes de crear tareas nuevas.

Lo que ya está construido y NO necesita rehacerse:
- `app/(dashboard)/calendario/page.tsx` — página completa: fetch de visas por mes + `v_turnos_semana` + pagos ✅
- `components/calendario/CalendarioView.tsx` — grid mensual, navegación, chips de turnos, chips de pagos, popup TurnoPopup, panel "Esta semana", responsive ✅ CAL-01 satisfecho
- `app/(dashboard)/configuracion/page.tsx` — Mi perfil, Usuarios del sistema (admin only), Precios del servicio (admin only via PreciosForm) ✅ CFG-01 satisfecho
- `components/configuracion/PreciosForm.tsx` — edita precio_visa y precio_seminario via PATCH /api/configuracion ✅
- `app/api/configuracion/route.ts` — PATCH verifica rol admin, actualiza precios ✅
- `app/api/turnos/route.ts` — retorna `{ turnos, pagos }` para navegación de mes ✅

Lo que FALTA (gaps reales):
- CAL-02: Seminarios NO incluidos en el calendario (ni en `CalendarioPage`, ni en `CalendarioView`, ni en `/api/turnos`)
- CFG-02: Colaboradores pueden entrar a /configuracion (no hay redirect) — el SC4 requiere redirección
- CFG-02 (sidebar): El link "Configuración" aparece en el sidebar para todos los roles — debe ocultarse para colaboradores

</domain>

<decisions>
## Implementation Decisions

### CAL-02 — Seminarios en el calendario

- **D-01:** Los seminarios se muestran como **chips en el grid mensual**, igual que los turnos de visa. Click en el chip abre un popup.
  - El chip muestra el nombre del seminario (ej. "SEM-2026-03" o el nombre corto).
  - Mismo patrón visual que los turno chips: `borderRadius: 4`, `fontSize: 11`, `fontWeight: 600`, `padding: '2px 5px'`.

- **D-02:** Color de los chips de seminario: **púrpura personalizado**.
  - Valor sugerido: `#a78bfa` (texto) con `rgba(167,139,250,0.18)` de fondo.
  - No usar ninguno de los colores existentes (amber, azul, verde, rojo) para evitar confusión con estados de visa.

- **D-03:** El popup al hacer click en un seminario muestra:
  - Nombre del seminario (ej. "SEM-2026-03")
  - Fecha formateada con `formatFecha()`
  - Modalidad (PRESENCIAL / VIRTUAL)
  - Botón "Ver seminario" que navega a `/seminarios/[id]`
  - Mismo patrón de layout que `TurnoPopup` (overlay + card centrado, botón de cierre)

- **D-04:** Rango de seminarios = **solo el mes visible** — mismo comportamiento que turnos y pagos.
  - Query filtra por `fecha >= inicio` y `fecha <= fin` del mes en visualización.
  - Cuando el usuario navega de mes, `/api/turnos` debe incluir seminarios del nuevo mes en su response.

- **D-05:** Campo de fecha a usar: `fecha` (DATE, ya existe en la tabla `seminarios`).
  - Query: `supabase.from('seminarios').select('id, sem_id, fecha, modalidad').eq('activo', true).gte('fecha', inicio).lte('fecha', fin).order('fecha', { ascending: true })`

- **D-06:** El tipo `SeminarioCalItem` se agrega en `CalendarioView.tsx` (junto a `TurnoItem` y `PagoCalItem`):
  ```ts
  export interface SeminarioCalItem {
    id: string
    sem_id: string
    fecha: string
    modalidad: 'PRESENCIAL' | 'VIRTUAL'
  }
  ```

- **D-07:** `/api/turnos` response se extiende a `{ turnos, pagos, seminarios }`.
  - `CalendarioView` llama a este endpoint al navegar — necesita recibir seminarios en el response.
  - `CalendarioPage` también pasa `initialSeminarios` al componente.

### CFG-02 — Control de acceso a /configuracion

- **D-08:** Agregar redirect al inicio de `ConfiguracionPage`:
  ```ts
  if (perfil.rol !== 'admin') redirect('/')
  ```
  - Ubicación: inmediatamente después de verificar que `perfil` existe (antes de hacer queries de admin).
  - Los colaboradores son redirigidos al dashboard (`/`) — pierden acceso a "Mi perfil" y "Cambiar contraseña" en esta página.

- **D-09:** Ocultar el link "Configuración" en el sidebar para colaboradores.
  - `Sidebar.tsx` ya recibe prop `rol: string`.
  - Filtrar el item `{ href: '/configuracion' }` de `navItems` cuando `rol !== 'admin'`.
  - No crear un prop nuevo — usar el `rol` existente.

### Claude's Discretion

- Nombre/label del chip de seminario en el grid — puede ser `sem_id` (SEM-2026-03) o un nombre corto si el seminario tiene descripción.
- Posición del popup de seminario relativa al click (centrado en pantalla, mismo que TurnoPopup está bien).
- Si mostrar icono de seminario (tipo 🎓 o SVG) en el popup header para diferenciarlo visualmente del popup de turno.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Código existente a auditar antes de planear

- `app/(dashboard)/calendario/page.tsx` — page a extender con query de seminarios
- `components/calendario/CalendarioView.tsx` — componente a extender con SeminarioCalItem, chips, popup
- `app/api/turnos/route.ts` — API a extender con seminarios en el response
- `app/(dashboard)/configuracion/page.tsx` — agregar redirect para no-admin
- `components/dashboard/Sidebar.tsx` — filtrar link /configuracion para colaboradores (prop `rol` ya existe)

### Patrones de referencia

- `TurnoPopup` en `CalendarioView.tsx` — patrón de popup a replicar para seminarios
- `CHIP` y `BADGE` constants en `CalendarioView.tsx` — patrón de chips de color por estado
- `turnosByDate` Map pattern en `CalendarioView.tsx` — replicar con `seminariosByDate`
- `lib/supabase/types.ts` — verificar shape de `seminarios` Row

### No external specs — requirements fully captured in decisions above

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- `TurnoPopup` component en `CalendarioView.tsx` — popup con overlay + card centrado, botón de cierre, link de navegación. Replicar para `SeminarioPopup`.
- `turnosByDate` Map pattern — `Map<string, TurnoItem[]>` keyed by `YYYY-MM-DD`. Mismo patrón para `seminariosByDate`.
- `buildCells()`, `dateKey()`, `MESES`, `DIAS` — helpers ya en CalendarioView, reutilizar sin modificar.
- `navigateTo()` en CalendarioView — llama a `/api/turnos?mes=X&anio=Y`. La respuesta debe incluir `seminarios[]`.
- `Sidebar.tsx:35` — recibe `rol: string` como prop. Filtrar `navItems` condicionalmente.

### Established Patterns

- Chips en el grid: `button` con `backgroundColor: chip.bg`, `color: chip.text`, `padding: '2px 5px'`, `borderRadius: 4`, `fontSize: 11`, `fontWeight: 600`, `whiteSpace: 'nowrap'`
- Navigation desde popup: `Link href="/..." onClick={onClose}` con estilo amber/azul
- Query de seminarios activos: `.eq('activo', true)` — campo `activo` fue agregado en Phase 4
- Redirect en server components: `redirect('/')` from `next/navigation`

### Integration Points

- `CalendarioPage` → `CalendarioView`: agregar prop `initialSeminarios: SeminarioCalItem[]`
- `/api/turnos` response: `{ turnos, pagos, seminarios }` — CalendarioView ya llama a este endpoint al navegar
- `Sidebar.tsx` navItems: filtrar `/configuracion` si `rol !== 'admin'`
- `ConfiguracionPage`: agregar `if (perfil.rol !== 'admin') redirect('/')` antes de las queries admin

</code_context>

<specifics>
## Specific Ideas

- El chip de seminario en el grid puede truncar el `sem_id` si el espacio es pequeño — mismo patrón `textOverflow: 'ellipsis'` que los turnos.
- El popup de seminario puede tener un header diferente (ej. icono de graduación o solo el label "Seminario" en pequeño) para que el usuario lo distinga del popup de turno.
- Color púrpura: `#a78bfa` texto / `rgba(167,139,250,0.18)` fondo — libre para el implementador ajustar si el contraste no es suficiente sobre el fondo `#111f38`.

</specifics>

<deferred>
## Deferred Ideas

- "Esta semana" sidebar panel con seminarios — mostrar seminarios de la semana actual junto a los turnos. No discutido, queda para un eventual v1.3.
- Conteo de asistentes en el popup de seminario — decidido NO incluir en esta fase para mantener el popup simple.

</deferred>

---

*Phase: 07-calendario-y-configuracion*
*Context gathered: 2026-03-24*

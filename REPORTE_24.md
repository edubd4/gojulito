# REPORTE_24 — Análisis funcional y diagnóstico de bugs

Fecha: 2026-03-17
Analizado sin modificar código.

---

## 1. Bugs confirmados

### BUG-1 — `PagosTable`: estado local no se sincroniza si los props cambian

**Archivo:** [components/pagos/PagosTable.tsx](components/pagos/PagosTable.tsx#L89)
**Línea:** 89
**Causa:** `const [rows, setRows] = useState<PagoRow[]>(pagos)` — React inicializa el estado con el prop solo la primera vez que se monta el componente. Si la página padre se re-renderiza (por navegación o refresh externo), `rows` no se actualiza con los nuevos `pagos`.
**Síntoma:** En `/pagos`, si el usuario realiza una acción fuera de la tabla que modifica pagos y vuelve a la misma página sin desmontar el componente, la tabla muestra datos desactualizados.
**Contraste:** `AsistentesTable` usa el patrón `localUpdates` + `useMemo` para evitar exactamente este problema (porque ahí sí hay un `router.refresh()` desde `EditarAsistenteModal`). En `PagosTable` no hay `router.refresh()`, pero el riesgo existe si el componente se cachea entre navegaciones.
**Fix propuesto:** Agregar `useEffect(() => { setRows(pagos) }, [pagos])` o usar el mismo patrón `localUpdates`.

---

### BUG-2 — `RegistrarPagoModal`: permite registrar pago tipo VISA sin visa activa

**Archivos:**
- [components/clientes/RegistrarPagoModal.tsx](components/clientes/RegistrarPagoModal.tsx#L111)
- [app/api/pagos/route.ts](app/api/pagos/route.ts#L32)

**Líneas:** Modal:111, API:32
**Causa:** El modal acepta `tipo = 'VISA'` sin validar si `visaId` está presente. En el cliente detalle ([app/(dashboard)/clientes/[id]/page.tsx](app/(dashboard)/clientes/%5Bid%5D/page.tsx#L359)) se llama `<RegistrarPagoModal clienteId={cliente.id} visaId={visa?.id} />` — si el cliente no tiene visa activa, `visaId` llega como `undefined`. El modal no valida esto: permite seleccionar tipo 'VISA' y enviar el form. La API tampoco valida: la línea 32 solo comprueba `cliente_id`, `tipo`, `monto`, `fecha_pago`, `estado` — no verifica que `visa_id` esté presente cuando `tipo === 'VISA'`.
**Síntoma:** Se pueden crear pagos tipo VISA sin `visa_id`, generando registros huérfanos imposibles de vincular a ningún trámite.
**Fix propuesto:**
- En el modal: si `!visaId` y `form.tipo === 'VISA'`, agregar error de validación: `"Este cliente no tiene visa activa para asociar el pago"`.
- En la API: si `body.tipo === 'VISA' && !body.visa_id`, retornar 422.

---

### BUG-3 — `calendario/page.tsx`: columnas incorrectas en query a `v_turnos_semana`

**Archivos:**
- [app/(dashboard)/calendario/page.tsx](app/(dashboard)/calendario/page.tsx#L29)
- [app/(dashboard)/page.tsx](app/(dashboard)/page.tsx#L14-L20)

**Líneas:** calendario/page.tsx:29-32
**Causa:** La vista `v_turnos_semana` expone las columnas `nombre_cliente` y `estado_visa` (confirmado por la interfaz `TurnoSemana` del dashboard, líneas 14-20). Sin embargo, `calendario/page.tsx` la consulta seleccionando `nombre` y `estado`:

```ts
// app/(dashboard)/calendario/page.tsx — línea 30
.select('visa_id, cliente_id, nombre, gj_id, telefono, fecha_turno, estado')
```

Supabase retorna `null` para columnas que no existen en la vista. Los datos llegan al componente `CalendarioView` (prop `turnosSemana`) con `nombre = null` y `estado = null`.

**Síntoma:** El panel "Esta semana" en el calendario muestra `—` en lugar del nombre del cliente, y la badge de estado no se renderiza correctamente (fallback a `BADGE.EN_PROCESO`).
**Fix propuesto:** Cambiar la query en `calendario/page.tsx`:

```ts
.select('visa_id, cliente_id, nombre_cliente, gj_id, telefono, fecha_turno, estado_visa')
```

Y mapear correctamente los campos en el array `turnosSemana`:

```ts
nombre: (v.nombre_cliente ?? '—') as string,
estado: (v.estado_visa ?? 'EN_PROCESO') as TurnoItem['estado'],
```

---

### BUG-4 — `CalendarioView`: crash potencial en chips si `nombre` es null

**Archivo:** [components/calendario/CalendarioView.tsx](components/calendario/CalendarioView.tsx#L299)
**Líneas:** 299-301
**Causa:** (consecuencia directa de BUG-3) El panel "Esta semana" recibe `turnosSemana` con `nombre = null`. Si algún turno del mes principal (`turnos`, cargado desde `/api/turnos` que consulta `visas JOIN clientes`) tuviera `nombre = null`, la línea 299 lanzaría `TypeError: Cannot read properties of null (reading 'split')`.

```ts
const firstName = t.nombre.split(' ')[0]  // crash si nombre es null
```

Los chips del calendario principal (`turnos`) no tienen este bug porque `/api/turnos` hace un join real a `clientes` y ya tiene el nombre. Pero `turnosSemana` afecta el panel de "Esta semana" (no los chips del grid) donde el nombre se muestra directamente como `{t.nombre}` — no invoca `.split()`. El crash solo ocurriría si `turnosSemana` alimentara los chips del grid, lo cual actualmente no pasa.

**Riesgo real:** Bajo en el estado actual, pero si el diseño de `CalendarioView` cambia y `turnosSemana` se usa en el grid, crashea.
**Fix propuesto:** Resolver BUG-3 (que es la causa raíz). Como salvaguarda, cambiar la línea 299 a:

```ts
const firstName = (t.nombre ?? '—').split(' ')[0]
```

---

### BUG-5 — `formatFecha` con fechas bare string (off-by-one en UTC-3)

**Archivos:**
- [app/(dashboard)/clientes/[id]/page.tsx](app/(dashboard)/clientes/%5Bid%5D/page.tsx#L398)
- [components/calendario/CalendarioView.tsx](components/calendario/CalendarioView.tsx#L455)

**Líneas:** clientes/[id]/page.tsx:398,466,471,474
**Causa:** `formatFecha(dateStr)` internamente hace `new Date(dateStr)`. Un string tipo `"2026-03-17"` (sin hora) se parsea como UTC midnight. Al convertir a la zona horaria de Argentina (UTC-3), queda como el día anterior: "16/03/2026".

`CalendarioView` ya aplica el workaround para el panel "Esta semana" (línea 455): `formatFecha(t.fecha_turno + 'T12:00:00')`. Pero en `clientes/[id]/page.tsx` se usan `formatFecha(visa.fecha_turno)`, `formatFecha(visa.fecha_aprobacion)`, `formatFecha(visa.fecha_vencimiento)`, y `formatFecha(cliente.fecha_nac)` sin el workaround.

**Síntoma:** Las fechas de turno, aprobación, vencimiento y fecha de nacimiento aparecen un día antes de lo correcto para usuarios en Argentina.
**Fix propuesto:** Centralizar el fix en `lib/utils.ts`:

```ts
export function formatFecha(dateStr: string): string {
  const safe = dateStr.length === 10 ? dateStr + 'T12:00:00' : dateStr
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(safe))
}
```

---

## 2. Inconsistencias de UX

### UX-1 — `RegistrarPagoModal`: campo Tipo no pre-seleccionado ni bloqueado

Cuando se abre desde la ficha de un cliente que **sí tiene visa activa**, el campo "Tipo" empieza vacío (placeholder "Seleccionar..."). Sería natural que auto-seleccionara 'VISA' si `visaId` está presente, o que bloqueara 'VISA' y mostrara un aviso si no hay visa.

### UX-2 — `AsistentesTable`: no se puede revertir a PENDIENTE desde el dropdown

`OPCIONES_PAGO = ['PAGADO', 'DEUDA']` — PENDIENTE jamás aparece como opción. Un asistente que estaba PENDIENTE puede pasar a PAGADO o DEUDA, pero si es un error, no puede volver a PENDIENTE sin ir a "Editar asistente". El modal `EditarAsistenteModal` sí permite PENDIENTE.

### UX-3 — `PagosTable`: toda la fila es link al cliente, el dropdown queda pequeño

Todas las celdas de la tabla (Pago ID, Cliente, Tipo, Monto, Fecha) son `<Link href={/clientes/...}>`. La celda "Estado" contiene el dropdown. El área de clic del dropdown es muy pequeña comparada con el área total de la fila, lo cual puede causar que el usuario quiera hacer clic en el dropdown y en cambio navegue al cliente.

### UX-4 — Calendario "Esta semana": no actualiza al navegar de mes

La prop `turnosSemana` viene del server component y no se actualiza cuando el usuario navega a otro mes. Los turnos de la semana actual siempre son los mismos independientemente del mes visualizado. Esto es correcto en diseño (muestra la semana real), pero puede ser confuso si el usuario navega a un mes futuro y el sidebar sigue mostrando la semana presente sin ninguna indicación.

### UX-5 — Cliente detalle: pagos son read-only en la ficha

La sección "Pagos" en la ficha del cliente ([app/(dashboard)/clientes/[id]/page.tsx](app/(dashboard)/clientes/%5Bid%5D/page.tsx#L490)) muestra una tabla estática: no hay dropdown para cambiar estado, ni botón de edición. Para cambiar el estado de un pago de un cliente específico hay que ir a `/pagos` (global). Inconsistente con el dropdown que sí existe en `PagosTable`.

### UX-6 — `IniciarVisaModal` no aparece si ya hay una visa CANCELADA

La consulta en `clientes/[id]/page.tsx` busca la visa más reciente que no sea CANCELADA (`.neq('estado', 'CANCELADA')`). Si el cliente tiene todas sus visas en CANCELADA, `visa` es null y aparece el botón "Iniciar visa". Esto es correcto. Pero si tiene una visa APROBADA o FINALIZADA (FINALIZADO es un estado de cliente, no de visa), sigue apareciendo el botón `EditarVisaModal` sin opción de iniciar una nueva. No hay ruta para iniciar una segunda visa para el mismo cliente.

---

## 3. Campos / acciones faltantes

### FALTANTE-1 — Sin validación de `orden_atencion` en formulario de visa

`VisaDetalle` tiene el campo `orden_atencion` y se muestra en la ficha del cliente. `EditarVisaModal` probablemente lo incluye (no leído), pero `IniciarVisaModal` (no leído) puede omitirlo. No es bloqueante pero hay riesgo de dejarlo vacío.

### FALTANTE-2 — Sin link desde chip de calendario a la visa

Los chips del calendario navegan a `/clientes/${t.cliente_id}` (línea 305). Sería más directo ir a la ficha de la visa, pero la ruta de visa detalle no existe como página separada (las visas se ven dentro de la ficha del cliente). No es un bug, pero limita la usabilidad del calendario.

### FALTANTE-3 — Sin confirmación al cambiar estado desde dropdown

Ni `PagosTable`, ni `TramitesTable`, ni `AsistentesTable` piden confirmación al cambiar estado vía dropdown. Para estados críticos (APROBADA, RECHAZADA) un cambio accidental no tiene undo salvo volver a abrir el dropdown. Bajo riesgo dado que el cambio es reversible, pero recomendable para RECHAZADA/CANCELADA.

### FALTANTE-4 — `historial` no se inserta al cambiar estado en `PagosTable`

El endpoint `PATCH /api/pagos/[id]` actualiza el estado del pago pero **no inserta en `historial`**. El endpoint `POST /api/pagos` sí lo hace. Los cambios de estado de pagos desde la tabla no quedan auditados. Contraste con `TramitesTable` que probablemente sí usa el endpoint de visas que inserta en historial.

### FALTANTE-5 — `AsistentesTable` no sincroniza `monto` al cambiar `estado_pago`

El endpoint `PATCH /api/seminarios/[id]/asistentes/[asistente_id]` con `estado_pago → PAGADO` sincroniza el pago vinculado en la tabla `pagos`. Pero `localUpdates` en `AsistentesTable` solo guarda `estado_pago` (línea 128). Si el seminario tiene precio y el monto del pago cambia, la celda "Monto" en la tabla no refleja el cambio hasta que se haga un refresh completo.

---

## 4. Propuesta de tasks

| # | Título | Prioridad | Descripción |
|---|--------|-----------|-------------|
| **T25** | Fix BUG-3: columnas de `v_turnos_semana` en calendario | Alta | Corregir `select()` y mapeo en `calendario/page.tsx` para usar `nombre_cliente` y `estado_visa` |
| **T26** | Fix BUG-5: `formatFecha` off-by-one timezone | Alta | Centralizar workaround `T12:00:00` en `lib/utils.ts` |
| **T27** | Fix BUG-2: validar tipo VISA sin visa activa | Media | Validación cliente + API para rechazar pago VISA sin `visa_id` |
| **T28** | Fix FALTANTE-4: historial al cambiar estado de pago | Media | Insertar evento en `historial` en `PATCH /api/pagos/[id]` |
| **T29** | UX: dropdown estado en pagos de ficha de cliente | Media | Reemplazar tabla estática de pagos en `clientes/[id]` con componente interactivo similar a `PagosTable` |
| **T30** | Fix BUG-1: sincronizar `rows` en `PagosTable` | Baja | Agregar `useEffect` para sincronizar estado local con prop `pagos` |
| **T31** | UX: auto-seleccionar tipo VISA en `RegistrarPagoModal` | Baja | Pre-seleccionar tipo VISA si `visaId` está presente, bloquear si no |
| **T32** | FALTANTE: permitir segunda visa por cliente | Baja | Habilitar "Iniciar nueva visa" desde ficha aunque ya haya una activa, con confirmación |

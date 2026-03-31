# Phase 8 Context: Fixes Julito Feedback

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Correcciones operativas solicitadas por Julito Correa después de usar la app en producción. Son fixes de comportamiento y UX — no cambios arquitecturales. La fase tiene 4 planes agrupados por área de impacto.

**Importante — qué NO entra en esta fase:**
- Integración Google Forms → requiere más información del cliente (URL + campos del form). Diferido a v1.3.
- Cambio de tema a interfaz clara → la queja apunta a inconsistencia visual, no a light theme. La Phase 9 (Design System Hardening) resuelve esto limpiando los inline styles.

</domain>

<decisions>

## Fixes incluidos en esta fase

---

### FIX-01 — Estado ACTIVO por defecto al crear cliente

**Problema:** Al crear un cliente (desde dashboard o desde el bot Telegram), se requiere enviar el campo `estado` explícitamente. El bot pregunta al usuario si quiere registrarlo como ACTIVO o PROSPECTO, lo cual es ruido operativo innecesario.

**Decisión:** Hardcodear `estado: 'ACTIVO'` como default en los dos endpoints de creación de cliente:
- `app/api/clientes/route.ts` — POST handler: ignorar `estado` del body e insertar siempre `ACTIVO`
- `app/api/webhook/clientes/route.ts` — POST handler: ignorar `estado` del body e insertar siempre `ACTIVO`

**Schema:** El schema de validación `createClienteSchema` en `lib/schemas/clientes.ts` debe hacer `estado` opcional (o eliminarlo del input schema) para no rechazar requests del bot que no lo envíen.

**Historial:** La entrada de historial con `tipo: 'NUEVO_CLIENTE'` ya incluye el estado — no cambia nada ahí.

**Impacto en el bot n8n:** El prompt del AI Agent (Alfred) debe actualizarse para no preguntar el estado — siempre registrar como ACTIVO. Documentar en AGENTS_v2.md.

---

### FIX-02 — Validación real de visa_id en pagos de tipo VISA

**Problema:** El schema valida que `visa_id` esté presente cuando `tipo === 'VISA'`, pero no verifica que esa visa exista en la DB ni que pertenezca al `cliente_id` enviado. El bot intenta registrar pagos de visa sin crear el trámite primero → falla silenciosamente o con error poco descriptivo.

**Decisión:**
1. En `app/api/pagos/route.ts` POST handler, después de la validación del schema, agregar un query de verificación:
   ```typescript
   const { data: visa } = await supabase.from('visas').select('id, cliente_id').eq('id', body.visa_id).single()
   if (!visa) return NextResponse.json({ error: 'La visa indicada no existe' }, { status: 404 })
   if (visa.cliente_id !== body.cliente_id) return NextResponse.json({ error: 'La visa no pertenece a este cliente' }, { status: 422 })
   ```
2. El mismo check aplica en `app/api/webhook/pagos/route.ts` para el bot.
3. El error debe ser descriptivo para que el bot pueda comunicarlo al usuario: `"No se puede registrar el pago: el cliente no tiene un trámite de visa registrado. Primero creá el trámite."`

**Nota:** Usar `createServiceRoleClient()` para este check — mismo patrón del resto del route.

---

### FIX-03 — Cards del dashboard clickeables

**Problema:** Las 4 metric cards de `app/(dashboard)/page.tsx` son `<div>` simples sin interacción. El usuario no puede hacer click para navegar.

**Decisión:** Envolver cada card en un `<Link>` de Next.js con la ruta correspondiente:

| Card | Destino |
|------|---------|
| Clientes activos | `/clientes` |
| Visas en proceso | `/tramites` |
| Turnos esta semana | `/calendario` |
| Deudas próximas | `/pagos` |

No agregar query params de filtrado (requeriría cambios en las páginas destino) — solo navegar a la sección. Agregar cursor pointer y hover state sutil (opacity o border highlight) para indicar que son clickeables.

---

### FIX-04 — Simplificar estados visibles de clientes en la UI

**Problema:** Los estados `PROSPECTO` e `INACTIVO` generan confusión operativa. Julito quiere que el flujo sea: se registra → ACTIVO → cuando termina → FINALIZADO.

**Decisión:**
- Los ENUMs en la DB y en `lib/constants.ts` se mantienen igual (no romper schema ni historial)
- En los **formularios de creación y edición de clientes** (NuevoClienteModal, EditarClienteModal), el dropdown de estado solo muestra `ACTIVO` y `FINALIZADO`
- El campo de estado en creación desaparece (siempre ACTIVO — ver FIX-01)
- En los **filtros de la lista de clientes** (`ClientesTable` o similar), los filtros de estado también solo muestran `ACTIVO` y `FINALIZADO` (ocultar PROSPECTO e INACTIVO del dropdown de filtro, no de los datos)
- Los registros existentes con estado PROSPECTO o INACTIVO siguen mostrándose correctamente — solo se ocultan del selector, no de los datos

**Importante:** No eliminar PROSPECTO ni INACTIVO del schema ni de constants.ts — pueden existir como estados internos o para el bot.

---

### FIX-05 — Registro de cliente en un solo paso desde sección VISA

**Problema:** Para registrar un trámite de visa, el usuario debe:
1. Ir a /clientes → crear cliente
2. Volver a /tramites → crear visa

Julito quiere poder registrar al cliente y su visa en un solo paso desde la sección tramites.

**Decisión:** Modificar el modal "Iniciar trámite" (`IniciarVisaModal` en `components/visas/`) para que tenga dos modos:
1. **Modo existente:** seleccionar cliente existente (comportamiento actual)
2. **Modo nuevo cliente:** un toggle o tab "Nuevo cliente" que muestra campos de nombre, teléfono y canal inline, crea el cliente vía POST /api/clientes, y luego con el `cliente_id` resultante inicia la visa

**Implementación:**
- Agregar estado `modoNuevoCliente: boolean` en IniciarVisaModal
- Si `modoNuevoCliente`, mostrar campos: nombre (required), telefono (required), canal (required)
- Al submit: primero POST /api/clientes (con estado ACTIVO, gracias a FIX-01), luego POST /api/visas con el id resultante
- Si el POST de cliente falla (ej: duplicado por teléfono), mostrar el error sin crear la visa
- El mismo principio aplica para la sección Seminarios — al agregar un asistente, poder crear el cliente vinculado inline — diferido si IniciarVisaModal es suficiente para esta fase

---

### FIX-06 — Registrar Pago y Deuda en el mismo formulario

**Problema:** Para registrar que un cliente pagó $100.000 y debe $60.000, el usuario debe:
1. Abrir NuevoPagoModal → registrar PAGADO $100.000
2. Abrir NuevoPagoModal otra vez → registrar DEUDA $60.000

Julito quiere hacerlo en un solo paso.

**Decisión:** Agregar un checkbox "También registrar deuda pendiente" en `NuevoPagoModal` que aparece solo cuando el estado seleccionado es `PAGADO`. Al activarlo, muestra campos adicionales:
- `monto_deuda` (número, required)
- `fecha_vencimiento_deuda` (date, optional)
- `notas_deuda` (text, optional)

Al submit con la deuda activada, el handler hace dos requests secuenciales:
1. POST /api/pagos con estado PAGADO (el pago principal)
2. POST /api/pagos con estado DEUDA y los campos adicionales

Si el primero falla → no ejecutar el segundo. Si el primero pasa pero el segundo falla → mostrar error parcial: "El pago se registró pero no se pudo registrar la deuda — registrala manualmente."

**Nota:** No crear un endpoint de bulk-pago — mantener dos POST separados desde el cliente para respetar la arquitectura actual.

</decisions>

<canonical_refs>

## Archivos a leer antes de planear/implementar

### FIX-01 y FIX-02 (Plan 08-01 — API fixes)
- `app/api/clientes/route.ts` — POST handler de creación
- `app/api/webhook/clientes/route.ts` — POST handler del bot
- `app/api/pagos/route.ts` — POST handler de pagos
- `app/api/webhook/pagos/route.ts` — POST handler webhook
- `lib/schemas/clientes.ts` — schema de validación a modificar
- `lib/schemas/pagos.ts` — schema de validación (referencia)

### FIX-03 y FIX-04 (Plan 08-02 — Dashboard UX)
- `app/(dashboard)/page.tsx` — cards del dashboard
- `components/clientes/NuevoClienteModal.tsx` — dropdown de estado a eliminar/simplificar
- `components/clientes/EditarClienteModal.tsx` — dropdown de estado a simplificar
- `components/clientes/ClientesTable.tsx` (o similar) — filtros de estado

### FIX-05 (Plan 08-03 — Registro en un paso)
- `components/visas/IniciarVisaModal.tsx` — modal a extender con modo nuevo cliente
- `app/api/clientes/route.ts` — POST que se llamará desde el modal
- `app/api/visas/route.ts` — POST existente (referencia)

### FIX-06 (Plan 08-04 — Pago + Deuda simultáneos)
- `components/pagos/NuevoPagoModal.tsx` — modal a extender con checkbox de deuda
- `app/api/pagos/route.ts` — POST existente (referencia)

</canonical_refs>

<deferred>

## Diferido — fuera de esta fase

- **Google Forms integration:** Julito necesita compartir la URL del formulario actual y los campos para mapear. Requiere un nuevo endpoint `POST /api/webhook/google-forms`. Diferido a v1.3.
- **Interfaz más clara (light theme):** La queja apunta a inconsistencia visual (inline styles). La Phase 9 Design System Hardening resuelve esto. Si después de la Phase 9 Julito sigue pidiendo un tema claro, se evalúa para v1.3.
- **Registro en un paso desde Seminarios:** El mismo flujo de FIX-05 puede aplicarse al agregar un asistente en seminarios (crear cliente inline). Se evalúa después de implementar FIX-05 en VISA.

</deferred>

---

*Phase: 08-fixes-julito*
*Context gathered: 2026-03-28*

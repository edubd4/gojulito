# Phase 13: Formularios — Dropdowns + Fecha Turno — Context

**Gathered:** 2026-04-06
**Status:** Ready for planning
**Source:** Research manual + REQUIREMENTS.md

<domain>
## Phase Boundary

Esta phase corrige 2 bugs independientes de formularios:

1. **FIX-01 — Dropdowns oscuros**: Todos los `<select>` nativos del sistema muestran fondo blanco en Chrome/Edge (el sistema operativo aplica el tema claro al dropdown nativo). Solución: agregar `style={{ colorScheme: 'dark' }}` a cada `<select>`. Hay ~46 selects en ~20 archivos que lo necesitan.

2. **FIX-02 — Fecha turno en wizard**: El wizard NuevoTramiteWizard tiene un paso 4 (StepVisaDS160) donde se elige el estado inicial de la visa: `EN_PROCESO` o `TURNO_ASIGNADO`. Cuando el usuario selecciona `TURNO_ASIGNADO`, NO aparece ningún campo para ingresar la fecha del turno. Solución: mostrar condicionalmente un input de tipo date para `fecha_turno` cuando `estado_visa_inicial === 'TURNO_ASIGNADO'`, y enviar ese dato a la API.

</domain>

<decisions>
## Implementation Decisions

### FIX-01 — colorScheme: 'dark' en todos los selects

**Alcance exacto** — archivos con `<select>` que NO tienen `colorScheme` aún:
- `components/clientes/ClientesTable.tsx` (9 selects — líneas 437, 447, 461, 472, 634, 646, 759, 781, 803)
- `components/clientes/EditarClienteModal.tsx` (3 selects sin colorScheme — líneas 344, 385, 413, 431; línea 376 YA lo tiene)
- `components/clientes/NuevoClienteModal.tsx` (2 selects sin colorScheme — líneas 268, 311, 334; línea 300 YA lo tiene)
- `components/configuracion/EditarUsuarioModal.tsx` (1 select — línea 104)
- `components/pagos/NuevoPagoModal.tsx` (4 selects — líneas 198, 299, 318, 355)
- `components/pagos/PagosTable.tsx` (2 selects — líneas 277, 287)
- `components/seminarios/AgregarAsistenteModal.tsx` (4 selects — líneas 212, 274, 290, 333)
- `components/seminarios/EditarAsistenteModal.tsx` (4 selects — líneas 169, 195, 224, 238)
- `components/seminarios/EditarSeminarioModal.tsx` (1 select — línea 168)
- `components/seminarios/LogisticaSection.tsx` (2 selects — líneas 313, 349)
- `components/seminarios/NuevoSeminarioModal.tsx` (1 select — línea 154)
- `components/tramites/steps/StepDatosPersonales.tsx` (1 select — línea 43)
- `components/tramites/steps/StepPasaporte.tsx` (1 select — línea 42)
- `components/tramites/TramitesTable.tsx` (2 selects — líneas 281, 292)
- `components/visas/EditarVisaModal.tsx` (1 select — línea 199)
- `components/visas/IniciarVisaModal.tsx` (1 select — línea 200)
- `components/visas/NuevoTramiteModal.tsx` (3 selects — líneas 350, 384, 411)

**Ya tienen colorScheme** (no tocar):
- `components/clientes/RegistrarPagoModal.tsx` ✓
- `components/grupos/AccionLoteGrupoModal.tsx` ✓
- `components/pagos/CambiarEstadoPagoDialog.tsx` ✓
- `components/pagos/DetallePagoModal.tsx` ✓
- `components/pagos/FechaVencimientoDialog.tsx` ✓

**Técnica**: añadir `style={{ colorScheme: 'dark' }}` a cada `<select>` faltante. Si el select YA tiene `style={{...}}`, mergear la propiedad. Si no tiene `style`, agregar el atributo.

### FIX-02 — Campo fecha_turno condicional en StepVisaDS160

**Cambios en `NuevoTramiteWizard.tsx`**:
- Agregar `fecha_turno: string` a la interfaz `WizardData`
- Agregar `fecha_turno: ''` al objeto `INITIAL_DATA`
- En `handleStep4Submit()`: si `data.estado_visa_inicial === 'TURNO_ASIGNADO' && data.fecha_turno`, incluir `body.fecha_turno = data.fecha_turno`

**Cambios en `StepVisaDS160.tsx`**:
- Después del bloque de selección de estado (debajo de los radio buttons), agregar condicionalmente un input tipo `date` para fecha_turno:
  ```tsx
  {data.estado_visa_inicial === 'TURNO_ASIGNADO' && (
    <Field label="Fecha del Turno">
      <Input
        type="date"
        value={data.fecha_turno}
        onChange={(e) => onChange({ fecha_turno: e.target.value })}
        style={{ colorScheme: 'dark' }}
      />
    </Field>
  )}
  ```
- El campo debe estar dentro del `md:col-span-2` section, justo debajo de los radio buttons de estado
- No es required (el turno puede registrarse sin fecha si no la saben aún)
- Usar el componente `Input` ya definido en StepVisaDS160, que aplica el estilo `bg-gj-surface rounded-lg...`

**API — `app/api/visas/route.ts`**: Verificar que `fecha_turno` ya es aceptado en el body. Si no, agregarlo al insert.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these antes de planear o implementar.**

### Wizard — archivo principal
- `components/tramites/NuevoTramiteWizard.tsx` — define `WizardData`, `INITIAL_DATA`, y `handleStep4Submit()`. Tiene 347 líneas.

### Wizard — paso 4
- `components/tramites/steps/StepVisaDS160.tsx` — Step 4 del wizard. Tiene el selector de estado EN_PROCESO/TURNO_ASIGNADO. Aquí hay que agregar el campo fecha_turno condicional.

### API de visas
- `app/api/visas/route.ts` — endpoint POST que recibe el body del wizard. Verificar si acepta `fecha_turno`.

### Archivos con selects sin colorScheme (FIX-01)
- `components/clientes/ClientesTable.tsx`
- `components/clientes/EditarClienteModal.tsx`
- `components/clientes/NuevoClienteModal.tsx`
- `components/configuracion/EditarUsuarioModal.tsx`
- `components/pagos/NuevoPagoModal.tsx`
- `components/pagos/PagosTable.tsx`
- `components/seminarios/AgregarAsistenteModal.tsx`
- `components/seminarios/EditarAsistenteModal.tsx`
- `components/seminarios/EditarSeminarioModal.tsx`
- `components/seminarios/LogisticaSection.tsx`
- `components/seminarios/NuevoSeminarioModal.tsx`
- `components/tramites/steps/StepDatosPersonales.tsx`
- `components/tramites/steps/StepPasaporte.tsx`
- `components/tramites/TramitesTable.tsx`
- `components/visas/EditarVisaModal.tsx`
- `components/visas/IniciarVisaModal.tsx`
- `components/visas/NuevoTramiteModal.tsx`

### Design System
- `CLAUDE.md` — tokens gj-*, colores

</canonical_refs>

<specifics>
## Specific Ideas

- FIX-01: Si ya existe un `style={{}}` en el select, hacer merge. Si no hay, agregar `style={{ colorScheme: 'dark' }}` como nuevo prop.
- FIX-02: El campo fecha_turno no necesita ser requerido — el turno puede registrarse sin fecha.
- FIX-02: El input date debe tener `style={{ colorScheme: 'dark' }}` ya que es un input especial con picker nativo.
- FIX-02: La animación/transición del campo al aparecer/desaparecer puede ser simple (sin animación extra).

</specifics>

<deferred>
## Deferred Ideas

- Validación de fecha_turno futura (no en el pasado) — out of scope
- Componente Select reutilizable que ya incluya colorScheme — out of scope (v1.5)

</deferred>

---
*Phase: 13-formularios-dropdowns-fecha-turno*
*Context gathered: 2026-04-06*

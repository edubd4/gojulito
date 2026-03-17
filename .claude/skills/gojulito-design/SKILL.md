# GoJulito Design System

Sistema de diseño del proyecto GoJulito. Aplicar siempre estas clases y patrones.
**Regla fundamental: nunca hardcodear colores hex. Siempre usar clases `gj-*` de Tailwind.**

> Nota: el código existente usa inline styles con hex por compatibilidad con Radix UI. En componentes nuevos que no usen Radix, usar siempre clases Tailwind.

---

## Colores

Definidos en `tailwind.config.ts` bajo la clave `gj`.

| Token | Clase Tailwind (texto) | Clase Tailwind (fondo) | Clase Tailwind (borde) | Hex |
|---|---|---|---|---|
| Fondo principal | `text-gj-bg` | `bg-gj-bg` | `border-gj-bg` | `#0b1628` |
| Card / surface | `text-gj-card` | `bg-gj-card` | `border-gj-card` | `#111f38` |
| Input / surface elevada | `text-gj-input` | `bg-gj-input` | `border-gj-input` | `#172645` |
| Amber / acento | `text-gj-amber` | `bg-gj-amber` | `border-gj-amber` | `#e8a020` |
| Verde / éxito | `text-gj-green` | `bg-gj-green` | `border-gj-green` | `#22c97a` |
| Rojo / error | `text-gj-red` | `bg-gj-red` | `border-gj-red` | `#e85a5a` |
| Azul / info | `text-gj-blue` | `bg-gj-blue` | `border-gj-blue` | `#4a9eff` |
| Texto principal | `text-gj-text` | `bg-gj-text` | `border-gj-text` | `#e8e6e0` |
| Texto secundario | `text-gj-secondary` | `bg-gj-secondary` | `border-gj-secondary` | `#9ba8bb` |

### Opacidades útiles (Tailwind arbitrarias o slash syntax)

```
bg-gj-green/15   → fondo verde con 15% opacidad (badge verde)
bg-gj-amber/15   → fondo amber con 15% opacidad (badge amber)
bg-gj-red/15     → fondo rojo con 15% opacidad (badge rojo)
bg-gj-blue/15    → fondo azul con 15% opacidad (badge azul)
border-white/10  → borde blanco con 10% opacidad (separadores)
border-white/6   → borde blanco con 6% opacidad (cards)
```

---

## Tipografías

Definidas en `tailwind.config.ts` bajo `fontFamily`.

| Clase | Fuente | Uso |
|---|---|---|
| `font-display` | Fraunces (serif) | Títulos de página, títulos de modal, headings `h1` |
| `font-body` | DM Sans (sans-serif) | Todo el resto: labels, párrafos, botones, tablas, inputs |

```tsx
// Título de página
<h1 className="font-display text-3xl font-bold text-gj-text">Clientes</h1>

// Subtítulo de sección
<h2 className="font-body text-xs font-semibold text-gj-secondary uppercase tracking-widest">
  Datos del cliente
</h2>

// Texto de cuerpo
<p className="font-body text-sm text-gj-text">Contenido</p>

// Texto secundario / helper
<span className="font-body text-xs text-gj-secondary">GJ-0001</span>
```

---

## Badges de estado

### Estados de cliente (`estado_cliente`)

| Estado | Clase de color | Clase de fondo |
|---|---|---|
| `ACTIVO` | `text-gj-green` | `bg-gj-green/15` |
| `PROSPECTO` | `text-gj-amber` | `bg-gj-amber/15` |
| `FINALIZADO` | `text-gj-secondary` | `bg-gj-secondary/15` |
| `INACTIVO` | `text-gj-secondary` | `bg-gj-secondary/15` |

### Estados de visa (`estado_visa`)

| Estado | Clase de color | Clase de fondo |
|---|---|---|
| `EN_PROCESO` | `text-gj-amber` | `bg-gj-amber/15` |
| `TURNO_ASIGNADO` | `text-gj-blue` | `bg-gj-blue/15` |
| `APROBADA` | `text-gj-green` | `bg-gj-green/15` |
| `RECHAZADA` | `text-gj-red` | `bg-gj-red/15` |
| `PAUSADA` | `text-gj-red` | `bg-gj-red/15` |
| `CANCELADA` | `text-gj-secondary` | `bg-gj-secondary/15` |

### Estados de pago (`estado_pago`)

| Estado | Clase de color | Clase de fondo |
|---|---|---|
| `PAGADO` | `text-gj-green` | `bg-gj-green/15` |
| `DEUDA` | `text-gj-red` | `bg-gj-red/15` |
| `PENDIENTE` | `text-gj-secondary` | `bg-gj-secondary/15` |

### Componente Badge

```tsx
function Badge({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold font-body ${color} ${bg}`}>
      {label}
    </span>
  )
}

// Ejemplo de uso con lookup:
const BADGE_CLIENTE = {
  ACTIVO:     { color: 'text-gj-green',     bg: 'bg-gj-green/15'     },
  PROSPECTO:  { color: 'text-gj-amber',     bg: 'bg-gj-amber/15'     },
  FINALIZADO: { color: 'text-gj-secondary', bg: 'bg-gj-secondary/15' },
  INACTIVO:   { color: 'text-gj-secondary', bg: 'bg-gj-secondary/15' },
}
```

---

## Cards

```tsx
// Card estándar
<div className="bg-gj-card rounded-xl p-6 border border-white/[0.06]">
  {/* Título de sección */}
  <h2 className="font-body text-xs font-semibold text-gj-secondary uppercase tracking-[0.06em] mb-5">
    Título
  </h2>
  {/* Contenido */}
</div>

// Card con header separado por línea
<div className="bg-gj-card rounded-xl border border-white/[0.06] overflow-hidden">
  <div className="px-7 py-5 border-b border-white/[0.08]">
    <h2 className="font-display text-xl font-bold text-gj-text">Título</h2>
  </div>
  <div className="px-7 py-6">
    {/* Contenido */}
  </div>
</div>
```

---

## Inputs y formularios

```tsx
// Input de texto
<input
  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-body outline-none focus:border-gj-blue/50 transition-colors"
/>

// Input con error
<input
  className="w-full bg-gj-input text-gj-text border border-gj-red rounded-lg px-3 py-2 text-sm font-body outline-none"
/>

// Select
<select
  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-body outline-none cursor-pointer"
>
  <option value="">Seleccionar...</option>
</select>

// Textarea
<textarea
  className="w-full bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm font-body outline-none resize-vertical min-h-[72px] leading-relaxed"
/>

// Label
<label className="block text-xs text-gj-secondary font-body mb-1">
  Campo *
</label>

// Mensaje de error inline
<span className="text-[11px] text-gj-red font-body mt-1 block">
  El campo es requerido
</span>

// Bloque de error de servidor
<div className="bg-gj-red/10 border border-gj-red/30 rounded-lg px-3.5 py-2.5 text-gj-red text-sm font-body mb-4">
  {error}
</div>
```

---

## Botones

```tsx
// Primario amber (crear, confirmar cambio de estado)
<button className="font-body text-sm font-semibold bg-gj-amber text-gj-bg px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
  Guardar
</button>

// Primario verde (registrar pago, acción positiva)
<button className="font-body text-sm font-semibold bg-gj-green text-gj-bg px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
  Registrar pago
</button>

// Primario azul (guardar edición de visa, acción neutral)
<button className="font-body text-sm font-semibold bg-gj-blue text-gj-bg px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
  Guardar cambios
</button>

// Secundario con borde azul (editar cliente, editar visa)
<button className="font-body text-sm font-medium text-gj-blue border border-gj-blue bg-transparent px-4 py-2 rounded-lg hover:bg-gj-blue/10 transition-colors">
  Editar cliente
</button>

// Secundario neutro (cancelar, acción destructiva suave)
<button className="font-body text-sm text-gj-secondary border border-white/15 bg-transparent px-5 py-2 rounded-lg hover:bg-white/5 transition-colors">
  Cancelar
</button>

// Secundario con borde gris (agregar nota)
<button className="font-body text-sm font-medium text-gj-secondary border border-gj-secondary/35 bg-transparent px-4 py-2 rounded-lg hover:bg-gj-secondary/10 transition-colors">
  Agregar nota
</button>
```

---

## Tablas

```tsx
<div className="bg-gj-card rounded-xl border border-white/[0.06] overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full border-collapse font-body">
      <thead>
        <tr>
          {['Col A', 'Col B', 'Col C'].map((col) => (
            <th
              key={col}
              className="text-left px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-[0.05em] border-b border-white/[0.08] whitespace-nowrap bg-gj-card"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer"
          >
            <td className="px-4 py-3 text-sm text-gj-text whitespace-nowrap">{row.nombre}</td>
            <td className="px-4 py-3 text-xs text-gj-secondary whitespace-nowrap">{row.gj_id}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              <Badge {...badge} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

// Estado vacío dentro de tabla/card
<div className="px-7 py-12 text-center text-sm text-gj-secondary font-body">
  Sin registros para los filtros seleccionados
</div>
```

---

## Modales (Radix Dialog)

**Regla crítica:** `DialogContent` solo recibe estilos de apariencia — nunca `position`, `display`, `maxHeight` ni `transform` via inline styles. Rompen el centrado de Radix. El scroll va en un `div` interno.

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent
    className="max-w-xl p-0 overflow-hidden"
    style={{
      // Solo apariencia — nunca position/display/maxHeight aquí
      backgroundColor: '#111f38',          // bg-gj-card (inline por Radix)
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 14,
      fontFamily: 'DM Sans, sans-serif',
    }}
  >
    {/* Overlay de éxito — position:absolute funciona porque DialogContent es position:fixed */}
    {saved && (
      <div className="absolute inset-0 z-20 rounded-[14px] bg-gj-bg/97 flex flex-col items-center justify-center gap-3">
        {/* ícono check + mensaje */}
      </div>
    )}

    {/* Header */}
    <DialogHeader
      style={{ padding: '24px 28px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <DialogTitle
        style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0', fontSize: 20, fontWeight: 700 }}
      >
        Título del modal
      </DialogTitle>
    </DialogHeader>

    {/* Cuerpo con scroll interno */}
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ padding: '20px 28px', maxHeight: '65vh', overflowY: 'auto' }}>
        {/* campos del formulario */}
      </div>

      {/* Footer fijo al pie */}
      <div
        style={{
          padding: '16px 28px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
        }}
      >
        <button type="button" onClick={() => setOpen(false)}>Cancelar</button>
        <button type="submit">{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  </DialogContent>
</Dialog>
```

### Overlay de éxito (patrón estándar)

```tsx
{saved && (
  <div
    style={{
      position: 'absolute', inset: 0, zIndex: 20, borderRadius: 14,
      backgroundColor: 'rgba(11,22,40,0.97)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
    }}
  >
    <div
      style={{
        width: 52, height: 52, borderRadius: '50%',
        backgroundColor: 'rgba(34,201,122,0.15)',
        border: '2px solid #22c97a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="#22c97a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <p style={{ color: '#22c97a', fontSize: 16, fontWeight: 600, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
      ¡Cambios guardados!
    </p>
  </div>
)}
```

---

## Página base (layout de sección)

```tsx
export default async function MiPagina() {
  return (
    <div className="bg-gj-bg min-h-full px-8 py-7 font-body">

      {/* Header de página */}
      <div className="mb-6">
        <h1 className="font-display text-[28px] font-bold text-gj-text m-0">
          Título de sección
        </h1>
        <p className="text-sm text-gj-secondary mt-1">
          Descripción o contador de resultados
        </p>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <input className="bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm outline-none min-w-[220px]" />
        <select className="bg-gj-input text-gj-text border border-white/10 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer" />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col gap-5">
        {/* Cards o tabla aquí */}
      </div>
    </div>
  )
}
```

---

## Grid de campos (dentro de cards y modales)

```tsx
// 2 columnas responsive
<div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
  <div>...</div>
  <div>...</div>
  {/* Campo full-width */}
  <div className="col-span-2">...</div>
</div>

// Grid de datos (detalle de cliente)
<div className="grid gap-x-7 gap-y-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
  <GridField label="Teléfono" value={cliente.telefono} />
</div>

// GridField helper
function GridField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div className="text-[11px] text-gj-secondary mb-1">{label}</div>
      <div className={`text-sm ${value ? 'text-gj-text' : 'text-gj-secondary'}`}>
        {value ?? '—'}
      </div>
    </div>
  )
}
```

---

## Separadores

```tsx
// Separador horizontal dentro de card
<div className="border-t border-white/[0.06] my-5" />

// Separador más visible (entre header y contenido)
<div className="border-t border-white/[0.08]" />
```

---

## Íconos

Usar SVGs inline con `currentColor`. No importar librerías de íconos externas.

```tsx
// Pencil/edit
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
</svg>

// Plus/add
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="12" cy="12" r="10" />
  <line x1="12" y1="8" x2="12" y2="16" />
  <line x1="8" y1="12" x2="16" y2="12" />
</svg>

// Check (para success overlay)
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
  <polyline points="20 6 9 17 4 12" />
</svg>

// Arrow left (back)
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <line x1="19" y1="12" x2="5" y2="12" />
  <polyline points="12 19 5 12 12 5" />
</svg>
```

---

## Anti-patrones — nunca hacer

```tsx
// MAL — hex hardcodeado
<div style={{ backgroundColor: '#111f38' }}>

// BIEN — clase gj-*
<div className="bg-gj-card">

// MAL — color arbitrario en Tailwind
<div className="bg-[#111f38]">

// BIEN
<div className="bg-gj-card">

// MAL — font-sans (no existe en este proyecto, apunta a fuente del sistema)
<p className="font-sans">

// BIEN — font-body = DM Sans
<p className="font-body">

// MAL — posición/display en inline style de DialogContent (rompe Radix)
<DialogContent style={{ display: 'flex', maxHeight: '90vh', position: 'relative' }}>

// BIEN — solo apariencia en DialogContent, scroll en div interno
<DialogContent className="max-w-xl p-0 overflow-hidden" style={{ backgroundColor: '...', borderRadius: 14 }}>
  <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
```

---

## Notas de implementación

- **Radix UI:** `DialogContent` usa `position: fixed` internamente. Los overlays con `position: absolute` funcionan sin necesitar `position: relative` en el padre.
- **shadcn CLI:** incompatible con Node 18. Todos los componentes de `components/ui/` se crearon manualmente — no ejecutar `npx shadcn`.
- **colorScheme: 'dark':** agregar `style={{ colorScheme: 'dark' }}` a inputs `type="date"` para que el calendario del sistema respete el tema oscuro.
- **`font-body` vs `font-sans`:** Tailwind tiene un `font-sans` built-in que apunta a fuentes del sistema. `font-body` es la clave custom que apunta a DM Sans.

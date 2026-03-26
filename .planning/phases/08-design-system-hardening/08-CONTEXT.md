# Phase 8 Context: Design System Hardening

## Phase Goal
Eliminar toda deuda de estilos inline del proyecto. Migrar 958 ocurrencias de `style={}` con hex hardcodeados a clases Tailwind `gj-*`, registrar el color púrpura de seminarios como token oficial, y agregar focus rings visibles en todos los inputs.

## Trigger
UI audit de proyecto completo (PROJECT-UI-REVIEW.md) detectó: score 16/24, con Color (2/4), Typography (2/4) y Spacing (2/4) afectados por el doble sistema de estilos inline + Tailwind coexistiendo en 95% de los componentes.

---

## Decisions

### 1. Alcance de la migración
**[auto] Migración completa — todos los componentes**

Migrar la totalidad del codebase frontend en una sola fase, no priorizar por visibilidad. Componentes en scope:
- `components/clientes/` (5 archivos)
- `components/pagos/` (5 archivos)
- `components/seminarios/` (7 archivos)
- `components/tramites/` (2 archivos)
- `components/visas/` (2 archivos)
- `components/configuracion/` (9 archivos)
- `components/grupos/` (1 archivo)
- `components/calendario/CalendarioView.tsx`
- `app/(dashboard)/` pages que tengan style inline
- Excluir `components/ui/` — creados manualmente, estables

**Rationale:** Una migración parcial mantendría el doble sistema y no cerraría la deuda técnica. Login + Sidebar ya son 100% Tailwind — ese es el patrón objetivo.

### 2. Estrategia de migración
**[auto] Reemplazar `style={}` por clases Tailwind `gj-*` — sin CSS variables intermedias**

El approach es: `style={{ color: '#e8a020' }}` → `text-gj-amber`, `style={{ backgroundColor: '#111f38' }}` → `bg-gj-card`, etc.

No usar `var(--color-gj-amber)` como paso intermedio — ir directo a clases Tailwind, que es el patrón ya establecido en Sidebar.tsx y login.

**Mapeo de tokens a usar:**
| Hex | Token Tailwind |
|-----|---------------|
| `#0b1628` | `bg-gj-bg` |
| `#111f38` | `bg-gj-card` |
| `#172645` | `bg-gj-input` |
| `#e8a020` | `text-gj-amber` / `bg-gj-amber` / `border-gj-amber` |
| `#22c97a` | `text-gj-green` / `bg-gj-green` |
| `#e85a5a` | `text-gj-red` / `bg-gj-red` |
| `#4a9eff` | `text-gj-blue` / `bg-gj-blue` |
| `#e8e6e0` | `text-gj-text` |
| `#9ba8bb` | `text-gj-secondary` |
| `#a78bfa` | `text-gj-seminario` / `bg-gj-seminario` (nuevo token) |

### 3. Nuevo token: color púrpura de seminarios
**[auto] Registrar como `gj-seminario` en `tailwind.config.ts`**

El color `#a78bfa` (Violet-400) fue introducido en Phase 07 para los chips de seminario en el calendario. Se registra como `gj-seminario` — nombre semántico que comunica su rol en el negocio, consistente con el patrón `gj-amber`, `gj-green`, `gj-red`, `gj-blue`.

**Cambio en tailwind.config.ts:**
```ts
'gj-seminario': '#a78bfa',  // chips de seminario en calendario
```

### 4. Focus rings en inputs
**[auto] Agregar `focus:ring-2 focus:ring-gj-amber focus:outline-none` a todos los inputs/textareas**

Actualmente todos los inputs y textareas dentro de modals y formularios tienen `outline: 'none'` sin reemplazo, lo que hace invisible la navegación con teclado.

La solución es reemplazar `outline: 'none'` + sin focus → `focus:ring-2 focus:ring-gj-amber focus:outline-none` en las clases Tailwind del input.

**Solo aplica a inputs que hoy tienen el estilo inline `outline: 'none'` explícito.** Los inputs con `inputStyle` compartido (variable) se migran en un solo lugar.

### 5. Manejo de estilos que no tienen equivalente Tailwind directo
**[auto] Usar clases Tailwind estándar para propiedades sin token `gj-*`**

Para propiedades como `fontSize`, `padding`, `borderRadius`, `gap`, `fontWeight` — usar las clases Tailwind estándar (`text-sm`, `p-2`, `rounded-lg`, `gap-3`, `font-semibold`).

Para `boxShadow` complejos o valores muy específicos sin equivalente: mantener como `style={}` solo esos casos — no forzar todos los estilos si algunos no tienen mapeo natural.

### 6. Prioridad de planes (orden de ejecución)
**[auto] Un plan por grupo de componentes afín, ejecutados en orden:**

1. **08-01**: `tailwind.config.ts` — agregar `gj-seminario` + auditar tokens existentes
2. **08-02**: `components/pagos/` — área con mayor deuda (NuevoPagoModal, PagosTable, etc.)
3. **08-03**: `components/clientes/` — alto tráfico operativo
4. **08-04**: `components/seminarios/` + `components/tramites/` + `components/visas/`
5. **08-05**: `components/configuracion/` + `components/grupos/` + `components/calendario/`

---

## Canonical Refs

- `tailwind.config.ts` — definición de tokens `gj-*`
- `app/globals.css` — variables CSS globales (referencia)
- `components/dashboard/Sidebar.tsx` — modelo de componente 100% Tailwind (patrón objetivo)
- `app/(auth)/login/page.tsx` — modelo de página 100% Tailwind (patrón objetivo)
- `.planning/PROJECT-UI-REVIEW.md` — diagnóstico completo con findings

## Constraints Inherited

- No tocar `components/ui/` — creados manualmente, fuera de scope
- TypeScript strict — no `any`
- No cambiar lógica de negocio, solo presentación/estilos
- `npm run build` debe compilar limpio tras cada plan

## Deferred Ideas

- Documentar el design system en un `DESIGN-SYSTEM.md` para onboarding — fuera de scope
- Migrar a CSS Modules para aislamiento de estilos — fuera de scope (over-engineering)
- Agregar Storybook — fuera de scope

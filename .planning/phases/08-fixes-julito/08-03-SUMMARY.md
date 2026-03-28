---
phase: 08-fixes-julito
plan: 03
status: completed
completed_at: "2026-03-28"
files_modified: 2
files_created: 1
---

# Plan 08-03 Summary: Registro en un paso desde sección VISA

## What was done

### FIX-05 — NuevoTramiteModal (nuevo archivo)

**components/visas/NuevoTramiteModal.tsx** — creado desde cero con:

- **Dos modos** con toggle visual:
  - `nuevo`: campos nombre*, teléfono*, canal* para crear cliente nuevo + visa
  - `existente`: búsqueda filtrable (por nombre o GJ-ID) + select de clientes cargados desde GET /api/clientes

- **Submit modo nuevo:**
  1. POST /api/clientes con nombre, teléfono, canal (sin estado — FIX-01 aplica: siempre ACTIVO)
  2. Si 409 DUPLICATE_CLIENT → muestra card con opción de "Usar cliente existente" que hace el POST visa con el id del duplicado
  3. Si ok → POST /api/visas con el id del cliente recién creado

- **Submit modo existente:** POST /api/visas directamente con el clienteId seleccionado

- **Export adicional `NuevoTramiteButton`**: client wrapper con estado `open` propio + `router.refresh()` en onSuccess, pensado para usarse en server components (pages)

### app/(dashboard)/tramites/page.tsx — modificado

- Import de `NuevoTramiteButton` desde `@/components/visas/NuevoTramiteModal`
- Header del page extendido con `display: flex, justifyContent: space-between`
- `<NuevoTramiteButton />` renderizado en el extremo derecho del header

## Decisions made during execution

- `NuevoTramiteButton` como export named del mismo archivo (no crear archivo separado) — mantiene cohesión del componente
- Select con `size={min(5, n+1)}` para modo existente — muestra múltiples opciones sin scroll inmediato
- Búsqueda de cliente es client-side filter sobre el fetch inicial — simple y efectivo para el volumen actual (<200 clientes)
- El card de duplicado tiene botón "Usar cliente existente" que ejecuta el POST visa inline — evita UX confusa de "volver al modo existente"

## Test results

- `npm run build` ✅ compilado sin errores TypeScript

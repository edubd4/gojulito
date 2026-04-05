# Plan de Implementación — Rediseño UX/UI GoJulito
> Análisis profundo: diseño actual vs nuevo diseño · Abril 2026
> REVISIÓN v2 — Corregido contra screenshots reales 04/04/2026

---

## 0. REFERENCIA DE SCREENSHOTS (para Code)

Cada pantalla del rediseño tiene screenshot + código HTML en:
`/mnt/stitch_gojulito_redesign_ux_ui/`

| Carpeta | Pantalla | Tema | Referencia para |
|---------|----------|------|-----------------|
| `dashboard_gojulito/` | Dashboard dark | Dark (HV) | F2 — Dashboard |
| `dashboard_principal/` | Dashboard light | Light (DB) | Referencia alternativa |
| `gesti_n_de_visas_gojulito/` | Gestión de Visas | Dark (HV) | F3 — Trámites tabla |
| `gesti_n_de_tr_mites/` | Gestión de Trámites | Light (DB) | Referencia alternativa |
| `nuevo_tr_mite_formulario/` | Wizard nuevo trámite | Dark (HV) | F3 — Wizard |
| `detalle_de_tr_mite_cliente_1/` | Detalle de trámite | Light (DB) | F3 — Detalle |
| `detalle_de_tr_mite_cliente_2/` | Detalle variante | Light (DB) | Referencia alternativa |
| `seminarios_gojulito/` | Seminarios dark | Dark (HV) | F4 — Seminarios |
| `m_dulo_de_seminarios/` | Seminarios + logística | Light (DB) | F4 — Logística |
| `heatmap_of_gesti_n_de_visas_gojulito/` | Heatmap UX (NO implementar) | — | Solo análisis UX |
| `diplomat_blue/DESIGN.md` | Design system light | — | Tokens de color light |
| `horizon_vista/DESIGN.md` | Design system dark | — | Tokens de color dark |

> **INSTRUCCIÓN PARA CODE:** Antes de implementar cada fase, leer el `code.html` y ver el `screen.png` de la carpeta correspondiente. El HTML tiene el markup exacto de referencia.

---

## 1. DECISIÓN DE TEMA (DESIGN SYSTEM)

El rediseño propone **dos sistemas** visuales:
- **Diplomat Blue (DB)** → tema claro, fondo `#f8f9fa`, azul `#002c98`
- **Horizon Vista (HV)** → tema oscuro, fondo `#051426`, amber `#ffba3a`

### Decisión: DARK principal (Horizon Vista), EXCEPTO detalle de trámite

- **Dashboard, Gestión de Visas, Wizard, Seminarios** → Dark (HV) — ya tienen diseño dark
- **Detalle de trámite/cliente** → Adaptar a dark, tomando la ESTRUCTURA del diseño light (DB) pero con colores HV
  - Razón: la página de detalle solo existe en light, pero el proyecto es 100% dark y hacer una sola página light rompería coherencia
  - El layout de 2 columnas, timeline, documentos y notas se mantienen; solo se adaptan colores
- **Módulo logística seminarios** → Misma estrategia: estructura del light adaptada a dark

---

## 2. CAMBIOS DE TOKENS DE DISEÑO

### 2A. Fuentes — CAMBIO REQUERIDO
| Actual | Nuevo |
|--------|-------|
| `Fraunces` (display/títulos) | `Manrope` (display/headlines) |
| `DM Sans` (body) | `Inter` (body/data) |

**Acción:** Actualizar `app/layout.tsx` + `tailwind.config.ts` para importar Manrope e Inter desde Google Fonts.

### 2B. Colores — EXTENSIÓN (no reemplazar)
Mantener todos los `gj-*` existentes y **añadir** los nuevos tokens:

```typescript
// tailwind.config.ts — añadir:
'gj-surface':       '#051426',    // nuevo deep navy (reemplaza gj-bg)
'gj-surface-low':   '#0d1c2f',    // nuevo card container
'gj-surface-mid':   '#122033',    // superficies mid
'gj-surface-high':  '#1c2b3e',    // superficies elevadas
'gj-amber-new':     '#ffba3a',    // nuevo amber (más brillante)
'gj-steel':         '#c0c6d9',    // nuevo text primary
'gj-outline':       '#909096',    // nuevo borders sutiles
```

### 2C. Iconos — CAMBIO REQUERIDO
- Actual: **Lucide React** (inferido de las convenciones Next.js con shadcn)
- Nuevo: **Material Symbols Outlined** (Google Icons)
- **Acción:** Añadir la fuente de Material Symbols en `app/layout.tsx` y crear wrapper component `<Icon name="..." />`

### 2D. Top Nav / Header — NUEVO
El rediseño muestra un header superior con:
- Izquierda: logo "GoJulito" + search bar "Buscar trámites..."
- Derecha: campana de notificaciones + ícono de ayuda (?) + avatar del usuario
- **Acción en F1:** Actualizar `DashboardShell.tsx` para incluir este header global

### 2E. Sidebar — CAMBIOS CLAVE
- Botón **"Nuevo Trámite"** como CTA dorado/amber prominente en el sidebar (no en la página)
- Items de nav con íconos Material Symbols
- Perfil del admin en la parte superior del sidebar con avatar + nombre + rol
- "Soporte" y "Cerrar Sesión" al fondo del sidebar

---

## 3. ANÁLISIS PANTALLA POR PANTALLA

---

### PANTALLA 1 — Dashboard (`/`)
**Estado:** Existe. Necesita rediseño visual mayor.

#### Cambios Visuales
- Layout actual: 4 métricas + 2 tablas + sidebar de actividad
- Layout nuevo: **Bento grid** asimétrico con:
  - Card grande: "Trámites de Visa Activos" con gráfico de barras semanal
  - 3 mini-cards de estado (Pendiente / Cita Agendada / Entregado)
  - Panel derecho sticky: Próximas Citas + card Seminario + 4 acciones rápidas
  - **Seminar Ticket Card** — componente visual tipo tarjeta de vuelo con efecto notch

#### Componentes Nuevos a Crear
- `components/dashboard/BentoGrid.tsx` — layout asimétrico
- `components/dashboard/WeeklyActivityChart.tsx` — gráfico de barras (usar Recharts, ya está en stack)
- `components/dashboard/SeminarTicketCard.tsx` — ticket visual con notch cutout
- `components/dashboard/ProximasCitasPanel.tsx` — lista lateral de turnos
- `components/dashboard/MetricaMiniCard.tsx` — mini-card de estado rápido

#### Datos Necesarios (ya existen en DB)
- Visas por estado → `v_metricas` o query directa
- Turnos de la semana → ya existe en dashboard actual
- Próximo seminario → query a `seminarios` ORDER BY fecha LIMIT 1

---

### PANTALLA 2 — Gestión de Trámites / Visas (`/tramites`)
**Estado:** Existe. Necesita mejoras funcionales importantes.

#### Cambios Visuales
- Filtros: mejorar UX con dropdowns más prominentes (Estado, Tipo de Visa, Fecha)
- Stats row: 4 cards de métricas arriba de la tabla (En Proceso, Citas Próximas, Aprobadas, Tasa de Éxito)
- Tabla: añadir columna de **estado de pago** más visible

#### Nueva Funcionalidad — MULTI-BADGE STATUS SYSTEM ⭐
El mayor cambio funcional. En vez de un solo badge de estado, mostrar el progreso del trámite:

```
[DS-160 ✓] [PAGO ✓] [CAS 🔄] [EMBAJADA ⏳]
```

- Requiere campos en tabla `visas` o lógica derivada del historial
- **Investigar:** ¿Los campos `ds160`, `fecha_turno`, `fecha_aprobacion` son suficientes para inferir estas etapas?
- **DB:** Probablemente añadir campo `etapa_actual` o derivarlo en el componente

#### Nueva Funcionalidad — CARGA MASIVA (Bulk Upload) ⭐
Panel nuevo en la página de trámites:
- Botón "Carga Masiva" que abre un panel/modal
- Upload de CSV con datos de clientes/visas
- **Backend:** Nueva API route `/api/visas/bulk-import`
- **Parsing:** Validación de CSV antes de insertar
- Muestra preview de registros antes de confirmar

#### Componentes Nuevos
- `components/tramites/MetricasTramiatesRow.tsx` — 4 stat cards
- `components/tramites/VisaProgressBadges.tsx` — multi-badge de etapas
- `components/tramites/CargaMasivaPanel.tsx` — upload + preview CSV
- `components/tramites/FiltrosAvanzados.tsx` — panel de filtros mejorado

---

### PANTALLA 3 — Nuevo Trámite (NUEVA RUTA: `/tramites/nuevo`) ⭐⭐⭐
**Estado:** NO EXISTE como página. Actualmente es solo un modal básico `NuevoTramiteModal`.

#### Descripción
Formulario wizard de **4 pasos** (verificado contra screenshot):
1. **DATOS PERSONALES** — nombres, apellidos, fecha nac., género (radio M/F), país de origen, estado civil
2. **PASAPORTE** — número de pasaporte, vencimiento, país emisor
3. **HISTORIAL** — historial de viajes/visas previas del cliente
4. **VISA DS-160** — datos específicos del formulario DS-160

> ⚠️ NOTA: Los pasos NO incluyen "Pago" ni "Revisión" — esos se manejan por separado en `/pagos`

#### Layout (verificado contra screenshot `nuevo_tr_mite_formulario/screen.png`)
- Stepper horizontal: 4 círculos numerados conectados por línea, paso activo en amber
- Breadcrumb: "Escritorio > Nuevo Trámite de Visa"
- Subtítulo: "Formulario de Perfil de Cliente - Expediente #GJ-XXXX-XXX"
- Form en 2 columnas dentro de card con borde superior amber
- Enlace "Guardar Progreso" arriba a la derecha del form
- Info card: "Validación de Identidad Automática" (ícono info verde)
- Botones: "Cancelar Trámite" (izq) | "Continuar a Pasaporte →" (derecha, amber)
- 3 cards de info al pie: "Seguridad Encriptada" | "Ahorro de Tiempo" | "Soporte Directo"

#### Técnico
- **Ruta:** `app/(dashboard)/tramites/nuevo/page.tsx`
- **Estado del form:** `useReducer` con 4 steps
- **Validación:** Zod schemas por step
- **API:** Reutilizar `/api/clientes` POST (step 1-2) + `/api/visas` POST (step 3-4)

#### Componentes Nuevos
- `components/tramites/NuevoTramiteWizard.tsx` — shell del wizard
- `components/tramites/StepIndicator.tsx` — barra de 4 pasos
- `components/tramites/steps/StepDatosPersonales.tsx`
- `components/tramites/steps/StepPasaporte.tsx`
- `components/tramites/steps/StepHistorial.tsx`
- `components/tramites/steps/StepVisaDS160.tsx`

---

### PANTALLA 4 — Detalle de Trámite / Cliente (`/clientes/[id]` → mejorar, o nueva `/tramites/[id]`)
**Estado:** Existe en `/clientes/[id]` pero mucho más básico que el rediseño.

#### Cambios Importantes

**A. Timeline Visual Horizontal** ⭐
- Progreso del caso: DS-160 → Pago → Cita CAS → Entrevista
- Íconos de check (✓) en verde, círculo pulsante para el paso actual, candado para futuros
- Con animación CSS: `animate-pulse` en el paso activo

**B. Sección de Documentos** ⭐
- Lista de archivos adjuntos: PDF icons + nombre + botón descarga
- Botón para subir nuevos documentos
- **Backend:** Supabase Storage para archivos
- **DB:** Nueva tabla `documentos` o campo en `visas` con array de storage paths

**C. Notas del Administrador** (mejorar)
- Mostrar historial de notas del sistema (ya existe en `historial`)
- Añadir textarea para nueva nota con botón de adjuntar archivo
- Banner de "Acción Requerida" configurable

**D. Layout de Dos Columnas**
- Columna izquierda (33%): perfil del cliente, tipo de visa, pasaporte, contacto, documentos
- Columna derecha (67%): timeline de progreso, notas, acciones requeridas

#### Decisión Arquitectónica
- **Opción A:** Mejorar `/clientes/[id]` — más sencillo, menos rutas
- **Opción B:** Crear `/tramites/[id]` como página independiente — más limpio, mejor separación
- **Recomendación:** Crear `/tramites/[id]` como página propia y enlazar desde la tabla de trámites

#### Nuevos Componentes
- `components/tramites/VisaTimeline.tsx` — barra horizontal de progreso con pulso
- `components/tramites/DocumentosPanel.tsx` — gestión de archivos
- `components/tramites/NotasAdmin.tsx` — historial + nuevo textarea
- `components/tramites/AccionRequeridaBanner.tsx` — banner de alerta accionable

#### Backend Requerido (si se añaden documentos)
- Habilitar Supabase Storage bucket `documentos`
- Nueva API route `/api/visas/[id]/documentos` (GET/POST)
- Política de seguridad: solo admin puede leer ciertos docs

---

### PANTALLA 5 — Seminarios (`/seminarios`)
**Estado:** Existe. Necesita mejoras visuales y nuevas secciones.

#### Cambios en Cards de Seminario
- Añadir **imagen de fondo** con overlay gradiente (actualmente sin imagen)
- **Barra de capacidad:** `[====      ] 42/50 (84%)`
- Badges de categoría: `ACADÉMICO • USA`, `TECNOLOGÍA • ASIA`
- Las cards pasan de planas a más visuales con imagen

#### Nueva Sección: Historial de Seminarios ⭐
- Grid de cards de seminarios pasados (estado FINALIZADO)
- Separado visualmente de los próximos
- Mostrar: nombre, fecha, cantidad de asistentes, recaudación

#### Panel Derecho: Detalles + Itinerario
- Al hacer click en un seminario, panel sticky de la derecha se actualiza
- **Itinerario Base:** lista de días con actividades (Día 1, Día 2, Día 3)
- **Documentación Requerida:** checklist con estados por asistente
  - Pasaporte Vigente ✓
  - Visa Schengen (X pendientes)
  - Seguro de Viaje ✓
  - Carta de Inscripción ✓

#### DB: Nuevas tablas/campos requeridos
```sql
-- Añadir a seminarios:
ALTER TABLE seminarios ADD COLUMN imagen_url text;
ALTER TABLE seminarios ADD COLUMN categoria text;
ALTER TABLE seminarios ADD COLUMN capacidad_max integer default 50;

-- Nueva tabla para itinerario:
CREATE TABLE seminario_itinerario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminario_id uuid REFERENCES seminarios(id),
  dia integer,
  descripcion text,
  hora_inicio time,
  hora_fin time
);
```

#### Componentes Nuevos
- `components/seminarios/SeminarioCardEnhanced.tsx` — card con imagen y capacity bar
- `components/seminarios/HistorialSeminarios.tsx` — sección de seminarios pasados
- `components/seminarios/ItinerarioPanel.tsx` — panel lateral sticky con timeline
- `components/seminarios/DocumentosChecklist.tsx` — checklist de docs por asistente
- `components/seminarios/CapacityBar.tsx` — barra de progreso de ocupación

---

### PANTALLA 6 — Módulo de Logística de Seminarios (`/seminarios/[id]`) ⭐⭐
**Estado:** La página de detalle existe pero sin módulo de logística.

#### Nueva Sección: Logística del Grupo
- Rows de logística: vuelos, transporte, alojamiento
- Cada row: ícono + descripción del transporte + vuelo/ruta + fecha/hora + capacidad + coordinador + estado
- Alerts de documentación: avisos de pendientes, cambios de itinerario

#### DB Requerido
```sql
CREATE TABLE seminario_logistica (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminario_id uuid REFERENCES seminarios(id),
  tipo text CHECK (tipo IN ('VUELO', 'TRANSPORTE_LOCAL', 'ALOJAMIENTO', 'OTRO')),
  descripcion text NOT NULL,
  detalle text,           -- ej: "AA 2042 - JFK"
  fecha_hora timestamptz,
  capacidad integer,
  coordinador text,
  estado text DEFAULT 'PROGRAMADO',
  created_at timestamptz DEFAULT now()
);
```

#### Componentes Nuevos
- `components/seminarios/LogisticaSection.tsx` — sección completa
- `components/seminarios/LogisticaRow.tsx` — fila individual de logística
- `components/seminarios/AlertasLogistica.tsx` — avisos de cambios
- `components/seminarios/NuevaLogisticaModal.tsx` — modal para añadir entrada

---

### PANTALLAS SIN DISEÑO NUEVO (mantener y mejorar con nuevo design system)

| Página | Qué hacer |
|--------|-----------|
| `/clientes` | Actualizar fonts, mantener estructura, añadir mejoras visuales menores |
| `/pagos` | Actualizar fonts, mejorar cards de métricas |
| `/calendario` | Mantener tal cual, actualizar tokens de color |
| `/configuracion` | Mantener estructura, actualizar visual |
| `/login` | Actualizar fonts + small polish visual |

---

## 4. RESUMEN DE NUEVAS PÁGINAS / RUTAS

| Ruta | Estado | Prioridad |
|------|--------|-----------|
| `/tramites/nuevo` | 🆕 Nueva | Alta |
| `/tramites/[id]` | 🆕 Nueva | Alta |
| (ya existe todo lo demás) | — | — |

---

## 5. RESUMEN DE NUEVAS TABLAS / MIGRACIONES DB

| Migración | Descripción | Prioridad |
|-----------|-------------|-----------|
| `add_seminario_imagen_capacidad` | `imagen_url`, `categoria`, `capacidad_max` a seminarios | Media |
| `create_seminario_itinerario` | Tabla de días del itinerario | Baja |
| `create_seminario_logistica` | Tabla de vuelos/transporte | Media |
| `create_visa_documentos` | Tabla de archivos adjuntos (o usar Storage directamente) | Media |

---

## 6. RESUMEN DE NUEVAS API ROUTES

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/visas/bulk-import` | POST | Importar CSV de trámites |
| `/api/visas/[id]/documentos` | GET/POST | Documentos adjuntos de visa |
| `/api/seminarios/[id]/logistica` | GET/POST/PUT/DELETE | CRUD logística |
| `/api/seminarios/[id]/itinerario` | GET/POST/PUT/DELETE | CRUD itinerario |
| `/api/dashboard/weekly-stats` | GET | Datos para gráfico semanal |

---

## 7. NUEVAS DEPENDENCIAS (si se aprueban)

```bash
# Gráfico de barras semanal (Recharts ya está disponible en stack según CLAUDE.md)
# No se necesitan dependencias adicionales para charts

# Si se decide usar Material Symbols (iconos)
# Añadir en app/layout.tsx via Google Fonts CDN link
# NO instalar paquete npm

# Para CSV parsing (bulk upload)
npm install papaparse @types/papaparse
```

---

## 8. PLAN DE EJECUCIÓN — ORDEN DE PRIORIDADES

### 🔴 FASE 1 — Fundamentos del Design System (1-2 sesiones)
> Cambia todo a la vez, base para el resto

1. Actualizar `app/layout.tsx` → fuentes Manrope + Inter
2. Actualizar `tailwind.config.ts` → nuevos tokens de color Horizon Vista
3. Crear `components/ui/Icon.tsx` → wrapper de Material Symbols
4. Actualizar `components/dashboard/DashboardShell.tsx` → nuevo layout con sidebar mejorado
5. Actualizar `Sidebar.tsx` → visual nuevo (iconos Material, colores HV, hover states)
6. Hacer `npm run build` para verificar que nada se rompe

### 🟠 FASE 2 — Dashboard Nuevo (1 sesión)
> La página más visible, genera impacto inmediato

1. Reemplazar layout de `/` con Bento Grid
2. Crear `WeeklyActivityChart` con Recharts
3. Crear `SeminarTicketCard` visual
4. Crear `ProximasCitasPanel` lateral
5. Actualizar métricas cards con nuevo visual

### 🟡 FASE 3 — Trámites Mejorado (2 sesiones)
> La funcionalidad core del negocio

1. Añadir stats row encima de la tabla
2. Implementar `VisaProgressBadges` (multi-badge DS-160/PAGO/CAS/APROBADA)
3. Mejorar filtros avanzados
4. Crear página `/tramites/nuevo` con wizard de 4 pasos
5. Crear página `/tramites/[id]` con timeline + documentos + notas

### 🟢 FASE 4 — Seminarios Mejorado (2 sesiones)
> Segundo módulo más importante

1. Mejorar cards con imagen, capacity bar, categoría
2. Añadir sección "Historial de Seminarios"
3. Añadir panel lateral de itinerario
4. Añadir módulo de logística en `/seminarios/[id]`
5. Añadir checklist de documentos por asistente
6. Aplicar migraciones DB necesarias

### 🔵 FASE 5 — Polish General (1 sesión)
1. Actualizar `/clientes`, `/pagos`, `/calendario`, `/configuracion` con nuevos tokens
2. Añadir FABs contextuales donde corresponde
3. Revisar consistencia de badges en todas las páginas
4. Implementar bulk upload (CSV) si se aprueba
5. `npm run build` final + testing

---

## 9. FEATURES NUEVAS — TABLA DE DECISIÓN

Estas features son **nuevas** (no existen en el proyecto actual). Julio debe confirmar si se implementan:

| Feature | Complejidad | Valor de Negocio | Decisión |
|---------|-------------|-----------------|----------|
| Wizard de 4 pasos para nuevo trámite | Media | Alto | ✅ Recomendado |
| Timeline visual de progreso de visa | Baja | Alto | ✅ Recomendado |
| Módulo de Logística de seminarios | Alta | Alto | ✅ Recomendado |
| Documentos adjuntos (Supabase Storage) | Alta | Medio | ⚠️ Confirmar |
| Carga masiva CSV | Alta | Medio | ⚠️ Confirmar |
| Itinerario de seminario | Media | Medio | ✅ Recomendado |
| Historial visual de seminarios pasados | Baja | Bajo | ✅ Recomendado |
| Capacity progress bars en seminarios | Baja | Bajo | ✅ Recomendado |
| Gráfico de barras semanal | Baja | Medio | ✅ Recomendado |
| Checklist de docs por asistente | Media | Medio | ⚠️ Confirmar |
| Ticket card en dashboard | Baja | Bajo | ✅ Recomendado |

---

## 10. LO QUE NO CAMBIA

- ✅ Toda la lógica de API routes existente
- ✅ Supabase auth y middleware
- ✅ ENUMs y constantes de negocio
- ✅ `components/ui/` (shadcn manual — no tocar)
- ✅ Estructura de DB existente
- ✅ Webhooks de n8n/Telegram
- ✅ Sistema de roles admin/colaborador
- ✅ `historial` immutable audit log
- ✅ Lógica de IDs humanlegibles (GJ-0001, VISA-0001, etc.)

---

## NOTAS FINALES PARA IMPLEMENTACIÓN

1. **No romper lo que funciona:** Cada fase debe terminar con `npm run build` exitoso
2. **Una feature por commit:** Mantener commits atómicos
3. **Mobile-first:** El rediseño muestra nav mobile, verificar responsive en cada componente
4. **Dark theme principal:** Adaptar pantallas light (detalle, logística) a dark con misma estructura
5. **Los `gj-*` colors:** Migrar gradualmente — fase 1 añade los nuevos, fases 2-5 los adoptan
6. **Supabase Storage:** Confirmar con Julio si hay presupuesto/plan que lo soporte antes de implementar documentos adjuntos

---

## 11. INSTRUCCIONES GSD PARA CODE (eficiencia de tokens)

### Reglas de ejecución
- **NO usar Agent/subagent** para explorar — usar Read/Glob/Grep directo
- **NO re-analizar el proyecto** — la estructura ya está documentada en este plan
- **Cada sesión = 1 subtarea** de la tabla de fases (sección 8)
- **Leer screenshot + code.html** de la carpeta correspondiente ANTES de escribir código
- **Respuestas cortas** — confirmar lo hecho, no explicar razonamientos
- **Build al final** de cada sesión como verificación

### Referencia rápida de archivos clave
```
app/layout.tsx                    → fonts, metadata
tailwind.config.ts                → colores, fonts
components/dashboard/DashboardShell.tsx → layout principal (sidebar + header)
components/dashboard/Sidebar.tsx  → navegación lateral
app/(dashboard)/page.tsx          → dashboard home
app/(dashboard)/tramites/page.tsx → tabla de trámites
app/(dashboard)/seminarios/page.tsx → seminarios
app/(dashboard)/clientes/[id]/page.tsx → detalle cliente actual
lib/constants.ts                  → ENUMs del negocio
lib/supabase/server.ts            → queries a DB
```

### Subtareas por sesión (tabla definitiva GSD)

| Sesión | ID | Tarea | Archivos a tocar | Ref screenshot |
|--------|----|-------|-------------------|----------------|
| 1 | F1A | Fuentes Manrope+Inter + tokens color HV | `layout.tsx`, `tailwind.config.ts` | `horizon_vista/DESIGN.md` |
| 2 | F1B | Icon component + Sidebar nuevo + Header | `Icon.tsx` (nuevo), `Sidebar.tsx`, `DashboardShell.tsx` | `dashboard_gojulito/screen.png` |
| 3 | F2A | Dashboard: BentoGrid + MetricCards + chart | `page.tsx`, 3 componentes nuevos | `dashboard_gojulito/` |
| 4 | F2B | Dashboard: SeminarTicket + ProximasCitas + acciones | 3 componentes nuevos | `dashboard_gojulito/` |
| 5 | F3A | Trámites: stats row + VisaProgressBadges + filtros | `TramitesTable.tsx`, 3 componentes nuevos | `gesti_n_de_visas_gojulito/` |
| 6 | F3B | Wizard nuevo trámite (steps 1-2) | Página nueva + 3 componentes | `nuevo_tr_mite_formulario/` |
| 7 | F3C | Wizard nuevo trámite (steps 3-4) | 2 componentes + wiring API | `nuevo_tr_mite_formulario/` |
| 8 | F3D | Detalle trámite: timeline + layout 2 cols | Página nueva + 2 componentes | `detalle_de_tr_mite_cliente_1/` |
| 9 | F3E | Detalle trámite: notas + banner acción | 2 componentes | `detalle_de_tr_mite_cliente_1/` |
| 10 | F4A | Seminarios: cards mejoradas + capacity + historial | `SeminarioCard.tsx` mejorado, 2 nuevos | `seminarios_gojulito/` |
| 11 | F4B | Seminarios: panel itinerario + checklist docs | 2 componentes nuevos | `seminarios_gojulito/` |
| 12 | F4C | Seminarios: logística (DB migration + API + UI) | Migration SQL, API route, 3 componentes | `m_dulo_de_seminarios/` |
| 13 | F5 | Polish: clientes, pagos, calendario, config | 4-5 archivos modificados | — |

> **Total: ~13 sesiones estimadas**

# Phase 7: Calendario y Configuración - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 07-calendario-y-configuracion
**Areas discussed:** Seminarios en calendario, Acceso a /configuracion

---

## Seminarios en calendario (CAL-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Chip en el grid + popup | Igual que los turnos: chip de color en la celda del día, click abre popup con nombre, fecha y link a /seminarios/[id] | ✓ |
| Solo en sidebar 'Esta semana' | Solo en el panel lateral, no en el grid | |
| Grid + sidebar | Chip en el grid Y entrada en 'Esta semana' | |

**User's choice:** Chip en el grid + popup (mismo patrón que TurnoItem)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Verde (#22c97a) | Color de APROBADA/PAGADO | |
| Púrpura personalizado | Un color nuevo tipo #a78bfa — exclusivo para seminarios | ✓ |
| Amber (#e8a020) | Mismo que EN_PROCESO, confuso | |

**User's choice:** Púrpura personalizado

---

| Option | Description | Selected |
|--------|-------------|----------|
| Nombre + fecha + link | Popup simple con nombre, fecha, modalidad, botón 'Ver seminario' | ✓ |
| Nombre + fecha + cant. asistentes | Con conteo de asistentes registrados | |
| Solo link directo | Click navega directo sin popup | |

**User's choice:** Nombre + fecha + link (patrón simple, mismo que TurnoPopup)

---

| Option | Description | Selected |
|--------|-------------|----------|
| Solo el mes visible | Mismo rango que turnos y pagos — consistente | ✓ |
| Próximos 90 días fijos | Siempre 3 meses sin importar el mes visto | |

**User's choice:** Solo el mes visible

---

| Option | Description | Selected |
|--------|-------------|----------|
| campo fecha (DATE existente) | Ya existe en la tabla seminarios | ✓ |
| fecha_inicio y fecha_fin | Para seminarios multi-día (schema actual no lo soporta) | |

**User's choice:** Campo `fecha` existente

---

## Acceso a /configuracion (CFG-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Redirect a / (dashboard) | `redirect('/')` al detectar rol !== 'admin' | ✓ |
| Página con mensaje 'Sin acceso' | 403-style page, el colaborador ve que existe | |
| Mantener perfil, bloquear admin | Comportamiento actual — NO cumple SC4 | |

**User's choice:** Redirect a / — colaboradores son redirigidos al dashboard

---

| Option | Description | Selected |
|--------|-------------|----------|
| Sí, ocultar en sidebar | Filtrar link /configuracion cuando rol !== 'admin' | ✓ |
| No, dejarlo visible | Link visible pero con redirect al hacer click | |

**User's choice:** Ocultar el link en el sidebar para colaboradores

---

## Claude's Discretion

- Nombre/label del chip de seminario en el grid (sem_id vs nombre corto)
- Posición y estilo del popup de seminario (centrado está bien)
- Si incluir icono visual en el popup header de seminario

## Deferred Ideas

- "Esta semana" sidebar con seminarios — no discutido, queda para v1.3
- Conteo de asistentes en el popup — decidido NO incluir para mantener simplicidad

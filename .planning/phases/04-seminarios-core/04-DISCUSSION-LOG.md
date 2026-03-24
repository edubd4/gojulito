# Phase 4: Seminarios — Core - Discussion Log

**Date:** 2026-03-23
**For human reference only — not consumed by downstream agents**

---

## Codebase Scout Summary

Gran parte de Phase 4 ya estaba construida desde v1.0 (pre-planning). Se identificaron los siguientes componentes existentes:
- API routes completas: GET, POST, PATCH para seminarios
- Modales: NuevoSeminarioModal, EditarSeminarioModal
- UI: SeminariosPage (lista), SeminarioCard, página de detalle completa

Único gap para los success criteria: soft delete (campo `activo` no existe en tabla `seminarios`).

---

## Area 1: Dónde va el botón de inactivar

**Q:** ¿En la lista (SeminarioCard) o en la página de detalle?

**Options presented:**
- SeminarioCard (lista) — acción rápida, más accesible
- Página de detalle — más deliberado, menos riesgo de activación accidental

**User selection:** Página de detalle.

**Reason given:** SeminarioCard ya tiene hover effects y actúa como link — no quiero agregar acciones destructivas ahí.

---

## Area 2: Visibilidad de seminarios inactivos

**Q:** ¿Desaparecen de la lista o se muestran opacados con badge "Inactivo"?

**Options presented:**
- Desaparecen (filtrar activo=true) — mismo patrón que clientes
- Se muestran opacados con badge "Inactivo" — visibilidad total
- Toggle "mostrar inactivos" — control explícito

**User selection:** Desaparecen por defecto, sin badge, sin toggle.

**Reason given:** Mismo patrón que clientes: filtrar is_active = true en la query principal.

---

## Area 3: Confirmación antes de inactivar

**Q:** ¿Diálogo de confirmación o acción directa?

**Options presented:**
- Confirmación — más seguro para acciones con impacto en datos asociados
- Acción directa con undo — modern UX pattern
- Sin confirmación — consistente con el resto del app

**User selection:** Diálogo de confirmación.

**Reason given:** Los seminarios tienen asistentes asociados — el usuario necesita confirmar que entiende. Usar el mismo patrón de AlertDialog que ya existe (ConfirmModal en ClientesTable.tsx).

---

## Update Session — 2026-03-23

**Areas revisited:** Soft delete ubicación (ROADMAP conflict), Historial al inactivar, Response shape POST, Redirect post-inactivación

### Soft delete — ubicación (confirmado)
Success criterion 3 del ROADMAP dice "desde la lista" — es un error en el roadmap. Decisión confirmada: botón en página de detalle.

### Historial al inactivar (nuevo — D-06)
Insertar entrada en historial: tipo='CAMBIO_ESTADO', descripcion='Seminario marcado como inactivo', origen='dashboard', usuario_id=user.id

### Response shape POST (no cambiar — D-08)
Mantener `{ success: true, seminario }` — no estandarizar en esta fase. Refactor posterior si hace falta.

### Redirect post-inactivación (nuevo — D-07)
router.push('/seminarios') después de confirmar. El seminario ya no existe en la vista del usuario.

---

## Deferred Ideas

- Estandarizar POST /api/seminarios a `{ data, error }` — milestone de refactor posterior.
- Toggle "mostrar inactivos" — fuera de scope de esta fase.

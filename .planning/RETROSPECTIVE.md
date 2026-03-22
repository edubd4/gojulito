# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.1 — Core Hardening

**Shipped:** 2026-03-22
**Phases:** 3 | **Plans:** 6 | **Tasks:** 13

### What Was Built

- Cascada FINALIZADO extraída de 3 rutas duplicadas a un solo helper `lib/visas.ts`
- Bulk-delete convertido a soft-delete (INACTIVO) con cascada de cancelación de visas
- Zod v4 instalado con schemas de dominio en `lib/schemas/` para clientes, visas y pagos
- Patrón `{ data, error }` estandarizado en los 9 handlers POST/PATCH del dashboard y webhooks
- 6 formularios frontend actualizados para mostrar errores del servidor inline (no silenciar fallos)

### What Worked

- **Planificación detallada por tarea**: Los PLANs con líneas específicas, tipo de cambio y código esperado permitieron ejecución completamente autónoma sin revisión manual.
- **`{ data, error }` como contrato único**: Estandarizar primero el contrato de respuesta y luego actualizar el cliente fue la secuencia correcta — Phase 2 habilitó directamente Phase 3.
- **Separación de concerns entre phases**: Cada phase tuvo un goal claro y acotado; no hubo scope creep.
- **Verificación automática post-ejecución**: Los verifiers con must_haves codificados como truths detectaron la discrepancia `json.pago` vs `json.data` que hubiera pasado desapercibida.

### What Was Inefficient

- **Zod v4 API gotcha**: La migración de `required_error`/`invalid_type_error` objects a string `error` en `z.enum()` no estaba documentada en el plan inicial — se descubrió durante ejecución. Añadir nota en CLAUDE.md hubiera ayudado.
- **Phase 2 VAL-02 scope ambiguity**: Algunos routes menores (`bulk-update`, `notas`) quedaron fuera del scope definido pero el verifier los flaggeó como deuda técnica, creando ruido. Scope debería haberse definido explícitamente en REQUIREMENTS.

### Patterns Established

- **Zod v4 API**: Usar `.issues` (no `.errors`) y string `error` en `z.enum()` — documentado en STATE.md
- **Error check en modales**: `if (!res.ok || json.error)` + `json.error ?? 'Error fallback'` — el patrón canónico a replicar en nuevos modales
- **409 DUPLICATE_CLIENT**: Shape de error específico que el bot de Telegram parsea — no modificar nunca sin actualizar el bot primero

### Key Lessons

1. **Documentar API gotchas en CLAUDE.md inmediatamente.** Zod v4 `.issues` vs `.errors` se descubrió durante ejecución. Una nota en CLAUDE.md hubiera ahorrado investigación en phases futuras.
2. **Definir scope de requirements con ejemplos concretos de lo que excluye.** "Todos los handlers" generó ambigüedad sobre `bulk-update` y `notas` routes.
3. **El orden Phase 2 → Phase 3 fue crítico.** Estandarizar `{ data, error }` primero hizo que el fix de modales fuera trivial (2 archivos, 6 líneas). Sin Phase 2, Phase 3 hubiera requerido refactoring profundo.

### Cost Observations

- Model mix: ~100% sonnet (executor + verifier)
- Sessions: 2 (Phase 1-2 en sesión 1, Phase 3 + milestone en sesión 2)
- Notable: 6 planes ejecutados con 0 fallos — planificación detallada eliminó retrabajo

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.1 | 2 | 3 | Primera vez con GSD — estableció el baseline de planificación formal |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.1 | 0 (no test suite) | — | Zod (validation only) |

### Top Lessons (Verified Across Milestones)

1. Contracts before consumers — estandarizar la shape de respuesta antes de actualizar el cliente es siempre la secuencia correcta.
2. Scope explícito beats scope implícito — "todos los handlers de POST/PATCH del dashboard" > "todos los handlers".

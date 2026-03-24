---
status: partial
phase: 07-calendario-y-configuracion
source: [07-VERIFICATION.md]
started: 2026-03-24T00:00:00Z
updated: 2026-03-24T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Seminario chip en calendario
expected: Al abrir /calendario, los seminarios activos aparecen como chips púrpura en las celdas del día correspondiente. Click en el chip abre un popup con sem_id, fecha formateada, badge de modalidad (Presencial/Virtual) y botón "Ver seminario" que navega a /seminarios/[id].
result: [pending]

### 2. Colaborador redirigido desde /configuracion
expected: Un usuario con rol=colaborador que intenta acceder a /configuracion es redirigido automáticamente a / (dashboard).
result: [pending]

### 3. Sidebar sin link Configuracion para colaborador
expected: Un usuario con rol=colaborador no ve el ítem "Configuracion" en el menú lateral.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps

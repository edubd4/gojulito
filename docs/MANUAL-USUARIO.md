# GoJulito - Manual de Usuario

Sistema de gestion operativa para tramites de visa USA y seminarios de viaje.

---

## Acceso al Sistema

### Ingresar

1. Abrir el navegador y entrar a la direccion del sistema (ej: `gojulito.tudominio.com`)
2. Ingresar **Email** y **Contrasena**
3. Hacer clic en **Ingresar**

El sistema tiene dos roles:
- **Admin**: acceso completo (Julio). Puede crear/eliminar usuarios, ver credenciales, configurar precios.
- **Colaborador**: acceso operativo. Puede gestionar clientes, tramites, pagos y seminarios pero NO accede a Configuracion ni a credenciales sensibles.

### Cambiar tema (claro/oscuro)

En la barra superior hay un icono de sol/luna. Hacele clic para alternar entre tema oscuro (por defecto) y tema claro.

---

## Panel Central (Dashboard)

Es la pantalla principal al ingresar. Muestra un resumen operativo:

- **Tramites de Visa Activos**: cuantos estan en proceso, con turno asignado, y aprobados. Incluye un grafico de actividad semanal.
- **Proximas Citas**: turnos de embajada de los proximos 7 dias con nombre del cliente, fecha y telefono.
- **Proximo Seminario**: si hay uno programado, muestra fecha, modalidad y cantidad de asistentes.
- **Deudas Proximas**: pagos con vencimiento en los proximos 30 dias.

---

## Clientes

### Ver todos los clientes

Ir a **Clientes** en el menu lateral. Se ve una tabla con todos los clientes del sistema.

**Columnas visibles:**
- Nombre
- Estado Cliente (dropdown editable: Prospecto, Activo, Finalizado, Inactivo)
- Estado Visa (dropdown editable: En proceso, Turno asignado, Aprobada, Rechazada, Pausada, Cancelada)
- Telefono (solo en pantallas medianas/grandes)
- Canal de ingreso (solo en pantallas medianas/grandes)
- Estado de pago
- Acciones (ver perfil, ver tramite)

### Filtrar clientes

Arriba de la tabla hay filtros:
- **Buscar**: por nombre, telefono o codigo GJ
- **Estado cliente**: Prospecto, Activo, Finalizado, Inactivo
- **Estado visa**: En proceso, Turno asignado, Aprobada, etc.
- **Estado pago**: Pagado, Deuda, Pendiente, Financiado
- **Canal**: Seminario, WhatsApp, Instagram, Referido, Charla, Otro

### Cambiar estado desde la tabla

Los campos **Est. cliente** y **Est. visa** se pueden cambiar directamente desde la tabla usando los dropdowns. El cambio se guarda automaticamente.

> **Nombre, Telefono y Canal** no se editan desde la tabla. Para modificarlos, entrar al perfil del cliente.

### Crear un cliente nuevo

1. Clic en **+ Nuevo Cliente** (boton naranja arriba a la derecha, o desde el menu lateral)
2. Completar los datos: nombre, telefono, email, DNI, provincia, canal de ingreso, observaciones
3. Guardar

El sistema genera automaticamente un codigo unico (ej: `GJ-0070`).

### Perfil del cliente (detalle)

Hacer clic en el icono de ojo en la tabla o en el nombre del cliente. Se abre una vista completa con:

- **Datos personales**: telefono, email, DNI, provincia, fecha de nacimiento, canal, grupo familiar, observaciones
- **Visa activa**: estado actual, DS-160, email portal, fechas de turno/aprobacion/vencimiento
- **Pagos**: todos los pagos asociados al cliente
- **Financiamientos**: planes de financiamiento activos con progreso de cuotas
- **Historial**: linea de tiempo con todos los eventos (cambios de estado, pagos, notas, alertas)

**Acciones disponibles desde el perfil:**
- **Editar Cliente**: modificar cualquier dato personal
- **Agregar Nota**: dejar un comentario en el historial
- **Registrar Pago**: crear un nuevo pago para este cliente
- **Iniciar Visa**: crear un nuevo tramite de visa (si no tiene una activa)

### Grupos Familiares

Debajo de la tabla de clientes hay una seccion de **Grupos Familiares**. Permiten agrupar clientes que viajan juntos (ej: familia Gonzalez).

- Crear grupo con un nombre
- Asignar clientes al grupo desde el perfil de cada cliente
- Ver todos los miembros de un grupo

---

## Tramites (Visas)

### Ver todos los tramites

Ir a **Tramites** en el menu lateral.

**Metricas superiores:**
- En Proceso (cantidad)
- Proximas Citas (30 dias)
- Aprobadas (total)
- Tasa de Exito (porcentaje)

Hacer clic en una metrica filtra la tabla por ese estado.

**Columnas de la tabla:**
- Codigo de visa (VISA-XXXX)
- Cliente
- Estado
- DS-160 (indicador si esta cargado)
- Fecha de turno
- Fecha de aprobacion
- Grupo familiar

### Crear un tramite nuevo

1. Clic en **Nuevo Tramite** (desde el menu lateral o la pagina de tramites)
2. Seleccionar el cliente
3. Completar datos de la visa: DS-160, email portal, fecha de turno, notas
4. Guardar

### Detalle del tramite

Hacer clic en una fila de la tabla. Se abre la vista detallada con toda la informacion de la visa y acciones para editar campos, cambiar estado, agregar notas.

---

## Pagos

### Ver todos los pagos

Ir a **Pagos** en el menu lateral.

**Columnas:**
- Codigo de pago (PAG-XXXX)
- Cliente
- Tipo (Visa o Seminario)
- Monto (en pesos argentinos)
- Fecha de pago
- Estado (Pagado, Deuda, Pendiente, Financiado)
- Fecha de vencimiento de deuda

### Estados de pago

| Estado | Color | Significado |
|--------|-------|-------------|
| **Pagado** | Verde | El pago esta completo |
| **Deuda** | Rojo | Tiene monto pendiente con fecha de vencimiento |
| **Pendiente** | Gris | Pago registrado pero no cobrado aun |
| **Financiado** | Azul | El pago esta dentro de un plan de financiamiento |

### Registrar un pago

Se puede hacer desde:
- La pagina de **Pagos** (boton + Nuevo Pago)
- El **perfil del cliente** (boton Registrar Pago)

Campos: cliente, tipo (visa/seminario), monto, fecha de pago, estado, fecha de vencimiento (si es deuda), notas.

---

## Financiamientos

### Ver financiamientos

Ir a **Financiamientos** en el menu lateral.

Muestra todos los planes de financiamiento activos con:
- Codigo (FIN-XXXX)
- Concepto (Vuelo, Visa, Viaje, Otro)
- Estado (Activo, Completado, Cancelado)
- Monto total
- Cuotas pagadas / totales
- Monto cobrado / pendiente
- Cliente asociado

### Detalle del financiamiento

Hacer clic en una fila para ver:
- Datos del plan
- Lista de cuotas con numero, monto, fecha de vencimiento, estado
- Registrar pago de cuota individual
- Marcar cuotas como pagadas o vencidas

---

## Seminarios

### Ver seminarios

Ir a **Seminarios** en el menu lateral.

Se dividen en dos secciones:
- **Proximos Destinos**: seminarios programados a futuro
- **Historial**: seminarios ya realizados

Cada tarjeta muestra: nombre, fecha, modalidad (Presencial/Virtual), cantidad de asistentes, capacidad, recaudacion.

### Crear un seminario

1. Clic en **Nuevo Seminario**
2. Completar: nombre, fecha, modalidad, precio, capacidad maxima, notas
3. Guardar

### Detalle del seminario

Hacer clic en una tarjeta. Se abre la vista completa con:

**Panel principal:**
- Resumen: cantidad de asistentes, total recaudado, cuantos convirtieron a visa
- **Tabla de Asistentes**: nombre, modalidad, estado de pago, monto, si convirtio a visa
- Notas del seminario

**Panel lateral:**
- **Itinerario**: agenda dia por dia con horarios
- **Logistica**: items como vuelos, transporte, alojamiento con responsable y estado
- **Checklist de Documentos**: verificacion por asistente

**Acciones:**
- Agregar asistente (seleccionar cliente existente o crear nombre nuevo)
- Editar datos del seminario
- Inactivar seminario (no se borra, se oculta)
- Editar/eliminar asistentes individuales

### Conversion a visa

La metrica mas importante: si un asistente de seminario despues arranca tramite de visa. Se marca en la columna **Convirtio** con tres opciones: Si, No, En Seguimiento.

---

## Calendario

Ir a **Calendario** en el menu lateral.

Vista mensual con eventos marcados por colores:
- **Azul**: turnos de embajada (citas de visa)
- **Verde**: pagos cobrados
- **Rojo**: deudas por vencer
- **Violeta**: seminarios

Hacer clic en un dia para ver todos los eventos de esa fecha en detalle.

Se puede navegar entre meses con las flechas.

---

## Configuracion (solo Admin)

Ir a **Configuracion** en el menu lateral (solo visible para rol Admin).

### Mi Perfil
- Ver y editar tu nombre
- Ver tu email y rol
- Cambiar contrasena

### Usuarios del Sistema
- Ver todos los usuarios registrados con su rol y estado
- **Crear usuario nuevo**: email, nombre, contrasena, rol (admin/colaborador)
- **Editar usuario**: cambiar nombre, email o rol
- **Activar/Desactivar**: toggle para habilitar o deshabilitar acceso
- **Eliminar usuario**: elimina permanentemente (requiere confirmacion)

### Precios del Servicio
- **Precio Visa**: monto por defecto al crear un pago tipo Visa
- **Precio Seminario**: monto por defecto al crear un pago tipo Seminario

Estos valores se usan como sugerencia al registrar pagos.

---

## Ayuda

Ir a **Soporte** en la parte inferior del menu lateral. Hay una guia interactiva con secciones expandibles para cada modulo y preguntas frecuentes.

---

## Reglas importantes del sistema

1. **Nada se borra definitivamente**: los clientes se marcan como "Inactivo", los seminarios se "Inactivan". Esto protege el historial.
2. **El historial es inmutable**: una vez que se registra un evento (pago, cambio de estado, nota), no se puede editar ni borrar. Es la fuente de verdad.
3. **Credenciales de visa**: las contrasenas de portales consulares solo las puede ver el Admin. El colaborador ve el email del portal pero no la contrasena.
4. **Codigos automaticos**: cada cliente (GJ-XXXX), visa (VISA-XXXX), pago (PAG-XXXX) y seminario (SEM-2026-XX) recibe un codigo unico automatico. No se reutilizan.

---

## Consejos de uso

- **Busqueda rapida**: la barra de busqueda en el header (desktop) busca en tramites
- **Cambios de estado rapidos**: usar los dropdowns directamente en la tabla de clientes
- **Revisar deudas**: el panel central muestra las deudas de los proximos 30 dias
- **Antes de un seminario**: verificar asistentes, pagos y documentos desde el detalle del seminario
- **Seguimiento post-seminario**: marcar la columna "Convirtio" para trackear conversion a visa

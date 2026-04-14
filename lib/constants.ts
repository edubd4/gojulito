// ENUM values — usar exactamente estos strings en toda la app

export const ESTADO_CLIENTE = {
  PROSPECTO: 'PROSPECTO',
  ACTIVO: 'ACTIVO',
  FINALIZADO: 'FINALIZADO',
  INACTIVO: 'INACTIVO',
} as const

export type EstadoCliente = typeof ESTADO_CLIENTE[keyof typeof ESTADO_CLIENTE]

export const ESTADO_VISA = {
  EN_PROCESO: 'EN_PROCESO',
  TURNO_ASIGNADO: 'TURNO_ASIGNADO',
  APROBADA: 'APROBADA',
  RECHAZADA: 'RECHAZADA',
  PAUSADA: 'PAUSADA',
  CANCELADA: 'CANCELADA',
} as const

export type EstadoVisa = typeof ESTADO_VISA[keyof typeof ESTADO_VISA]

export const ESTADO_PAGO = {
  PAGADO: 'PAGADO',
  DEUDA: 'DEUDA',
  PENDIENTE: 'PENDIENTE',
  FINANCIADO: 'FINANCIADO',
} as const

export type EstadoPago = typeof ESTADO_PAGO[keyof typeof ESTADO_PAGO]

export const CANAL_INGRESO = {
  SEMINARIO: 'SEMINARIO',
  WHATSAPP: 'WHATSAPP',
  INSTAGRAM: 'INSTAGRAM',
  REFERIDO: 'REFERIDO',
  CHARLA: 'CHARLA',
  FORM: 'FORM',
  OTRO: 'OTRO',
} as const

export type CanalIngreso = typeof CANAL_INGRESO[keyof typeof CANAL_INGRESO]

export const TIPO_SERVICIO = {
  VISA: 'VISA',
  SEMINARIO: 'SEMINARIO',
} as const

export type TipoServicio = typeof TIPO_SERVICIO[keyof typeof TIPO_SERVICIO]

export const MODALIDAD_SEM = {
  PRESENCIAL: 'PRESENCIAL',
  VIRTUAL: 'VIRTUAL',
  AMBAS: 'AMBAS',
} as const

export type ModalidadSem = typeof MODALIDAD_SEM[keyof typeof MODALIDAD_SEM]

export const CONVIRTIO_VISA = {
  SI: 'SI',
  NO: 'NO',
  EN_SEGUIMIENTO: 'EN_SEGUIMIENTO',
} as const

export type ConvirtioVisa = typeof CONVIRTIO_VISA[keyof typeof CONVIRTIO_VISA]

export const TIPO_EVENTO = {
  CAMBIO_ESTADO: 'CAMBIO_ESTADO',
  PAGO: 'PAGO',
  NOTA: 'NOTA',
  TURNO_ASIGNADO: 'TURNO_ASIGNADO',
  ALERTA: 'ALERTA',
  NUEVO_CLIENTE: 'NUEVO_CLIENTE',
} as const

export type TipoEvento = typeof TIPO_EVENTO[keyof typeof TIPO_EVENTO]

export const CONCEPTO_FINANCIAMIENTO = {
  VUELO: 'VUELO',
  VISA: 'VISA',
  VIAJE: 'VIAJE',
  OTRO: 'OTRO',
} as const

export type ConceptoFinanciamiento = typeof CONCEPTO_FINANCIAMIENTO[keyof typeof CONCEPTO_FINANCIAMIENTO]

export const ESTADO_FINANCIAMIENTO = {
  ACTIVO: 'ACTIVO',
  COMPLETADO: 'COMPLETADO',
  CANCELADO: 'CANCELADO',
} as const

export type EstadoFinanciamiento = typeof ESTADO_FINANCIAMIENTO[keyof typeof ESTADO_FINANCIAMIENTO]

export const ESTADO_CUOTA = {
  PENDIENTE: 'PENDIENTE',
  PAGADO: 'PAGADO',
  VENCIDO: 'VENCIDO',
} as const

export type EstadoCuota = typeof ESTADO_CUOTA[keyof typeof ESTADO_CUOTA]

export const ROL = {
  ADMIN: 'admin',
  COLABORADOR: 'colaborador',
} as const

export type Rol = typeof ROL[keyof typeof ROL]

export const TIPO_NOTIFICACION = {
  DEUDA_PROXIMA:   'DEUDA_PROXIMA',
  TURNO_PROXIMO:   'TURNO_PROXIMO',
  NUEVA_SOLICITUD: 'NUEVA_SOLICITUD',
  CUOTA_VENCIDA:   'CUOTA_VENCIDA',
} as const

export type TipoNotificacion = typeof TIPO_NOTIFICACION[keyof typeof TIPO_NOTIFICACION]

import { z } from 'zod'
import { ESTADO_VISA, ESTADO_PAGO } from '@/lib/constants'

const estadoVisaValues = [
  ESTADO_VISA.EN_PROCESO,
  ESTADO_VISA.TURNO_ASIGNADO,
  ESTADO_VISA.APROBADA,
  ESTADO_VISA.RECHAZADA,
  ESTADO_VISA.PAUSADA,
  ESTADO_VISA.CANCELADA,
] as const

const estadoPagoVisaValues = [
  ESTADO_PAGO.PAGADO,
  ESTADO_PAGO.DEUDA,
] as const

export const createVisaSchema = z.object({
  cliente_id: z.string().uuid('cliente_id inválido'),
  pais_codigo: z.string().min(2, 'País es requerido'),
  ds160: z.string().nullable().optional(),
  email_portal: z.string().email('Email de portal inválido').nullable().optional(),
  estado: z.enum(estadoVisaValues, 'Estado es requerido'),
  orden_atencion: z.string().nullable().optional(),
  fecha_turno: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
  cobrar: z.boolean().optional(),
  monto: z.number().positive('Monto debe ser positivo').optional(),
  estado_pago: z.enum(estadoPagoVisaValues).optional(),
  fecha_vencimiento_deuda: z.string().nullable().optional(),
})

export const patchVisaSchema = z.object({
  estado: z.enum(estadoVisaValues).optional(),
  ds160: z.string().nullable().optional(),
  email_portal: z.string().email('Email de portal inválido').nullable().optional(),
  orden_atencion: z.string().nullable().optional(),
  fecha_turno: z.string().nullable().optional(),
  fecha_aprobacion: z.string().nullable().optional(),
  fecha_vencimiento: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
})

export const webhookVisaPatchSchema = z.object({
  visa_id: z.string().min(1, 'visa_id es requerido'),
  estado: z.enum(estadoVisaValues, 'Estado es requerido'),
  fecha_turno: z.string().nullable().optional(),
  notas: z.string().nullable().optional(),
})

export type CreateVisaInput = z.infer<typeof createVisaSchema>
export type PatchVisaInput = z.infer<typeof patchVisaSchema>
export type WebhookVisaPatchInput = z.infer<typeof webhookVisaPatchSchema>

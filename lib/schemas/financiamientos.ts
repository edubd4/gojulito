import { z } from 'zod'
import { CONCEPTO_FINANCIAMIENTO, ESTADO_FINANCIAMIENTO, ESTADO_CUOTA } from '@/lib/constants'

const conceptoValues = [
  CONCEPTO_FINANCIAMIENTO.VUELO,
  CONCEPTO_FINANCIAMIENTO.VISA,
  CONCEPTO_FINANCIAMIENTO.VIAJE,
  CONCEPTO_FINANCIAMIENTO.OTRO,
] as const

const estadoFinValues = [
  ESTADO_FINANCIAMIENTO.ACTIVO,
  ESTADO_FINANCIAMIENTO.COMPLETADO,
  ESTADO_FINANCIAMIENTO.CANCELADO,
] as const

const estadoCuotaValues = [
  ESTADO_CUOTA.PENDIENTE,
  ESTADO_CUOTA.PAGADO,
  ESTADO_CUOTA.VENCIDO,
] as const

const cuotaSchema = z.object({
  monto: z.number().positive('Monto de cuota debe ser positivo'),
  fecha_vencimiento: z.string().min(1, 'Fecha de vencimiento es requerida'),
  notas: z.string().nullable().optional(),
})

export const createFinanciamientoSchema = z.object({
  cliente_id: z.string().uuid('cliente_id inválido'),
  concepto: z.enum(conceptoValues, { message: 'Concepto inválido' }),
  descripcion: z.string().nullable().optional(),
  monto_total: z.number().positive('Monto total debe ser positivo'),
  cuotas: z.array(cuotaSchema).min(1, 'Se requiere al menos una cuota'),
})

export const patchFinanciamientoSchema = z.object({
  estado: z.enum(estadoFinValues, { message: 'Estado inválido' }),
})

export const patchCuotaSchema = z
  .object({
    estado: z.enum(estadoCuotaValues, { message: 'Estado de cuota inválido' }).optional(),
    fecha_pago: z.string().nullable().optional(),
    notas: z.string().nullable().optional(),
  })
  .refine(data => Object.keys(data).length > 0, { message: 'Sin campos para actualizar' })

export const addCuotaSchema = z.object({
  monto: z.number().positive('Monto debe ser positivo'),
  fecha_vencimiento: z.string().min(1, 'Fecha de vencimiento es requerida'),
  notas: z.string().nullable().optional(),
})

export type CreateFinanciamientoInput = z.infer<typeof createFinanciamientoSchema>
export type PatchFinanciamientoInput = z.infer<typeof patchFinanciamientoSchema>
export type PatchCuotaInput = z.infer<typeof patchCuotaSchema>
export type AddCuotaInput = z.infer<typeof addCuotaSchema>

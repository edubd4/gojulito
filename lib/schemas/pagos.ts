import { z } from 'zod'
import { ESTADO_PAGO, TIPO_SERVICIO } from '@/lib/constants'

const estadoPagoValues = [
  ESTADO_PAGO.PAGADO,
  ESTADO_PAGO.DEUDA,
  ESTADO_PAGO.PENDIENTE,
] as const

const tipoServicioValues = [
  TIPO_SERVICIO.VISA,
  TIPO_SERVICIO.SEMINARIO,
] as const

export const createPagoSchema = z
  .object({
    cliente_id: z.string().uuid('cliente_id inválido'),
    visa_id: z.string().uuid('visa_id inválido').nullable().optional(),
    tipo: z.enum(tipoServicioValues, 'Tipo es requerido'),
    monto: z.number().positive('Monto debe ser positivo'),
    fecha_pago: z.string().min(1, 'Fecha de pago es requerida'),
    estado: z.enum(estadoPagoValues, 'Estado es requerido'),
    fecha_vencimiento_deuda: z.string().nullable().optional(),
    referencia_grupo: z.string().nullable().optional(),
    notas: z.string().nullable().optional(),
  })
  .refine(
    data => !(data.tipo === 'VISA' && !data.visa_id),
    { message: 'Se requiere visa_id cuando tipo es VISA' }
  )

export const patchPagoSchema = z
  .object({
    estado: z.enum(estadoPagoValues).optional(),
    fecha_pago: z.string().nullable().optional(),
    fecha_vencimiento_deuda: z.string().nullable().optional(),
    monto: z.number().positive('Monto debe ser positivo').optional(),
    notas: z.string().nullable().optional(),
  })
  .refine(data => Object.keys(data).length > 0, { message: 'Sin campos para actualizar' })

export type CreatePagoInput = z.infer<typeof createPagoSchema>
export type PatchPagoInput = z.infer<typeof patchPagoSchema>

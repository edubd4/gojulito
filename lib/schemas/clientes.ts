import { z } from 'zod'
import { ESTADO_CLIENTE, CANAL_INGRESO } from '@/lib/constants'

const estadoClienteValues = [
  ESTADO_CLIENTE.PROSPECTO,
  ESTADO_CLIENTE.ACTIVO,
  ESTADO_CLIENTE.FINALIZADO,
  ESTADO_CLIENTE.INACTIVO,
] as const

const canalIngresoValues = [
  CANAL_INGRESO.SEMINARIO,
  CANAL_INGRESO.WHATSAPP,
  CANAL_INGRESO.INSTAGRAM,
  CANAL_INGRESO.REFERIDO,
  CANAL_INGRESO.CHARLA,
  CANAL_INGRESO.OTRO,
] as const

export const createClienteSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido').transform(v => v.trim()),
  telefono: z.string().min(1, 'Teléfono es requerido').transform(v => v.trim()),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .or(z.literal(''))
    .transform(v => v?.trim() || undefined),
  dni: z.string().optional().transform(v => v?.trim() || undefined),
  fecha_nac: z.string().optional(),
  provincia: z.string().optional().transform(v => v?.trim() || undefined),
  canal: z.enum(canalIngresoValues).optional(),
  estado: z.enum(estadoClienteValues).optional(), // siempre se fuerza a ACTIVO en el server — campo ignorado
  grupo_familiar_id: z.string().uuid('grupo_familiar_id inválido').optional(),
  observaciones: z.string().optional().transform(v => v?.trim() || undefined),
})

export const patchClienteSchema = z.object({
  nombre: z.string().min(1, 'Nombre no puede estar vacío').optional(),
  telefono: z.string().nullable().optional(),
  email: z.string().email('Email inválido').nullable().optional(),
  dni: z.string().nullable().optional(),
  fecha_nac: z.string().nullable().optional(),
  provincia: z.string().nullable().optional(),
  canal: z.enum(canalIngresoValues).optional(),
  estado: z.enum(estadoClienteValues).optional(),
  grupo_familiar_id: z.string().uuid('grupo_familiar_id inválido').nullable().optional(),
  observaciones: z.string().nullable().optional(),
})

export type CreateClienteInput = z.infer<typeof createClienteSchema>
export type PatchClienteInput = z.infer<typeof patchClienteSchema>

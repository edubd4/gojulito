import type { SupabaseClient } from '@supabase/supabase-js'
import type { EstadoVisa } from '@/lib/constants'

export const ESTADOS_TERMINALES: EstadoVisa[] = ['APROBADA', 'RECHAZADA', 'CANCELADA']

/**
 * Aplica la cascada FINALIZADO: si la visa que acaba de cambiar a estado terminal es la última
 * visa activa del cliente, marca al cliente como FINALIZADO e inserta el historial correspondiente.
 *
 * @returns true si el cliente fue marcado FINALIZADO, false si aún tiene visas activas
 */
export async function aplicarCascadaFinalizado(
  supabase: SupabaseClient,
  clienteId: string,
  visaIdExcluir: string
): Promise<boolean> {
  const { data: visasActivas } = await supabase
    .from('visas')
    .select('id')
    .eq('cliente_id', clienteId)
    .neq('id', visaIdExcluir)
    .not('estado', 'in', `(${ESTADOS_TERMINALES.join(',')})`)
    .limit(1)

  if (!visasActivas || visasActivas.length === 0) {
    await supabase
      .from('clientes')
      .update({ estado: 'FINALIZADO', updated_at: new Date().toISOString() })
      .eq('id', clienteId)

    await supabase.from('historial').insert({
      cliente_id: clienteId,
      visa_id: visaIdExcluir,
      tipo: 'CAMBIO_ESTADO',
      descripcion: 'Cliente marcado como FINALIZADO (todas las visas en estado terminal)',
      origen: 'sistema',
      usuario_id: null,
    })

    return true
  }

  return false
}

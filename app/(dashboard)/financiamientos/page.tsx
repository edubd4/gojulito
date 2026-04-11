import { notFound } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import FinanciamientosTable from '@/components/financiamientos/FinanciamientosTable'
import type { FinanciamientoRow } from '@/components/financiamientos/FinanciamientosTable'

export default async function FinanciamientosPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  // Rol del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.rol === 'admin'

  const { data: rawData } = await supabase
    .from('financiamientos')
    .select(`
      id, financiamiento_id, concepto, descripcion, monto_total, estado, created_at,
      clientes ( id, gj_id, nombre ),
      cuotas_financiamiento ( id, estado, monto )
    `)
    .eq('activo', true)
    .order('created_at', { ascending: false })

  const financiamientos: FinanciamientoRow[] = (rawData ?? []).map((row) => {
    const cliente = Array.isArray(row.clientes)
      ? (row.clientes[0] as { id: string; gj_id: string; nombre: string } | undefined)
      : (row.clientes as { id: string; gj_id: string; nombre: string } | null)

    const cuotas = (row.cuotas_financiamiento ?? []) as { id: string; estado: string; monto: number }[]
    const cuotasPagadas = cuotas.filter((c) => c.estado === 'PAGADO')
    const montoCobrado = cuotasPagadas.reduce((sum, c) => sum + c.monto, 0)
    const montoPendiente = cuotas
      .filter((c) => c.estado !== 'PAGADO')
      .reduce((sum, c) => sum + c.monto, 0)

    return {
      id: row.id as string,
      financiamiento_id: row.financiamiento_id as string,
      concepto: row.concepto as 'VUELO' | 'VISA' | 'VIAJE' | 'OTRO',
      monto_total: row.monto_total as number,
      estado: row.estado as 'ACTIVO' | 'COMPLETADO' | 'CANCELADO',
      created_at: row.created_at as string,
      cliente_id: cliente?.id ?? '',
      cliente_nombre: cliente?.nombre ?? '—',
      cliente_codigo: cliente?.gj_id ?? '—',
      cuotas_total: cuotas.length,
      cuotas_pagadas: cuotasPagadas.length,
      monto_cobrado: montoCobrado,
      monto_pendiente: montoPendiente,
    }
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-surface min-h-full font-sans">
      <div className="mb-6">
        <h1 className="font-display text-[28px] font-bold text-gj-text m-0 mb-1">
          Financiamientos
        </h1>
        <p className="text-gj-secondary text-sm m-0">
          {financiamientos.length} financiamiento{financiamientos.length !== 1 ? 's' : ''} activo{financiamientos.length !== 1 ? 's' : ''}
        </p>
      </div>

      <FinanciamientosTable financiamientos={financiamientos} isAdmin={isAdmin} />
    </div>
  )
}

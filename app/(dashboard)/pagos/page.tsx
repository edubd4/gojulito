import { notFound } from 'next/navigation'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import PagosTable, { type PagoRow } from '@/components/pagos/PagosTable'
import type { EstadoPago } from '@/lib/constants'

export default async function PagosPage() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const { data: rawPagos } = await supabase
    .from('pagos')
    .select('id, pago_id, cliente_id, tipo, monto, fecha_pago, estado, fecha_vencimiento_deuda, clientes(nombre, gj_id)')
    .order('fecha_pago', { ascending: false })

  const pagos: PagoRow[] = (rawPagos ?? []).map((row) => {
    const cliente = Array.isArray(row.clientes)
      ? (row.clientes[0] as { nombre: string; gj_id: string } | undefined)
      : (row.clientes as { nombre: string; gj_id: string } | null)

    return {
      id: row.id as string,
      pago_id: row.pago_id as string,
      cliente_id: row.cliente_id as string,
      cliente_nombre: cliente?.nombre ?? '—',
      cliente_gj_id: cliente?.gj_id ?? '—',
      tipo: row.tipo as 'VISA' | 'SEMINARIO',
      monto: row.monto as number,
      fecha_pago: (row.fecha_pago as string | null) ?? null,
      estado: row.estado as EstadoPago,
      fecha_vencimiento_deuda: (row.fecha_vencimiento_deuda as string | null) ?? null,
    }
  })

  return (
    <div
      style={{
        backgroundColor: '#0b1628',
        minHeight: '100%',
        padding: '28px 32px',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#e8e6e0',
            margin: '0 0 4px',
          }}
        >
          Pagos
        </h1>
        <p style={{ color: '#9ba8bb', fontSize: 14, margin: 0 }}>
          {pagos.length} pago{pagos.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      <PagosTable pagos={pagos} />
    </div>
  )
}

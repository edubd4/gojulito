import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { formatPesos } from '@/lib/utils'
import CuotasTable from '@/components/financiamientos/CuotasTable'
import type { CuotaRow } from '@/components/financiamientos/CuotasTable'

const BADGE_CONCEPTO: Record<string, { classes: string; label: string }> = {
  VUELO: { classes: 'text-gj-blue bg-gj-blue/15', label: 'Vuelo' },
  VISA:  { classes: 'text-gj-amber bg-gj-amber/15', label: 'Visa' },
  VIAJE: { classes: 'text-gj-green bg-gj-green/15', label: 'Viaje' },
  OTRO:  { classes: 'text-gj-secondary bg-gj-secondary/15', label: 'Otro' },
}

const BADGE_ESTADO: Record<string, { classes: string; label: string }> = {
  ACTIVO:     { classes: 'text-gj-amber bg-gj-amber/15', label: 'Activo' },
  COMPLETADO: { classes: 'text-gj-green bg-gj-green/15', label: 'Completado' },
  CANCELADO:  { classes: 'text-gj-secondary bg-gj-secondary/15', label: 'Cancelado' },
}

export default async function FinanciamientoDetallePage({
  params,
}: {
  params: { id: string }
}) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) notFound()

  const supabase = await createServiceRoleClient()

  const { data: financiamiento, error } = await supabase
    .from('financiamientos')
    .select('*, clientes(id, codigo, nombre, apellido)')
    .eq('id', params.id)
    .single()

  if (error || !financiamiento) notFound()

  const { data: rawCuotas } = await supabase
    .from('cuotas_financiamiento')
    .select('*')
    .eq('financiamiento_id', params.id)
    .order('numero', { ascending: true })

  const cuotas: CuotaRow[] = (rawCuotas ?? []).map((c) => ({
    id: c.id as string,
    numero: c.numero as number,
    monto: c.monto as number,
    fecha_vencimiento: c.fecha_vencimiento as string,
    fecha_pago: (c.fecha_pago as string | null) ?? null,
    estado: c.estado as 'PENDIENTE' | 'PAGADO' | 'VENCIDO',
    notas: (c.notas as string | null) ?? null,
  }))

  const cliente = Array.isArray(financiamiento.clientes)
    ? (financiamiento.clientes[0] as { id: string; codigo: string; nombre: string; apellido: string } | undefined)
    : (financiamiento.clientes as { id: string; codigo: string; nombre: string; apellido: string } | null)

  const finId = financiamiento.financiamiento_id as string
  const concepto = financiamiento.concepto as string
  const estado = financiamiento.estado as string
  const montoTotal = financiamiento.monto_total as number
  const descripcion = financiamiento.descripcion as string | null

  const conceptoBadge = BADGE_CONCEPTO[concepto] ?? BADGE_CONCEPTO.OTRO
  const estadoBadge = BADGE_ESTADO[estado] ?? BADGE_ESTADO.ACTIVO

  const cuotasPagadas = cuotas.filter((c) => c.estado === 'PAGADO').length
  const montoCobrado = cuotas.filter((c) => c.estado === 'PAGADO').reduce((s, c) => s + c.monto, 0)
  const montoPendiente = cuotas.filter((c) => c.estado !== 'PAGADO').reduce((s, c) => s + c.monto, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gj-surface min-h-full font-sans">
      {/* Back */}
      <div className="mb-6">
        <Link
          href="/financiamientos"
          className="inline-flex items-center gap-1.5 text-gj-secondary no-underline text-[13px] mb-5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver a financiamientos
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3.5 flex-wrap mb-1">
          <h1 className="font-display text-[28px] font-bold text-gj-text m-0">
            {finId}
          </h1>
          <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold font-sans ${estadoBadge.classes}`}>
            {estadoBadge.label}
          </span>
          <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold font-sans ${conceptoBadge.classes}`}>
            {conceptoBadge.label}
          </span>
        </div>

        {cliente && (
          <p className="text-gj-secondary text-sm m-0">
            <Link href={`/clientes/${cliente.id}`} className="text-gj-amber no-underline hover:underline">
              {cliente.nombre} {cliente.apellido}
            </Link>
            <span className="ml-2 text-gj-secondary text-xs">{cliente.codigo}</span>
          </p>
        )}

        {descripcion && (
          <p className="text-gj-text text-sm m-0 mt-2">{descripcion}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="bg-gj-surface-low rounded-xl px-4 py-3.5 border border-white/[6%]">
          <div className="text-[11px] text-gj-secondary uppercase tracking-wide mb-1 font-sans">Monto total</div>
          <div className="text-xl font-bold text-gj-text font-sans">{formatPesos(montoTotal)}</div>
        </div>
        <div className="bg-gj-surface-low rounded-xl px-4 py-3.5 border border-white/[6%]">
          <div className="text-[11px] text-gj-secondary uppercase tracking-wide mb-1 font-sans">Cuotas</div>
          <div className="text-xl font-bold text-gj-text font-sans">
            <span className="text-gj-green">{cuotasPagadas}</span>/{cuotas.length}
          </div>
        </div>
        <div className="bg-gj-surface-low rounded-xl px-4 py-3.5 border border-white/[6%]">
          <div className="text-[11px] text-gj-secondary uppercase tracking-wide mb-1 font-sans">Cobrado</div>
          <div className="text-xl font-bold text-gj-green font-sans">{formatPesos(montoCobrado)}</div>
        </div>
        <div className="bg-gj-surface-low rounded-xl px-4 py-3.5 border border-white/[6%]">
          <div className="text-[11px] text-gj-secondary uppercase tracking-wide mb-1 font-sans">Pendiente</div>
          <div className="text-xl font-bold text-gj-amber font-sans">{formatPesos(montoPendiente)}</div>
        </div>
      </div>

      {/* Cuotas table */}
      <div className="bg-gj-surface-low rounded-xl px-7 py-6 border border-white/[6%]">
        <h2 className="font-sans text-[13px] font-semibold text-gj-secondary uppercase tracking-[0.06em] mb-5">
          Cuotas
        </h2>
        <CuotasTable cuotas={cuotas} financiamientoId={params.id} />
      </div>
    </div>
  )
}

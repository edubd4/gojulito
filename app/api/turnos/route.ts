import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import type { EstadoVisa } from '@/lib/constants'

export async function GET(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const now = new Date()
  const mes = parseInt(searchParams.get('mes') ?? String(now.getMonth() + 1), 10)
  const anio = parseInt(searchParams.get('anio') ?? String(now.getFullYear()), 10)

  if (isNaN(mes) || mes < 1 || mes > 12 || isNaN(anio) || anio < 2020 || anio > 2100) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
  }

  const inicio = `${anio}-${String(mes).padStart(2, '0')}-01`
  const lastDay = new Date(anio, mes, 0).getDate()
  const fin = `${anio}-${String(mes).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const supabase = await createServiceRoleClient()

  const [{ data, error }, { data: rawPagos }, { data: rawSeminarios }] = await Promise.all([
    supabase
      .from('visas')
      .select('visa_id, cliente_id, fecha_turno, estado, clientes(id, nombre, gj_id, telefono)')
      .gte('fecha_turno', inicio)
      .lte('fecha_turno', fin)
      .neq('estado', 'CANCELADA')
      .order('fecha_turno', { ascending: true }),
    supabase
      .from('pagos')
      .select('id, pago_id, cliente_id, monto, estado, fecha_pago, fecha_vencimiento_deuda, clientes(nombre, gj_id)')
      .or(
        `and(fecha_pago.gte.${inicio},fecha_pago.lte.${fin}),and(estado.eq.DEUDA,fecha_vencimiento_deuda.gte.${inicio},fecha_vencimiento_deuda.lte.${fin})`
      )
      .order('fecha_pago', { ascending: true }),
    supabase
      .from('seminarios')
      .select('id, sem_id, fecha, modalidad')
      .eq('activo', true)
      .gte('fecha', inicio)
      .lte('fecha', fin)
      .order('fecha', { ascending: true }),
  ])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const turnos = (data ?? []).map((v) => {
    const cliente = v.clientes as unknown as { id: string; nombre: string; gj_id: string; telefono: string | null } | null
    return {
      visa_id: v.visa_id as string,
      cliente_id: v.cliente_id as string,
      nombre: cliente?.nombre ?? '—',
      gj_id: cliente?.gj_id ?? '—',
      telefono: (cliente?.telefono ?? null) as string | null,
      fecha_turno: v.fecha_turno as string,
      estado: v.estado as EstadoVisa,
    }
  })

  const pagos = (rawPagos ?? []).map((p) => {
    const cliente = p.clientes as unknown as { nombre: string; gj_id: string } | null
    const fechaCalendario = p.estado === 'DEUDA' && p.fecha_vencimiento_deuda
      ? p.fecha_vencimiento_deuda as string
      : p.fecha_pago as string | null
    return {
      id: p.id as string,
      pago_id: p.pago_id as string,
      cliente_id: p.cliente_id as string,
      cliente_nombre: cliente?.nombre ?? '—',
      cliente_gj_id: cliente?.gj_id ?? '—',
      monto: p.monto as number,
      estado: p.estado as 'PAGADO' | 'DEUDA' | 'PENDIENTE',
      fecha: fechaCalendario,
    }
  }).filter((p) => !!p.fecha)

  const seminarios = (rawSeminarios ?? []).map((s) => ({
    id: s.id as string,
    sem_id: s.sem_id as string,
    fecha: s.fecha as string,
    modalidad: s.modalidad as 'PRESENCIAL' | 'VIRTUAL',
  }))

  return NextResponse.json({ turnos, pagos, seminarios })
}

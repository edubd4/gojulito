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

  const { data, error } = await supabase
    .from('visas')
    .select('visa_id, cliente_id, fecha_turno, estado, clientes(id, nombre, gj_id, telefono)')
    .gte('fecha_turno', inicio)
    .lte('fecha_turno', fin)
    .neq('estado', 'CANCELADA')
    .order('fecha_turno', { ascending: true })

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

  return NextResponse.json({ turnos })
}

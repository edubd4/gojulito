import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { id } = params
  const supabase = await createServiceRoleClient()

  const { data: cliente, error: clienteError } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (clienteError || !cliente) {
    return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  }

  let grupoNombre: string | null = null
  if (cliente.grupo_familiar_id) {
    const { data: grupo } = await supabase
      .from('grupos_familiares')
      .select('nombre')
      .eq('id', cliente.grupo_familiar_id)
      .single()
    grupoNombre = grupo?.nombre ?? null
  }

  const { data: visa } = await supabase
    .from('visas')
    .select('*')
    .eq('cliente_id', id)
    .neq('estado', 'CANCELADA')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: pagos } = await supabase
    .from('pagos')
    .select('*')
    .eq('cliente_id', id)
    .order('fecha_pago', { ascending: false })

  const { data: historial } = await supabase
    .from('historial')
    .select('*')
    .eq('cliente_id', id)
    .order('created_at', { ascending: false })

  return NextResponse.json({
    cliente: { ...cliente, grupo_familiar_nombre: grupoNombre },
    visa: visa ?? null,
    pagos: pagos ?? [],
    historial: historial ?? [],
  })
}

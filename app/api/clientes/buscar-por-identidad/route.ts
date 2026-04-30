import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const dni = searchParams.get('dni')
  const pasaporte = searchParams.get('pasaporte')

  if (!dni && !pasaporte) {
    return NextResponse.json({ error: 'Se requiere dni o pasaporte' }, { status: 400 })
  }

  const supabase = createServiceRoleClient()

  let clienteData: { id: string; gj_id: string; nombre: string; estado: string; dni: string | null } | null = null

  if (dni) {
    const { data } = await supabase
      .from('clientes')
      .select('id, gj_id, nombre, estado, dni')
      .eq('dni', dni)
      .neq('estado', 'INACTIVO')
      .limit(1)
      .maybeSingle()
    clienteData = data
  }

  if (!clienteData && pasaporte) {
    const { data: solData } = await supabase
      .from('solicitudes')
      .select('cliente_id')
      .eq('numero_pasaporte', pasaporte)
      .eq('estado', 'ACEPTADA')
      .not('cliente_id', 'is', null)
      .limit(1)
      .maybeSingle()

    if (solData?.cliente_id) {
      const { data } = await supabase
        .from('clientes')
        .select('id, gj_id, nombre, estado, dni')
        .eq('id', solData.cliente_id as string)
        .neq('estado', 'INACTIVO')
        .maybeSingle()
      clienteData = data
    }
  }

  if (!clienteData) {
    return NextResponse.json({ cliente: null })
  }

  const { data: visas } = await supabase
    .from('visas')
    .select('visa_id, estado, paises(codigo_iso, nombre, emoji)')
    .eq('cliente_id', clienteData.id)
    .neq('estado', 'CANCELADA')
    .order('created_at', { ascending: false })

  return NextResponse.json({
    cliente: clienteData,
    visas: visas ?? [],
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createServiceRoleClient()

  const [
    { data: metricas, error: metricasError },
    { data: turnos, error: turnosError },
    { data: deudas, error: deudasError },
  ] = await Promise.all([
    supabase.from('v_metricas').select('*'),
    supabase.from('v_turnos_semana').select('*'),
    supabase.from('v_deudas_proximas').select('*'),
  ])

  if (metricasError ?? turnosError ?? deudasError) {
    const msg = metricasError?.message ?? turnosError?.message ?? deudasError?.message
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  return NextResponse.json({
    metricas: metricas ?? [],
    turnos: turnos ?? [],
    deudas: deudas ?? [],
  })
}

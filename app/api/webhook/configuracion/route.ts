import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createServiceRoleClient()
  const { data, error } = await supabase
    .from('configuracion')
    .select('clave, valor, descripcion')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const configuracion: Record<string, string> = {}
  for (const row of (data || []) as Array<{ clave: string; valor: string }>) {
    configuracion[row.clave] = row.valor
  }

  return NextResponse.json({ configuracion })
}

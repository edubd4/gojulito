import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('paises')
    .select('id, codigo_iso, nombre, emoji, orden')
    .eq('activo', true)
    .order('orden')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ paises: data ?? [] })
}

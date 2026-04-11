import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

interface SolicitudBody {
  nombre: string
  apellido?: string
  email?: string
  telefono?: string
  provincia?: string
  tipo_consulta?: 'VISA' | 'SEMINARIO' | 'OTRO'
  notas?: string
  origen?: string
}

function normalizeTelefono(tel: string): string {
  return tel.replace(/[\s\-().]+/g, '').trim()
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Body inválido' }, { status: 400 })
  }

  const body = raw as SolicitudBody

  // Validar nombre mínimo
  if (!body.nombre?.trim()) {
    return NextResponse.json({ success: false, error: 'El campo nombre es requerido' }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const nombre = body.nombre.trim()
  const apellido = body.apellido?.trim() || null
  const email = body.email?.trim().toLowerCase() || null
  const telefono = body.telefono ? normalizeTelefono(body.telefono) : null
  const provincia = body.provincia?.trim() || null
  const notas = body.notas?.trim() || null
  const origen = body.origen?.trim() || 'google-forms'

  // Detectar duplicados por email o teléfono (case-insensitive)
  if (email || telefono) {
    const conditions: string[] = []
    if (email) conditions.push(`email.ilike.${email}`)
    if (telefono) conditions.push(`telefono.eq.${telefono}`)

    const { data: existentes } = await supabase
      .from('clientes')
      .select('id, gj_id')
      .or(conditions.join(','))
      .limit(1)

    if (existentes && existentes.length > 0) {
      const existente = existentes[0] as { id: string; gj_id: string }
      return NextResponse.json({
        success: false,
        code: 'DUPLICATE',
        cliente_id: existente.id,
        gj_id: existente.gj_id,
      })
    }
  }

  // Generar gj_id
  const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
    prefix: 'GJ',
    table_name: 'clientes',
    id_column: 'gj_id',
  })
  if (idError || !newId) {
    return NextResponse.json({ success: false, error: 'Error generando ID' }, { status: 500 })
  }
  const gj_id = newId as string

  // Mapear tipo_consulta → canal_ingreso
  let canal = 'OTRO'
  if (body.tipo_consulta === 'SEMINARIO') canal = 'SEMINARIO'
  else if (body.tipo_consulta === 'VISA') canal = 'WHATSAPP'

  // Insertar cliente PROSPECTO
  const nombreCompleto = apellido ? `${nombre} ${apellido}` : nombre

  const insert: Record<string, unknown> = {
    gj_id,
    nombre: nombreCompleto,
    canal,
    estado: 'PROSPECTO',
    activo: true,
  }
  if (email) insert.email = email
  if (telefono) insert.telefono = telefono
  if (provincia) insert.provincia = provincia

  const { data: cliente, error: insertError } = await supabase
    .from('clientes')
    .insert(insert)
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
  }

  const clienteId = (cliente as { id: string }).id

  // Historial
  const descripcionHistorial = `Cliente captado via formulario Google Sheets (${origen})${notas ? ' — ' + notas : ''}`

  await supabase.from('historial').insert({
    cliente_id: clienteId,
    tipo: 'NUEVO_CLIENTE',
    descripcion: descripcionHistorial,
    origen: 'sistema',
    usuario_id: null,
  })

  return NextResponse.json({
    success: true,
    cliente_id: clienteId,
    gj_id,
  })
}

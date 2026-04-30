import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { validateApiKey } from '@/lib/auth-m2m'

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const supabase = await createServiceRoleClient()
    const { searchParams } = req.nextUrl
    const estado = searchParams.get('estado')

    let query = supabase
      .from('solicitudes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (estado && estado !== 'TODOS') {
      query = query.eq('estado', estado)
    } else if (!estado) {
      query = query.eq('estado', 'PENDIENTE')
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ solicitudes: data || [] })
  } catch {
    return NextResponse.json({ solicitudes: [], nota: 'Tabla de solicitudes no disponible en este entorno' })
  }
}

// Mapeo de columnas Google Form → campos de la tabla solicitudes, por país
const FIELD_MAPS: Record<string, Record<string, string>> = {
  USA: {
    'Nombre y Apellido Completos': 'nombre',
    'Correo Electrónico de uso Principal': 'email',
    'Numeros de telefono Primario': 'telefono',
    'DNI': 'dni',
    'Tu fecha de nacimiento': 'fecha_nacimiento',
    'Provincia': 'provincia',
    'Municipio': 'municipio',
    'Codigo Postal': 'codigo_postal',
    'Tu nacionalidad': 'nacionalidad',
    'Estado Civil': 'estado_civil',
    'Numero de pasaporte': 'numero_pasaporte',
    'Marca temporal': 'fecha_envio',
  },
  DEU: {
    'Nombre y Apellido Completos': 'nombre',
    'Correo Electrónico de uso Principal': 'email',
    'Numeros de telefono Primario': 'telefono',
    'DNI': 'dni',
    'Tu fecha de nacimiento': 'fecha_nacimiento',
    'Provincia': 'provincia',
    'Municipio': 'municipio',
    'Codigo Postal': 'codigo_postal',
    'Tu nacionalidad': 'nacionalidad',
    'Estado Civil': 'estado_civil',
    'Numero de pasaporte': 'numero_pasaporte',
    'Marca temporal': 'fecha_envio',
  },
  IRL: {
    'Nombre y Apellido Completos': 'nombre',
    'Correo Electrónico de uso Principal': 'email',
    'Numeros de telefono Primario': 'telefono',
    'DNI': 'dni',
    'Tu fecha de nacimiento': 'fecha_nacimiento',
    'Provincia': 'provincia',
    'Municipio': 'municipio',
    'Codigo Postal': 'codigo_postal',
    'Tu nacionalidad': 'nacionalidad',
    'Estado Civil': 'estado_civil',
    'Numero de pasaporte': 'numero_pasaporte',
    'Marca temporal': 'fecha_envio',
  },
  JPN: {
    'Nombre y Apellido Completos': 'nombre',
    'Correo Electrónico de uso Principal': 'email',
    'Numeros de telefono Primario': 'telefono',
    'DNI': 'dni',
    'Tu fecha de nacimiento': 'fecha_nacimiento',
    'Provincia': 'provincia',
    'Municipio': 'municipio',
    'Codigo Postal': 'codigo_postal',
    'Tu nacionalidad': 'nacionalidad',
    'Estado Civil': 'estado_civil',
    'Numero de pasaporte': 'numero_pasaporte',
    'Marca temporal': 'fecha_envio',
  },
}

interface GoogleFormRow {
  [key: string]: unknown
}

function mapRow(row: GoogleFormRow, fieldMap: Record<string, string>): {
  mapped: Record<string, unknown>
  datos_raw: Record<string, unknown>
} {
  const mapped: Record<string, unknown> = {}
  const datos_raw: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(row)) {
    const dbField = fieldMap[key]
    if (dbField) {
      const strVal = typeof value === 'string' ? value.trim() : value
      if (strVal !== undefined && strVal !== null && strVal !== '') {
        mapped[dbField] = strVal
      }
    }
    // Todo va a datos_raw (incluso los mapeados, para tener el original completo)
    datos_raw[key] = value
  }

  return { mapped, datos_raw }
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 })
  }

  // Resolver país desde query param obligatorio
  const { searchParams } = req.nextUrl
  const paisCodigo = searchParams.get('pais')?.toUpperCase()

  if (!paisCodigo) {
    return NextResponse.json(
      { success: false, error: 'Query param ?pais= es requerido (ej: ?pais=USA)' },
      { status: 400 }
    )
  }

  const fieldMap = FIELD_MAPS[paisCodigo]
  if (!fieldMap) {
    return NextResponse.json(
      { success: false, error: `País '${paisCodigo}' no tiene mapeo configurado. Valores válidos: ${Object.keys(FIELD_MAPS).join(', ')}` },
      { status: 400 }
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Body inválido' }, { status: 400 })
  }

  // n8n puede enviar un solo objeto o un array
  const rows: GoogleFormRow[] = Array.isArray(raw) ? raw : [raw as GoogleFormRow]

  if (rows.length === 0) {
    return NextResponse.json({ success: true, created: 0, skipped: 0 })
  }

  const supabase = createServiceRoleClient()

  // Resolver pais_id desde codigo_iso
  const { data: pais } = await supabase
    .from('paises')
    .select('id')
    .eq('codigo_iso', paisCodigo)
    .eq('activo', true)
    .single()

  if (!pais) {
    return NextResponse.json(
      { success: false, error: `País '${paisCodigo}' no encontrado o inactivo en la base de datos` },
      { status: 404 }
    )
  }

  const pais_id = (pais as { id: string }).id

  let created = 0
  let skipped = 0
  const errors: string[] = []

  for (const row of rows) {
    const { mapped, datos_raw } = mapRow(row, fieldMap)

    if (!mapped.nombre) {
      errors.push(`Fila sin nombre — skipped`)
      skipped++
      continue
    }

    // Deduplicación por dni + fecha_envio + pais_id
    // (misma persona puede aplicar a dos países distintos)
    if (mapped.dni && mapped.fecha_envio) {
      const { data: existing } = await supabase
        .from('solicitudes')
        .select('id')
        .eq('dni', mapped.dni as string)
        .eq('fecha_envio', mapped.fecha_envio as string)
        .eq('pais_id', pais_id)
        .limit(1)

      if (existing && existing.length > 0) {
        skipped++
        continue
      }
    }

    // Generar solicitud_id: SOL-0001
    const { data: newId, error: idError } = await supabase.rpc('generate_readable_id', {
      prefix: 'SOL',
      table_name: 'solicitudes',
      id_column: 'solicitud_id',
    })

    if (idError || !newId) {
      errors.push(`Error generando ID para ${mapped.nombre as string}`)
      continue
    }

    const solicitud_id = newId as string

    const insert: Record<string, unknown> = {
      solicitud_id,
      nombre: mapped.nombre,
      email: mapped.email || null,
      telefono: mapped.telefono || null,
      dni: mapped.dni || null,
      fecha_nacimiento: mapped.fecha_nacimiento || null,
      provincia: mapped.provincia || null,
      municipio: mapped.municipio || null,
      codigo_postal: mapped.codigo_postal || null,
      nacionalidad: mapped.nacionalidad || null,
      estado_civil: mapped.estado_civil || null,
      numero_pasaporte: mapped.numero_pasaporte || null,
      fecha_envio: mapped.fecha_envio || null,
      estado: 'PENDIENTE',
      datos_raw,
      pais_id,
      origen_detalle: `google-forms-${paisCodigo}`,
    }

    const { error: insertError } = await supabase
      .from('solicitudes')
      .insert(insert)

    if (insertError) {
      errors.push(`Error insertando ${solicitud_id}: ${insertError.message}`)
      continue
    }

    // Insertar notificación en tiempo real (fire-and-forget)
    void supabase.from('notificaciones').upsert({
      tipo: 'NUEVA_SOLICITUD',
      titulo: `Nueva solicitud — ${mapped.nombre as string}`,
      descripcion: `Formulario recibido${mapped.fecha_envio ? ` el ${mapped.fecha_envio as string}` : ''}`,
      fecha_referencia: mapped.fecha_envio
        ? (mapped.fecha_envio as string).split('T')[0]
        : new Date().toISOString().split('T')[0],
      metadata: { solicitud_id, nombre: mapped.nombre, pais: paisCodigo },
      ref_id: `SOL:${solicitud_id}`,
    }, { onConflict: 'ref_id', ignoreDuplicates: true })

    created++
  }

  return NextResponse.json({
    success: true,
    created,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
  })
}

# GoJulito - Guia de Migracion y Deploy

Instrucciones para deployar GoJulito en un nuevo entorno para un cliente.

---

## Indice

1. [Crear proyecto en Supabase](#1-crear-proyecto-en-supabase)
2. [Crear la base de datos](#2-crear-la-base-de-datos)
3. [Configurar autenticacion](#3-configurar-autenticacion)
4. [Clonar y configurar el repositorio](#4-clonar-y-configurar-el-repositorio)
5. [Deploy en Vercel (o VPS)](#5-deploy)
6. [Dominio personalizado](#6-dominio-personalizado)
7. [Crear usuario admin del cliente](#7-crear-usuario-admin)
8. [Integraciones opcionales (n8n/Telegram)](#8-integraciones)
9. [Referencia de variables de entorno](#9-variables-de-entorno)

---

## 1. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear una cuenta (o loguearse)
2. Clic en **New Project**
3. Completar:
   - **Name**: `gojulito-{nombre-cliente}` (ej: `gojulito-julito`)
   - **Database Password**: generar una segura y guardarla
   - **Region**: elegir la mas cercana al cliente (ej: `South America (Sao Paulo)`)
4. Esperar a que se cree (~2 minutos)
5. Una vez creado, ir a **Settings > API** y copiar:
   - **Project URL** → sera `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → sera `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret key** → sera `SUPABASE_SERVICE_ROLE_KEY`

> IMPORTANTE: El `service_role` key tiene acceso total a la DB, sin RLS. NUNCA exponerlo en el frontend.

---

## 2. Crear la base de datos

Ir a **SQL Editor** en el dashboard de Supabase y ejecutar los siguientes bloques en orden.

### 2.1 Habilitar extensiones

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2.2 Crear enums

```sql
-- Enums del negocio
CREATE TYPE canal_ingreso AS ENUM ('SEMINARIO', 'WHATSAPP', 'INSTAGRAM', 'REFERIDO', 'CHARLA', 'OTRO');
CREATE TYPE estado_cliente AS ENUM ('PROSPECTO', 'ACTIVO', 'FINALIZADO', 'INACTIVO');
CREATE TYPE estado_visa AS ENUM ('EN_PROCESO', 'TURNO_ASIGNADO', 'APROBADA', 'RECHAZADA', 'PAUSADA', 'CANCELADA');
CREATE TYPE estado_pago AS ENUM ('PAGADO', 'DEUDA', 'PENDIENTE', 'FINANCIADO');
CREATE TYPE tipo_servicio AS ENUM ('VISA', 'SEMINARIO');
CREATE TYPE modalidad_sem AS ENUM ('PRESENCIAL', 'VIRTUAL');
CREATE TYPE convirtio_visa AS ENUM ('SI', 'NO', 'EN_SEGUIMIENTO');
CREATE TYPE tipo_evento AS ENUM ('CAMBIO_ESTADO', 'PAGO', 'NOTA', 'TURNO_ASIGNADO', 'ALERTA', 'NUEVO_CLIENTE');
CREATE TYPE rol_usuario AS ENUM ('admin', 'colaborador');
```

### 2.3 Crear funciones auxiliares

```sql
-- Funcion para obtener el rol del usuario autenticado (usada por RLS)
CREATE OR REPLACE FUNCTION get_user_rol()
RETURNS rol_usuario AS $$
  SELECT rol FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Funcion para auto-actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Funcion para generar IDs legibles (GJ-0001, VISA-0001, etc.)
CREATE OR REPLACE FUNCTION generate_readable_id(
  table_name text,
  id_column text,
  prefix text,
  pad_length integer DEFAULT 4
)
RETURNS text AS $$
DECLARE
  next_num integer;
  new_id text;
BEGIN
  EXECUTE format(
    'SELECT COALESCE(MAX(CAST(SUBSTRING(%I FROM %L) AS integer)), 0) + 1
     FROM %I
     WHERE %I ~ %L',
    id_column,
    '\d+$',
    table_name,
    id_column,
    prefix || '-\d+'
  ) INTO next_num;
  new_id := prefix || '-' || LPAD(next_num::text, pad_length, '0');
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;
```

### 2.4 Crear tablas

```sql
-- Profiles (se vincula con auth.users de Supabase)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  nombre text,
  rol rol_usuario DEFAULT 'colaborador',
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE profiles IS 'Usuarios del sistema GoJulito. Admin = cliente principal. Colaborador = asistente.';

-- Grupos Familiares
CREATE TABLE grupos_familiares (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre text NOT NULL,
  notas text,
  created_at timestamptz DEFAULT now()
);

-- Clientes
CREATE TABLE clientes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  gj_id text UNIQUE NOT NULL,
  nombre text NOT NULL,
  telefono text,
  email text,
  dni text,
  fecha_nac date,
  canal canal_ingreso DEFAULT 'OTRO',
  estado estado_cliente DEFAULT 'PROSPECTO',
  observaciones text,
  provincia text,
  grupo_familiar_id uuid REFERENCES grupos_familiares(id),
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE clientes IS 'Un registro por persona. Nunca grupos en una sola fila.';
COMMENT ON COLUMN clientes.gj_id IS 'ID legible. Formato GJ-0001. Secuencial, nunca se reutiliza.';

-- Visas
CREATE TABLE visas (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_id text UNIQUE NOT NULL,
  cliente_id uuid NOT NULL REFERENCES clientes(id),
  ds160 text,
  email_portal text,
  estado estado_visa DEFAULT 'EN_PROCESO',
  orden_atencion integer,
  fecha_turno date,
  fecha_aprobacion date,
  fecha_vencimiento date,
  notas text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE visas IS 'Tramites de visa. email_portal aqui, contrasena en tabla credenciales.';
COMMENT ON COLUMN visas.email_portal IS 'Email del portal consular USCIS. La contrasena va en credenciales (solo admin).';

-- Credenciales (solo admin)
CREATE TABLE credenciales (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_id uuid UNIQUE NOT NULL REFERENCES visas(id),
  password_portal text,
  notas text,
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE credenciales IS 'Solo visible para rol=admin. Contrasenas encriptadas a nivel app.';

-- Pagos
CREATE TABLE pagos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  pago_id text UNIQUE NOT NULL,
  cliente_id uuid NOT NULL REFERENCES clientes(id),
  visa_id uuid REFERENCES visas(id),
  tipo tipo_servicio NOT NULL,
  monto integer DEFAULT 0,
  fecha_pago date,
  estado estado_pago DEFAULT 'PENDIENTE',
  fecha_vencimiento_deuda date,
  referencia_grupo text,
  notas text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE pagos IS 'Un registro por cobro.';

-- Seminarios
CREATE TABLE seminarios (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sem_id text UNIQUE NOT NULL,
  nombre text NOT NULL,
  fecha date,
  modalidad modalidad_sem DEFAULT 'PRESENCIAL',
  precio integer DEFAULT 0,
  notas text,
  activo boolean DEFAULT true,
  capacidad_max integer DEFAULT 50,
  categoria text,
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE seminarios IS 'Edicion del seminario. Los asistentes van en seminario_asistentes.';

-- Seminario Asistentes
CREATE TABLE seminario_asistentes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  seminario_id uuid NOT NULL REFERENCES seminarios(id),
  cliente_id uuid REFERENCES clientes(id),
  nombre text,
  telefono text,
  provincia text,
  modalidad modalidad_sem DEFAULT 'PRESENCIAL',
  estado_pago estado_pago DEFAULT 'PENDIENTE',
  monto integer DEFAULT 0,
  convirtio convirtio_visa DEFAULT 'NO',
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
COMMENT ON TABLE seminario_asistentes IS 'cliente_id nullable: la persona puede no ser cliente aun. Se vincula despues.';
COMMENT ON COLUMN seminario_asistentes.convirtio IS 'La metrica mas importante del negocio: arranco tramite de visa?';

-- Seminario Itinerario
CREATE TABLE seminario_itinerario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminario_id uuid NOT NULL REFERENCES seminarios(id),
  dia integer NOT NULL,
  titulo text NOT NULL,
  descripcion text,
  hora_inicio time,
  hora_fin time,
  created_at timestamptz DEFAULT now()
);

-- Seminario Logistica
CREATE TABLE seminario_logistica (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seminario_id uuid NOT NULL REFERENCES seminarios(id),
  tipo text NOT NULL CHECK (tipo IN ('VUELO', 'TRANSPORTE_LOCAL', 'ALOJAMIENTO', 'OTRO')),
  descripcion text NOT NULL,
  detalle text,
  fecha_hora timestamptz,
  capacidad integer,
  coordinador text,
  estado text DEFAULT 'PROGRAMADO' CHECK (estado IN ('PROGRAMADO', 'CONFIRMADO', 'CANCELADO', 'EN_CURSO')),
  created_at timestamptz DEFAULT now()
);

-- Historial (inmutable: solo INSERT)
CREATE TABLE historial (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id uuid REFERENCES clientes(id),
  visa_id uuid REFERENCES visas(id),
  tipo tipo_evento NOT NULL,
  descripcion text NOT NULL,
  metadata jsonb,
  origen text,
  usuario_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);
COMMENT ON TABLE historial IS 'Log inmutable. Nunca se edita ni borra. Fuente de verdad de que paso y cuando.';
COMMENT ON COLUMN historial.metadata IS 'JSON libre: estado_anterior, estado_nuevo, monto, etc.';
COMMENT ON COLUMN historial.origen IS 'telegram | dashboard | n8n | sistema';

-- Configuracion (key-value store)
CREATE TABLE configuracion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clave text UNIQUE NOT NULL,
  valor text NOT NULL,
  descripcion text,
  updated_at timestamptz DEFAULT now()
);

-- Telegram historial
CREATE TABLE telegram_historial (
  id serial PRIMARY KEY,
  session_id varchar NOT NULL,
  message jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Financiamientos
CREATE TABLE financiamientos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financiamiento_id text UNIQUE NOT NULL,
  cliente_id uuid NOT NULL REFERENCES clientes(id),
  concepto text NOT NULL CHECK (concepto IN ('VUELO', 'VISA', 'VIAJE', 'OTRO')),
  descripcion text,
  monto_total integer NOT NULL CHECK (monto_total > 0),
  estado text DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'COMPLETADO', 'CANCELADO')),
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cuotas de Financiamiento
CREATE TABLE cuotas_financiamiento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financiamiento_id uuid NOT NULL REFERENCES financiamientos(id),
  numero integer NOT NULL,
  monto integer NOT NULL CHECK (monto > 0),
  fecha_vencimiento date NOT NULL,
  fecha_pago date,
  estado text DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PAGADO', 'VENCIDO')),
  notas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 2.5 Crear triggers

```sql
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_clientes_updated_at BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_visas_updated_at BEFORE UPDATE ON visas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_pagos_updated_at BEFORE UPDATE ON pagos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_sem_asistentes_updated_at BEFORE UPDATE ON seminario_asistentes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 2.6 Crear vistas

```sql
-- Clientes activos con estado de visa y deudas
CREATE OR REPLACE VIEW v_clientes_activos AS
SELECT
  c.id, c.gj_id, c.nombre, c.telefono, c.canal,
  c.estado AS estado_cliente,
  v.visa_id, v.estado AS estado_visa, v.fecha_turno, v.ds160,
  count(p.id) FILTER (WHERE p.estado = 'DEUDA') AS deudas_pendientes,
  COALESCE(sum(p.monto) FILTER (WHERE p.estado = 'PAGADO'), 0) AS total_cobrado
FROM clientes c
LEFT JOIN visas v ON v.cliente_id = c.id
LEFT JOIN pagos p ON p.cliente_id = c.id
WHERE c.estado IN ('ACTIVO', 'PROSPECTO')
GROUP BY c.id, c.gj_id, c.nombre, c.telefono, c.canal, c.estado,
         v.visa_id, v.estado, v.fecha_turno, v.ds160;

-- Metricas generales de visas
CREATE OR REPLACE VIEW v_metricas AS
SELECT
  count(*) FILTER (WHERE estado = 'EN_PROCESO') AS en_proceso,
  count(*) FILTER (WHERE estado = 'TURNO_ASIGNADO') AS turno_asignado,
  count(*) FILTER (WHERE estado = 'APROBADA') AS aprobadas,
  count(*) FILTER (WHERE estado = 'RECHAZADA') AS rechazadas,
  count(*) FILTER (WHERE estado = 'PAUSADA') AS pausadas
FROM visas;

-- Deudas con vencimiento en los proximos 30 dias
CREATE OR REPLACE VIEW v_deudas_proximas AS
SELECT
  p.pago_id, p.cliente_id, c.gj_id, c.nombre AS nombre_cliente, c.telefono,
  p.monto, p.fecha_vencimiento_deuda,
  (p.fecha_vencimiento_deuda - CURRENT_DATE) AS dias_restantes
FROM pagos p
JOIN clientes c ON c.id = p.cliente_id
WHERE p.estado = 'DEUDA'
  AND p.fecha_vencimiento_deuda IS NOT NULL
  AND p.fecha_vencimiento_deuda <= (CURRENT_DATE + '30 days'::interval)
ORDER BY p.fecha_vencimiento_deuda;

-- Turnos de visa en los proximos 7 dias
CREATE OR REPLACE VIEW v_turnos_semana AS
SELECT
  v.visa_id, v.cliente_id, c.gj_id, c.nombre AS nombre_cliente, c.telefono,
  v.fecha_turno, v.estado AS estado_visa
FROM visas v
JOIN clientes c ON c.id = v.cliente_id
WHERE v.fecha_turno >= CURRENT_DATE
  AND v.fecha_turno <= (CURRENT_DATE + '7 days'::interval)
ORDER BY v.fecha_turno;
```

### 2.7 Habilitar RLS y crear politicas

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE credenciales ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE seminarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE seminario_asistentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE seminario_itinerario ENABLE ROW LEVEL SECURITY;
ALTER TABLE seminario_logistica ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos_familiares ENABLE ROW LEVEL SECURITY;
ALTER TABLE financiamientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuotas_financiamiento ENABLE ROW LEVEL SECURITY;

-- === PROFILES ===
CREATE POLICY profiles_select ON profiles FOR SELECT USING (
  id = auth.uid() OR get_user_rol() = 'admin'
);
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (
  get_user_rol() = 'admin'
);

-- === CLIENTES ===
CREATE POLICY clientes_select ON clientes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY clientes_insert ON clientes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY clientes_update ON clientes FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY clientes_delete ON clientes FOR DELETE USING (get_user_rol() = 'admin');

-- === VISAS ===
CREATE POLICY visas_select ON visas FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY visas_insert ON visas FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY visas_update ON visas FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY visas_delete ON visas FOR DELETE USING (get_user_rol() = 'admin');

-- === CREDENCIALES (solo admin) ===
CREATE POLICY credenciales_admin_only ON credenciales FOR ALL
  USING (get_user_rol() = 'admin')
  WITH CHECK (get_user_rol() = 'admin');

-- === PAGOS ===
CREATE POLICY pagos_select ON pagos FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY pagos_insert ON pagos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY pagos_update ON pagos FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY pagos_delete ON pagos FOR DELETE USING (get_user_rol() = 'admin');

-- === SEMINARIOS ===
CREATE POLICY seminarios_select ON seminarios FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY seminarios_insert ON seminarios FOR INSERT WITH CHECK (get_user_rol() = 'admin');
CREATE POLICY seminarios_update ON seminarios FOR UPDATE USING (get_user_rol() = 'admin');
CREATE POLICY seminarios_delete ON seminarios FOR DELETE USING (get_user_rol() = 'admin');

-- === SEMINARIO ASISTENTES ===
CREATE POLICY sem_asistentes_select ON seminario_asistentes FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY sem_asistentes_insert ON seminario_asistentes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY sem_asistentes_update ON seminario_asistentes FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY sem_asistentes_delete ON seminario_asistentes FOR DELETE USING (get_user_rol() = 'admin');

-- === SEMINARIO ITINERARIO ===
CREATE POLICY "Authenticated users can read itinerario" ON seminario_itinerario FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert itinerario" ON seminario_itinerario FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update itinerario" ON seminario_itinerario FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete itinerario" ON seminario_itinerario FOR DELETE TO authenticated USING (true);

-- === HISTORIAL (solo lectura + insert) ===
CREATE POLICY historial_select ON historial FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY historial_insert ON historial FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- === CONFIGURACION ===
CREATE POLICY "Usuarios autenticados pueden leer configuracion" ON configuracion FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Solo admin puede modificar configuracion" ON configuracion FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.rol = 'admin')
);

-- === GRUPOS FAMILIARES ===
CREATE POLICY grupos_select ON grupos_familiares FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY grupos_insert ON grupos_familiares FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY grupos_update ON grupos_familiares FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY grupos_delete ON grupos_familiares FOR DELETE USING (get_user_rol() = 'admin');

-- === FINANCIAMIENTOS ===
CREATE POLICY auth_read_financiamientos ON financiamientos FOR SELECT USING (auth.role() = 'authenticated');

-- === CUOTAS FINANCIAMIENTO ===
CREATE POLICY auth_read_cuotas ON cuotas_financiamiento FOR SELECT USING (auth.role() = 'authenticated');
```

### 2.8 Insertar configuracion inicial

```sql
INSERT INTO configuracion (clave, valor, descripcion) VALUES
  ('precio_visa', '0', 'Precio por defecto al crear un pago de tipo VISA (en pesos)'),
  ('precio_seminario', '0', 'Precio por defecto al crear un pago de tipo SEMINARIO (en pesos)');
```

---

## 3. Configurar autenticacion

En el dashboard de Supabase:

1. Ir a **Authentication > Providers**
2. Asegurarse que **Email** este habilitado
3. En **Authentication > URL Configuration**:
   - **Site URL**: poner la URL final del deploy (ej: `https://gojulito.tudominio.com`)
   - **Redirect URLs**: agregar la misma URL

---

## 4. Clonar y configurar el repositorio

### 4.1 Acceso al codigo

El repositorio es privado y propiedad del desarrollador:

```
GitHub: github.com/edubd4/gojulito (privado)
```

El cliente NO necesita acceso al repositorio. El deploy se gestiona desde la cuenta del desarrollador.

Si el cliente quiere su propia copia:
1. Hacer fork privado o crear repo nuevo en la cuenta del cliente
2. Pushear el codigo
3. Configurar el deploy desde ese repo

### 4.2 Variables de entorno

Crear archivo `.env.local` en la raiz del proyecto (o configurar en el servicio de hosting):

```env
# Supabase (obligatorias)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Webhook auth (para integraciones n8n/Telegram)
N8N_API_KEY=una-clave-segura-generada-por-vos
```

> Para generar el `N8N_API_KEY` se puede usar: `openssl rand -hex 32`

---

## 5. Deploy

### Opcion A: Vercel (recomendado para simplicidad)

1. Ir a [vercel.com](https://vercel.com) y loguearse con GitHub
2. Importar el repositorio `gojulito`
3. En **Environment Variables** agregar las 4 variables del paso anterior
4. Framework: **Next.js** (se detecta automaticamente)
5. Deploy

Vercel asigna un dominio automatico tipo `gojulito-xxx.vercel.app`.

### Opcion B: VPS (actual para GoJulito de Julio)

Si ya se tiene un VPS con Node.js:

```bash
# Clonar el repo
git clone git@github.com:edubd4/gojulito.git
cd gojulito

# Instalar dependencias
npm install

# Crear .env.local con las variables
nano .env.local

# Build de produccion
npm run build

# Iniciar (con PM2 recomendado)
pm2 start npm --name "gojulito" -- start
pm2 save
```

---

## 6. Dominio personalizado

### Si el cliente quiere su propio dominio

1. El cliente compra un dominio (ej: `gojulito-juancorrea.com`) en cualquier registrador (Namecheap, GoDaddy, etc.)
2. Configurar DNS:

**Si usa Vercel:**
- En Vercel > Project > Settings > Domains > Add Domain
- Agregar registro CNAME: `gojulito-juancorrea.com` → `cname.vercel-dns.com`
- Vercel genera SSL automaticamente

**Si usa VPS:**
- Apuntar el dominio al IP del VPS (registro A)
- Configurar Nginx como reverse proxy:

```nginx
server {
    server_name gojulito.tudominio.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- Generar SSL con Certbot: `sudo certbot --nginx -d gojulito.tudominio.com`

### Subdominio del desarrollador

Alternativa: usar un subdominio propio del desarrollador:
- `cliente.automatizacionestuc.online`
- Configurar CNAME o A record en el DNS del dominio principal

---

## 7. Crear usuario Admin

Una vez que la DB esta creada y la app deployada:

### 7.1 Crear el usuario en Supabase Auth

En Supabase dashboard: **Authentication > Users > Add User**

- Email: el email del cliente (ej: `julio@gmail.com`)
- Password: una contrasena temporal
- Marcar **Auto Confirm User**

Copiar el **User UID** que aparece (ej: `a1b2c3d4-...`)

### 7.2 Crear el perfil en la tabla profiles

En **SQL Editor**:

```sql
INSERT INTO profiles (id, email, nombre, rol, activo)
VALUES (
  'PEGAR-EL-UUID-DEL-PASO-ANTERIOR',
  'julio@gmail.com',
  'Julio Correa',
  'admin',
  true
);
```

### 7.3 Verificar acceso

1. Ir a la URL del sistema
2. Loguearse con el email y contrasena
3. Verificar que aparece el badge "Admin" en el menu lateral
4. Ir a **Configuracion** y verificar que se ve la seccion de usuarios y precios

> El cliente puede cambiar su contrasena desde Configuracion > Mi Perfil > Cambiar Contrasena.

---

## 8. Integraciones (opcionales)

### n8n + Telegram Bot

Si el cliente quiere un bot de Telegram para consultas rapidas:

1. Crear bot en Telegram via @BotFather → obtener token
2. Instalar n8n en el VPS (o usar n8n cloud)
3. Configurar workflows de n8n que llamen a los endpoints webhook:
   - `POST /api/webhook/clientes` — crear cliente desde bot
   - `POST /api/webhook/visas` — crear visa desde bot
   - `POST /api/webhook/pagos` — registrar pago desde bot
   - `POST /api/webhook/solicitud` — procesar solicitud
   - `POST /api/webhook/resumen` — obtener resumen

4. En cada request de n8n, agregar el header:
   ```
   x-api-key: {valor-de-N8N_API_KEY}
   ```

5. Configurar la URL de Supabase en los workflows de n8n para acceso directo a la DB si es necesario

---

## 9. Variables de entorno (referencia)

| Variable | Donde se usa | Descripcion |
|----------|-------------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + Backend | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend + Backend | Clave publica anonima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo Backend (API routes) | Clave con acceso total, bypass RLS |
| `N8N_API_KEY` | Solo Backend (webhooks) | Clave para autenticar webhooks de n8n/Telegram |

---

## Checklist de migracion

- [ ] Proyecto Supabase creado
- [ ] Extensiones habilitadas (uuid-ossp)
- [ ] Enums creados
- [ ] Funciones auxiliares creadas (get_user_rol, update_updated_at, generate_readable_id)
- [ ] Tablas creadas (16 tablas)
- [ ] Triggers creados (5 triggers)
- [ ] Vistas creadas (4 vistas)
- [ ] RLS habilitado + politicas creadas
- [ ] Configuracion inicial insertada (precios)
- [ ] Auth provider Email habilitado
- [ ] Site URL configurada en Supabase Auth
- [ ] Variables de entorno configuradas en hosting
- [ ] App deployada y accesible
- [ ] Usuario admin creado (Auth + profiles)
- [ ] Login verificado
- [ ] Dominio configurado (opcional)
- [ ] SSL activo
- [ ] n8n/Telegram configurado (opcional)

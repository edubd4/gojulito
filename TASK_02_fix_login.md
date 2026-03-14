# TASK 02 — Fix Login + Vincular GitHub

## Contexto
Leé AGENTS.md. El proyecto Next.js ya está creado localmente.
Hay dos problemas a resolver en este orden.

## Problema 1: Login no funciona
El formulario de login existe pero Supabase rechaza las credenciales.
Causa probable: el cliente de Supabase no está leyendo bien las variables de entorno,
o el método de auth no es el correcto para el nuevo formato de claves de Supabase.

### Qué hacer:
1. Revisá lib/supabase/client.ts y lib/supabase/server.ts
2. Verificá que .env.local tiene las 3 variables correctas:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY (formato nuevo: sb_publishable_...)
   - SUPABASE_SERVICE_ROLE_KEY (formato nuevo: sb_secret_...)
3. Revisá app/(auth)/login/page.tsx — el método debe ser:
   supabase.auth.signInWithPassword({ email, password })
4. Agregá un console.log temporal del error exacto de Supabase para diagnosticar
5. Corregí lo que encuentres y probá que el login funciona

## Problema 2: Vincular con GitHub
El repo https://github.com/edubd4/gojulito existe pero el código local no está subido.

### Qué hacer:
1. Verificá si ya hay un remote configurado: git remote -v
2. Si no hay remote, ejecutá:
   git remote add origin https://github.com/edubd4/gojulito.git
3. Hacé commit de todo el código actual:
   git add .
   git commit -m "feat: base del proyecto Next.js + Supabase + auth"
4. Subí al repo:
   git push -u origin main

## Definition of done
- El login con julio@gojulito.com funciona y redirige al dashboard
- git remote -v muestra el repo de GitHub
- El código está en GitHub (verificar en el navegador)

## NO hacer
- No instalar librerías nuevas
- No tocar páginas del dashboard todavía
- No cambiar el schema de Supabase

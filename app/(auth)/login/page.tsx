'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error('Supabase auth error:', error)
        setError(error.message || 'Email o contraseña incorrectos.')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Error inesperado. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0b1628' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{
          backgroundColor: '#111f38',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0' }}
          >
            GoJulito
          </h1>
          <p style={{ color: '#9ba8bb', fontSize: '0.9rem' }}>
            Panel de gestión operativa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              style={{ color: '#9ba8bb', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif' }}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="julio@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                backgroundColor: '#172645',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#e8e6e0',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              style={{ color: '#9ba8bb', fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif' }}
            >
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                backgroundColor: '#172645',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#e8e6e0',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
          </div>

          {error && (
            <p
              className="text-sm text-center"
              style={{ color: '#e85a5a', fontFamily: 'DM Sans, sans-serif' }}
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={loading}
            style={{
              backgroundColor: '#e8a020',
              color: '#0b1628',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  )
}

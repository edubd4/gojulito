'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
        setError('Email o contraseña incorrectos.')
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
    <div className="min-h-screen bg-gj-bg flex items-center justify-center relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gj-amber/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-72 h-72 rounded-full bg-gj-blue/5 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-gj-card/80 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl px-8 py-10">

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gj-amber/15 border border-gj-amber/30 mb-4">
              <span className="font-display text-gj-amber font-bold text-xl">G</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-gj-text">GoJulito</h1>
            <p className="text-gj-secondary text-sm mt-1.5">Panel de gestión operativa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-gj-secondary text-sm font-medium font-sans">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="julio@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-gj-input border border-white/10 rounded-lg px-4 py-2.5 text-gj-text placeholder:text-gj-secondary/50 text-sm font-sans focus:outline-none focus:border-gj-amber/50 focus:ring-1 focus:ring-gj-amber/20 transition-colors disabled:opacity-60"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-gj-secondary text-sm font-medium font-sans">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full bg-gj-input border border-white/10 rounded-lg px-4 py-2.5 text-gj-text placeholder:text-gj-secondary/50 text-sm font-sans focus:outline-none focus:border-gj-amber/50 focus:ring-1 focus:ring-gj-amber/20 transition-colors disabled:opacity-60"
              />
            </div>

            {error && (
              <p className="text-gj-red text-sm text-center font-sans">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gj-amber text-gj-bg font-semibold rounded-lg px-4 py-2.5 text-sm font-sans hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

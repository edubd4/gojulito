'use client'

import { useState } from 'react'

interface Pais {
  id: string
  codigo_iso: string
  nombre: string
  emoji: string
  activo: boolean
  orden: number
}

interface Props {
  initialData: Pais[]
}

interface NuevoPais {
  codigo_iso: string
  nombre: string
  emoji: string
  orden: string
}

const EMPTY_FORM: NuevoPais = { codigo_iso: '', nombre: '', emoji: '', orden: '100' }

export default function PaisesAdmin({ initialData }: Props) {
  const [paises, setPaises] = useState<Pais[]>(initialData)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<NuevoPais>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function showMsg(type: 'success' | 'error', text: string) {
    setMsg({ type, text })
    setTimeout(() => setMsg(null), 4000)
  }

  async function toggleActivo(pais: Pais) {
    setLoadingId(pais.id)
    try {
      const res = await fetch('/api/paises', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pais.id, activo: !pais.activo }),
      })
      const json = await res.json() as { data?: Pais; error?: string }
      if (!res.ok || json.error) {
        showMsg('error', json.error ?? 'Error al actualizar')
        return
      }
      setPaises((prev) =>
        prev.map((p) => (p.id === pais.id ? { ...p, activo: !pais.activo } : p))
      )
      showMsg('success', `${pais.nombre} ${!pais.activo ? 'activado' : 'desactivado'}`)
    } catch {
      showMsg('error', 'Error de conexión')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.codigo_iso.trim() || !form.nombre.trim()) {
      showMsg('error', 'Código ISO y nombre son obligatorios')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/paises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo_iso: form.codigo_iso.trim().toUpperCase(),
          nombre: form.nombre.trim(),
          emoji: form.emoji.trim(),
          orden: parseInt(form.orden, 10) || 100,
        }),
      })
      const json = await res.json() as { data?: Pais; error?: string }
      if (!res.ok || json.error) {
        showMsg('error', json.error ?? 'Error al agregar')
        return
      }
      if (json.data) {
        setPaises((prev) => [...prev, json.data as Pais].sort((a, b) => a.orden - b.orden))
      }
      setForm(EMPTY_FORM)
      setFormOpen(false)
      showMsg('success', `${form.nombre} agregado correctamente`)
    } catch {
      showMsg('error', 'Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Message banner */}
      {msg && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-lg text-[13px] font-sans border ${
            msg.type === 'success'
              ? 'bg-gj-green/10 border-gj-green/30 text-gj-green'
              : 'bg-gj-red/10 border-gj-red/30 text-gj-red'
          }`}
        >
          {msg.text}
        </div>
      )}

      {/* Table */}
      <div className="bg-gj-surface-low rounded-xl border border-white/[6%] overflow-hidden mb-5">
        {paises.length === 0 ? (
          <div className="px-7 py-12 text-center text-gj-secondary text-sm font-sans">
            Sin países configurados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-sans">
              <thead>
                <tr>
                  {['Emoji', 'Código ISO', 'Nombre', 'Orden', 'Estado', 'Acciones'].map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide border-b border-white/[8%] whitespace-nowrap bg-gj-surface-low"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paises.map((pais) => (
                  <tr
                    key={pais.id}
                    className="border-b border-white/[4%] last:border-0"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <td className="px-4 py-3 text-xl">{pais.emoji || '—'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gj-text font-semibold">
                      {pais.codigo_iso}
                    </td>
                    <td className="px-4 py-3 text-sm text-gj-text">{pais.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gj-secondary">{pais.orden}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          pais.activo
                            ? 'bg-gj-green/15 text-gj-green'
                            : 'bg-gj-red/15 text-gj-red'
                        }`}
                      >
                        {pais.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => void toggleActivo(pais)}
                        disabled={loadingId === pais.id}
                        className={`text-xs font-semibold font-sans px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          pais.activo
                            ? 'bg-gj-red/10 text-gj-red hover:bg-gj-red/20'
                            : 'bg-gj-green/10 text-gj-green hover:bg-gj-green/20'
                        }`}
                      >
                        {loadingId === pais.id
                          ? 'Guardando...'
                          : pais.activo
                          ? 'Desactivar'
                          : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add country section */}
      {!formOpen ? (
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gj-amber/15 text-gj-amber font-sans font-semibold text-sm border-none cursor-pointer hover:bg-gj-amber/25 transition-colors"
        >
          + Agregar país
        </button>
      ) : (
        <div className="bg-gj-surface-low border border-white/[6%] rounded-xl p-5">
          <h2 className="font-sans text-sm font-semibold text-gj-steel mb-4">Nuevo país</h2>
          <form onSubmit={(e) => void handleAdd(e)} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gj-secondary uppercase tracking-wide font-sans">
                  Código ISO *
                </label>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="US"
                  value={form.codigo_iso}
                  onChange={(e) => setForm((f) => ({ ...f, codigo_iso: e.target.value }))}
                  className="bg-gj-input border border-white/[8%] rounded-lg px-3 py-2 text-sm text-gj-text font-sans placeholder-gj-secondary/50 outline-none focus:border-gj-amber/40 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-gj-secondary uppercase tracking-wide font-sans">
                  Nombre *
                </label>
                <input
                  type="text"
                  placeholder="Estados Unidos"
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  className="bg-gj-input border border-white/[8%] rounded-lg px-3 py-2 text-sm text-gj-text font-sans placeholder-gj-secondary/50 outline-none focus:border-gj-amber/40 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gj-secondary uppercase tracking-wide font-sans">
                  Emoji
                </label>
                <input
                  type="text"
                  placeholder="🇺🇸"
                  value={form.emoji}
                  onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                  className="bg-gj-input border border-white/[8%] rounded-lg px-3 py-2 text-sm text-gj-text font-sans placeholder-gj-secondary/50 outline-none focus:border-gj-amber/40 transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-32">
              <label className="text-[11px] font-semibold text-gj-secondary uppercase tracking-wide font-sans">
                Orden
              </label>
              <input
                type="number"
                min={1}
                placeholder="100"
                value={form.orden}
                onChange={(e) => setForm((f) => ({ ...f, orden: e.target.value }))}
                className="bg-gj-input border border-white/[8%] rounded-lg px-3 py-2 text-sm text-gj-text font-sans placeholder-gj-secondary/50 outline-none focus:border-gj-amber/40 transition-colors"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-gj-amber text-gj-surface text-sm font-semibold font-sans border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Guardando...' : 'Agregar'}
              </button>
              <button
                type="button"
                onClick={() => { setFormOpen(false); setForm(EMPTY_FORM) }}
                className="px-4 py-2 rounded-lg bg-transparent border border-white/[12%] text-gj-secondary text-sm font-sans cursor-pointer hover:text-gj-text hover:border-white/20 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

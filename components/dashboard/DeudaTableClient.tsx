'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatPesos, formatFecha } from '@/lib/utils'

export interface DeudaProxima {
  cliente_id: string
  gj_id: string
  nombre_cliente: string
  pago_id: string
  monto: number
  fecha_vencimiento_deuda: string
}

function diasRestantes(fechaStr: string): number {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  const fecha = new Date(fechaStr); fecha.setHours(0, 0, 0, 0)
  return Math.round((fecha.getTime() - hoy.getTime()) / 86_400_000)
}

export default function DeudaTableClient({ deudas }: { deudas: DeudaProxima[] }) {
  const [clientePopup, setClientePopup] = useState<DeudaProxima | null>(null)
  const [deudaPopup, setDeudaPopup] = useState<DeudaProxima | null>(null)

  if (deudas.length === 0) {
    return <p className="text-gj-secondary text-sm mt-5 font-sans">Sin deudas próximas</p>
  }

  return (
    <>
      <table className="w-full border-collapse font-sans mt-3">
        <thead>
          <tr>
            {['Cliente', 'Monto', 'Vence'].map((col) => (
              <th
                key={col}
                className="text-left pr-4 pb-2.5 text-[11px] font-semibold text-gj-secondary uppercase tracking-wide border-b border-white/[7%]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deudas.map((d, i) => {
            const dias = diasRestantes(d.fecha_vencimiento_deuda)
            const urgClassName = dias <= 7 ? 'text-gj-red' : dias <= 15 ? 'text-gj-amber' : 'text-gj-secondary'
            return (
              <tr key={i} className="border-b border-white/[4%]">
                <td
                  className="py-[11px] cursor-pointer"
                  onClick={() => setClientePopup(d)}
                >
                  <div className="text-sm text-gj-text font-medium hover:text-gj-amber">{d.nombre_cliente}</div>
                  <div className="text-[11px] text-gj-secondary">{d.gj_id}</div>
                </td>
                <td
                  className="py-[11px] pr-5 text-sm text-gj-text font-medium whitespace-nowrap cursor-pointer hover:text-gj-amber"
                  onClick={() => setDeudaPopup(d)}
                >
                  {formatPesos(d.monto)}
                </td>
                <td className="py-[11px] whitespace-nowrap">
                  <Link href="/calendario" className="no-underline">
                    <div className={`text-[13px] font-semibold ${urgClassName}`}>
                      {dias === 0 ? 'Hoy' : dias === 1 ? '1 día' : `${dias} días`}
                    </div>
                    <div className="text-[11px] text-gj-secondary">{formatFecha(d.fecha_vencimiento_deuda)}</div>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Popup: Cliente */}
      {clientePopup && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setClientePopup(null)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-surface-low border border-white/[12%] rounded-[14px] p-6 w-[300px] font-sans"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-base font-bold text-gj-text mb-0.5">{clientePopup.nombre_cliente}</div>
                <div className="text-xs text-gj-secondary">{clientePopup.gj_id}</div>
              </div>
              <button
                onClick={() => setClientePopup(null)}
                className="bg-none border-none cursor-pointer text-gj-secondary p-1 leading-none"
                aria-label="Cerrar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <Link
              href={`/clientes/${clientePopup.cliente_id}`}
              className="flex items-center justify-center gap-1.5 w-full py-[9px] bg-gj-blue/[12%] border border-gj-blue/25 rounded-lg text-gj-blue text-[13px] font-semibold no-underline font-sans"
              onClick={() => setClientePopup(null)}
            >
              Ver ficha del cliente
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </>
      )}

      {/* Popup: Deuda */}
      {deudaPopup && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setDeudaPopup(null)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gj-surface-low border border-white/[12%] rounded-[14px] p-6 w-[300px] font-sans"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-base font-bold text-gj-text mb-0.5">Detalle de deuda</div>
                <div className="text-xs text-gj-secondary">{deudaPopup.pago_id}</div>
              </div>
              <button
                onClick={() => setDeudaPopup(null)}
                className="bg-none border-none cursor-pointer text-gj-secondary p-1 leading-none"
                aria-label="Cerrar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-2.5 mb-[18px]">
              <div className="text-[13px] text-gj-text">
                <span className="text-gj-secondary">Monto: </span>
                <span className="font-semibold">{formatPesos(deudaPopup.monto)}</span>
              </div>
              <div className="text-[13px] text-gj-text">
                <span className="text-gj-secondary">Vencimiento: </span>
                {formatFecha(deudaPopup.fecha_vencimiento_deuda)}
              </div>
              <div className="text-[13px] text-gj-text">
                <span className="text-gj-secondary">Cliente: </span>
                {deudaPopup.nombre_cliente}
              </div>
            </div>
            <Link
              href="/pagos"
              className="flex items-center justify-center gap-1.5 w-full py-[9px] bg-gj-blue/[12%] border border-gj-blue/25 rounded-lg text-gj-blue text-[13px] font-semibold no-underline font-sans"
              onClick={() => setDeudaPopup(null)}
            >
              Ver pagos
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </>
      )}
    </>
  )
}

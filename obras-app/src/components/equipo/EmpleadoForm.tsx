'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEmpleado } from '@/actions/members.actions'
import { Loader2, CheckCircle2, Copy, Check, AlertTriangle } from 'lucide-react'

interface Credenciales { email: string; password: string }

export function EmpleadoForm({ cupoLleno }: { cupoLleno: boolean }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [creds, setCreds] = useState<Credenciales | null>(null)
  const [copiado, setCopiado] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = e.currentTarget
    const result = await createEmpleado(new FormData(form))
    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    setCreds(result.data)
    setLoading(false)
    form.reset()
    router.refresh()
  }

  async function copiar(cr: Credenciales) {
    try {
      await navigator.clipboard.writeText(`Email: ${cr.email}\nContraseña: ${cr.password}`)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {}
  }

  const inputClass = "w-full h-10 px-3 bg-[#0A0A0B] border border-[#1E1E20] rounded-md text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
  const labelClass = "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5"

  if (cupoLleno) {
    return (
      <div className="flex items-start gap-2 text-sm text-amber-400/80 bg-amber-500/5 border border-amber-500/15 rounded-md px-3 py-2.5">
        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
        <span>Alcanzaste el tope de empleados de tu plan. Desactivá alguno o cambiá de plan para agregar más.</span>
      </div>
    )
  }

  if (creds) {
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={18} className="text-green-400" />
          <p className="text-sm text-foreground font-medium">Empleado creado</p>
        </div>
        <div className="bg-[#0A0A0B] border border-[#1E1E20] rounded-lg p-4 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
            <p className="text-sm text-foreground font-mono break-all">{creds.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Contraseña temporal</p>
            <p className="text-sm text-amber-400 font-mono">{creds.password}</p>
          </div>
          <button
            onClick={() => copiar(creds)}
            className="w-full flex items-center justify-center gap-2 h-9 bg-[#161618] hover:bg-[#1E1E20] text-sm text-foreground rounded-md transition-colors"
          >
            {copiado ? <><Check size={15} className="text-green-400" /> Copiado</> : <><Copy size={15} /> Copiar credenciales</>}
          </button>
        </div>
        <p className="text-xs text-amber-400/70 mt-3">⚠ La contraseña se muestra una sola vez. Pasásela al empleado.</p>
        <button
          onClick={() => { setCreds(null); setCopiado(false) }}
          className="mt-4 h-9 px-4 bg-[#161618] hover:bg-[#1E1E20] text-sm text-foreground rounded-md transition-colors"
        >
          Agregar otro
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre *</label>
          <input name="nombre" type="text" required placeholder="Ej: María López" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input name="email" type="email" required placeholder="empleado@estudio.com" className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Rol *</label>
        <select name="rol" required defaultValue="miembro" className={inputClass}>
          <option value="miembro">Miembro (arquitecto/ingeniero) — solo obras asignadas</option>
          <option value="admin">Admin — ve y gestiona todo el estudio</option>
        </select>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-10 px-5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Creando…</> : 'Crear empleado'}
      </button>
    </form>
  )
}

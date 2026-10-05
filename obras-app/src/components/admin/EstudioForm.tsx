'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEstudio } from '@/actions/admin.actions'
import { Loader2, CheckCircle2, Copy, Check } from 'lucide-react'
import type { Plan } from '@/types'

interface EstudioFormProps {
  planes: Plan[]
}

interface Credenciales {
  email: string
  password: string
}

export function EstudioForm({ planes }: EstudioFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [creds, setCreds] = useState<Credenciales | null>(null)
  const [copiado, setCopiado] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createEstudio(formData)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
      return
    }
    setCreds(result.data)
    setLoading(false)
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

  if (creds) {
    return (
      <div className="animate-fade-in-up">
        <div className="text-center mb-5">
          <CheckCircle2 size={36} className="text-green-400 mx-auto mb-3" />
          <p className="text-foreground font-medium">Estudio creado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Pasale estas credenciales al owner. Podrá cambiar la contraseña desde su perfil.
          </p>
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

        <p className="text-xs text-amber-400/70 bg-amber-500/5 border border-amber-500/15 rounded-md px-3 py-2 mt-4">
          ⚠ Esta contraseña se muestra una sola vez. Copiala antes de salir de esta pantalla.
        </p>

        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => { setCreds(null); setCopiado(false) }}
            className="h-10 px-4 bg-[#161618] hover:bg-[#1E1E20] text-sm text-foreground rounded-md transition-colors"
          >
            Crear otro
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="h-10 px-4 bg-amber-500 hover:bg-amber-400 text-black text-sm font-medium rounded-md transition-colors"
          >
            Ver estudios
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Nombre del estudio *</label>
        <input name="nombre_estudio" type="text" required placeholder="Ej: Estudio Nohte" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Plan *</label>
        <select name="plan_id" required defaultValue="" className={inputClass}>
          <option value="" disabled>Seleccioná un plan</option>
          {planes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}{p.max_empleados != null ? ` — ${p.max_empleados} empleados` : ' — ilimitado'}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2 border-t border-[#1A1A1C]">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 mt-4">Cuenta del owner</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Nombre *</label>
            <input name="owner_nombre" type="text" required placeholder="Ej: Juan Pérez" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input name="owner_email" type="email" required placeholder="owner@estudio.com" className={inputClass} />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Creando…</> : 'Crear estudio'}
      </button>
    </form>
  )
}

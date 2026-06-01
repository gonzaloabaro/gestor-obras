'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createObra, updateObra } from '@/actions/obras.actions'
import { Loader2 } from 'lucide-react'
import type { Project, ProjectStatus } from '@/types'

const ESTADOS: ProjectStatus[] = ['Pendiente', 'En progreso', 'Finalizada', 'Pausada']

interface ObraFormProps {
  obra?: Project
}

export function ObraForm({ obra }: ObraFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const result = obra
      ? await updateObra(obra.id, formData)
      : await createObra(formData)

    if (result && !result.success) {
      setError(result.error)
      setLoading(false)
    }
  }

  const inputClass = "w-full h-10 px-3 bg-[#0A0A0B] border border-[#1E1E20] rounded-md text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
  const labelClass = "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Nombre de la obra *</label>
          <input
            name="nombre"
            type="text"
            required
            defaultValue={obra?.nombre}
            placeholder="Ej: Residencia García"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cliente *</label>
          <input
            name="cliente"
            type="text"
            required
            defaultValue={obra?.cliente}
            placeholder="Ej: Juan García"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Dirección</label>
        <input
          name="direccion"
          type="text"
          defaultValue={obra?.direccion ?? ''}
          placeholder="Ej: Av. Corrientes 1234, CABA"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>Fecha de inicio</label>
          <input
            name="fecha_inicio"
            type="date"
            defaultValue={obra?.fecha_inicio ?? ''}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Fecha fin estimada</label>
          <input
            name="fecha_fin_estimada"
            type="date"
            defaultValue={obra?.fecha_fin_estimada ?? ''}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select
            name="estado"
            defaultValue={obra?.estado ?? 'Pendiente'}
            className={inputClass}
          >
            {ESTADOS.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Presupuesto (ARS)</label>
        <input
          name="presupuesto"
          type="number"
          min="0"
          step="0.01"
          defaultValue={obra?.presupuesto ?? ''}
          placeholder="0"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          name="descripcion"
          rows={3}
          defaultValue={obra?.descripcion ?? ''}
          placeholder="Descripción general de la obra..."
          className="w-full px-3 py-2.5 bg-[#0A0A0B] border border-[#1E1E20] rounded-md text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
        />
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="h-10 px-6 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium text-sm rounded-md transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {obra ? 'Guardando...' : 'Creando...'}
            </>
          ) : (
            obra ? 'Guardar cambios' : 'Crear obra'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 px-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { createGasto } from '@/actions/gastos.actions'
import { Loader2, Plus } from 'lucide-react'

const CATEGORIAS = [
  'Materiales', 'Mano de obra', 'Electricidad',
  'Pintura', 'Sanitarios', 'Equipamiento',
  'Transporte', 'Honorarios', 'Otros'
]

interface GastoFormProps {
  projectId: string
}

export function GastoForm({ projectId }: GastoFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createGasto(projectId, formData)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
    } else {
      setOpen(false)
      setLoading(false)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  const inputClass = "w-full h-10 px-3 bg-[#0A0A0B] border border-[#1E1E20] rounded-md text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-9 px-4 bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm rounded-md transition-all"
      >
        <Plus size={15} />
        Nuevo gasto
      </button>
    )
  }

  return (
    <div className="bg-[#0F0F10] border border-amber-500/30 rounded-lg p-5 animate-fade-in-up mb-6">
      <p className="text-sm font-medium text-foreground mb-4">Registrar gasto</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Categoría *
            </label>
            <select name="categoria" required className={inputClass}>
              <option value="">Seleccionar...</option>
              {CATEGORIAS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Monto (ARS) *
            </label>
            <input
              name="monto"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="0.00"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Descripción
            </label>
            <input
              name="descripcion"
              type="text"
              placeholder="Detalle del gasto..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Fecha
            </label>
            <input
              name="fecha"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 h-9 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-medium text-sm rounded-md transition-all"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Guardando...
              </>
            ) : (
              'Registrar gasto'
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

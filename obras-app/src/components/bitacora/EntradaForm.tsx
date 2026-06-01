'use client'

import { useState } from 'react'
import { createEntrada } from '@/actions/bitacora.actions'
import { Loader2, Plus } from 'lucide-react'

interface EntradaFormProps {
  projectId: string
}

export function EntradaForm({ projectId }: EntradaFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createEntrada(projectId, formData)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
    } else {
      setOpen(false)
      setLoading(false)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-9 px-4 bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm rounded-md transition-all"
      >
        <Plus size={15} />
        Nueva entrada
      </button>
    )
  }

  return (
    <div className="bg-[#0F0F10] border border-amber-500/30 rounded-lg p-5 animate-fade-in-up">
      <p className="text-sm font-medium text-foreground mb-3">Nueva entrada de bitácora</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          name="comentario"
          rows={3}
          required
          placeholder="Describí el avance, novedad o evento relevante..."
          className="w-full px-3 py-2.5 bg-[#0A0A0B] border border-[#1E1E20] rounded-md text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all resize-none"
          autoFocus
        />
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
              'Guardar entrada'
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

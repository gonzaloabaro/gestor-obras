'use client'

import { useState } from 'react'
import { deleteObra } from '@/actions/obras.actions'
import { Trash2, Loader2 } from 'lucide-react'

interface ObraDeleteDialogProps {
  obraId: string
  obraNombre: string
}

export function ObraDeleteDialog({ obraId, obraNombre }: ObraDeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await deleteObra(obraId)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-9 px-3 text-sm text-muted-foreground hover:text-red-400 hover:bg-red-400/10 border border-[#1E1E20] hover:border-red-400/20 rounded-md transition-all"
      >
        <Trash2 size={14} />
        Eliminar
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative bg-[#0F0F10] border border-[#2E2E30] rounded-lg p-6 w-full max-w-sm animate-fade-in-up">
        <h3 className="font-display text-lg text-foreground mb-2">
          Eliminar obra
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          ¿Estás seguro que querés eliminar{' '}
          <span className="text-foreground font-medium">"{obraNombre}"</span>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 h-10 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-medium text-sm rounded-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Eliminando...
              </>
            ) : (
              'Sí, eliminar'
            )}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 h-10 border border-[#1E1E20] text-sm text-muted-foreground hover:text-foreground rounded-md transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

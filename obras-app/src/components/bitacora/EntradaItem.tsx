'use client'

import { useState } from 'react'
import { deleteEntrada, uploadFoto } from '@/actions/bitacora.actions'
import { formatRelativeDate } from '@/lib/utils'
import type { ProgressEntry } from '@/types'
import { Trash2, Camera, Loader2, X } from 'lucide-react'

interface EntradaItemProps {
  entrada: ProgressEntry
  projectId: string
  fotos: { url: string; nombre: string }[]
}

export function EntradaItem({ entrada, projectId, fotos }: EntradaItemProps) {
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)

  async function handleDelete() {
    if (!confirm('¿Eliminar esta entrada?')) return
    setDeleting(true)
    await deleteEntrada(entrada.id, projectId)
  }

  async function handleFotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('foto', file)
    await uploadFoto(projectId, entrada.id, formData)
    setUploading(false)
  }

  return (
    <>
      <div className="flex gap-4">
        {/* Línea de tiempo */}
        <div className="flex flex-col items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
          <div className="w-px flex-1 bg-[#1E1E20] mt-1.5" />
        </div>

        {/* Contenido */}
        <div className="flex-1 pb-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-xs text-muted-foreground">
              {formatRelativeDate(entrada.fecha)}
              <span className="mx-1.5 text-[#2E2E30]">·</span>
              {new Date(entrada.fecha).toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <div className="flex items-center gap-1 flex-shrink-0">
              <label className={`flex items-center gap-1.5 h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground border border-[#1E1E20] hover:border-[#2E2E30] rounded-md transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Camera size={11} />
                )}
                Foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoUpload}
                  disabled={uploading}
                />
              </label>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center h-7 px-2 text-muted-foreground hover:text-red-400 border border-[#1E1E20] hover:border-red-400/20 rounded-md transition-all"
              >
                {deleting ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Trash2 size={11} />
                )}
              </button>
            </div>
          </div>

          <p className="text-sm text-foreground leading-relaxed mb-3">
            {entrada.comentario}
          </p>

          {/* Fotos */}
          {fotos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {fotos.map((foto, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(foto.url)}
                  className="w-20 h-20 rounded-md overflow-hidden border border-[#1E1E20] hover:border-amber-500/40 transition-all"
                >
                  <img
                    src={foto.url}
                    alt={foto.nombre}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={24} />
          </button>
          <img
            src={lightbox}
            alt="Foto de avance"
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

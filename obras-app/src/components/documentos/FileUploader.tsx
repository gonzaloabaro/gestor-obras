'use client'

import { useState } from 'react'
import { uploadFile } from '@/actions/files.actions'
import { Loader2, Upload } from 'lucide-react'
import type { FileType } from '@/types'

const TIPOS: { value: FileType; label: string }[] = [
  { value: 'plano',    label: 'Plano' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'pdf',      label: 'PDF' },
  { value: 'otro',     label: 'Otro' },
]

interface FileUploaderProps {
  projectId: string
}

export function FileUploader({ projectId }: FileUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await uploadFile(projectId, formData)

    if (!result.success) {
      setError(result.error)
      setLoading(false)
    } else {
      setOpen(false)
      setLoading(false)
      setFileName(null)
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
        <Upload size={15} />
        Subir archivo
      </button>
    )
  }

  return (
    <div className="bg-[#0F0F10] border border-amber-500/30 rounded-lg p-5 animate-fade-in-up mb-6">
      <p className="text-sm font-medium text-foreground mb-4">Subir documento</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Tipo de documento
            </label>
            <select name="tipo" required className={inputClass}>
              {TIPOS.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
              Archivo *
            </label>
            <label className="flex items-center gap-2 w-full h-10 px-3 bg-[#0A0A0B] border border-[#1E1E20] rounded-md text-sm text-muted-foreground cursor-pointer hover:border-amber-500/50 transition-all">
              <Upload size={13} />
              <span className="truncate">{fileName ?? 'Seleccionar archivo...'}</span>
              <input
                type="file"
                name="archivo"
                required
                className="hidden"
                accept=".pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                onChange={e => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
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
                Subiendo...
              </>
            ) : (
              'Subir archivo'
            )}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setFileName(null) }}
            className="h-9 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

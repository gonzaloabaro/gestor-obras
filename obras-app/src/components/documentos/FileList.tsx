'use client'

import { useState } from 'react'
import { deleteFile } from '@/actions/files.actions'
import { formatDate } from '@/lib/utils'
import type { ProjectFile } from '@/types'
import { Trash2, Loader2, FileText, FileImage, File, ExternalLink } from 'lucide-react'

const TIPO_CONFIG: Record<string, { label: string; color: string; icon: typeof FileText }> = {
  plano:    { label: 'Plano',    color: '#7B8FD4', icon: FileText },
  contrato: { label: 'Contrato', color: '#D4A853', icon: FileText },
  pdf:      { label: 'PDF',      color: '#D47B7B', icon: FileText },
  foto:     { label: 'Foto',     color: '#7BD4A0', icon: FileImage },
  otro:     { label: 'Otro',     color: '#8B8B8B', icon: File },
}

interface FileListProps {
  files: ProjectFile[]
  projectId: string
}

export function FileList({ files, projectId }: FileListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Eliminar este archivo?')) return
    setDeletingId(id)
    await deleteFile(id, projectId)
    setDeletingId(null)
  }

  function openFile(url: string) {
    window.open(url, '_blank')
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Sin documentos subidos todavía</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#1E1E20]">
      {files.map(file => {
        const config = TIPO_CONFIG[file.tipo] ?? TIPO_CONFIG.otro
        const Icon = config.icon

        return (
          <div
            key={file.id}
            className="flex items-center justify-between px-5 py-3.5 hover:bg-[#111113] transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: config.color + '15' }}
              >
                <Icon size={14} style={{ color: config.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{file.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mr-1.5"
                    style={{ color: config.color, backgroundColor: config.color + '15' }}
                  >
                    {config.label}
                  </span>
                  {formatDate(file.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-3">
              <button
                onClick={() => openFile(file.url)}
                className="flex items-center h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground border border-[#1E1E20] hover:border-[#2E2E30] rounded-md transition-all gap-1.5"
              >
                <ExternalLink size={11} />
                Abrir
              </button>
              <button
                onClick={() => handleDelete(file.id)}
                disabled={deletingId === file.id}
                className="opacity-0 group-hover:opacity-100 flex items-center h-7 px-2 text-muted-foreground hover:text-red-400 border border-transparent hover:border-red-400/20 rounded-md transition-all"
              >
                {deletingId === file.id ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <Trash2 size={11} />
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

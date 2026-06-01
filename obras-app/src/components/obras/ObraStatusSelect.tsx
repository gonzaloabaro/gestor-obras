'use client'

import { useState } from 'react'
import { updateObraEstado } from '@/actions/obras.actions'
import { STATUS_CONFIG } from '@/lib/utils'
import type { ProjectStatus } from '@/types'
import { ChevronDown, Loader2 } from 'lucide-react'

const ESTADOS: ProjectStatus[] = ['Pendiente', 'En progreso', 'Finalizada', 'Pausada']

interface ObraStatusSelectProps {
  obraId: string
  estadoActual: ProjectStatus
}

export function ObraStatusSelect({ obraId, estadoActual }: ObraStatusSelectProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [estado, setEstado] = useState<ProjectStatus>(estadoActual)

  const config = STATUS_CONFIG[estado]

  async function handleChange(nuevoEstado: ProjectStatus) {
    if (nuevoEstado === estado) {
      setOpen(false)
      return
    }
    setLoading(true)
    setOpen(false)
    const result = await updateObraEstado(obraId, nuevoEstado)
    if (result.success) {
      setEstado(nuevoEstado)
    }
    setLoading(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-2 h-9 px-3 bg-[#0F0F10] border border-[#1E1E20] hover:border-[#2E2E30] rounded-md transition-all"
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin text-muted-foreground" />
        ) : (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: config.color }}
          />
        )}
        <span className="text-xs font-medium" style={{ color: config.color }}>
          {config.label}
        </span>
        <ChevronDown size={12} className="text-muted-foreground" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-10 left-0 z-20 bg-[#0F0F10] border border-[#2E2E30] rounded-md py-1 min-w-[140px] shadow-xl">
            {ESTADOS.map((e) => {
              const c = STATUS_CONFIG[e]
              return (
                <button
                  key={e}
                  onClick={() => handleChange(e)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[#161618] transition-colors text-left"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span style={{ color: c.color }}>{c.label}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { deleteGasto } from '@/actions/gastos.actions'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Expense } from '@/types'
import { Trash2, Loader2 } from 'lucide-react'

const CATEGORIA_COLORS: Record<string, string> = {
  'Materiales':   '#D4A853',
  'Mano de obra': '#7B8FD4',
  'Electricidad': '#F0C040',
  'Pintura':      '#D47B8F',
  'Sanitarios':   '#7BD4C0',
  'Equipamiento': '#A07BD4',
  'Transporte':   '#8FD47B',
  'Honorarios':   '#D4A07B',
  'Otros':        '#8B8B8B',
}

interface GastosTableProps {
  gastos: Expense[]
  projectId: string
}

export function GastosTable({ gastos, projectId }: GastosTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este gasto?')) return
    setDeletingId(id)
    await deleteGasto(id, projectId)
    setDeletingId(null)
  }

  if (gastos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Sin gastos registrados todavía</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#1E1E20]">
      {gastos.map(gasto => (
        <div
          key={gasto.id}
          className="flex items-center justify-between px-5 py-3.5 hover:bg-[#111113] transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: CATEGORIA_COLORS[gasto.categoria] ?? '#8B8B8B' }}
            />
            <div className="min-w-0">
              <p className="text-sm text-foreground truncate">
                {gasto.descripcion || gasto.categoria}
              </p>
              <p className="text-xs text-muted-foreground">
                {gasto.categoria} · {formatDate(gasto.fecha)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            <p className="text-sm font-medium text-foreground">
              {formatCurrency(gasto.monto)}
            </p>
            <button
              onClick={() => handleDelete(gasto.id)}
              disabled={deletingId === gasto.id}
              className="opacity-0 group-hover:opacity-100 flex items-center h-7 px-2 text-muted-foreground hover:text-red-400 border border-transparent hover:border-red-400/20 rounded-md transition-all"
            >
              {deletingId === gasto.id ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Trash2 size={11} />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

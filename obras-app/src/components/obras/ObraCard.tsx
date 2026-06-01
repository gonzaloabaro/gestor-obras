import Link from 'next/link'
import { ObraStatusBadge } from './ObraStatusBadge'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Project } from '@/types'
import { MapPin, User, Calendar, DollarSign } from 'lucide-react'

interface ObraCardProps {
  obra: Project
}

export function ObraCard({ obra }: ObraCardProps) {
  return (
    <Link href={`/obras/${obra.id}`}>
      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-5 hover:border-[#2E2E30] hover:bg-[#111113] transition-all group cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display text-base text-foreground group-hover:text-amber-400 transition-colors leading-tight pr-2">
            {obra.nombre}
          </h3>
          <ObraStatusBadge estado={obra.estado} size="sm" />
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User size={11} className="flex-shrink-0" />
            <span className="truncate">{obra.cliente}</span>
          </div>
          {obra.direccion && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate">{obra.direccion}</span>
            </div>
          )}
          {obra.fecha_fin_estimada && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={11} className="flex-shrink-0" />
              <span>Entrega: {formatDate(obra.fecha_fin_estimada)}</span>
            </div>
          )}
        </div>

        {obra.presupuesto > 0 && (
          <div className="pt-3 border-t border-[#1E1E20] flex items-center gap-2">
            <DollarSign size={11} className="text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">
              Presupuesto:{' '}
              <span className="text-foreground font-medium">
                {formatCurrency(obra.presupuesto)}
              </span>
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

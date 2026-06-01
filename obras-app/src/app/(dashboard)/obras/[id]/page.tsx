import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getObra } from '@/actions/obras.actions'
import { Header } from '@/components/layout/Header'
import { ObraStatusSelect } from '@/components/obras/ObraStatusSelect'
import { ObraDeleteDialog } from '@/components/obras/ObraDeleteDialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Pencil, MapPin, User, Calendar, DollarSign, FileText } from 'lucide-react'

export default async function ObraDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const obra = await getObra(id)

  if (!obra) notFound()

  return (
    <div className="animate-fade-in-up max-w-3xl">
      <Header
        title={obra.nombre}
        subtitle={`Cliente: ${obra.cliente}`}
        actions={
          <div className="flex items-center gap-2">
            <ObraStatusSelect obraId={obra.id} estadoActual={obra.estado} />
            <Link
              href={`/obras/${obra.id}/editar`}
              className="flex items-center gap-2 h-9 px-3 text-sm text-muted-foreground hover:text-foreground border border-[#1E1E20] hover:border-[#2E2E30] rounded-md transition-all"
            >
              <Pencil size={14} />
              Editar
            </Link>
            <ObraDeleteDialog obraId={obra.id} obraNombre={obra.nombre} />
          </div>
        }
      />

      {/* Info general */}
      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg divide-y divide-[#1E1E20] mb-4">
        {obra.direccion && (
          <div className="flex items-center gap-3 px-5 py-3.5">
            <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Dirección</p>
              <p className="text-sm text-foreground">{obra.direccion}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 px-5 py-3.5">
          <User size={14} className="text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Cliente</p>
            <p className="text-sm text-foreground">{obra.cliente}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x divide-[#1E1E20]">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Inicio</p>
              <p className="text-sm text-foreground">{formatDate(obra.fecha_inicio)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3.5">
            <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Entrega estimada</p>
              <p className="text-sm text-foreground">{formatDate(obra.fecha_fin_estimada)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-3.5">
          <DollarSign size={14} className="text-muted-foreground flex-shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Presupuesto</p>
            <p className="text-sm text-foreground">
              {obra.presupuesto > 0 ? formatCurrency(obra.presupuesto) : '—'}
            </p>
          </div>
        </div>
        {obra.descripcion && (
          <div className="flex items-start gap-3 px-5 py-3.5">
            <FileText size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Descripción</p>
              <p className="text-sm text-foreground leading-relaxed">{obra.descripcion}</p>
            </div>
          </div>
        )}
      </div>

      {/* Accesos rápidos a secciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { href: `/obras/${obra.id}/bitacora`, label: 'Bitácora', desc: 'Avances y fotos' },
          { href: `/obras/${obra.id}/gastos`, label: 'Gastos', desc: 'Control financiero' },
          { href: `/obras/${obra.id}/documentos`, label: 'Documentos', desc: 'Planos y contratos' },
        ].map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-[#0F0F10] border border-[#1E1E20] hover:border-[#2E2E30] hover:bg-[#111113] rounded-lg px-5 py-4 transition-all group"
          >
            <p className="text-sm font-medium text-foreground group-hover:text-amber-400 transition-colors mb-0.5">
              {label}
            </p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

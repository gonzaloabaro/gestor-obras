import Link from 'next/link'
import { getObras } from '@/actions/obras.actions'
import { getMiRol } from '@/actions/members.actions'
import { Header } from '@/components/layout/Header'
import { ObraCard } from '@/components/obras/ObraCard'
import { Plus } from 'lucide-react'

export default async function ObrasPage() {
  const obras = await getObras()
  const rol = await getMiRol()
  const canCreate = rol === 'owner' || rol === 'admin'

  return (
    <div className="animate-fade-in-up">
      <Header
        title="Obras"
        subtitle={`${obras.length} proyecto${obras.length !== 1 ? 's' : ''} en total`}
        actions={
          canCreate ? (
            <Link
              href="/obras/nueva"
              className="flex items-center gap-2 h-9 px-4 bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm rounded-md transition-all"
            >
              <Plus size={15} />
              Nueva obra
            </Link>
          ) : undefined
        }
      />

      {obras.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
            <Plus size={20} className="text-amber-400" />
          </div>
          <h3 className="font-display text-xl text-foreground mb-2">
            Sin obras todavía
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            {canCreate
              ? 'Creá tu primer proyecto para empezar a gestionar tus obras.'
              : 'Todavía no tenés obras asignadas.'}
          </p>
          {canCreate && (
            <Link
              href="/obras/nueva"
              className="flex items-center gap-2 h-9 px-4 bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm rounded-md transition-all"
            >
              <Plus size={15} />
              Crear primera obra
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {obras.map((obra, i) => (
            <div
              key={obra.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <ObraCard obra={obra} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

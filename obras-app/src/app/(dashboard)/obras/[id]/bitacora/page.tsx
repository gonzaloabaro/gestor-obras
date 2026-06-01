import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getObra } from '@/actions/obras.actions'
import { getEntradas } from '@/actions/bitacora.actions'
import { Header } from '@/components/layout/Header'
import { EntradaForm } from '@/components/bitacora/EntradaForm'
import { EntradaItem } from '@/components/bitacora/EntradaItem'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'

export default async function BitacoraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const obra = await getObra(id)
  if (!obra) notFound()

  const entradas = await getEntradas(id)

  const supabase = await createClient()
  const { data: fotos } = await supabase
    .from('files')
    .select('url, nombre, project_id')
    .eq('project_id', id)
    .eq('tipo', 'foto')

  return (
    <div className="animate-fade-in-up max-w-3xl">
      <Link
        href={`/obras/${id}`}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={13} />
        Volver a {obra.nombre}
      </Link>

      <Header
        title="Bitácora"
        subtitle={`${entradas.length} entrada${entradas.length !== 1 ? 's' : ''} registrada${entradas.length !== 1 ? 's' : ''}`}
        actions={<EntradaForm projectId={id} />}
      />

      {entradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
            <span className="text-amber-400 text-xl">📋</span>
          </div>
          <h3 className="font-display text-xl text-foreground mb-2">
            Sin entradas todavía
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Registrá el primer avance de la obra usando el botón "Nueva entrada".
          </p>
        </div>
      ) : (
        <div className="mt-2">
          {entradas.map(entrada => {
            const fotosEntrada = (fotos ?? []).filter(f =>
              f.url.includes(entrada.id)
            ).map(f => ({ url: f.url, nombre: f.nombre }))

            return (
              <EntradaItem
                key={entrada.id}
                entrada={entrada}
                projectId={id}
                fotos={fotosEntrada}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

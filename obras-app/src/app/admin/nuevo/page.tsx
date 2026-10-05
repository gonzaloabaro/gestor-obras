import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPlanes } from '@/actions/admin.actions'
import { EstudioForm } from '@/components/admin/EstudioForm'

export default async function NuevoEstudioPage() {
  const planes = await getPlanes()

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
        <ArrowLeft size={15} />
        Volver
      </Link>
      <h1 className="font-display text-2xl text-foreground tracking-tight mb-1">Nuevo estudio</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Se crea el estudio y la cuenta del owner con una contraseña temporal que vas a ver en pantalla para pasarle.
      </p>
      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-6">
        <EstudioForm planes={planes} />
      </div>
    </div>
  )
}

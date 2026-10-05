import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ObraForm } from '@/components/obras/ObraForm'
import { getMiRol, getMiembrosAsignables } from '@/actions/members.actions'

export default async function NuevaObraPage() {
  const rol = await getMiRol()
  if (rol !== 'owner' && rol !== 'admin') redirect('/obras')

  const asignables = await getMiembrosAsignables()

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <Header title="Nueva obra" subtitle="Completá los datos del proyecto" />
      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-6">
        <ObraForm asignables={asignables} asignadosIds={[]} canAssign />
      </div>
    </div>
  )
}

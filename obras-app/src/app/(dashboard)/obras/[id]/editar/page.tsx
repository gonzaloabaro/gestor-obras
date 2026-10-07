import { notFound } from 'next/navigation'
import { getObra, getObraAsignados } from '@/actions/obras.actions'
import { getMiRol, getMiembrosAsignables } from '@/actions/members.actions'
import { Header } from '@/components/layout/Header'
import { ObraForm } from '@/components/obras/ObraForm'

export default async function EditarObraPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const obra = await getObra(id)
  if (!obra) notFound()

  const rol = await getMiRol()
  const canAssign = rol === 'owner' || rol === 'admin'
  const asignables = canAssign ? await getMiembrosAsignables() : []
  const asignadosIds = canAssign ? await getObraAsignados(id) : []

  return (
    <div className="animate-fade-in-up max-w-2xl">
      <Header title="Editar obra" subtitle={obra.nombre} />
      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-6">
        <ObraForm obra={obra} asignables={asignables} asignadosIds={asignadosIds} canAssign={canAssign} canEditNombre={canAssign} />
      </div>
    </div>
  )
}

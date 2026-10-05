import { Header } from '@/components/layout/Header'
import { getEstudioContext, getMiembros } from '@/actions/members.actions'
import { EmpleadoForm } from '@/components/equipo/EmpleadoForm'
import { MiembrosTable } from '@/components/equipo/MiembrosTable'
import { Users } from 'lucide-react'

export default async function EquipoPage() {
  const ctx = await getEstudioContext()

  if (!ctx) {
    return (
      <div className="animate-fade-in-up">
        <Header title="Equipo" subtitle="No pertenecés a ningún estudio." />
      </div>
    )
  }

  const miembros = await getMiembros()
  const canManage = ctx.rol === 'owner' || ctx.rol === 'admin'
  const cupoLleno = ctx.maxEmpleados != null && ctx.empleadosActivos >= ctx.maxEmpleados

  return (
    <div className="animate-fade-in-up max-w-3xl">
      <Header title="Equipo" subtitle={ctx.orgNombre} />

      <div className="flex items-center gap-2 mb-6 text-sm">
        <Users size={15} className="text-amber-400" />
        <span className="text-muted-foreground">
          Plan <span className="text-foreground">{ctx.planNombre ?? '—'}</span> ·{' '}
          <span className="text-foreground">{ctx.empleadosActivos}</span>
          {ctx.maxEmpleados != null ? ` / ${ctx.maxEmpleados}` : ''} empleados
        </span>
      </div>

      {canManage && (
        <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-6 mb-6">
          <p className="text-sm font-medium text-foreground mb-4">Agregar empleado</p>
          <EmpleadoForm cupoLleno={cupoLleno} />
        </div>
      )}

      <MiembrosTable miembros={miembros} canManage={canManage} />
    </div>
  )
}

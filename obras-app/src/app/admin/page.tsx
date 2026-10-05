import Link from 'next/link'
import { getEstudios } from '@/actions/admin.actions'
import { Plus, Building2 } from 'lucide-react'

export default async function AdminPage() {
  const estudios = await getEstudios()

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-foreground tracking-tight">Estudios</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {estudios.length} {estudios.length === 1 ? 'estudio registrado' : 'estudios registrados'}
          </p>
        </div>
        <Link
          href="/admin/nuevo"
          className="flex items-center gap-2 h-10 px-4 bg-amber-500 hover:bg-amber-400 text-black text-sm font-medium rounded-md transition-colors"
        >
          <Plus size={16} />
          Nuevo estudio
        </Link>
      </div>

      {estudios.length === 0 ? (
        <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-12 text-center">
          <Building2 size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Todavía no hay estudios. Creá el primero.</p>
        </div>
      ) : (
        <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E1E20] text-left">
                <th className="px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Estudio</th>
                <th className="px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Plan</th>
                <th className="px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Miembros</th>
                <th className="px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {estudios.map((e) => (
                <tr key={e.id} className="border-b border-[#1A1A1C] last:border-0 hover:bg-[#141416] transition-colors">
                  <td className="px-4 py-3 text-foreground">{e.nombre}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {e.plan?.nombre ?? '—'}
                    {e.plan?.max_empleados != null && (
                      <span className="text-muted-foreground/50"> · {e.plan.max_empleados} empl.</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.miembros}</td>
                  <td className="px-4 py-3">
                    <span className={
                      e.estado === 'activo'
                        ? 'text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }>
                      {e.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

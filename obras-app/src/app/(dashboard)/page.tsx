import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getMiRol } from '@/actions/members.actions'
import { Header } from '@/components/layout/Header'
import { formatCurrency, formatDate, STATUS_CONFIG } from '@/lib/utils'
import type { ProjectStatus } from '@/types'
import { Plus, TrendingUp, Clock, CheckCircle, PauseCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('nombre')
    .eq('id', user!.id)
    .single()

  const rol = await getMiRol()
  const canCreate = rol === 'owner' || rol === 'admin'

  // RLS filtra las obras accesibles (owner/admin: todas del estudio; miembro: asignadas)
  const { data: obras } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: gastos } = await supabase
    .from('expenses')
    .select('monto, project_id, fecha')
    .in('project_id', (obras ?? []).map(o => o.id))

  const totalObras = obras?.length ?? 0
  const obrasActivas = obras?.filter(o => o.estado === 'En progreso').length ?? 0
  const obrasFinalizadas = obras?.filter(o => o.estado === 'Finalizada').length ?? 0
  const obrasPausadas = obras?.filter(o => o.estado === 'Pausada').length ?? 0

  const totalPresupuesto = obras?.reduce((acc, o) => acc + (o.presupuesto ?? 0), 0) ?? 0
  const totalGastado = gastos?.reduce((acc, g) => acc + (g.monto ?? 0), 0) ?? 0

  const obrasRecientes = obras?.slice(0, 5) ?? []

  const gastosRecientes = gastos
    ?.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5) ?? []

  return (
    <div className="animate-fade-in-up">
      <Header
        title={`Hola, ${profile?.nombre ?? 'Arquitecto'}`}
        subtitle="Resumen general de tus proyectos"
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

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total obras', value: totalObras, icon: TrendingUp, color: 'text-amber-400' },
          { label: 'En progreso', value: obrasActivas, icon: Clock, color: 'text-amber-400' },
          { label: 'Finalizadas', value: obrasFinalizadas, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Pausadas', value: obrasPausadas, icon: PauseCircle, color: 'text-orange-400' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div
            key={label}
            className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-4 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
              <Icon size={14} className={color} />
            </div>
            <p className={`font-display text-3xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Presupuesto vs Gasto */}
      {totalObras > 0 && (
        <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-5 mb-6 animate-fade-in-up animate-delay-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Presupuesto global vs. gasto acumulado
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Presupuesto total</p>
              <p className="font-display text-xl text-foreground">{formatCurrency(totalPresupuesto)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Gasto acumulado</p>
              <p className="font-display text-xl text-amber-400">{formatCurrency(totalGastado)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Saldo restante</p>
              <p className={`font-display text-xl ${totalPresupuesto - totalGastado >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(totalPresupuesto - totalGastado)}
              </p>
            </div>
          </div>
          {totalPresupuesto > 0 && (
            <div className="h-1.5 bg-[#1E1E20] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min((totalGastado / totalPresupuesto) * 100, 100)}%`,
                  backgroundColor: totalGastado > totalPresupuesto ? '#f87171' : '#D4A853',
                }}
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {totalPresupuesto > 0
              ? `${Math.round((totalGastado / totalPresupuesto) * 100)}% del presupuesto utilizado`
              : 'Sin presupuesto asignado'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Obras recientes */}
        <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg animate-fade-in-up animate-delay-3">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E20]">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Obras recientes</p>
            <Link href="/obras" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
              Ver todas
            </Link>
          </div>
          {obrasRecientes.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">Sin obras todavía</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1E1E20]">
              {obrasRecientes.map(obra => {
                const config = STATUS_CONFIG[obra.estado as ProjectStatus]
                return (
                  <Link
                    key={obra.id}
                    href={`/obras/${obra.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#111113] transition-colors group"
                  >
                    <div className="min-w-0 mr-3">
                      <p className="text-sm text-foreground group-hover:text-amber-400 transition-colors truncate">
                        {obra.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{obra.cliente}</p>
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                      style={{ color: config.color, backgroundColor: config.bg }}
                    >
                      {config.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Próximas entregas */}
        <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg animate-fade-in-up animate-delay-4">
          <div className="px-5 py-4 border-b border-[#1E1E20]">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Próximas entregas</p>
          </div>
          {(() => {
            const proximas = (obras ?? [])
              .filter(o => o.fecha_fin_estimada && o.estado !== 'Finalizada')
              .sort((a, b) => new Date(a.fecha_fin_estimada!).getTime() - new Date(b.fecha_fin_estimada!).getTime())
              .slice(0, 5)

            if (proximas.length === 0) {
              return (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-muted-foreground">Sin fechas de entrega asignadas</p>
                </div>
              )
            }

            return (
              <div className="divide-y divide-[#1E1E20]">
                {proximas.map(obra => {
                  const dias = Math.ceil(
                    (new Date(obra.fecha_fin_estimada!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  )
                  const urgente = dias <= 7
                  const vencido = dias < 0

                  return (
                    <Link
                      key={obra.id}
                      href={`/obras/${obra.id}`}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-[#111113] transition-colors group"
                    >
                      <div className="min-w-0 mr-3">
                        <p className="text-sm text-foreground group-hover:text-amber-400 transition-colors truncate">
                          {obra.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(obra.fecha_fin_estimada)}</p>
                      </div>
                      <span className={`text-[10px] flex-shrink-0 font-medium ${
                        vencido ? 'text-red-400' : urgente ? 'text-orange-400' : 'text-muted-foreground'
                      }`}>
                        {vencido ? `${Math.abs(dias)}d vencido` : dias === 0 ? 'Hoy' : `${dias}d`}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

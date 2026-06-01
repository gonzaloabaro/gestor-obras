import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getObra } from '@/actions/obras.actions'
import { getGastos } from '@/actions/gastos.actions'
import { Header } from '@/components/layout/Header'
import { GastoForm } from '@/components/gastos/GastoForm'
import { GastosTable } from '@/components/gastos/GastosTable'
import { PresupuestoProgress } from '@/components/gastos/PresupuestoProgress'
import { ArrowLeft } from 'lucide-react'

export default async function GastosPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const obra = await getObra(id)
  if (!obra) notFound()

  const gastos = await getGastos(id)
  const totalGastado = gastos.reduce((acc, g) => acc + g.monto, 0)

  // Gastos por categoría
  const porCategoria = gastos.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] ?? 0) + g.monto
    return acc
  }, {} as Record<string, number>)

  const categoriasOrdenadas = Object.entries(porCategoria)
    .sort((a, b) => b[1] - a[1])

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
        title="Gastos"
        subtitle={`${gastos.length} gasto${gastos.length !== 1 ? 's' : ''} registrado${gastos.length !== 1 ? 's' : ''}`}
        actions={<GastoForm projectId={id} />}
      />

      <PresupuestoProgress
        presupuesto={obra.presupuesto}
        gastado={totalGastado}
      />

      {/* Resumen por categoría */}
      {categoriasOrdenadas.length > 0 && (
        <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-5 mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            Desglose por categoría
          </p>
          <div className="space-y-2.5">
            {categoriasOrdenadas.map(([cat, monto]) => {
              const pct = totalGastado > 0 ? (monto / totalGastado) * 100 : 0
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-foreground">{cat}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(pct)}%
                    </p>
                  </div>
                  <div className="h-1 bg-[#1E1E20] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: '#D4A853',
                        opacity: 0.4 + (pct / 100) * 0.6,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tabla de gastos */}
      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1E1E20] flex items-center justify-between">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Detalle de gastos
          </p>
          {gastos.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Total:{' '}
              <span className="text-amber-400 font-medium">
                {new Intl.NumberFormat('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                  minimumFractionDigits: 0,
                }).format(totalGastado)}
              </span>
            </p>
          )}
        </div>
        <GastosTable gastos={gastos} projectId={id} />
      </div>
    </div>
  )
}

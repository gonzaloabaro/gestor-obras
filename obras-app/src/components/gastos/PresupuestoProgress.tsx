import { formatCurrency } from '@/lib/utils'

interface PresupuestoProgressProps {
  presupuesto: number
  gastado: number
}

export function PresupuestoProgress({ presupuesto, gastado }: PresupuestoProgressProps) {
  const porcentaje = presupuesto > 0 ? Math.min((gastado / presupuesto) * 100, 100) : 0
  const restante = presupuesto - gastado
  const excedido = restante < 0

  return (
    <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-5 mb-6">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
        Control presupuestario
      </p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Presupuesto</p>
          <p className="font-display text-xl text-foreground">
            {presupuesto > 0 ? formatCurrency(presupuesto) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Gastado</p>
          <p className="font-display text-xl text-amber-400">
            {formatCurrency(gastado)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {excedido ? 'Excedido' : 'Disponible'}
          </p>
          <p className={`font-display text-xl ${excedido ? 'text-red-400' : 'text-emerald-400'}`}>
            {excedido ? `+${formatCurrency(Math.abs(restante))}` : formatCurrency(restante)}
          </p>
        </div>
      </div>

      {presupuesto > 0 && (
        <>
          <div className="h-2 bg-[#1E1E20] rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${porcentaje}%`,
                backgroundColor: excedido ? '#f87171' : porcentaje > 80 ? '#f97316' : '#D4A853',
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round(porcentaje)}% del presupuesto utilizado
            {excedido && (
              <span className="text-red-400 ml-2">— Presupuesto excedido</span>
            )}
          </p>
        </>
      )}

      {presupuesto === 0 && (
        <p className="text-xs text-muted-foreground">
          Sin presupuesto asignado.{' '}
          <span className="text-amber-400">Editá la obra para agregar uno.</span>
        </p>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setMiembroEstado, setMiembroRol } from '@/actions/members.actions'
import { Loader2, Crown } from 'lucide-react'
import type { MiembroRow, OrgRole } from '@/types'

const ROL_LABEL: Record<OrgRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  miembro: 'Miembro',
}

export function MiembrosTable({ miembros, canManage }: { miembros: MiembroRow[]; canManage: boolean }) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function cambiarRol(id: string, rol: 'admin' | 'miembro') {
    setBusyId(id); setError(null)
    const r = await setMiembroRol(id, rol)
    if (!r.success) setError(r.error)
    setBusyId(null)
    router.refresh()
  }

  async function cambiarEstado(id: string, estado: 'activo' | 'inactivo') {
    setBusyId(id); setError(null)
    const r = await setMiembroEstado(id, estado)
    if (!r.success) setError(r.error)
    setBusyId(null)
    router.refresh()
  }

  return (
    <div>
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2 mb-3">
          {error}
        </div>
      )}
      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1E1E20] text-left">
              <th className="px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Rol</th>
              <th className="px-4 py-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Estado</th>
              {canManage && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            {miembros.map((m) => {
              const isOwner = m.rol === 'owner'
              const busy = busyId === m.id
              return (
                <tr key={m.id} className="border-b border-[#1A1A1C] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isOwner && <Crown size={13} className="text-amber-400 flex-shrink-0" />}
                      <div>
                        <p className="text-foreground">{m.nombre}</p>
                        <p className="text-xs text-muted-foreground/60">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {canManage && !isOwner ? (
                      <select
                        value={m.rol}
                        disabled={busy}
                        onChange={(e) => cambiarRol(m.id, e.target.value as 'admin' | 'miembro')}
                        className="h-8 px-2 bg-[#0A0A0B] border border-[#1E1E20] rounded-md text-xs text-foreground focus:outline-none focus:border-amber-500/50"
                      >
                        <option value="miembro">Miembro</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="text-muted-foreground">{ROL_LABEL[m.rol]}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={
                      m.estado === 'activo'
                        ? 'text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'text-xs px-2 py-0.5 rounded-full bg-muted-foreground/10 text-muted-foreground border border-muted-foreground/20'
                    }>
                      {m.estado}
                    </span>
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-right">
                      {!isOwner && (
                        busy ? (
                          <Loader2 size={15} className="animate-spin text-muted-foreground inline" />
                        ) : m.estado === 'activo' ? (
                          <button
                            onClick={() => cambiarEstado(m.id, 'inactivo')}
                            className="text-xs text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            Desactivar
                          </button>
                        ) : (
                          <button
                            onClick={() => cambiarEstado(m.id, 'activo')}
                            className="text-xs text-muted-foreground hover:text-green-400 transition-colors"
                          >
                            Activar
                          </button>
                        )
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

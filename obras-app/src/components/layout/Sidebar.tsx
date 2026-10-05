'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/actions/auth.actions'
import {
  Building2,
  LayoutDashboard,
  HardHat,
  Users,
  ShieldCheck,
  LogOut,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrgRole } from '@/types'

interface SidebarProps {
  userName: string
  rol?: OrgRole | null
  isSuperAdmin?: boolean
}

export function Sidebar({ userName, rol = null, isSuperAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const canManageTeam = rol === 'owner' || rol === 'admin'

  const navItems = [
    { href: '/',       label: 'Dashboard', icon: LayoutDashboard },
    { href: '/obras',  label: 'Obras',     icon: HardHat },
    ...(canManageTeam ? [{ href: '/equipo', label: 'Equipo', icon: Users }] : []),
    { href: '/perfil', label: 'Perfil',    icon: User },
  ]

  return (
    <aside className="hidden md:flex flex-col w-56 h-screen bg-[#080809] border-r border-[#1A1A1C] fixed left-0 top-0 z-40">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1A1A1C]">
        <div className="w-7 h-7 rounded-sm bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Building2 size={14} className="text-amber-400" />
        </div>
        <span className="font-display text-base text-foreground/90 tracking-tight">
          ArquiFlow
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/'
            ? pathname === '/'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group',
                isActive
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-muted-foreground hover:bg-[#161618] hover:text-foreground'
              )}
            >
              <Icon
                size={16}
                className={cn(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-amber-400' : 'group-hover:text-foreground'
                )}
              />
              {label}
            </Link>
          )
        })}

        {isSuperAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-[#161618] hover:text-foreground transition-all group mt-2 border-t border-[#1A1A1C] pt-3"
          >
            <ShieldCheck size={16} className="flex-shrink-0" />
            Super Admin
          </Link>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-[#1A1A1C]">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-muted-foreground/60 truncate">{userName}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-[#161618] hover:text-foreground transition-all group"
          >
            <LogOut size={16} className="flex-shrink-0" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, HardHat, Users, ShieldCheck, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrgRole } from '@/types'

interface MobileNavProps {
  rol?: OrgRole | null
  isSuperAdmin?: boolean
}

const GRID_COLS: Record<number, string> = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
}

export function MobileNav({ rol = null, isSuperAdmin = false }: MobileNavProps) {
  const pathname = usePathname()
  const canManageTeam = rol === 'owner' || rol === 'admin'

  const navItems = [
    { href: '/',       label: 'Dashboard', icon: LayoutDashboard },
    { href: '/obras',  label: 'Obras',     icon: HardHat },
    ...(canManageTeam ? [{ href: '/equipo', label: 'Equipo', icon: Users }] : []),
    { href: '/perfil', label: 'Perfil',    icon: User },
    ...(isSuperAdmin ? [{ href: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080809] border-t border-[#1A1A1C]">
      <div className={cn('grid h-16', GRID_COLS[navItems.length] ?? 'grid-cols-4')}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/'
            ? pathname === '/'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-all',
                isActive ? 'text-amber-400' : 'text-muted-foreground'
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

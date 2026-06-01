'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, HardHat, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/',       label: 'Dashboard', icon: LayoutDashboard },
  { href: '/obras',  label: 'Obras',     icon: HardHat },
  { href: '/perfil', label: 'Perfil',    icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080809] border-t border-[#1A1A1C]">
      <div className="grid grid-cols-3 h-16">
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

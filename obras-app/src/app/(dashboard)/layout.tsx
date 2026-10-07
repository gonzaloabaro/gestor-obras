import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import type { OrgRole } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('nombre, email, platform_role')
    .eq('id', user.id)
    .single()

  const { data: membership } = await supabase
    .from('organization_members')
    .select('rol')
    .eq('user_id', user.id)
    .eq('estado', 'activo')
    .limit(1)
    .maybeSingle()

  const userName = profile?.nombre ?? user.email ?? 'Usuario'
  const rol = (membership?.rol as OrgRole | undefined) ?? null
  const isSuperAdmin = profile?.platform_role === 'super_admin'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userName={userName} rol={rol} isSuperAdmin={isSuperAdmin} />
      <main className="md:ml-56 min-h-screen">
        <div className="px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      <MobileNav rol={rol} isSuperAdmin={isSuperAdmin} />
    </div>
  )
}

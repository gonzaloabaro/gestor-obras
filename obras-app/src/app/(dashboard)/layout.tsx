import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'

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
    .select('nombre, email')
    .eq('id', user.id)
    .single()

  const userName = profile?.nombre ?? user.email ?? 'Usuario'

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userName={userName} />
      <main className="md:ml-56 min-h-screen">
        <div className="px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}

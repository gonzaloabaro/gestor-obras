import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth.actions'
import { ShieldCheck, LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('platform_role, nombre')
    .eq('id', user.id)
    .single()

  if (profile?.platform_role !== 'super_admin') redirect('/')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-[#1A1A1C] bg-[#080809]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-sm bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <ShieldCheck size={14} className="text-amber-400" />
            </div>
            <span className="font-display text-base text-foreground/90 tracking-tight">
              ArquiFlow <span className="text-muted-foreground/60">· Super Admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground/60 hidden sm:block">
              {profile?.nombre ?? user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={15} />
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">{children}</main>
    </div>
  )
}

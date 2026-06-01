import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth.actions'
import { Header } from '@/components/layout/Header'
import { LogOut } from 'lucide-react'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="animate-fade-in-up max-w-lg">
      <Header title="Perfil" subtitle="Tu información de cuenta" />

      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg divide-y divide-[#1E1E20]">
        <div className="px-5 py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nombre</p>
          <p className="text-sm text-foreground">{profile?.nombre ?? '—'}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
          <p className="text-sm text-foreground">{profile?.email ?? user.email}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Miembro desde</p>
          <p className="text-sm text-foreground">
            {new Date(user.created_at).toLocaleDateString('es-AR', {
              day: '2-digit', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
      </div>

      <form action={signOut} className="mt-4">
        <button
          type="submit"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors"
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </form>
    </div>
  )
}

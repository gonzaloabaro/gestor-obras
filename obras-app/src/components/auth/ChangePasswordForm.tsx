'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Eye, EyeOff, Check } from 'lucide-react'

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDone(false)

    const form = e.currentTarget
    const formData = new FormData(form)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      setLoading(false)
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('No se pudo actualizar la contraseña. Intentá de nuevo.')
      setLoading(false)
      return
    }

    form.reset()
    setDone(true)
    setLoading(false)
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Nueva contraseña
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            className="w-full h-10 px-3 pr-10 bg-[#0F0F10] border border-[#1E1E20] rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Confirmar contraseña
        </label>
        <div className="relative">
          <input
            name="confirm"
            type={showConfirm ? 'text' : 'password'}
            required
            autoComplete="new-password"
            placeholder="Repetí la contraseña"
            className="w-full h-10 px-3 pr-10 bg-[#0F0F10] border border-[#1E1E20] rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {done && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-md px-3 py-2">
          <Check size={14} />
          Contraseña actualizada.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-10 px-5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium text-sm rounded-md transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Guardando...
          </>
        ) : (
          'Cambiar contraseña'
        )}
      </button>
    </form>
  )
}

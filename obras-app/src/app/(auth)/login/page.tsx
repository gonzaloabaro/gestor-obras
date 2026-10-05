'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/actions/auth.actions'
import { Building2, Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signIn(formData)

    if (result && !result.success) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--amber) 1px, transparent 1px),
            linear-gradient(90deg, var(--amber) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-sm bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Building2 size={18} className="text-amber-400" />
          </div>
          <span className="font-display text-lg text-foreground/90 tracking-tight">
            ArquiFlow
          </span>
        </div>

        <h1 className="font-display text-3xl text-foreground mb-1">
          Bienvenido
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Ingresá a tu espacio de gestión de proyectos
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="w-full h-10 px-3 bg-[#0F0F10] border border-[#1E1E20] rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
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

          {error && (
            <div className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium text-sm rounded-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-amber-400 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  )
}

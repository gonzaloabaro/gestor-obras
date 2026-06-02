import { Building2 } from 'lucide-react'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
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
        <ResetPasswordForm />
      </div>
    </div>
  )
}

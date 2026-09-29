import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase con service_role. BYPASSEA RLS.
 * Usar SOLO en Server Actions / código de servidor.
 * Nunca importar desde un componente cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

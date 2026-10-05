'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResult, Plan, EstudioResumen } from '@/types'

/** Devuelve el user autenticado solo si es super_admin; si no, null. */
async function requireSuperAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('users')
    .select('platform_role')
    .eq('id', user.id)
    .single()
  return data?.platform_role === 'super_admin' ? user : null
}

export async function getPlanes(): Promise<Plan[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('plans')
    .select('*')
    .eq('activo', true)
    .order('max_empleados', { ascending: true, nullsFirst: false })
  return data ?? []
}

export async function getEstudios(): Promise<EstudioResumen[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('organizations')
    .select('id, nombre, estado, created_at, plan:plans(nombre, max_empleados), organization_members(count)')
    .order('created_at', { ascending: false })

  if (!data) return []

  return data.map((o: any) => ({
    id: o.id,
    nombre: o.nombre,
    estado: o.estado,
    created_at: o.created_at,
    plan: o.plan ?? null,
    miembros: o.organization_members?.[0]?.count ?? 0,
  }))
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Contraseña temporal legible (sin caracteres ambiguos). */
function generarPassword(len = 12): string {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(len))
  let out = ''
  for (let i = 0; i < len; i++) out += abc[bytes[i] % abc.length]
  return out
}

export async function createEstudio(
  formData: FormData
): Promise<ActionResult<{ email: string; password: string }>> {
  const superAdmin = await requireSuperAdmin()
  if (!superAdmin) return { success: false, error: 'No autorizado.' }

  const nombreEstudio = (formData.get('nombre_estudio') as string | null)?.trim()
  const planId = formData.get('plan_id') as string | null
  const ownerNombre = (formData.get('owner_nombre') as string | null)?.trim()
  const ownerEmail = (formData.get('owner_email') as string | null)?.trim().toLowerCase()

  if (!nombreEstudio || !planId || !ownerNombre || !ownerEmail) {
    return { success: false, error: 'Todos los campos son requeridos.' }
  }

  const admin = createAdminClient()

  // 1) Crear la cuenta del owner (auth) con contraseña temporal, ya confirmada.
  const password = generarPassword()
  const { data: created, error: userErr } = await admin.auth.admin.createUser({
    email: ownerEmail,
    password,
    email_confirm: true,
    user_metadata: { nombre: ownerNombre },
  })

  if (userErr || !created?.user) {
    const msg = userErr?.message?.toLowerCase().includes('already')
      ? 'Ese email ya está registrado.'
      : 'No se pudo crear el usuario owner.'
    return { success: false, error: msg }
  }
  const ownerId = created.user.id

  // 2) Crear el estudio
  const { data: org, error: orgErr } = await admin
    .from('organizations')
    .insert({ nombre: nombreEstudio, slug: slugify(nombreEstudio), plan_id: planId })
    .select('id')
    .single()

  if (orgErr || !org) {
    await admin.auth.admin.deleteUser(ownerId) // rollback
    const msg = orgErr?.message?.toLowerCase().includes('duplicate')
      ? 'Ya existe un estudio con ese nombre.'
      : 'No se pudo crear el estudio.'
    return { success: false, error: msg }
  }

  // 3) Membership owner
  const { error: memErr } = await admin
    .from('organization_members')
    .insert({ org_id: org.id, user_id: ownerId, rol: 'owner', estado: 'activo' })

  if (memErr) {
    await admin.from('organizations').delete().eq('id', org.id) // rollback
    await admin.auth.admin.deleteUser(ownerId)
    return { success: false, error: 'No se pudo asignar el owner al estudio.' }
  }

  revalidatePath('/admin')
  return { success: true, data: { email: ownerEmail, password } }
}

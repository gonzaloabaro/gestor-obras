'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionResult, OrgRole, EstudioContext, MiembroRow } from '@/types'

/** Membership activo del usuario actual (asumimos un estudio por usuario). */
async function getMembership() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('organization_members')
    .select('org_id, rol')
    .eq('user_id', user.id)
    .eq('estado', 'activo')
    .limit(1)
    .maybeSingle()
  if (!data) return null
  return { userId: user.id, orgId: data.org_id as string, rol: data.rol as OrgRole }
}

function generarPassword(len = 12): string {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(len))
  let out = ''
  for (let i = 0; i < len; i++) out += abc[bytes[i] % abc.length]
  return out
}

export async function getEstudioContext(): Promise<EstudioContext | null> {
  const m = await getMembership()
  if (!m) return null
  const supabase = await createClient()

  const { data: org } = await supabase
    .from('organizations')
    .select('nombre, plan:plans(nombre, max_empleados)')
    .eq('id', m.orgId)
    .single()

  const { count } = await supabase
    .from('organization_members')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', m.orgId)
    .eq('estado', 'activo')
    .in('rol', ['admin', 'miembro'])

  const plan = (org as any)?.plan ?? null

  return {
    orgId: m.orgId,
    orgNombre: (org as any)?.nombre ?? '',
    rol: m.rol,
    planNombre: plan?.nombre ?? null,
    maxEmpleados: plan?.max_empleados ?? null,
    empleadosActivos: count ?? 0,
  }
}

export async function getMiembros(): Promise<MiembroRow[]> {
  const m = await getMembership()
  if (!m) return []
  const supabase = await createClient()

  const { data } = await supabase
    .from('organization_members')
    .select('id, rol, estado, created_at, user:users(id, nombre, email)')
    .eq('org_id', m.orgId)
    .order('created_at', { ascending: true })

  if (!data) return []

  return data.map((r: any) => ({
    id: r.id,
    userId: r.user?.id ?? '',
    nombre: r.user?.nombre ?? '',
    email: r.user?.email ?? '',
    rol: r.rol,
    estado: r.estado,
    created_at: r.created_at,
  }))
}

export async function createEmpleado(
  formData: FormData
): Promise<ActionResult<{ email: string; password: string }>> {
  const m = await getMembership()
  if (!m || (m.rol !== 'owner' && m.rol !== 'admin')) {
    return { success: false, error: 'No autorizado.' }
  }

  const nombre = (formData.get('nombre') as string | null)?.trim()
  const email = (formData.get('email') as string | null)?.trim().toLowerCase()
  const rol = formData.get('rol') as OrgRole | null

  if (!nombre || !email || !rol) {
    return { success: false, error: 'Todos los campos son requeridos.' }
  }
  if (rol !== 'admin' && rol !== 'miembro') {
    return { success: false, error: 'Rol inválido.' }
  }

  // Validación de cupo del plan (sin contar owner)
  const ctx = await getEstudioContext()
  if (ctx && ctx.maxEmpleados != null && ctx.empleadosActivos >= ctx.maxEmpleados) {
    return {
      success: false,
      error: `Alcanzaste el tope de tu plan (${ctx.maxEmpleados} empleados). Desactivá alguno o cambiá de plan.`,
    }
  }

  const admin = createAdminClient()
  const password = generarPassword()

  const { data: created, error: userErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre },
  })
  if (userErr || !created?.user) {
    const msg = userErr?.message?.toLowerCase().includes('already')
      ? 'Ese email ya está registrado.'
      : 'No se pudo crear el empleado.'
    return { success: false, error: msg }
  }

  const { error: memErr } = await admin
    .from('organization_members')
    .insert({ org_id: m.orgId, user_id: created.user.id, rol, estado: 'activo' })

  if (memErr) {
    await admin.auth.admin.deleteUser(created.user.id) // rollback
    return { success: false, error: 'No se pudo asignar el empleado al estudio.' }
  }

  revalidatePath('/equipo')
  return { success: true, data: { email, password } }
}

export async function setMiembroEstado(
  memberId: string,
  estado: 'activo' | 'inactivo'
): Promise<ActionResult> {
  const m = await getMembership()
  if (!m || (m.rol !== 'owner' && m.rol !== 'admin')) {
    return { success: false, error: 'No autorizado.' }
  }

  // Si se reactiva, validar cupo
  if (estado === 'activo') {
    const ctx = await getEstudioContext()
    if (ctx && ctx.maxEmpleados != null && ctx.empleadosActivos >= ctx.maxEmpleados) {
      return { success: false, error: `Alcanzaste el tope de tu plan (${ctx.maxEmpleados} empleados).` }
    }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('organization_members')
    .update({ estado })
    .eq('id', memberId)
    .eq('org_id', m.orgId)
    .neq('rol', 'owner') // nunca tocar al owner

  if (error) return { success: false, error: 'No se pudo actualizar el estado.' }
  revalidatePath('/equipo')
  return { success: true, data: undefined }
}

export async function setMiembroRol(
  memberId: string,
  rol: 'admin' | 'miembro'
): Promise<ActionResult> {
  const m = await getMembership()
  if (!m || (m.rol !== 'owner' && m.rol !== 'admin')) {
    return { success: false, error: 'No autorizado.' }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('organization_members')
    .update({ rol })
    .eq('id', memberId)
    .eq('org_id', m.orgId)
    .neq('rol', 'owner')

  if (error) return { success: false, error: 'No se pudo actualizar el rol.' }
  revalidatePath('/equipo')
  return { success: true, data: undefined }
}

export async function getMiRol(): Promise<OrgRole | null> {
  const m = await getMembership()
  return m?.rol ?? null
}

export async function getMiembrosAsignables(): Promise<MiembroRow[]> {
  const m = await getMembership()
  if (!m) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('organization_members')
    .select('id, rol, estado, created_at, user:users(id, nombre, email)')
    .eq('org_id', m.orgId)
    .eq('estado', 'activo')
    .eq('rol', 'miembro')
    .order('created_at', { ascending: true })
  if (!data) return []
  return data.map((r: any) => ({
    id: r.id,
    userId: r.user?.id ?? '',
    nombre: r.user?.nombre ?? '',
    email: r.user?.email ?? '',
    rol: r.rol,
    estado: r.estado,
    created_at: r.created_at,
  }))
}

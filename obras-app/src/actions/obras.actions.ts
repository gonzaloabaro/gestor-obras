'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, Project, ProjectStatus, OrgRole } from '@/types'

type SB = Awaited<ReturnType<typeof createClient>>

// Usa el MISMO cliente del request (evita doble refresh de token / pérdida de sesión).
async function getMembership(supabase: SB) {
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

// RLS filtra: owner/admin ven todas las obras del estudio; miembro solo las asignadas.
export async function getObras(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return []
  return data ?? []
}

export async function getObra(id: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getObraAsignados(projectId: string): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('project_members')
    .select('user_id')
    .eq('project_id', projectId)
  return (data ?? []).map((r: any) => r.user_id as string)
}

export async function createObra(formData: FormData): Promise<ActionResult<Project>> {
  const supabase = await createClient()
  const m = await getMembership(supabase)
  if (!m || (m.rol !== 'owner' && m.rol !== 'admin')) {
    return { success: false, error: 'No autorizado para crear obras.' }
  }

  const nombre = formData.get('nombre') as string
  const cliente = formData.get('cliente') as string
  const direccion = formData.get('direccion') as string
  const fecha_inicio = formData.get('fecha_inicio') as string
  const fecha_fin_estimada = formData.get('fecha_fin_estimada') as string
  const estado = formData.get('estado') as ProjectStatus
  const presupuesto = parseFloat(formData.get('presupuesto') as string) || 0
  const descripcion = formData.get('descripcion') as string

  if (!nombre || !cliente) {
    return { success: false, error: 'Nombre y cliente son requeridos.' }
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      org_id: m.orgId,
      user_id: m.userId,
      nombre,
      cliente,
      direccion: direccion || null,
      fecha_inicio: fecha_inicio || null,
      fecha_fin_estimada: fecha_fin_estimada || null,
      estado: estado || 'Pendiente',
      presupuesto,
      descripcion: descripcion || null,
    })
    .select()
    .single()

  if (error || !data) return { success: false, error: 'Error al crear la obra.' }

  const asignados = formData.getAll('asignados').map(String).filter(Boolean)
  if (asignados.length > 0) {
    await supabase
      .from('project_members')
      .insert(asignados.map((uid) => ({ project_id: data.id, user_id: uid })))
  }

  revalidatePath('/obras')
  return { success: true, data }
}

export async function updateObra(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const m = await getMembership(supabase)
  if (!m) return { success: false, error: 'No autenticado' }

  const nombre = formData.get('nombre') as string
  const cliente = formData.get('cliente') as string
  const direccion = formData.get('direccion') as string
  const fecha_inicio = formData.get('fecha_inicio') as string
  const fecha_fin_estimada = formData.get('fecha_fin_estimada') as string
  const estado = formData.get('estado') as ProjectStatus
  const presupuesto = parseFloat(formData.get('presupuesto') as string) || 0
  const descripcion = formData.get('descripcion') as string

  if (!nombre || !cliente) {
    return { success: false, error: 'Nombre y cliente son requeridos.' }
  }

  const { error } = await supabase
    .from('projects')
    .update({
      nombre,
      cliente,
      direccion: direccion || null,
      fecha_inicio: fecha_inicio || null,
      fecha_fin_estimada: fecha_fin_estimada || null,
      estado,
      presupuesto,
      descripcion: descripcion || null,
    })
    .eq('id', id)

  if (error) return { success: false, error: 'Error al actualizar la obra.' }

  if (m.rol === 'owner' || m.rol === 'admin') {
    const asignados = formData.getAll('asignados').map(String).filter(Boolean)
    await supabase.from('project_members').delete().eq('project_id', id)
    if (asignados.length > 0) {
      await supabase
        .from('project_members')
        .insert(asignados.map((uid) => ({ project_id: id, user_id: uid })))
    }
  }

  revalidatePath('/obras')
  revalidatePath(`/obras/${id}`)
  return { success: true, data: undefined }
}

export async function updateObraEstado(id: string, estado: ProjectStatus): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .update({ estado })
    .eq('id', id)

  if (error) return { success: false, error: 'Error al actualizar el estado.' }

  revalidatePath('/obras')
  revalidatePath(`/obras/${id}`)
  return { success: true, data: undefined }
}

export async function deleteObra(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: 'Error al eliminar la obra.' }

  revalidatePath('/obras')
  redirect('/obras')
}

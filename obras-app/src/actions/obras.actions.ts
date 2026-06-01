'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, Project, ProjectStatus } from '@/types'

export async function getObras(): Promise<Project[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function getObra(id: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) return null
  return data
}

export async function createObra(formData: FormData): Promise<ActionResult<Project>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

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
      user_id: user.id,
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

  if (error) return { success: false, error: 'Error al crear la obra.' }

  revalidatePath('/obras')
  redirect(`/obras/${data.id}`)
}

export async function updateObra(id: string, formData: FormData): Promise<ActionResult<Project>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

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
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return { success: false, error: 'Error al actualizar la obra.' }

  revalidatePath('/obras')
  revalidatePath(`/obras/${id}`)
  redirect(`/obras/${id}`)
}

export async function updateObraEstado(id: string, estado: ProjectStatus): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('projects')
    .update({ estado })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: 'Error al actualizar el estado.' }

  revalidatePath('/obras')
  revalidatePath(`/obras/${id}`)
  return { success: true, data: undefined }
}

export async function deleteObra(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: 'Error al eliminar la obra.' }

  revalidatePath('/obras')
  redirect('/obras')
}

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, ProgressEntry } from '@/types'

export async function getEntradas(projectId: string): Promise<ProgressEntry[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('progress_entries')
    .select('*')
    .eq('project_id', projectId)
    .order('fecha', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function createEntrada(
  projectId: string,
  formData: FormData
): Promise<ActionResult<ProgressEntry>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const comentario = formData.get('comentario') as string

  if (!comentario?.trim()) {
    return { success: false, error: 'El comentario es requerido.' }
  }

  const { data, error } = await supabase
    .from('progress_entries')
    .insert({
      project_id: projectId,
      comentario: comentario.trim(),
    })
    .select()
    .single()

  if (error) return { success: false, error: 'Error al crear la entrada.' }

  revalidatePath(`/obras/${projectId}/bitacora`)
  return { success: true, data }
}

export async function deleteEntrada(
  entradaId: string,
  projectId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('progress_entries')
    .delete()
    .eq('id', entradaId)

  if (error) return { success: false, error: 'Error al eliminar la entrada.' }

  revalidatePath(`/obras/${projectId}/bitacora`)
  return { success: true, data: undefined }
}

export async function uploadFoto(
  projectId: string,
  entradaId: string,
  formData: FormData
): Promise<ActionResult<string>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const file = formData.get('foto') as File
  if (!file || file.size === 0) {
    return { success: false, error: 'No se seleccionó ningún archivo.' }
  }

  const ext = file.name.split('.').pop()
  const path = `${user.id}/${projectId}/${entradaId}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('project-files')
    .upload(path, file)

  if (uploadError) return { success: false, error: 'Error al subir la foto.' }

  const { data: { publicUrl } } = supabase.storage
    .from('project-files')
    .getPublicUrl(path)

  await supabase.from('files').insert({
    project_id: projectId,
    nombre: file.name,
    url: publicUrl,
    tipo: 'foto',
  })

  revalidatePath(`/obras/${projectId}/bitacora`)
  return { success: true, data: publicUrl }
}

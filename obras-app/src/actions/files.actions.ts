'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, ProjectFile, FileType } from '@/types'

export async function getFiles(projectId: string): Promise<ProjectFile[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('project_id', projectId)
    .neq('tipo', 'foto')
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function uploadFile(
  projectId: string,
  formData: FormData
): Promise<ActionResult<ProjectFile>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const file = formData.get('archivo') as File
  const tipo = formData.get('tipo') as FileType

  if (!file || file.size === 0) {
    return { success: false, error: 'No se seleccionó ningún archivo.' }
  }

  if (file.size > 20 * 1024 * 1024) {
    return { success: false, error: 'El archivo no puede superar los 20MB.' }
  }

  const ext = file.name.split('.').pop()
  const path = `${user.id}/${projectId}/docs/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('project-files')
    .upload(path, file)

  if (uploadError) return { success: false, error: 'Error al subir el archivo.' }

  const { data: { publicUrl } } = supabase.storage
    .from('project-files')
    .getPublicUrl(path)

  const { data, error: dbError } = await supabase
    .from('files')
    .insert({
      project_id: projectId,
      nombre: file.name,
      url: publicUrl,
      tipo: tipo || 'otro',
    })
    .select()
    .single()

  if (dbError) return { success: false, error: 'Error al guardar el archivo.' }

  revalidatePath(`/obras/${projectId}/documentos`)
  return { success: true, data }
}

export async function deleteFile(
  fileId: string,
  projectId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId)

  if (error) return { success: false, error: 'Error al eliminar el archivo.' }

  revalidatePath(`/obras/${projectId}/documentos`)
  return { success: true, data: undefined }
}

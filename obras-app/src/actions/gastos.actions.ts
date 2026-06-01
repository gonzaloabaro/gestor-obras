'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult, Expense } from '@/types'

export async function getGastos(projectId: string): Promise<Expense[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('project_id', projectId)
    .order('fecha', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function createGasto(
  projectId: string,
  formData: FormData
): Promise<ActionResult<Expense>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const categoria = formData.get('categoria') as string
  const descripcion = formData.get('descripcion') as string
  const monto = parseFloat(formData.get('monto') as string)
  const fecha = formData.get('fecha') as string

  if (!categoria || !monto || monto <= 0) {
    return { success: false, error: 'Categoría y monto son requeridos.' }
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert({
      project_id: projectId,
      categoria,
      descripcion: descripcion || null,
      monto,
      fecha: fecha || new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (error) return { success: false, error: 'Error al registrar el gasto.' }

  revalidatePath(`/obras/${projectId}/gastos`)
  return { success: true, data }
}

export async function deleteGasto(
  gastoId: string,
  projectId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', gastoId)

  if (error) return { success: false, error: 'Error al eliminar el gasto.' }

  revalidatePath(`/obras/${projectId}/gastos`)
  return { success: true, data: undefined }
}

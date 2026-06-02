'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types'

export async function signIn(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { success: false, error: 'Email o contraseña incorrectos.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()

  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const nombre   = formData.get('nombre') as string

  if (!nombre || !email || !password) {
    return { success: false, error: 'Todos los campos son requeridos.' }
  }

  if (password.length < 6) {
    return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nombre } },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { success: false, error: 'Este email ya está registrado.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resetPasswordRequest(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const email = formData.get('email') as string

  if (!email) {
    return { success: false, error: 'El email es requerido.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://arquiflow.estudionohte.com.ar/reset-password',
  })

  if (error) {
    return { success: false, error: 'Error al enviar el email. Verificá la dirección.' }
  }

  return { success: true, data: undefined }
}

export async function updatePassword(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirm  = formData.get('confirm') as string

  if (!password || password.length < 6) {
    return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  if (password !== confirm) {
    return { success: false, error: 'Las contraseñas no coinciden.' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { success: false, error: 'Error al actualizar la contraseña.' }
  }

  return { success: true, data: undefined }
}

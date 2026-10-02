'use server'

import { redirect } from 'next/navigation'
import { checkAdminPassword, createSession, deleteSession } from '@/lib/session'

export type LoginState = { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get('password') ?? '')

  if (!checkAdminPassword(password)) {
    // Atraso fixo para encarecer tentativa e erro
    await new Promise((r) => setTimeout(r, 800))
    return { error: 'Senha incorreta' }
  }

  await createSession()
  redirect('/dashboard')
}

/** Sem redirect(): chamado em onClick; o cliente navega depois. */
export async function logoutAction() {
  await deleteSession()
}

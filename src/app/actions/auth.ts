'use server'

import { redirect } from 'next/navigation'
import { ApiError, apiFetch } from '@/lib/api/http'
import type { LoginResponse } from '@/lib/api/types'
import { deleteSession, setSessionToken } from '@/lib/session'

export type LoginState = { error?: string; email?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  try {
    const { accessToken, expiresAt } = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      cache: 'no-store',
    })
    await setSessionToken(accessToken, new Date(expiresAt))
  } catch (err) {
    if (err instanceof ApiError && err.status === 429) {
      return { email, error: 'Muitas tentativas. Aguarde um minuto e tente de novo.' }
    }
    if (err instanceof ApiError && (err.status === 401 || err.status === 400)) {
      return { email, error: 'E-mail ou senha incorretos' }
    }
    console.error('[auth] falha no login', err)
    return { email, error: 'Não foi possível entrar agora. Tente de novo em instantes.' }
  }

  redirect('/dashboard')
}

/** Sem redirect(): chamado em onClick; o cliente navega depois. */
export async function logoutAction() {
  await deleteSession()
}

import 'server-only'

import { cookies } from 'next/headers'

/*
 * Sessão do dashboard: cookie httpOnly com o access token (JWT) emitido pela API.
 * Quem valida o token é a API; aqui só guardamos/lemos o cookie.
 */

export const SESSION_COOKIE = 'liriou_admin'

export async function setSessionToken(token: string, expiresAt: Date) {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function getSessionToken() {
  const store = await cookies()
  return store.get(SESSION_COOKIE)?.value
}

export async function deleteSession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

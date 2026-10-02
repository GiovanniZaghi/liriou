import 'server-only'

import { cookies } from 'next/headers'

/*
 * Sessão do dashboard: cookie httpOnly com `expiração.assinatura` (HMAC-SHA256 com SESSION_SECRET).
 * Usa Web Crypto para rodar igual no proxy e nas Server Actions.
 */

export const SESSION_COOKIE = 'liriou_admin'
const MAX_AGE_S = 60 * 60 * 8 // 8h

function getSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET ausente ou curta (mín. 32 caracteres)')
  return secret
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return Buffer.from(sig).toString('base64url')
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || Number(exp) < Date.now()) return false
  return safeEqual(sig, await sign(exp))
}

export async function createSession() {
  const exp = String(Date.now() + MAX_AGE_S * 1000)
  const store = await cookies()
  store.set(SESSION_COOKIE, `${exp}.${await sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_S,
  })
}

export async function deleteSession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function isAuthenticated() {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}

/** Compara a senha do formulário com ADMIN_PASSWORD em tempo constante. */
export function checkAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) throw new Error('ADMIN_PASSWORD não configurada')
  return safeEqual(input, expected)
}

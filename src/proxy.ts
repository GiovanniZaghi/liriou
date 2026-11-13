import { NextResponse, type NextRequest } from 'next/server'
import { isJwtExpired } from '@/lib/jwt-expiry'

const SESSION_COOKIE = 'liriou_admin'

/**
 * Protege /dashboard/** (exceto o login). Checagem rápida só do vencimento do token;
 * a validação de verdade acontece na API a cada chamada (401 → volta ao login).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === '/dashboard/login'
  const hasSession = !isJwtExpired(request.cookies.get(SESSION_COOKIE)?.value)

  if (!isLogin && !hasSession) return NextResponse.redirect(new URL('/dashboard/login', request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

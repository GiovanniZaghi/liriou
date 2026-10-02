import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

/** Protege /dashboard/** (exceto o login) e tira do login quem já está autenticado. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authed = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
  const isLogin = pathname === '/dashboard/login'

  if (isLogin && authed) return NextResponse.redirect(new URL('/dashboard', request.url))
  if (!isLogin && !authed) return NextResponse.redirect(new URL('/dashboard/login', request.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

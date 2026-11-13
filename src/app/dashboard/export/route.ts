import { NextResponse, type NextRequest } from 'next/server'
import { exportLeadsCsv } from '@/lib/api/admin'
import { getSessionToken } from '@/lib/session'

/** Repassa o CSV gerado pela API (mesmos filtros da tela), autenticado pelo cookie da sessão. */
export async function GET(request: NextRequest) {
  if (!(await getSessionToken())) return new NextResponse('Não autorizado', { status: 401 })

  const sp = request.nextUrl.searchParams
  const upstream = await exportLeadsCsv({ q: sp.get('q') || undefined, pain: sp.get('pain') || undefined })
  if (upstream.status === 401) return NextResponse.redirect(new URL('/dashboard/login', request.url))
  if (!upstream.ok) return new NextResponse('Não foi possível exportar agora', { status: 502 })

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'text/csv; charset=utf-8',
      'Content-Disposition': upstream.headers.get('Content-Disposition') ?? 'attachment; filename="lista-vip.csv"',
      'Cache-Control': 'no-store',
    },
  })
}

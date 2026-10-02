import { NextResponse, type NextRequest } from 'next/server'
import { formatDateTime, formatPhone, painLabel } from '@/lib/format'
import { listAllLeads } from '@/lib/leads-query'
import { isAuthenticated } from '@/lib/session'

/** CSV dos cadastros com os mesmos filtros da tela (abre direto no Excel: `;` + BOM). */
export async function GET(request: NextRequest) {
  // O proxy já protege a rota; conferido de novo porque aqui saem dados pessoais
  if (!(await isAuthenticated())) return new NextResponse('Não autorizado', { status: 401 })

  const sp = request.nextUrl.searchParams
  const rows = await listAllLeads({ q: sp.get('q') || undefined, pain: sp.get('pain') || undefined })

  const header = ['Data', 'Nome', 'E-mail', 'WhatsApp', 'Pesadelo ao acordar', 'utm_source', 'utm_medium', 'utm_campaign', 'Consentimento']
  const lines = rows.map((r) =>
    [
      formatDateTime(r.createdAt),
      r.name,
      r.email,
      formatPhone(r.whatsapp),
      painLabel(r.pain),
      r.utm?.utm_source ?? '',
      r.utm?.utm_medium ?? '',
      r.utm?.utm_campaign ?? '',
      r.consentAt.toISOString(),
    ]
      .map(csvCell)
      .join(';'),
  )

  const stamp = new Date().toISOString().slice(0, 10)
  return new NextResponse('﻿' + [header.join(';'), ...lines].join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="liriou-lista-vip-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}

function csvCell(value: string) {
  // Neutraliza fórmulas (=, +, -, @) que o Excel executaria
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return /[;"\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PaginationProps {
  /** Rota da listagem, ex.: /dashboard/estoque */
  basePath: string
  /** Filtros atuais (mantidos ao trocar de página) */
  query?: Record<string, string | number | boolean | undefined>
  page: number
  total: number
  pageSize: number
}

export function Pagination({ basePath, query = {}, page: requested, total, pageSize }: PaginationProps) {
  const pages = Math.ceil(total / pageSize)
  const page = Math.min(requested, Math.max(pages, 1))
  if (pages <= 1) return null

  const href = (p: number) => {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== '' && v !== false) sp.set(k, String(v))
    if (p > 1) sp.set('page', String(p))
    return `${basePath}${sp.size ? `?${sp}` : ''}`
  }

  const link = 'grid h-10 min-w-10 place-items-center rounded-full px-3 text-[14px]'

  return (
    <nav aria-label="Paginação" className="mt-5 flex items-center justify-between gap-4">
      <p className="text-[13px] text-musgo">
        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} de {total}
      </p>
      <div className="flex items-center gap-1">
        <PageLink href={href(page - 1)} disabled={page <= 1} className={link}>
          ← Anterior
        </PageLink>
        <span className="px-2 text-[14px] text-tinta tabular-nums">
          {page} / {pages}
        </span>
        <PageLink href={href(page + 1)} disabled={page >= pages} className={link}>
          Próxima →
        </PageLink>
      </div>
    </nav>
  )
}

function PageLink({ href, disabled, className, children }: { href: string; disabled: boolean; className: string; children: React.ReactNode }) {
  if (disabled) return <span className={cn(className, 'text-musgo/50')}>{children}</span>
  return (
    <Link href={href} className={cn(className, 'text-noite-900 hover:bg-linho')}>
      {children}
    </Link>
  )
}

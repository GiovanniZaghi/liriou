import Link from 'next/link'
import type { LeadFilters } from '@/lib/leads-query'
import { cn } from '@/lib/utils'

interface PaginationProps {
  filters: LeadFilters
  total: number
  pageSize: number
}

export function Pagination({ filters, total, pageSize }: PaginationProps) {
  const pages = Math.ceil(total / pageSize)
  const page = Math.min(filters.page ?? 1, Math.max(pages, 1))
  if (pages <= 1) return null

  const href = (p: number) => {
    const sp = new URLSearchParams()
    if (filters.q) sp.set('q', filters.q)
    if (filters.pain) sp.set('pain', filters.pain)
    if (p > 1) sp.set('page', String(p))
    return `/dashboard${sp.size ? `?${sp}` : ''}`
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

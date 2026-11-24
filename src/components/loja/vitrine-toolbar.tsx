'use client'

import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import type { ProductCategory } from '@/lib/api/types'
import { cn } from '@/lib/utils'
import { SORT_OPTIONS, vitrineHref, type VitrineFilters, type VitrineSort, type VitrineTone } from '@/lib/vitrine'

interface VitrineToolbarProps {
  filters: VitrineFilters
  /** Só as categorias que têm produto na vitrine */
  categories: { value: ProductCategory; label: string; count: number }[]
  /** Só os tons que têm produto */
  tones: { value: VitrineTone; label: string; swatch: string; count: number }[]
  total: number
}

const chip = 'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-colors'

/** Busca, categorias, ordenação e "só disponíveis". Tudo vive na URL (dá para compartilhar o link). */
export function VitrineToolbar({ filters, categories, tones, total }: VitrineToolbarProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [query, setQuery] = useState(filters.q)

  const go = (next: Partial<VitrineFilters>) =>
    startTransition(() => router.replace(vitrineHref({ ...filters, page: 1, ...next }), { scroll: false }))

  // A URL manda: se ela mudar por fora (limpar filtros, voltar no navegador), o campo acompanha
  useEffect(() => setQuery(filters.q), [filters.q])

  // Busca enquanto digita, com uma pequena espera para não navegar a cada tecla
  useEffect(() => {
    if (query.trim() === filters.q) return
    const t = setTimeout(() => go({ q: query.trim() }), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div className={cn('space-y-5 transition-opacity', pending && 'opacity-70')}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form role="search" onSubmit={(e) => { e.preventDefault(); go({ q: query.trim() }) }} className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-cinza" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por produto, cor ou ritual..."
            aria-label="Buscar na vitrine"
            className="w-full rounded-full border border-borda bg-white py-3 pr-4 pl-11 text-sm text-grafite placeholder:text-cinza/70 focus:border-salvia focus:outline-none"
          />
        </form>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-grafite select-none">
            <input type="checkbox" checked={filters.inStock} onChange={(e) => go({ inStock: e.target.checked })}
              className="size-4 cursor-pointer accent-salvia" />
            Só disponíveis
          </label>
          <label className="sr-only" htmlFor="vitrine-ordem">Ordenar por</label>
          <select
            id="vitrine-ordem"
            value={filters.sort}
            onChange={(e) => go({ sort: e.target.value as VitrineSort })}
            className="cursor-pointer rounded-full border border-borda bg-white px-4 py-3 text-xs text-grafite focus:border-salvia focus:outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <nav aria-label="Categorias" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link
          href={vitrineHref({ ...filters, category: null, page: 1 })}
          scroll={false}
          aria-current={!filters.category ? 'page' : undefined}
          className={cn(chip, 'shrink-0', !filters.category ? 'border-salvia bg-salvia text-white' : 'border-borda bg-white text-grafite hover:border-salvia')}
        >
          Tudo
        </Link>
        {categories.map((c) => {
          const active = filters.category === c.value
          return (
            <Link
              key={c.value}
              href={vitrineHref({ ...filters, category: active ? null : c.value, page: 1 })}
              scroll={false}
              aria-current={active ? 'page' : undefined}
              className={cn(chip, 'shrink-0', active ? 'border-salvia bg-salvia text-white' : 'border-borda bg-white text-grafite hover:border-salvia')}
            >
              {c.label}
              <span className={cn('text-[10px]', active ? 'text-white/80' : 'text-cinza')}>{c.count}</span>
            </Link>
          )
        })}
      </nav>

      {tones.length > 0 && (
        <nav aria-label="Cores" className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <span className="shrink-0 pr-1 text-xs text-cinza">Cores:</span>
          {tones.map((t) => {
            const active = filters.tone === t.value
            return (
              <Link
                key={t.value}
                href={vitrineHref({ ...filters, tone: active ? null : t.value, page: 1 })}
                scroll={false}
                aria-current={active ? 'page' : undefined}
                className={cn(chip, 'shrink-0', active ? 'border-grafite bg-grafite text-white' : 'border-borda bg-white text-grafite hover:border-grafite')}
              >
                <span className="size-3.5 rounded-full ring-1 ring-black/10" style={{ background: t.swatch }} aria-hidden />
                {t.label}
                {active ? <X className="size-3" aria-hidden /> : <span className="text-[10px] text-cinza">{t.count}</span>}
              </Link>
            )
          })}
        </nav>
      )}

      <div className="flex items-center justify-between gap-3 text-xs text-cinza" aria-live="polite">
        <span>
          {total} {total === 1 ? 'produto' : 'produtos'}
          {filters.q && <> para “<strong className="text-grafite">{filters.q}</strong>”</>}
        </span>
        {(filters.q || filters.category || filters.tone || filters.inStock || filters.sort !== 'destaques') && (
          <Link href="/vitrine" scroll={false} className="inline-flex items-center gap-1 font-medium text-rubor hover:underline">
            <X className="size-3.5" aria-hidden /> Limpar filtros
          </Link>
        )}
      </div>
    </div>
  )
}

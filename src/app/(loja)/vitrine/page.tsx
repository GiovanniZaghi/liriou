import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductCard } from '@/components/loja/product-card'
import { VitrineToolbar } from '@/components/loja/vitrine-toolbar'
import { getCatalog } from '@/lib/api/catalog'
import { CATEGORY_OPTIONS } from '@/lib/products'
import { cn } from '@/lib/utils'
import { applyVitrineFilters, parseVitrineParams, vitrineHref, type VitrineFilters } from '@/lib/vitrine'

export const metadata: Metadata = {
  title: 'Vitrine | Líriou',
  description: 'Toda a coleção Líriou: scrunchies, toucas, kits e acessórios em cetim de alta gramatura.',
  alternates: { canonical: '/vitrine' },
  openGraph: { title: 'Vitrine · Líriou', url: '/vitrine', locale: 'pt_BR', type: 'website' },
}

type SearchParams = Promise<{ q?: string; categoria?: string; ordem?: string; disponivel?: string; page?: string }>

export default async function VitrinePage({ searchParams }: { searchParams: SearchParams }) {
  const [products, params] = await Promise.all([getCatalog(), searchParams])
  const filters = parseVitrineParams(params)
  const result = applyVitrineFilters(products, filters)

  const categories = CATEGORY_OPTIONS.map((c) => ({ ...c, count: products.filter((p) => p.category === c.value).length })).filter(
    (c) => c.count > 0,
  )

  return (
    <div className="mx-auto max-w-7xl px-4 pt-14 pb-24 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <span className="eyebrow text-rubor">Vitrine</span>
        <h1 className="mt-2 font-serif text-4xl text-grafite sm:text-5xl">Toda a coleção</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-cinza">
          Cetim de alta gramatura, acabamento de alfaiataria e cores pensadas para o seu ritual.
        </p>
      </header>

      <VitrineToolbar filters={filters} categories={categories} total={result.total} />

      {products.length === 0 ? (
        <p className="mt-10 rounded-3xl border border-borda bg-white p-10 text-center text-sm text-cinza">
          Nossa vitrine está sendo preparada. Volte em instantes 🤎
        </p>
      ) : result.total === 0 ? (
        <div className="mt-10 rounded-3xl border border-borda bg-white p-10 text-center text-sm text-cinza">
          <p>Nenhum produto encontrado com esses filtros.</p>
          <Link href="/vitrine" className="mt-3 inline-block font-medium text-salvia hover:underline">
            Ver toda a coleção
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {result.items.map((p, i) => (
              // Atraso da animação por coluna (não por posição): a página inteira não fica esperando
              <ProductCard key={p.id} product={p} index={i % 4} />
            ))}
          </div>
          <VitrinePagination filters={filters} page={result.page} totalPages={result.totalPages} />
        </>
      )}
    </div>
  )
}

function VitrinePagination({ filters, page, totalPages }: { filters: VitrineFilters; page: number; totalPages: number }) {
  if (totalPages <= 1) return null
  const href = (p: number) => vitrineHref({ ...filters, page: p })
  // Primeira, última e as vizinhas da atual; o resto vira reticências
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  )
  const link = 'grid size-10 place-items-center rounded-full text-sm transition-colors'

  return (
    <nav aria-label="Páginas da vitrine" className="mt-14 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={href(page - 1)} aria-label="Página anterior" className={cn(link, 'text-grafite hover:bg-algodao')}>
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={cn(link, 'text-cinza/40')} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-cinza">…</span>}
          <Link
            href={href(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(link, p === page ? 'bg-salvia font-semibold text-white' : 'text-grafite hover:bg-algodao')}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={href(page + 1)} aria-label="Próxima página" className={cn(link, 'text-grafite hover:bg-algodao')}>
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={cn(link, 'text-cinza/40')} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  )
}

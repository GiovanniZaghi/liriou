import { Plus } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { InventoryTiles } from '@/components/dashboard/estoque/inventory-tiles'
import { ProductsFilters } from '@/components/dashboard/estoque/products-filters'
import { ProductsTable } from '@/components/dashboard/estoque/products-table'
import { FlashToast } from '@/components/dashboard/flash-toast'
import { dashBtn, PageHeader, pageShell } from '@/components/dashboard/page-header'
import { Pagination } from '@/components/dashboard/pagination'
import { getInventorySummary, listProducts, PRODUCTS_PAGE_SIZE } from '@/lib/api/admin'
import type { ProductCategory, ProductFilters } from '@/lib/api/types'
import { CATEGORY_OPTIONS } from '@/lib/products'

export const metadata: Metadata = { title: 'Estoque · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ q?: string; categoria?: string; vitrine?: string; baixo?: string; page?: string; excluido?: string }>

export default async function EstoquePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filters: ProductFilters = {
    q: params.q?.trim().slice(0, 100) || undefined,
    category: CATEGORY_OPTIONS.some((o) => o.value === params.categoria) ? (params.categoria as ProductCategory) : undefined,
    status: params.vitrine === 'ativo' || params.vitrine === 'oculto' ? params.vitrine : undefined,
    lowStock: params.baixo === '1',
    page: Math.max(1, Number(params.page) || 1),
  }

  const [summary, products] = await Promise.all([getInventorySummary(), listProducts(filters)])

  return (
    <main className={pageShell}>
      {params.excluido && <FlashToast message="Produto excluído do estoque e da vitrine." />}

      <PageHeader
        title="Estoque"
        description="Produtos, quantidades e o que aparece na vitrine da loja."
        actions={
          <Link href="/dashboard/estoque/novo" className={dashBtn.primary}>
            <Plus className="size-4" aria-hidden /> Novo produto
          </Link>
        }
      />

      <InventoryTiles summary={summary} />

      <section aria-labelledby="produtos-titulo" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="produtos-titulo" className="font-serif text-[32px] leading-none text-noite-900">
              Produtos
            </h2>
            <p className="mt-1 text-[14px] text-musgo">
              {products.meta.total} {products.meta.total === 1 ? 'produto' : 'produtos'}
              {filters.q || filters.category || filters.status || filters.lowStock ? ' com os filtros atuais' : ''} · a
              ordem segue a da vitrine
            </p>
          </div>
          <ProductsFilters filters={filters} />
        </div>
        <ProductsTable rows={products.data} />
        <Pagination
          basePath="/dashboard/estoque"
          query={{ q: filters.q, categoria: filters.category, vitrine: filters.status, baixo: filters.lowStock ? '1' : undefined }}
          page={filters.page ?? 1}
          total={products.meta.total}
          pageSize={PRODUCTS_PAGE_SIZE}
        />
      </section>
    </main>
  )
}

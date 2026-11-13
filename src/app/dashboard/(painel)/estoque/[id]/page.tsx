import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DeleteProductButton } from '@/components/dashboard/estoque/delete-product-button'
import { MovementsTable } from '@/components/dashboard/estoque/movements-table'
import { ProductForm } from '@/components/dashboard/estoque/product-form'
import { StockBadge } from '@/components/dashboard/estoque/products-table'
import { StockMovementDialog } from '@/components/dashboard/estoque/stock-movement-dialog'
import { FlashToast } from '@/components/dashboard/flash-toast'
import { PageHeader, pageShell } from '@/components/dashboard/page-header'
import { getProduct, listStockMovements } from '@/lib/api/admin'
import { getStoreSettings } from '@/lib/api/catalog'
import { ApiError } from '@/lib/api/http'

export const metadata: Metadata = { title: 'Produto · Estoque' }
export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ criado?: string; salvo?: string }>

export default async function ProdutoPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ id }, flags] = await Promise.all([params, searchParams])
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()

  const [product, movements, settings] = await Promise.all([
    getProduct(id).catch((err) => {
      if (err instanceof ApiError && err.status === 404) notFound()
      throw err
    }),
    listStockMovements(id),
    getStoreSettings(),
  ])

  const flash = flags.criado
    ? product.isActive
      ? 'Produto cadastrado e já disponível na vitrine.'
      : 'Produto cadastrado (oculto na vitrine).'
    : flags.salvo
      ? 'Alterações salvas — a vitrine já foi atualizada.'
      : null

  return (
    <main className={pageShell}>
      {flash && <FlashToast message={flash} />}

      <PageHeader
        title={product.name}
        description={`SKU ${product.sku}`}
        breadcrumb={[{ href: '/dashboard/estoque', label: 'Estoque' }]}
        actions={
          <>
            <span className="mr-2 text-[14px] text-musgo">
              Estoque: <strong className="text-[18px] font-semibold text-noite-900 tabular-nums">{product.stock}</strong>
              <StockBadge product={product} />
            </span>
            <StockMovementDialog productId={product.id} productName={product.name} stock={product.stock} variant="primary" />
            <DeleteProductButton productId={product.id} name={product.name} />
          </>
        }
      />

      {/* key: remonta o formulário com os dados novos depois de salvar/movimentar */}
      <ProductForm key={product.updatedAt} product={product} installments={settings.installments} />

      <div className="mt-6 lg:max-w-[calc(100%-404px)]">
        <MovementsTable rows={movements.data} total={movements.meta.total} />
      </div>
    </main>
  )
}

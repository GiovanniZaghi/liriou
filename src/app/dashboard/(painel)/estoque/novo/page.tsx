import type { Metadata } from 'next'
import { ProductForm } from '@/components/dashboard/estoque/product-form'
import { PageHeader, pageShell } from '@/components/dashboard/page-header'
import { getStoreSettings } from '@/lib/api/catalog'

export const metadata: Metadata = { title: 'Novo produto · Estoque' }

export default async function NovoProdutoPage() {
  const settings = await getStoreSettings()

  return (
    <main className={pageShell}>
      <PageHeader
        title="Novo produto"
        description="Cadastre o produto e veja ao lado como ele vai aparecer na vitrine."
        breadcrumb={[{ href: '/dashboard/estoque', label: 'Estoque' }]}
      />
      <ProductForm installments={settings.installments} />
    </main>
  )
}

import type { Metadata } from 'next'
import { CustomerOrders } from '@/components/loja/customer-orders'

export const metadata: Metadata = {
  title: 'Meus pedidos | Líriou',
  description: 'Acompanhe seus pedidos Líriou: pagamento, separação, envio e entrega.',
  alternates: { canonical: '/meus-pedidos' },
  // Página pessoal: não precisa aparecer no Google
  robots: { index: false, follow: true },
}

export default function MeusPedidosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-14 pb-24 sm:px-6">
      <header className="mb-8 text-center">
        <span className="eyebrow text-rubor">Área da cliente</span>
        <h1 className="mt-2 font-serif text-4xl text-grafite sm:text-5xl">Meus pedidos</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-cinza">
          Digite o CPF usado na compra para ver seus pedidos e acompanhar cada etapa, do pagamento à entrega.
        </p>
      </header>
      <CustomerOrders />
    </div>
  )
}

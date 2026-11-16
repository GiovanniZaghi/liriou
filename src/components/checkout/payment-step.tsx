'use client'

import { CheckCircle2, Loader2, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '@/lib/api/http'
import { ordersApi } from '@/lib/api/orders'
import type { Order } from '@/lib/api/types'
import { formatBRL } from '@/lib/format'
import { useStore } from '../loja/store-provider'
import { btnPrimary } from '../loja/styles'
import { CheckoutSteps } from './checkout-steps'
import { OrderSummary } from './order-summary'
import { PaymentMethods } from './payment-methods'

/** Etapa 4 do checkout: pagamento pelo Mercado Pago (Pix, cartão ou boleto) e confirmação. */
export function PaymentStep({ orderId }: { orderId: string }) {
  const { settings } = useStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string>()

  useEffect(() => {
    ordersApi
      .get(orderId)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiError && err.status === 404 ? 'Pedido não encontrado.' : err.message))
  }, [orderId])

  const handlePaid = useCallback(() => {
    setOrder((o) => (o ? { ...o, status: 'pago' } : o))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-serif text-2xl text-grafite">{error}</h1>
        <Link href="/#colecao" className={`${btnPrimary} mt-6`}>
          Voltar à loja
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex justify-center py-32 text-cinza">
        <Loader2 className="size-6 animate-spin" aria-label="Carregando pedido" />
      </div>
    )
  }

  const a = order.shippingAddress
  const paid = order.status === 'pago'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CheckoutSteps current={3} />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          {paid ? (
            <section className="rounded-3xl border border-folha/30 bg-folha/10 p-8 text-center">
              <PartyPopper className="mx-auto mb-3 size-10 text-folha" aria-hidden />
              <h1 className="font-serif text-3xl text-grafite">Pagamento aprovado!</h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-noite-900">
                Seu pedido #{order.number} está confirmado e já vamos preparar o envio com todo carinho. 🌸
              </p>
              <Link href="/" className={`${btnPrimary} mt-6`}>
                Continuar comprando
              </Link>
            </section>
          ) : order.status === 'cancelado' ? (
            <section className="rounded-3xl border border-rubor/30 bg-rubor/5 p-6">
              <h1 className="font-serif text-2xl text-grafite">Pedido #{order.number} cancelado</h1>
              <p className="mt-1 text-xs text-noite-900">Este pedido não pode mais ser pago. Fale com a gente pelo Instagram @lirio.u.</p>
            </section>
          ) : (
            <>
              <section className="flex items-start gap-4 rounded-3xl border border-folha/30 bg-folha/10 p-6">
                <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-folha" aria-hidden />
                <div>
                  <h1 className="font-serif text-2xl text-grafite">Pedido #{order.number} criado</h1>
                  <p className="mt-1 text-xs leading-relaxed text-noite-900">
                    Seu pedido foi registrado. Conclua o pagamento abaixo para confirmarmos o envio.
                  </p>
                </div>
              </section>

              <section className="rounded-3xl border border-borda bg-white p-6 shadow-sm sm:p-8">
                <header className="mb-6 flex items-center justify-between">
                  <h2 className="font-serif text-2xl text-grafite">Pagamento</h2>
                  <span className="font-serif text-xl text-grafite">{formatBRL(order.totals.total)}</span>
                </header>
                <PaymentMethods order={order} settings={settings} onPaid={handlePaid} />
              </section>
            </>
          )}

          <section className="grid gap-4 rounded-3xl border border-borda bg-white p-6 text-xs leading-relaxed text-cinza shadow-sm sm:grid-cols-2 sm:p-8">
            <div>
              <h3 className="mb-2 font-semibold tracking-wider text-grafite uppercase">Entrega</h3>
              <p className="font-medium text-grafite">{a.recipient}</p>
              <p>
                {a.street}, {a.number}
                {a.complement && ` — ${a.complement}`}
              </p>
              <p>
                {a.district} · {a.city}/{a.state} · CEP {a.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}
              </p>
              <p className="mt-1 text-grafite">{order.shippingOption.label}</p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold tracking-wider text-grafite uppercase">Compradora</h3>
              <p className="font-medium text-grafite">{order.customer.name}</p>
              <p>{order.customer.email}</p>
              <p>CPF {order.customer.cpf}</p>
            </div>
          </section>
        </div>

        <OrderSummary
          items={order.items.map((i) => ({ key: i.productId, name: i.name, image: i.image, quantity: i.quantity, lineTotal: i.lineTotal }))}
          subtotal={order.totals.subtotal}
          discount={order.totals.discount}
          couponCode={order.couponCode}
          shipping={order.totals.shipping}
          total={order.totals.total}
          installments={settings.installments}
        />
      </div>
    </div>
  )
}

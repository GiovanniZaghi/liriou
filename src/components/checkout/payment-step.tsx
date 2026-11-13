'use client'

import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ApiError } from '@/lib/api/http'
import { ordersApi } from '@/lib/api/orders'
import type { Order } from '@/lib/api/types'
import { formatBRL } from '@/lib/format'
import { useStore } from '../loja/store-provider'
import { btnPrimary } from '../loja/styles'
import { CheckoutSteps } from './checkout-steps'
import { OrderSummary } from './order-summary'

/** Etapa 4 do checkout. O gateway de pagamento entra em <PaymentMethods />. */
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CheckoutSteps current={3} />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
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
            <PaymentMethods order={order} />
          </section>

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

/**
 * Ponto de integração do gateway de pagamento.
 * Recebe o pedido (id, número, total, compradora) já criado como "aguardando_pagamento".
 */
function PaymentMethods({ order }: { order: Order }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-borda bg-areia px-6 py-10 text-center">
      <CreditCard className="mb-3 size-8 text-cinza/60" aria-hidden />
      <p className="text-sm font-medium text-grafite">Pagamento em configuração</p>
      <p className="mt-1 max-w-sm text-xs text-cinza">
        Pedido #{order.number} reservado no valor de {formatBRL(order.totals.total)}.
      </p>
    </div>
  )
}

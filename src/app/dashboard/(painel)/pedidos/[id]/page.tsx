import { Mail, MessageCircle, UserRound } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, unstable_rethrow } from 'next/navigation'
import { dashBtn, PageHeader, pageShell } from '@/components/dashboard/page-header'
import { OrderStatusBadge } from '@/components/dashboard/pedidos/order-badges'
import { ShipmentCard } from '@/components/dashboard/pedidos/shipment-card'
import { getOrder, getShipment } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/http'
import { formatBirthday, formatBRL, formatDateTime, formatPhone } from '@/lib/format'
import { maskCpf } from '@/lib/masks'
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS } from '@/lib/orders'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Pedido · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>

export default async function PedidoDetalhePage({ params }: { params: Params }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()

  const [order, shipment] = await Promise.all([
    getOrder(id).catch((err) => {
      if (err instanceof ApiError && err.status === 404) notFound()
      throw err
    }),
    // Se a API de envios falhar, o resto da página continua
    getShipment(id).catch((err) => {
      unstable_rethrow(err)
      console.error('[envio]', err)
      return null
    }),
  ])

  const c = order.customer
  const a = order.shippingAddress
  const customerHref = `/dashboard/clientes/${encodeURIComponent(c.email)}`

  return (
    <main className={pageShell}>
      <PageHeader
        title={`Pedido #${order.number}`}
        description={`Feito em ${formatDateTime(new Date(order.createdAt))} · ${order.itemCount} ${order.itemCount === 1 ? 'item' : 'itens'}`}
        breadcrumb={[{ href: '/dashboard/pedidos', label: 'Pedidos' }]}
        actions={
          <>
            <a href={`https://wa.me/55${c.phone}`} target="_blank" rel="noopener noreferrer" className={dashBtn.primary}>
              <MessageCircle className="size-4" aria-hidden /> WhatsApp
            </a>
            <a href={`mailto:${c.email}?subject=${encodeURIComponent(`Seu pedido #${order.number} na Líriou`)}`} className={dashBtn.outline}>
              <Mail className="size-4" aria-hidden /> E-mail
            </a>
          </>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-[20px] border border-linho bg-white">
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-linho px-5 py-4">
              <h2 className="text-[16px] font-semibold text-noite-900">Itens</h2>
              <OrderStatusBadge status={order.status} />
            </header>
            {order.giftWrap && (
              <p className="flex items-center gap-2 border-b border-linho bg-rubor/5 px-5 py-3 text-[14px] font-semibold text-rubor">
                🎁 Enviar com embalagem de Natal
              </p>
            )}
            <ul className="divide-y divide-linho/70">
              {order.items.map((i) => (
                <li key={i.productId} className="flex items-center gap-4 px-5 py-3">
                  <img src={i.image} alt="" className="size-14 shrink-0 rounded-xl border border-linho object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/estoque/${i.productId}`} className="block truncate font-medium text-noite-900 hover:underline">
                      {i.name}
                    </Link>
                    <span className="text-[12px] text-musgo">
                      {i.sku} · {i.quantity} × {formatBRL(i.unitPrice)}
                    </span>
                  </div>
                  <span className="font-semibold tabular-nums">{formatBRL(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-linho px-5 py-4 text-[14px]">
              <Row label="Subtotal" value={formatBRL(order.totals.subtotal)} />
              {order.totals.discount > 0 && (
                <Row label={`Desconto${order.couponCode ? ` (${order.couponCode})` : ''}`} value={`- ${formatBRL(order.totals.discount)}`} />
              )}
              <Row label={`Envio · ${order.shippingLabel}`} value={order.totals.shipping === 0 ? 'Grátis' : formatBRL(order.totals.shipping)} />
              <div className="flex justify-between border-t border-linho pt-2 text-[16px] font-semibold text-noite-900">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatBRL(order.totals.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-[20px] border border-linho bg-white">
            <header className="border-b border-linho px-5 py-4">
              <h2 className="text-[16px] font-semibold text-noite-900">Pagamentos</h2>
              <p className="text-[13px] text-musgo">Cada tentativa feita no Mercado Pago, da mais recente para a mais antiga.</p>
            </header>
            {order.payments.length === 0 ? (
              <p className="px-5 py-6 text-[14px] text-musgo">A cliente ainda não escolheu a forma de pagamento.</p>
            ) : (
              <ul className="divide-y divide-linho/70 text-[14px]">
                {order.payments.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                    <div>
                      <p className="font-medium text-noite-900">
                        {PAYMENT_METHOD_LABEL[p.method] ?? p.method}
                        {p.method === 'credit_card' && ` · ${p.installments}x`}
                      </p>
                      <p className="text-[12px] text-musgo">
                        {formatDateTime(new Date(p.createdAt))}
                        {p.statusDetail && ` · ${p.statusDetail}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-[13px] font-semibold', PAYMENT_STATUS[p.status]?.tone)}>
                        {PAYMENT_STATUS[p.status]?.label ?? p.status}
                      </p>
                      <p className="tabular-nums">{formatBRL(p.amount)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <Card title="Cliente">
            <dl className="space-y-1.5">
              <Field label="Nome" value={c.name} />
              <Field label="E-mail" value={c.email} />
              <Field label="Telefone" value={formatPhone(c.phone)} />
              <Field label="CPF" value={maskCpf(c.cpf)} />
              {c.birthDate && <Field label="Aniversário" value={`🎂 ${formatBirthday(c.birthDate, true)}`} />}
            </dl>
            <Link href={customerHref} className={`${dashBtn.ghost} mt-3 -ml-3`}>
              <UserRound className="size-4" aria-hidden /> Ver todos os pedidos dela
            </Link>
          </Card>

          <Card title="Entrega">
            <div className="space-y-0.5">
              <p className="font-medium text-noite-900">{a.recipient}</p>
              <p>
                {a.street}, {a.number}
                {a.complement && ` · ${a.complement}`}
              </p>
              <p>
                {a.district} · {a.city}/{a.state}
              </p>
              <p>CEP {a.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}</p>
            </div>
          </Card>

          {shipment && <ShipmentCard info={shipment} />}
        </aside>
      </div>
    </main>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[20px] border border-linho bg-white p-5 text-[14px] text-tinta">
      <h2 className="mb-3 text-[15px] font-semibold text-noite-900">{title}</h2>
      {children}
    </section>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-musgo">{label}</dt>
      <dd className="text-right font-medium break-all">{value}</dd>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-musgo">
      <dt>{label}</dt>
      <dd className="font-medium text-tinta tabular-nums">{value}</dd>
    </div>
  )
}

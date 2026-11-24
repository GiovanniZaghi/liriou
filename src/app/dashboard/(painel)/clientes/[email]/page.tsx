import { Mail, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dashBtn, PageHeader, pageShell } from '@/components/dashboard/page-header'
import { OrderStatusBadge, StageBadge } from '@/components/dashboard/pedidos/order-badges'
import { getCustomer } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/http'
import { formatBirthday, formatBRL, formatDateTime, formatNumber, formatPhone } from '@/lib/format'
import { maskCpf } from '@/lib/masks'
import { shipmentStatusLabel } from '@/lib/orders'

export const metadata: Metadata = { title: 'Cliente · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

type Params = Promise<{ email: string }>

/** O e-mail chega codificado na URL (%40 no lugar de @) */
function decodeEmail(raw: string) {
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

export default async function ClienteDetalhePage({ params }: { params: Params }) {
  const email = decodeEmail((await params).email)
  if (!/^[^\s@]+@[^\s@]+$/.test(email)) notFound()

  const c = await getCustomer(email).catch((err) => {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) notFound()
    throw err
  })

  const a = c.address
  const avgTicket = c.paidOrdersCount ? c.totalSpent / c.paidOrdersCount : 0

  return (
    <main className={pageShell}>
      <PageHeader
        title={c.name}
        description={`${c.email} · ${formatPhone(c.phone)} · cliente desde ${formatDateTime(new Date(c.firstSeenAt))}`}
        breadcrumb={[{ href: '/dashboard/clientes', label: 'Clientes' }]}
        actions={
          <>
            <a href={`https://wa.me/55${c.phone}`} target="_blank" rel="noopener noreferrer" className={dashBtn.primary}>
              <MessageCircle className="size-4" aria-hidden /> WhatsApp
            </a>
            <a href={`mailto:${c.email}`} className={dashBtn.outline}>
              <Mail className="size-4" aria-hidden /> E-mail
            </a>
          </>
        }
      />

      <section aria-label="Resumo da cliente" className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[20px] bg-noite-900 p-6 text-leite">
          <p className="text-[14px] text-leite/78">Total gasto</p>
          <p className="mt-2 text-[36px] leading-none font-semibold tracking-[-0.02em]">{formatBRL(c.totalSpent)}</p>
          <p className="mt-2 text-[13px] text-leite/70">em pedidos pagos</p>
        </div>
        <Tile label="Pedidos" value={formatNumber(c.ordersCount)} hint={`${formatNumber(c.paidOrdersCount)} pagos`} />
        <Tile label="Ticket médio" value={avgTicket ? formatBRL(avgTicket) : '—'} hint="por pedido pago" />
        <Tile
          label="Em sacolas abertas"
          value={c.openCartsCount ? formatBRL(c.openCartsValue) : '—'}
          hint={c.openCartsCount ? `${c.openCartsCount} ${c.openCartsCount === 1 ? 'sacola' : 'sacolas'} sem pedido` : 'nada pendente'}
          danger={c.openCartsCount > 0}
        />
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-[20px] border border-linho bg-white">
            <header className="border-b border-linho px-5 py-4">
              <h2 className="text-[16px] font-semibold text-noite-900">Pedidos</h2>
            </header>
            {c.orders.length === 0 ? (
              <p className="px-5 py-8 text-center text-[14px] text-musgo">Ainda não fez nenhum pedido.</p>
            ) : (
              <ul className="divide-y divide-linho/70 text-[14px]">
                {c.orders.map((o) => (
                  <li key={o.id}>
                    <Link href={`/dashboard/pedidos/${o.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 hover:bg-leite/60">
                      <span className="w-20 font-semibold text-noite-900">#{o.number}</span>
                      <span className="min-w-36 flex-1 text-musgo tabular-nums">{formatDateTime(new Date(o.createdAt))}</span>
                      <OrderStatusBadge status={o.status} />
                      <span className="min-w-28 text-[13px] text-musgo">
                        {o.shipmentStatus ? shipmentStatusLabel(o.shipmentStatus) : o.status === 'pago' ? 'A enviar' : ''}
                      </span>
                      <span className="w-16 text-right text-musgo tabular-nums">
                        {o.itemCount} {o.itemCount === 1 ? 'item' : 'itens'}
                      </span>
                      <span className="w-24 text-right font-semibold tabular-nums">{formatBRL(o.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {c.openCarts.length > 0 && (
            <section className="rounded-[20px] border border-linho bg-white">
              <header className="border-b border-linho px-5 py-4">
                <h2 className="text-[16px] font-semibold text-noite-900">Sacolas que não viraram pedido</h2>
                <p className="text-[13px] text-musgo">Valores pelos preços atuais do catálogo. Boa chance de recuperar pelo WhatsApp.</p>
              </header>
              <ul className="divide-y divide-linho/70 text-[14px]">
                {c.openCarts.map((cart) => (
                  <li key={cart.cartId} className="space-y-2 px-5 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <StageBadge stage={cart.stage} />
                        <span className="text-[13px] text-musgo tabular-nums">{formatDateTime(new Date(cart.lastActivityAt))}</span>
                      </span>
                      <span className="font-semibold tabular-nums">{formatBRL(cart.value)}</span>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {cart.items.map((i, idx) => (
                        <li key={idx} className="flex items-center gap-2 rounded-xl border border-linho py-1 pr-3 pl-1 text-[13px]">
                          <img src={i.image} alt="" className="size-8 rounded-lg object-cover" />
                          {i.name} <span className="text-musgo">×{i.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <Card title="Dados da cliente">
            <dl className="space-y-1.5">
              <Field label="Nome" value={c.name} />
              <Field label="E-mail" value={c.email} />
              <Field label="Telefone" value={formatPhone(c.phone)} />
              {c.cpf && <Field label="CPF" value={maskCpf(c.cpf)} />}
              {c.birthDate && <Field label="Aniversário" value={`🎂 ${formatBirthday(c.birthDate, true)}`} />}
              <Field label="Última atividade" value={formatDateTime(new Date(c.lastActivityAt))} />
            </dl>
          </Card>

          <Card title="Último endereço">
            {a ? (
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
            ) : (
              <p className="text-musgo">Ainda não informou o endereço.</p>
            )}
          </Card>
        </aside>
      </div>
    </main>
  )
}

function Tile({ label, value, hint, danger }: { label: string; value: string; hint: string; danger?: boolean }) {
  return (
    <div className="rounded-[20px] border border-linho bg-white p-6">
      <p className="text-[14px] text-musgo">{label}</p>
      <p className={`mt-2 text-[28px] leading-none font-semibold ${danger ? 'text-rubor' : 'text-noite-900'}`}>{value}</p>
      <p className="mt-2 text-[12px] text-musgo">{hint}</p>
    </div>
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

import { Check, Mail, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { StageBadge } from '@/components/dashboard/clientes/journeys-table'
import { dashBtn, PageHeader, pageShell } from '@/components/dashboard/page-header'
import { getJourney } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/http'
import type { JourneyDetail } from '@/lib/api/types'
import { formatBRL, formatDateTime, formatPhone } from '@/lib/format'
import { ORDER_STATUS_LABEL, stageInfo } from '@/lib/journey'
import { maskCpf } from '@/lib/masks'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Cliente · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

type Params = Promise<{ cartId: string }>

export default async function ClienteDetalhePage({ params }: { params: Params }) {
  const { cartId } = await params
  if (!/^[0-9a-f-]{36}$/i.test(cartId)) notFound()

  const j = await getJourney(cartId).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound()
    throw err
  })

  const c = j.customer
  const a = j.shippingAddress

  return (
    <main className={pageShell}>
      <PageHeader
        title={c?.name ?? 'Visitante não identificada'}
        description={c ? `${c.email} · ${formatPhone(c.phone)}` : 'Montou a sacola, mas ainda não iniciou o checkout.'}
        breadcrumb={[{ href: '/dashboard/clientes', label: 'Clientes' }]}
        actions={
          c && (
            <>
              <a href={`https://wa.me/55${c.phone}`} target="_blank" rel="noopener noreferrer" className={dashBtn.primary}>
                <MessageCircle className="size-4" aria-hidden /> WhatsApp
              </a>
              <a href={`mailto:${c.email}`} className={dashBtn.outline}>
                <Mail className="size-4" aria-hidden /> E-mail
              </a>
            </>
          )
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Timeline journey={j} />

          <section className="rounded-[20px] border border-linho bg-white">
            <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-linho px-5 py-4">
              <h2 className="text-[16px] font-semibold text-noite-900">
                {j.order ? `Pedido #${j.order.number}` : 'O que tem na sacola'}
              </h2>
              <span className="text-[13px] text-musgo">
                {j.order ? `${ORDER_STATUS_LABEL[j.order.status]} · valores do momento da compra` : 'preços atuais do catálogo'}
              </span>
            </header>
            {j.items.length === 0 ? (
              <p className="px-5 py-8 text-center text-[14px] text-musgo">A sacola está vazia (os itens foram removidos).</p>
            ) : (
              <ul className="divide-y divide-linho/70">
                {j.items.map((i) => (
                  <li key={i.productId} className="flex items-center gap-4 px-5 py-3">
                    <img src={i.image} alt="" className="size-12 shrink-0 rounded-xl border border-linho object-cover" />
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
            )}
            <dl className="space-y-1.5 border-t border-linho px-5 py-4 text-[14px]">
              <Row label="Subtotal" value={formatBRL(j.totals.subtotal)} />
              {j.totals.discount > 0 && <Row label={`Desconto${j.couponCode ? ` (${j.couponCode})` : ''}`} value={`- ${formatBRL(j.totals.discount)}`} />}
              {!j.order && j.couponCode && <Row label="Cupom aplicado" value={j.couponCode} />}
              <Row label="Envio" value={j.totals.shipping === null ? (j.shippingOption ?? 'não escolhido') : j.totals.shipping === 0 ? 'Grátis' : formatBRL(j.totals.shipping)} />
              <div className="flex justify-between border-t border-linho pt-2 text-[16px] font-semibold text-noite-900">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatBRL(j.totals.total)}</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="space-y-4">
          <Card title="Dados da cliente">
            {c ? (
              <dl className="space-y-1.5">
                <Field label="Nome" value={c.name} />
                <Field label="E-mail" value={c.email} />
                <Field label="Telefone" value={formatPhone(c.phone)} />
                <Field label="CPF" value={maskCpf(c.cpf)} />
              </dl>
            ) : (
              <p className="text-musgo">Ainda não informou os dados.</p>
            )}
          </Card>

          <Card title="Entrega">
            {a ? (
              <div className="space-y-0.5">
                <p className="font-medium text-noite-900">{a.recipient}</p>
                <p>{a.street}, {a.number}{a.complement && ` — ${a.complement}`}</p>
                <p>{a.district} · {a.city}/{a.state}</p>
                <p>CEP {a.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}</p>
                {j.shippingOption && <p className="mt-1.5 text-noite-900">{j.shippingOption}</p>}
              </div>
            ) : (
              <p className="text-musgo">Ainda não informou o endereço.</p>
            )}
          </Card>

          {j.otherSessions.length > 0 && (
            <Card title="Outras visitas desta cliente">
              <ul className="space-y-2">
                {j.otherSessions.map((s) => (
                  <li key={s.cartId}>
                    <Link href={`/dashboard/clientes/${s.cartId}`} className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 hover:bg-leite">
                      <span>
                        <span className={cn('block text-[13px] font-medium', s.order ? 'text-folha' : 'text-noite-900')}>
                          {s.order ? `Pedido #${s.order.number}` : stageInfo(s.stage).label}
                        </span>
                        <span className="text-[12px] text-musgo">{formatDateTime(new Date(s.lastActivityAt))}</span>
                      </span>
                      <span className="font-semibold tabular-nums">{formatBRL(s.value)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </main>
  )
}

/** Linha do tempo: as 4 etapas do checkout, com data de cada uma que foi concluída. */
function Timeline({ journey: j }: { journey: JourneyDetail }) {
  const steps = [
    { label: 'Montou a sacola', at: j.timeline.createdAt },
    { label: 'Identificou-se', at: j.timeline.identifiedAt },
    { label: 'Informou a entrega', at: j.timeline.deliveryAt },
    { label: j.order ? `Fez o pedido #${j.order.number}` : 'Finalizou o pedido', at: j.timeline.orderedAt },
  ]
  const nextIndex = steps.findIndex((s) => !s.at)

  return (
    <section aria-label="Jornada no checkout" className="rounded-[20px] border border-linho bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold text-noite-900">Jornada no checkout</h2>
        <StageBadge stage={j.stage} />
      </div>
      <ol className="grid gap-3 sm:grid-cols-4">
        {steps.map((s, i) => {
          const done = Boolean(s.at)
          const stoppedHere = i === nextIndex
          return (
            <li
              key={s.label}
              className={cn(
                'rounded-2xl border p-3',
                done ? 'border-folha/30 bg-folha/5' : stoppedHere ? 'border-rubor/40 bg-rubor/5' : 'border-linho bg-leite/40',
              )}
            >
              <span
                className={cn(
                  'mb-2 flex size-7 items-center justify-center rounded-full text-[12px] font-semibold',
                  done ? 'bg-folha text-leite' : stoppedHere ? 'bg-rubor text-leite' : 'bg-linho text-musgo',
                )}
              >
                {done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <p className={cn('text-[13px] font-medium', done ? 'text-noite-900' : 'text-musgo')}>{s.label}</p>
              <p className={cn('mt-0.5 text-[12px]', stoppedHere ? 'font-medium text-rubor' : 'text-musgo')}>
                {s.at ? formatDateTime(new Date(s.at)) : stoppedHere ? 'Parou aqui' : '—'}
              </p>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-[12px] text-musgo">Última atividade: {formatDateTime(new Date(j.lastActivityAt))}</p>
    </section>
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
    <div className="flex justify-between text-musgo">
      <dt>{label}</dt>
      <dd className="font-medium text-tinta tabular-nums">{value}</dd>
    </div>
  )
}

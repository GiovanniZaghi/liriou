'use client'

import { Check, ExternalLink, Gift, Loader2, PackageSearch, Truck } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { ApiError } from '@/lib/api/http'
import { ordersApi } from '@/lib/api/orders'
import type { CustomerOrder, CustomerOrdersLookup, FulfillmentStage } from '@/lib/api/types'
import { isValidCpf } from '@/lib/checkout'
import { formatBRL, formatDateTime } from '@/lib/format'
import { maskCpf } from '@/lib/masks'
import { FULFILLMENT_STEPS } from '@/lib/orders'
import { cn } from '@/lib/utils'
import { btnPrimary } from './styles'

/**
 * "Meus pedidos" sem cadastro: a cliente digita o CPF da compra.
 * O CPF fica só na memória da página (não vai para a URL nem para o navegador).
 */
export function CustomerOrders() {
  const [cpf, setCpf] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CustomerOrdersLookup | null>(null)

  async function search(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidCpf(cpf)) return setError('Confira o CPF: ele parece incompleto ou inválido.')
    setError('')
    setLoading(true)
    try {
      setResult(await ordersApi.lookup(cpf))
    } catch (err) {
      setResult(null)
      if (err instanceof ApiError && err.status === 429) setError('Muitas tentativas seguidas. Aguarde um minuto e tente de novo.')
      else if (err instanceof ApiError && err.fields?.cpf) setError(err.fields.cpf)
      else setError('Não foi possível consultar agora. Tente de novo em instantes.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={search} noValidate className="rounded-3xl border border-borda bg-white p-6 shadow-sm sm:p-8">
        <label htmlFor="mp-cpf" className="mb-1 block text-xs font-semibold tracking-wider text-grafite uppercase">
          CPF usado na compra
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="mp-cpf"
            value={cpf}
            onChange={(e) => {
              setCpf(maskCpf(e.target.value))
              setError('')
            }}
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'mp-cpf-erro' : undefined}
            className={cn(
              'w-full flex-1 rounded-xl border bg-white px-4 py-3 text-sm text-grafite placeholder:text-cinza/60 focus:outline-none',
              error ? 'border-rubor' : 'border-borda focus:border-salvia',
            )}
          />
          <button type="submit" disabled={loading} className={cn(btnPrimary, 'justify-center sm:w-auto')}>
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <PackageSearch className="size-4" aria-hidden />}
            Ver meus pedidos
          </button>
        </div>
        {error && (
          <p id="mp-cpf-erro" role="alert" className="mt-2 text-[12px] text-rubor">
            {error}
          </p>
        )}
      </form>

      {result && (
        <section aria-live="polite" className="space-y-5">
          {result.orders.length === 0 ? (
            <div className="rounded-3xl border border-borda bg-white p-10 text-center text-sm text-cinza">
              <p>Não encontramos pedidos com este CPF.</p>
              <p className="mt-1">Confira se é o mesmo CPF informado na compra.</p>
              <Link href="/vitrine" className="mt-4 inline-block font-medium text-salvia hover:underline">
                Conhecer a coleção
              </Link>
            </div>
          ) : (
            <>
              <p className="text-center text-sm text-cinza">
                {result.firstName ? `Olá, ${result.firstName}! ` : ''}
                {result.orders.length === 1 ? 'Encontramos 1 pedido.' : `Encontramos ${result.orders.length} pedidos.`}
              </p>
              {result.orders.map((o) => (
                <OrderCard key={o.number} order={o} />
              ))}
            </>
          )}
        </section>
      )}
    </div>
  )
}

function OrderCard({ order: o }: { order: CustomerOrder }) {
  const itemCount = o.items.reduce((s, i) => s + i.quantity, 0)
  return (
    <article className="overflow-hidden rounded-3xl border border-borda bg-white shadow-sm">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-borda px-6 py-4">
        <div>
          <h2 className="font-serif text-xl text-grafite">Pedido #{o.number}</h2>
          <p className="text-[12px] text-cinza">
            {formatDateTime(new Date(o.createdAt))} · {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          </p>
        </div>
        <p className="font-serif text-xl text-grafite">{formatBRL(o.total)}</p>
      </header>

      <div className="space-y-5 px-6 py-5">
        {o.stage === 'cancelado' ? (
          <p className="rounded-xl bg-linho/60 px-4 py-3 text-sm text-cinza">
            Este pedido foi cancelado (pagamento não concluído ou estornado). Se precisar de ajuda, fale com a gente.
          </p>
        ) : (
          <Timeline stage={o.stage} pickup={o.shipping.pickup} />
        )}

        <ul className="flex flex-wrap gap-3">
          {o.items.map((i) => (
            <li key={i.name} className="flex items-center gap-2 rounded-2xl bg-algodao py-1.5 pr-3 pl-1.5">
              <img src={i.image} alt="" className="size-10 rounded-xl object-cover" />
              <span className="text-xs text-grafite">
                {i.name} <span className="text-cinza">×{i.quantity}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="space-y-1.5 border-t border-borda pt-4 text-xs text-cinza">
          <p className="flex items-center gap-2">
            <Truck className="size-3.5 shrink-0" aria-hidden />
            <span>
              {o.shipping.label}
              {o.shipping.pickup
                ? ' · combinamos a retirada pelo WhatsApp'
                : o.city && ` · para ${o.city}/${o.state}`}
            </span>
          </p>
          {o.giftWrap && (
            <p className="flex items-center gap-2 text-rubor">
              <Gift className="size-3.5 shrink-0" aria-hidden /> Com embalagem de Natal
            </p>
          )}
          {o.tracking?.lastEvent && (
            <p className="pl-5.5">
              Última atualização: {o.tracking.lastEvent.description}
              {o.tracking.lastEvent.location && ` · ${o.tracking.lastEvent.location}`} ({o.tracking.lastEvent.at})
            </p>
          )}
          {o.tracking?.number && (
            <p className="pl-5.5">
              Rastreio: <span className="font-mono text-grafite">{o.tracking.number}</span>
              {o.tracking.url && (
                <a
                  href={o.tracking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 font-medium text-salvia hover:underline"
                >
                  Acompanhar entrega <ExternalLink className="size-3" aria-hidden />
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

/** Recebido → Pago → Separando → Enviado → Entregue (na retirada, sem "Enviado"). */
function Timeline({ stage, pickup }: { stage: FulfillmentStage; pickup: boolean }) {
  const steps = pickup ? FULFILLMENT_STEPS.filter((s) => s !== 'enviado') : FULFILLMENT_STEPS
  const label = (s: (typeof steps)[number]) =>
    ({ recebido: 'Recebido', pago: 'Pago', separando: 'Separando', enviado: 'Enviado', entregue: pickup ? 'Retirado' : 'Entregue' })[s]
  const current = steps.indexOf(stage as (typeof steps)[number])

  return (
    <ol className="flex items-start" aria-label="Andamento do pedido">
      {steps.map((s, i) => {
        const done = i <= current
        const isCurrent = i === current
        return (
          <li key={s} className="relative flex flex-1 flex-col items-center text-center" aria-current={isCurrent ? 'step' : undefined}>
            {i > 0 && (
              <span
                aria-hidden
                className={cn('absolute top-3.5 right-1/2 h-0.5 w-full -translate-y-1/2', i <= current ? 'bg-salvia' : 'bg-borda')}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex size-7 items-center justify-center rounded-full border-2 text-[11px] font-bold',
                done ? 'border-salvia bg-salvia text-white' : 'border-borda bg-white text-cinza',
                isCurrent && 'ring-4 ring-salvia/20',
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
            </span>
            <span className={cn('mt-1.5 text-[11px] leading-tight sm:text-xs', done ? 'font-semibold text-grafite' : 'text-cinza')}>
              {label(s)}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

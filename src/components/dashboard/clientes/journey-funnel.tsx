import Link from 'next/link'
import type { CheckoutStage, JourneyFunnel as Funnel } from '@/lib/api/types'
import { formatBRL, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

const STEPS: { stage: CheckoutStage; label: string; hint: string }[] = [
  { stage: 'cart', label: 'Na sacola', hint: 'montaram a sacola e não iniciaram o checkout' },
  { stage: 'identified', label: 'Pararam na entrega', hint: 'se identificaram e não informaram o endereço' },
  { stage: 'delivery', label: 'Pararam na revisão', hint: 'informaram a entrega e não confirmaram' },
  { stage: 'ordered', label: 'Pedidos realizados', hint: 'concluíram o checkout' },
]

/** Funil do checkout: cada etapa é um filtro da lista abaixo. */
export function JourneyFunnel({ funnel, active }: { funnel: Funnel; active?: CheckoutStage }) {
  const total = funnel.cart + funnel.identified + funnel.delivery + funnel.ordered
  const conversion = total ? Math.round((funnel.ordered / total) * 100) : 0

  return (
    <section aria-label="Funil do checkout" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[20px] bg-noite-900 p-6 text-leite">
          <p className="text-[14px] text-leite/78">Vendido em pedidos</p>
          <p className="mt-2 text-[40px] leading-none font-semibold tracking-[-0.02em]">{formatBRL(funnel.orderedValue)}</p>
          <p className="mt-2 text-[13px] text-leite/70">
            {funnel.ordered} {funnel.ordered === 1 ? 'pedido' : 'pedidos'} · conversão de {conversion}%
          </p>
        </div>
        <div className="rounded-[20px] border border-linho bg-white p-6">
          <p className="text-[14px] text-musgo">Em sacolas não finalizadas</p>
          <p className="mt-2 text-[40px] leading-none font-semibold text-rubor">{formatBRL(funnel.openValue)}</p>
          <p className="mt-2 text-[13px] text-musgo">
            {formatNumber(funnel.cart + funnel.identified + funnel.delivery)} clientes não concluíram a compra
          </p>
        </div>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ stage, label, hint }, i) => {
          const count = funnel[stage]
          const isActive = active === stage
          return (
            <li key={stage}>
              <Link
                href={isActive ? '/dashboard/clientes' : `/dashboard/clientes?etapa=${stage}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'block h-full rounded-[20px] border bg-white p-5 transition-colors hover:border-noite-900',
                  isActive ? 'border-noite-900 ring-1 ring-noite-900' : 'border-linho',
                )}
              >
                <p className="text-[12px] font-semibold tracking-[0.08em] text-musgo uppercase">
                  {i + 1}. {label}
                </p>
                <p className={cn('mt-2 text-[32px] leading-none font-semibold', stage === 'ordered' ? 'text-folha' : 'text-noite-900')}>
                  {formatNumber(count)}
                </p>
                <p className="mt-2 text-[12px] leading-snug text-musgo">{hint}</p>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

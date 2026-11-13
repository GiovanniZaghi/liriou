import { formatBRL } from '@/lib/format'
import { cn } from '@/lib/utils'

export interface SummaryItem {
  key: string
  name: string
  image: string
  quantity: number
  lineTotal: number
  warning?: string
}

interface OrderSummaryProps {
  items: SummaryItem[]
  subtotal: number
  discount: number
  couponCode?: string | null
  /** Cupom na sacola mas sem desconto agora (expirou, falta mínimo...) */
  couponNotice?: string | null
  /** null = ainda não escolhido */
  shipping: number | null
  total: number
  installments: number
  footer?: React.ReactNode
}

/** Resumo lateral: itens + totais (sacola durante o checkout; pedido na etapa de pagamento). */
export function OrderSummary({ items, subtotal, discount, couponCode, couponNotice, shipping, total, installments, footer }: OrderSummaryProps) {
  return (
    <aside aria-label="Resumo do pedido" className="rounded-3xl border border-borda bg-white p-6 shadow-sm lg:sticky lg:top-6">
      <h2 className="font-serif text-xl text-grafite">Resumo do pedido</h2>
      <ul className="mt-4 divide-y divide-borda">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-3 py-3">
            <div className="relative size-14 shrink-0">
              <img src={item.image} alt="" className="size-full rounded-xl border border-borda object-cover" />
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-grafite text-[10px] font-bold text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-grafite">{item.name}</p>
              {item.warning && <p className="text-[10px] text-rubor">{item.warning}</p>}
            </div>
            <span className="text-xs font-semibold whitespace-nowrap">{formatBRL(item.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-2 space-y-2 border-t border-borda pt-4 text-xs text-cinza">
        <Row label="Subtotal" value={formatBRL(subtotal)} />
        <Row label="Envio" value={shipping === null ? 'A escolher' : shipping === 0 ? 'Grátis' : formatBRL(shipping)} />
        {discount > 0 && <Row label={`Desconto${couponCode ? ` (${couponCode})` : ''}`} value={`- ${formatBRL(discount)}`} className="text-salvia" />}
      </dl>
      {couponNotice && (
        <p role="status" className="mt-2 rounded-lg bg-rubor/5 px-3 py-2 text-[11px] text-rubor">
          Cupom {couponCode}: {couponNotice}
        </p>
      )}
      <div className="mt-3 flex items-baseline justify-between border-t border-borda pt-3">
        <span className="text-sm font-semibold text-grafite">Total</span>
        <span className="text-right">
          <span className="block font-serif text-2xl text-grafite">{formatBRL(total)}</span>
          <span className="text-[10px] text-cinza">
            ou {installments}x de {formatBRL(total / installments)}
          </span>
        </span>
      </div>
      {footer}
    </aside>
  )
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn('flex justify-between', className)}>
      <dt>{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}

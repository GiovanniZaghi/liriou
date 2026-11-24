import { Truck } from 'lucide-react'
import Link from 'next/link'
import type { AdminOrderRow } from '@/lib/api/types'
import { formatBRL, formatDateTime } from '@/lib/format'
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS, shipmentStatusLabel } from '@/lib/orders'
import { cn } from '@/lib/utils'
import { OrderStatusBadge } from './order-badges'

export function OrdersTable({ rows, emptyMessage = 'Nenhum pedido encontrado.' }: { rows: AdminOrderRow[]; emptyMessage?: string }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[20px] border border-linho bg-white px-6 py-14 text-center text-[14px] text-musgo">{emptyMessage}</div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-[20px] border border-linho bg-white">
      <table className="w-full min-w-[960px] text-left text-[14px]">
        <thead className="border-b border-linho text-[12px] font-semibold tracking-[0.08em] text-musgo uppercase">
          <tr>
            <th scope="col" className="px-5 py-3.5 font-semibold">Pedido</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Cliente</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Pagamento</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Envio</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Itens</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id} className="border-b border-linho/70 last:border-0 hover:bg-leite/60">
              <td className="px-5 py-3">
                <Link href={`/dashboard/pedidos/${o.id}`} className="block">
                  <span className="block font-semibold text-noite-900 hover:underline">#{o.number}</span>
                  <span className="block text-[12px] whitespace-nowrap text-musgo tabular-nums">
                    {formatDateTime(new Date(o.createdAt))}
                  </span>
                </Link>
              </td>
              <td className="px-5 py-3">
                <Link href={`/dashboard/clientes/${encodeURIComponent(o.customer.email)}`} className="block">
                  <span className="block font-medium text-noite-900 hover:underline">
                    {o.customer.name}
                    {o.giftWrap && (
                      <span title="Embalagem de Natal" className="ml-2 rounded-full bg-rubor/10 px-2 py-0.5 text-[11px] font-semibold text-rubor">
                        🎁 Natal
                      </span>
                    )}
                  </span>
                  <span className="block text-[12px] text-musgo">
                    {o.customer.email}
                    {o.city && ` · ${o.city}/${o.state}`}
                  </span>
                </Link>
              </td>
              <td className="px-5 py-3">
                <OrderStatusBadge status={o.status} />
              </td>
              <td className="px-5 py-3 text-[13px]">
                {o.payment ? (
                  <>
                    <span className="block text-noite-900">
                      {PAYMENT_METHOD_LABEL[o.payment.method] ?? o.payment.method}
                      {o.payment.method === 'credit_card' && o.payment.installments > 1 && ` ${o.payment.installments}x`}
                    </span>
                    <span className={cn('block text-[12px] font-medium', PAYMENT_STATUS[o.payment.status]?.tone)}>
                      {PAYMENT_STATUS[o.payment.status]?.label ?? o.payment.status}
                    </span>
                  </>
                ) : (
                  <span className="text-musgo">Não iniciado</span>
                )}
              </td>
              <td className="px-5 py-3 text-[13px]">
                {o.shipment ? (
                  <>
                    <span className="block text-noite-900">{shipmentStatusLabel(o.shipment.status)}</span>
                    {o.shipment.trackingNumber && (
                      <span className="block font-mono text-[12px] text-musgo">{o.shipment.trackingNumber}</span>
                    )}
                  </>
                ) : o.status === 'pago' ? (
                  <span className="inline-flex items-center gap-1 font-medium text-rubor">
                    <Truck className="size-3.5" aria-hidden /> A enviar
                  </span>
                ) : (
                  <span className="text-musgo">—</span>
                )}
              </td>
              <td className="px-5 py-3 text-right tabular-nums">{o.itemCount}</td>
              <td className="px-5 py-3 text-right font-semibold whitespace-nowrap tabular-nums">{formatBRL(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

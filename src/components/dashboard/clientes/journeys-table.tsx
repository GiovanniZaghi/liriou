import Link from 'next/link'
import type { JourneyRow } from '@/lib/api/types'
import { formatBRL, formatDateTime, formatPhone } from '@/lib/format'
import { ORDER_STATUS_LABEL, stageInfo } from '@/lib/journey'
import { cn } from '@/lib/utils'

export function StageBadge({ stage }: { stage: JourneyRow['stage'] }) {
  const info = stageInfo(stage)
  return <span className={cn('rounded-full px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap', info.tone)}>{info.label}</span>
}

export function JourneysTable({ rows }: { rows: JourneyRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[20px] border border-linho bg-white px-6 py-14 text-center text-[14px] text-musgo">
        Nenhuma cliente encontrada.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-[20px] border border-linho bg-white">
      <table className="w-full min-w-[920px] text-left text-[14px]">
        <thead className="border-b border-linho text-[12px] font-semibold tracking-[0.08em] text-musgo uppercase">
          <tr>
            <th scope="col" className="px-5 py-3.5 font-semibold">Cliente</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Onde parou</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Itens</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Valor</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Local</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Última atividade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.cartId} className="border-b border-linho/70 last:border-0 hover:bg-leite/60">
              <td className="px-5 py-3">
                <Link href={`/dashboard/clientes/${r.cartId}`} className="block">
                  {r.customer ? (
                    <>
                      <span className="block font-medium text-noite-900 hover:underline">{r.customer.name}</span>
                      <span className="block text-[12px] text-musgo">
                        {r.customer.email} · {formatPhone(r.customer.phone)}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="block font-medium text-musgo hover:underline">Visitante não identificada</span>
                      <span className="block text-[12px] text-musgo/80">ainda não iniciou o checkout</span>
                    </>
                  )}
                </Link>
              </td>
              <td className="px-5 py-3">
                <StageBadge stage={r.stage} />
                {r.order && (
                  <span className="mt-1 block text-[12px] text-musgo">
                    #{r.order.number} · {ORDER_STATUS_LABEL[r.order.status]}
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-right tabular-nums">{r.itemCount}</td>
              <td className="px-5 py-3 text-right font-semibold whitespace-nowrap tabular-nums">{formatBRL(r.value)}</td>
              <td className="px-5 py-3 text-musgo">{r.city ? `${r.city}/${r.state}` : '—'}</td>
              <td className="px-5 py-3 whitespace-nowrap text-musgo tabular-nums">{formatDateTime(new Date(r.lastActivityAt))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

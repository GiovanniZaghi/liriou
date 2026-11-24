import Link from 'next/link'
import type { CustomerRow } from '@/lib/api/types'
import { formatBirthday, formatBRL, formatDateTime, formatPhone } from '@/lib/format'

export const customerHref = (email: string) => `/dashboard/clientes/${encodeURIComponent(email)}`

export function CustomersTable({ rows }: { rows: CustomerRow[] }) {
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
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Pedidos</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Total gasto</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Último pedido</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">Sacola aberta</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Local</th>
            <th scope="col" className="px-5 py-3.5 font-semibold">Última atividade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.email} className="border-b border-linho/70 last:border-0 hover:bg-leite/60">
              <td className="px-5 py-3">
                <Link href={customerHref(r.email)} className="block">
                  <span className="block font-medium text-noite-900 hover:underline">
                    {r.name}
                    {r.birthDate && (
                      <span title="Aniversário" className="ml-2 text-[12px] font-normal text-musgo">🎂 {formatBirthday(r.birthDate)}</span>
                    )}
                  </span>
                  <span className="block text-[12px] text-musgo">
                    {r.email} · {formatPhone(r.phone)}
                  </span>
                </Link>
              </td>
              <td className="px-5 py-3 text-right tabular-nums">
                {r.ordersCount > 0 ? (
                  <>
                    <span className="font-semibold text-noite-900">{r.ordersCount}</span>
                    {r.paidOrdersCount !== r.ordersCount && (
                      <span className="block text-[12px] text-musgo">{r.paidOrdersCount} pago{r.paidOrdersCount === 1 ? '' : 's'}</span>
                    )}
                  </>
                ) : (
                  <span className="text-musgo">0</span>
                )}
              </td>
              <td className="px-5 py-3 text-right font-semibold whitespace-nowrap tabular-nums">
                {r.totalSpent > 0 ? formatBRL(r.totalSpent) : <span className="font-normal text-musgo">—</span>}
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-musgo tabular-nums">
                {r.lastOrderAt ? formatDateTime(new Date(r.lastOrderAt)) : 'Nunca comprou'}
              </td>
              <td className="px-5 py-3 text-right whitespace-nowrap tabular-nums">
                {r.openCartsCount > 0 ? <span className="font-medium text-rubor">{formatBRL(r.openCartsValue)}</span> : <span className="text-musgo">—</span>}
              </td>
              <td className="px-5 py-3 text-musgo">{r.city ? `${r.city}/${r.state}` : '—'}</td>
              <td className="px-5 py-3 whitespace-nowrap text-musgo tabular-nums">{formatDateTime(new Date(r.lastActivityAt))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

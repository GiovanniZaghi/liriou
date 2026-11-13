import type { StockMovement } from '@/lib/api/types'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'

export function MovementsTable({ rows, total }: { rows: StockMovement[]; total: number }) {
  return (
    <section aria-labelledby="historico-titulo" className="rounded-[20px] border border-linho bg-white">
      <header className="flex items-baseline justify-between border-b border-linho px-5 py-4">
        <h2 id="historico-titulo" className="text-[16px] font-semibold text-noite-900">
          Histórico de estoque
        </h2>
        <span className="text-[13px] text-musgo">
          {total > rows.length ? `últimas ${rows.length} de ${total}` : `${total} movimentações`}
        </span>
      </header>
      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-[14px] text-musgo">Nenhuma movimentação ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead className="text-[12px] font-semibold tracking-[0.08em] text-musgo uppercase">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Data</th>
                <th scope="col" className="px-5 py-3 font-semibold">Tipo</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Qtd.</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Saldo</th>
                <th scope="col" className="px-5 py-3 font-semibold">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const entrada = m.type === 'entrada'
                return (
                  <tr key={m.id} className="border-t border-linho/70">
                    <td className="px-5 py-3 whitespace-nowrap text-musgo tabular-nums">{formatDateTime(new Date(m.createdAt))}</td>
                    <td className="px-5 py-3">
                      <span className={cn('rounded-full px-2 py-0.5 text-[12px] font-semibold', entrada ? 'bg-folha/12 text-folha' : 'bg-rubor/10 text-rubor')}>
                        {entrada ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className={cn('px-5 py-3 text-right font-semibold tabular-nums', entrada ? 'text-folha' : 'text-rubor')}>
                      {entrada ? '+' : '−'}
                      {m.quantity}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">{m.balanceAfter}</td>
                    <td className="px-5 py-3 text-tinta">{m.reason ?? <span className="text-musgo">—</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

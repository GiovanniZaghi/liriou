import { formatNumber, painLabel } from '@/lib/format'
import { cn } from '@/lib/utils'

interface PainBreakdownProps {
  byPain: { pain: string | null; count: number }[]
  total: number
}

/** Barras horizontais: magnitude por resposta, uma cor só; "Não respondeu" em neutro. */
export function PainBreakdown({ byPain, total }: PainBreakdownProps) {
  // Respostas primeiro (maior → menor); "Não respondeu" sempre no fim
  const rows = [...byPain.filter((r) => r.pain), ...byPain.filter((r) => !r.pain)]
  const max = Math.max(1, ...rows.map((r) => r.count))

  return (
    <figure className="rounded-[20px] border border-linho bg-white p-6">
      <figcaption>
        <h3 className="text-[16px] font-medium text-noite-900">Maior pesadelo ao acordar</h3>
        <p className="text-[13px] text-musgo">Resposta opcional do formulário</p>
      </figcaption>

      {rows.length === 0 ? (
        <p className="mt-6 text-[14px] text-musgo">Nenhum cadastro ainda.</p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3.5">
          {rows.map((r) => {
            const pct = total ? Math.round((r.count / total) * 100) : 0
            return (
              <li key={r.pain ?? 'none'}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[14px]">
                  <span className={r.pain ? 'text-tinta' : 'text-musgo'}>{painLabel(r.pain)}</span>
                  <span className="text-tinta tabular-nums">
                    <strong className="font-semibold">{formatNumber(r.count)}</strong>
                    <span className="ml-1.5 text-musgo">{pct}%</span>
                  </span>
                </div>
                <div
                  className={cn('h-2.5 rounded-r-[4px]', r.pain ? 'bg-folha' : 'bg-musgo/35')}
                  style={{ width: `${(r.count / max) * 100}%`, minWidth: r.count ? 4 : 0 }}
                />
              </li>
            )
          })}
        </ul>
      )}
    </figure>
  )
}

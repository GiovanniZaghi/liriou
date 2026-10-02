import { formatNumber } from '@/lib/format'
import type { LeadStats } from '@/lib/leads-query'

export function StatTiles({ stats }: { stats: LeadStats }) {
  const answeredPct = stats.total ? Math.round((stats.withPain / stats.total) * 100) : 0

  return (
    <section aria-label="Resumo" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      {/* Número principal: um por tela, sans, ≥ 48px */}
      <div className="rounded-[20px] bg-noite-900 p-6 text-leite sm:col-span-2 lg:col-span-1">
        <p className="text-[14px] text-leite/78">Cadastros na lista VIP</p>
        <p className="mt-2 text-[56px] leading-none font-semibold tracking-[-0.02em]">{formatNumber(stats.total)}</p>
      </div>
      <Tile label="Hoje" value={formatNumber(stats.today)} />
      <Tile label="Últimos 7 dias" value={formatNumber(stats.last7)} />
      <Tile
        label="Responderam a pergunta"
        value={`${answeredPct}%`}
        hint={`${formatNumber(stats.withPain)} de ${formatNumber(stats.total)}`}
      />
    </section>
  )
}

function Tile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-[20px] border border-linho bg-white p-6">
      <p className="text-[14px] text-musgo">{label}</p>
      <p className="mt-2 text-[32px] leading-none font-semibold text-noite-900">{value}</p>
      {hint && <p className="mt-2 text-[12px] text-musgo">{hint}</p>}
    </div>
  )
}

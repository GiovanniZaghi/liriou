import Link from 'next/link'
import type { InventorySummary } from '@/lib/api/types'
import { formatBRL, formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'

export function InventoryTiles({ summary }: { summary: InventorySummary }) {
  return (
    <section aria-label="Resumo do estoque" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div className="rounded-[20px] bg-noite-900 p-6 text-leite sm:col-span-2 lg:col-span-1">
        <p className="text-[14px] text-leite/78">Valor em estoque</p>
        <p className="mt-2 text-[44px] leading-none font-semibold tracking-[-0.02em]">{formatBRL(summary.inventoryValue)}</p>
        <p className="mt-2 text-[13px] text-leite/70">{formatNumber(summary.unitsInStock)} unidades</p>
      </div>
      <Tile
        label="Na vitrine"
        value={`${summary.activeProducts}`}
        hint={`de ${summary.totalProducts} produtos cadastrados`}
      />
      <Tile
        label="Estoque baixo"
        value={formatNumber(summary.lowStock)}
        hint="no mínimo ou abaixo"
        href={summary.lowStock ? '/dashboard/estoque?baixo=1' : undefined}
        alert={summary.lowStock > 0}
      />
      <Tile
        label="Esgotados"
        value={formatNumber(summary.outOfStock)}
        hint="aparecem como “Esgotado” na loja"
        alert={summary.outOfStock > 0}
      />
    </section>
  )
}

function Tile({ label, value, hint, href, alert }: { label: string; value: string; hint?: string; href?: string; alert?: boolean }) {
  const body = (
    <>
      <p className="text-[14px] text-musgo">{label}</p>
      <p className={cn('mt-2 text-[32px] leading-none font-semibold', alert ? 'text-rubor' : 'text-noite-900')}>{value}</p>
      {hint && <p className="mt-2 text-[12px] text-musgo">{hint}</p>}
    </>
  )
  const cls = 'block rounded-[20px] border border-linho bg-white p-6'
  return href ? (
    <Link href={href} className={cn(cls, 'transition-colors hover:border-noite-900')}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  )
}

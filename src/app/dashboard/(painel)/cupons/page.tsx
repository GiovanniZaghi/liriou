import { Pencil, Plus } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CouponActiveToggle } from '@/components/dashboard/cupons/coupon-active-toggle'
import { FlashToast } from '@/components/dashboard/flash-toast'
import { dashBtn, dashControl, PageHeader, pageShell } from '@/components/dashboard/page-header'
import { Pagination } from '@/components/dashboard/pagination'
import { COUPONS_PAGE_SIZE, listCoupons } from '@/lib/api/admin'
import { COUPON_STATUS, couponDiscountLabel } from '@/lib/coupons'
import { formatBRL, formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Cupons · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ q?: string; page?: string; criado?: string; salvo?: string; excluido?: string }>

export default async function CuponsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = params.q?.trim().slice(0, 60) || undefined
  const page = Math.max(1, Number(params.page) || 1)
  const coupons = await listCoupons({ q, page })

  const flash = params.criado
    ? `Cupom ${params.criado} criado.`
    : params.salvo
      ? `Cupom ${params.salvo} atualizado.`
      : params.excluido
        ? 'Cupom excluído.'
        : null

  return (
    <main className={pageShell}>
      {flash && <FlashToast message={flash} />}
      <PageHeader
        title="Cupons"
        description="Descontos válidos para todo o site. A cliente digita o código na sacola."
        actions={
          <Link href="/dashboard/cupons/novo" className={dashBtn.primary}>
            <Plus className="size-4" aria-hidden /> Novo cupom
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <p className="text-[14px] text-musgo">
          {coupons.meta.total} {coupons.meta.total === 1 ? 'cupom' : 'cupons'}
          {q ? ' com a busca atual' : ''}
        </p>
        <form role="search" className="flex items-center gap-2">
          <label className="sr-only" htmlFor="cupom-busca">Buscar cupom</label>
          <input id="cupom-busca" name="q" type="search" defaultValue={q} placeholder="Código ou descrição" className={`${dashControl} w-[240px]`} />
          <button type="submit" className="h-11 cursor-pointer rounded-full bg-noite-900 px-5 text-[14px] font-semibold text-leite hover:bg-noite-800">Buscar</button>
        </form>
      </div>

      {coupons.data.length === 0 ? (
        <div className="rounded-[20px] border border-linho bg-white px-6 py-14 text-center text-[14px] text-musgo">
          Nenhum cupom encontrado.{' '}
          <Link href="/dashboard/cupons/novo" className="font-medium text-noite-900 underline">Criar cupom</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[20px] border border-linho bg-white">
          <table className="w-full min-w-[900px] text-left text-[14px]">
            <thead className="border-b border-linho text-[12px] font-semibold tracking-[0.08em] text-musgo uppercase">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold">Código</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Desconto</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Pedido mínimo</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Validade</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold">Usos</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Situação</th>
                <th scope="col" className="px-5 py-3.5 font-semibold">Ativo</th>
                <th scope="col" className="px-5 py-3.5"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {coupons.data.map((c) => {
                const status = COUPON_STATUS[c.status]
                return (
                  <tr key={c.id} className="border-b border-linho/70 last:border-0 hover:bg-leite/60">
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/cupons/${c.id}`} className="font-mono font-semibold text-noite-900 hover:underline">{c.code}</Link>
                      {c.description && <span className="block text-[12px] text-musgo">{c.description}</span>}
                    </td>
                    <td className="px-5 py-3 font-medium whitespace-nowrap">{couponDiscountLabel(c)}</td>
                    <td className="px-5 py-3 text-musgo">{c.minSubtotal > 0 ? formatBRL(c.minSubtotal) : '—'}</td>
                    <td className="px-5 py-3 text-[13px] whitespace-nowrap text-musgo">
                      {c.startsAt || c.endsAt ? (
                        <>
                          {c.startsAt && <span className="block">de {formatDateTime(new Date(c.startsAt))}</span>}
                          {c.endsAt && <span className="block">até {formatDateTime(new Date(c.endsAt))}</span>}
                        </>
                      ) : 'Sem prazo'}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {c.usedCount}
                      <span className="text-musgo">{c.maxUses ? ` / ${c.maxUses}` : ''}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-[12px] font-semibold', status.tone)}>{status.label}</span>
                    </td>
                    <td className="px-5 py-3"><CouponActiveToggle id={c.id} code={c.code} isActive={c.isActive} /></td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/dashboard/cupons/${c.id}`} className={dashBtn.ghost}>
                        <Pencil className="size-3.5" aria-hidden /> Editar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination basePath="/dashboard/cupons" query={{ q }} page={page} total={coupons.meta.total} pageSize={COUPONS_PAGE_SIZE} />
    </main>
  )
}

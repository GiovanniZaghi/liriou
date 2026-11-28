import type { Metadata } from 'next'
import Link from 'next/link'
import { dashControl, PageHeader, pageShell } from '@/components/dashboard/page-header'
import { EyeOff } from 'lucide-react'
import { Pagination } from '@/components/dashboard/pagination'
import { OrdersTable } from '@/components/dashboard/pedidos/orders-table'
import { getOrdersSummary, listOrders, ORDERS_PAGE_SIZE } from '@/lib/api/admin'
import type { OrderFilters, OrdersSummary, OrderStatus } from '@/lib/api/types'
import { formatBRL, formatNumber } from '@/lib/format'
import { ORDER_STATUS_OPTIONS } from '@/lib/orders'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Pedidos · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ q?: string; status?: string; enviar?: string; ocultos?: string; page?: string }>

export default async function PedidosPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filters: OrderFilters = {
    q: params.q?.trim().slice(0, 100) || undefined,
    status: ORDER_STATUS_OPTIONS.some((o) => o.value === params.status) ? (params.status as OrderStatus) : undefined,
    toShip: params.enviar === '1' || undefined,
    hidden: params.ocultos === '1' || undefined,
    page: Math.max(1, Number(params.page) || 1),
  }
  const hasFilters = Boolean(filters.q || filters.status || filters.toShip || filters.hidden)

  const [summary, orders] = await Promise.all([getOrdersSummary(), listOrders(filters)])

  return (
    <main className={pageShell}>
      <PageHeader title="Pedidos" description="Tudo o que foi comprado na loja: pagamento, envio e etiqueta de cada pedido." />

      <SummaryTiles summary={summary} filters={filters} />

      <section aria-labelledby="pedidos-titulo" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="pedidos-titulo" className="font-serif text-[32px] leading-none text-noite-900">
              {filters.hidden ? 'Ocultos (entregues)' : filters.toShip ? 'A enviar' : filters.status ? ORDER_STATUS_OPTIONS.find((o) => o.value === filters.status)?.label : 'Todos os pedidos'}
            </h2>
            <p className="mt-1 text-[14px] text-musgo">
              {formatNumber(orders.meta.total)} {orders.meta.total === 1 ? 'pedido' : 'pedidos'}
              {hasFilters ? ' com os filtros atuais' : ''} · mais recentes primeiro
            </p>
            <Link
              href={filters.hidden ? '/dashboard/pedidos' : '/dashboard/pedidos?ocultos=1'}
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-musgo underline hover:text-noite-900"
            >
              <EyeOff className="size-3.5" aria-hidden />
              {filters.hidden ? 'Voltar para a fila' : `Ver ocultos (${formatNumber(summary.hidden)})`}
            </Link>
          </div>

          <form role="search" className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="pedidos-busca">Buscar por número, nome, e-mail, telefone ou CPF</label>
            <input id="pedidos-busca" name="q" type="search" defaultValue={filters.q}
              placeholder="Nº do pedido, nome, e-mail, CPF" className={`${dashControl} w-full sm:w-[300px]`} />
            <label className="sr-only" htmlFor="pedidos-status">Status</label>
            <select id="pedidos-status" name="status" defaultValue={filters.status ?? ''} className={`${dashControl} cursor-pointer pr-8`}>
              <option value="">Todos os status</option>
              {ORDER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {filters.toShip && <input type="hidden" name="enviar" value="1" />}
            {filters.hidden && <input type="hidden" name="ocultos" value="1" />}
            <button type="submit" className="h-11 cursor-pointer rounded-full bg-noite-900 px-5 text-[14px] font-semibold text-leite hover:bg-noite-800">
              Filtrar
            </button>
            {hasFilters && (
              <Link href="/dashboard/pedidos" className="px-2 text-[14px] text-musgo underline hover:text-rubor">Limpar</Link>
            )}
          </form>
        </div>

        <OrdersTable
          rows={orders.data}
          emptyMessage={filters.hidden ? 'Nenhum pedido oculto. Pedidos marcados como entregues aparecem aqui.' : undefined}
        />
        <Pagination
          basePath="/dashboard/pedidos"
          query={{ q: filters.q, status: filters.status, enviar: filters.toShip ? '1' : undefined, ocultos: filters.hidden ? '1' : undefined }}
          page={filters.page ?? 1}
          total={orders.meta.total}
          pageSize={ORDERS_PAGE_SIZE}
        />
      </section>
    </main>
  )
}

/** Indicadores que também funcionam como atalho de filtro. */
function SummaryTiles({ summary: s, filters }: { summary: OrdersSummary; filters: OrderFilters }) {
  const tiles = [
    {
      href: '/dashboard/pedidos?enviar=1',
      active: Boolean(filters.toShip),
      label: 'A enviar',
      value: formatNumber(s.toShip),
      hint: 'pagos e ainda sem etiqueta',
      tone: s.toShip > 0 ? 'text-rubor' : 'text-noite-900',
    },
    {
      href: '/dashboard/pedidos?status=aguardando_pagamento',
      active: filters.status === 'aguardando_pagamento',
      label: 'Aguardando pagamento',
      value: formatNumber(s.awaitingPayment),
      hint: `${formatBRL(s.awaitingValue)} em aberto`,
      tone: 'text-[#8a5a00]',
    },
    {
      href: '/dashboard/pedidos?status=cancelado',
      active: filters.status === 'cancelado',
      label: 'Cancelados',
      value: formatNumber(s.cancelled),
      hint: 'estornados ou expirados',
      tone: 'text-musgo',
    },
  ]

  return (
    <section aria-label="Resumo dos pedidos" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <Link
        href={filters.status === 'pago' ? '/dashboard/pedidos' : '/dashboard/pedidos?status=pago'}
        className={cn('rounded-[20px] bg-noite-900 p-6 text-leite sm:col-span-2 lg:col-span-1', filters.status === 'pago' && 'ring-2 ring-folha')}
      >
        <p className="text-[14px] text-leite/78">Vendido (pedidos pagos)</p>
        <p className="mt-2 text-[44px] leading-none font-semibold tracking-[-0.02em]">{formatBRL(s.paidValue)}</p>
        <p className="mt-2 text-[13px] text-leite/70">
          {formatNumber(s.paid)} {s.paid === 1 ? 'pedido pago' : 'pedidos pagos'} · {formatNumber(s.today)} hoje
        </p>
      </Link>
      {tiles.map((t) => (
        <Link
          key={t.label}
          href={t.active ? '/dashboard/pedidos' : t.href}
          aria-current={t.active ? 'true' : undefined}
          className={cn(
            'rounded-[20px] border bg-white p-6 transition-colors hover:border-noite-900',
            t.active ? 'border-noite-900 ring-1 ring-noite-900' : 'border-linho',
          )}
        >
          <p className="text-[14px] text-musgo">{t.label}</p>
          <p className={cn('mt-2 text-[32px] leading-none font-semibold', t.tone)}>{t.value}</p>
          <p className="mt-2 text-[12px] text-musgo">{t.hint}</p>
        </Link>
      ))}
    </section>
  )
}

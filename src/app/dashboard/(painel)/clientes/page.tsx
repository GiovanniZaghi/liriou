import type { Metadata } from 'next'
import Link from 'next/link'
import { CustomersTable } from '@/components/dashboard/clientes/customers-table'
import { JourneyFunnel } from '@/components/dashboard/clientes/journey-funnel'
import { dashControl, PageHeader, pageShell } from '@/components/dashboard/page-header'
import { Pagination } from '@/components/dashboard/pagination'
import { CUSTOMERS_PAGE_SIZE, getJourneyFunnel, listCustomers } from '@/lib/api/admin'
import type { CustomerFilters, CustomerSegment } from '@/lib/api/types'
import { formatNumber } from '@/lib/format'

export const metadata: Metadata = { title: 'Clientes · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

const SEGMENTS: { value: CustomerSegment; label: string }[] = [
  { value: 'buyers', label: 'Já compraram' },
  { value: 'not_bought', label: 'Ainda não compraram' },
  { value: 'birthday_month', label: '🎂 Aniversariantes do mês' },
]

type SearchParams = Promise<{ q?: string; segmento?: string; page?: string }>

export default async function ClientesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filters: CustomerFilters = {
    q: params.q?.trim().slice(0, 100) || undefined,
    segment: SEGMENTS.some((s) => s.value === params.segmento) ? (params.segmento as CustomerSegment) : undefined,
    page: Math.max(1, Number(params.page) || 1),
  }

  const [funnel, customers] = await Promise.all([getJourneyFunnel(), listCustomers(filters)])

  return (
    <main className={pageShell}>
      <PageHeader
        title="Clientes"
        description="Cada cliente uma vez só, com todos os pedidos que já fez e as sacolas que ficaram para trás."
      />

      <JourneyFunnel funnel={funnel} />

      <section aria-labelledby="clientes-titulo" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="clientes-titulo" className="font-serif text-[32px] leading-none text-noite-900">
              Clientes
            </h2>
            <p className="mt-1 text-[14px] text-musgo">
              {formatNumber(customers.meta.total)} {customers.meta.total === 1 ? 'cliente' : 'clientes'}
              {filters.q || filters.segment ? ' com os filtros atuais' : ''} · atividade mais recente primeiro
            </p>
          </div>

          <form role="search" className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="clientes-busca">Buscar por nome, e-mail, telefone ou CPF</label>
            <input id="clientes-busca" name="q" type="search" defaultValue={filters.q}
              placeholder="Nome, e-mail, telefone ou CPF" className={`${dashControl} w-full sm:w-[280px]`} />
            <label className="sr-only" htmlFor="clientes-segmento">Situação</label>
            <select id="clientes-segmento" name="segmento" defaultValue={filters.segment ?? ''} className={`${dashControl} cursor-pointer pr-8`}>
              <option value="">Todas</option>
              {SEGMENTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <button type="submit" className="h-11 cursor-pointer rounded-full bg-noite-900 px-5 text-[14px] font-semibold text-leite hover:bg-noite-800">
              Filtrar
            </button>
            {(filters.q || filters.segment) && (
              <Link href="/dashboard/clientes" className="px-2 text-[14px] text-musgo underline hover:text-rubor">Limpar</Link>
            )}
          </form>
        </div>

        <CustomersTable rows={customers.data} />
        <Pagination
          basePath="/dashboard/clientes"
          query={{ q: filters.q, segmento: filters.segment }}
          page={filters.page ?? 1}
          total={customers.meta.total}
          pageSize={CUSTOMERS_PAGE_SIZE}
        />
      </section>
    </main>
  )
}

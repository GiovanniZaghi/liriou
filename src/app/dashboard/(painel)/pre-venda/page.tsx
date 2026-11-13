import type { Metadata } from 'next'
import { DailyChart } from '@/components/dashboard/daily-chart'
import { LeadsFilters } from '@/components/dashboard/leads-filters'
import { LeadsTable } from '@/components/dashboard/leads-table'
import { PageHeader, pageShell } from '@/components/dashboard/page-header'
import { Pagination } from '@/components/dashboard/pagination'
import { PainBreakdown } from '@/components/dashboard/pain-breakdown'
import { StatTiles } from '@/components/dashboard/stat-tiles'
import { getLeadStats, LEADS_PAGE_SIZE, listLeads } from '@/lib/api/admin'
import type { LeadFilters } from '@/lib/api/types'

export const metadata: Metadata = { title: 'Pré-venda · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ q?: string; pain?: string; page?: string }>

export default async function PreVendaPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filters: LeadFilters = {
    q: params.q?.trim().slice(0, 100) || undefined,
    pain: params.pain || undefined,
    page: Math.max(1, Number(params.page) || 1),
  }

  const [stats, leads] = await Promise.all([getLeadStats(), listLeads(filters)])
  const total = leads.meta.total

  return (
    <main className={pageShell}>
      <PageHeader title="Pré-venda" description="Cadastros da lista VIP da landing de pré-lançamento." />

      <StatTiles stats={stats} />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <DailyChart daily={stats.daily} />
        <PainBreakdown byPain={stats.byPain} total={stats.total} />
      </div>

      <section aria-labelledby="cadastros-titulo" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="cadastros-titulo" className="font-serif text-[32px] leading-none text-noite-900">
              Cadastros
            </h2>
            <p className="mt-1 text-[14px] text-musgo">
              {total === stats.total ? `${total} no total` : `${total} de ${stats.total} com os filtros atuais`}
            </p>
          </div>
          <LeadsFilters filters={filters} />
        </div>
        <LeadsTable rows={leads.data} />
        <Pagination
          basePath="/dashboard/pre-venda"
          query={{ q: filters.q, pain: filters.pain }}
          page={filters.page ?? 1}
          total={total}
          pageSize={LEADS_PAGE_SIZE}
        />
      </section>
    </main>
  )
}

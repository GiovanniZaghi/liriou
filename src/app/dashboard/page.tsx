import { DailyChart } from '@/components/dashboard/daily-chart'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { LeadsFilters } from '@/components/dashboard/leads-filters'
import { LeadsTable } from '@/components/dashboard/leads-table'
import { Pagination } from '@/components/dashboard/pagination'
import { PainBreakdown } from '@/components/dashboard/pain-breakdown'
import { StatTiles } from '@/components/dashboard/stat-tiles'
import { getLeadStats, listLeads, PAGE_SIZE, type LeadFilters } from '@/lib/leads-query'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ q?: string; pain?: string; page?: string }>

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filters: LeadFilters = {
    q: params.q?.trim().slice(0, 100) || undefined,
    pain: params.pain || undefined,
    page: Number(params.page) || 1,
  }

  const [stats, { rows, total }] = await Promise.all([getLeadStats(), listLeads(filters)])

  return (
    <>
      <DashboardHeader />
      <main className="mx-auto w-full max-w-[1280px] px-5 pt-8 pb-20 lg:px-10">
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
          <LeadsTable rows={rows} />
          <Pagination filters={filters} total={total} pageSize={PAGE_SIZE} />
        </section>
      </main>
    </>
  )
}

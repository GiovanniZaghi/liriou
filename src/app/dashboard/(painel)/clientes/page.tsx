import type { Metadata } from 'next'
import { JourneyFunnel } from '@/components/dashboard/clientes/journey-funnel'
import { JourneysTable } from '@/components/dashboard/clientes/journeys-table'
import { dashControl, PageHeader, pageShell } from '@/components/dashboard/page-header'
import { Pagination } from '@/components/dashboard/pagination'
import { getJourneyFunnel, JOURNEYS_PAGE_SIZE, listJourneys } from '@/lib/api/admin'
import type { CheckoutStage, JourneyFilters } from '@/lib/api/types'
import { STAGE_OPTIONS } from '@/lib/journey'

export const metadata: Metadata = { title: 'Clientes · Dashboard Líriou' }
export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ q?: string; etapa?: string; page?: string }>

export default async function ClientesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const filters: JourneyFilters = {
    q: params.q?.trim().slice(0, 100) || undefined,
    stage: STAGE_OPTIONS.some((o) => o.value === params.etapa) ? (params.etapa as CheckoutStage) : undefined,
    page: Math.max(1, Number(params.page) || 1),
  }

  const [funnel, journeys] = await Promise.all([getJourneyFunnel(), listJourneys(filters)])

  return (
    <main className={pageShell}>
      <PageHeader
        title="Clientes"
        description="Quem passou pela loja, até onde chegou no checkout e o que tinha na sacola."
      />

      <JourneyFunnel funnel={funnel} active={filters.stage} />

      <section aria-labelledby="clientes-titulo" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="clientes-titulo" className="font-serif text-[32px] leading-none text-noite-900">
              Jornadas
            </h2>
            <p className="mt-1 text-[14px] text-musgo">
              {journeys.meta.total} {journeys.meta.total === 1 ? 'cliente' : 'clientes'}
              {filters.q || filters.stage ? ' com os filtros atuais' : ''} · mais recentes primeiro
            </p>
          </div>

          <form role="search" className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="clientes-busca">Buscar por nome, e-mail, telefone ou CPF</label>
            <input id="clientes-busca" name="q" type="search" defaultValue={filters.q}
              placeholder="Nome, e-mail, telefone ou CPF" className={`${dashControl} w-full sm:w-[280px]`} />
            <label className="sr-only" htmlFor="clientes-etapa">Onde parou</label>
            <select id="clientes-etapa" name="etapa" defaultValue={filters.stage ?? ''} className={`${dashControl} cursor-pointer pr-8`}>
              <option value="">Todas as etapas</option>
              {STAGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button type="submit" className="h-11 cursor-pointer rounded-full bg-noite-900 px-5 text-[14px] font-semibold text-leite hover:bg-noite-800">
              Filtrar
            </button>
            {(filters.q || filters.stage) && (
              <a href="/dashboard/clientes" className="px-2 text-[14px] text-musgo underline hover:text-rubor">Limpar</a>
            )}
          </form>
        </div>

        <JourneysTable rows={journeys.data} />
        <Pagination
          basePath="/dashboard/clientes"
          query={{ q: filters.q, etapa: filters.stage }}
          page={filters.page ?? 1}
          total={journeys.meta.total}
          pageSize={JOURNEYS_PAGE_SIZE}
        />
      </section>
    </main>
  )
}

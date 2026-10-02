import { PAIN_OPTIONS } from '@/lib/lead'
import type { LeadFilters } from '@/lib/leads-query'

/** Filtros via GET (funcionam sem JS) + exportação CSV com os mesmos filtros. */
export function LeadsFilters({ filters }: { filters: LeadFilters }) {
  const exportParams = new URLSearchParams()
  if (filters.q) exportParams.set('q', filters.q)
  if (filters.pain) exportParams.set('pain', filters.pain)
  const exportHref = `/dashboard/export${exportParams.size ? `?${exportParams}` : ''}`

  const control =
    'h-11 rounded-full border-[1.5px] border-linho bg-white px-4 text-[14px] text-tinta outline-none focus:border-noite-900'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form role="search" className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="busca">
          Buscar por nome, e-mail ou WhatsApp
        </label>
        <input
          id="busca"
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Buscar nome, e-mail ou WhatsApp"
          className={`${control} w-full sm:w-[280px]`}
        />
        <label className="sr-only" htmlFor="filtro-pesadelo">
          Filtrar por pesadelo
        </label>
        <select id="filtro-pesadelo" name="pain" defaultValue={filters.pain ?? ''} className={`${control} cursor-pointer pr-8`}>
          <option value="">Todas as respostas</option>
          {PAIN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
          <option value="none">Não respondeu</option>
        </select>
        <button type="submit" className="h-11 cursor-pointer rounded-full bg-noite-900 px-5 text-[14px] font-semibold text-leite hover:bg-noite-800">
          Filtrar
        </button>
        {(filters.q || filters.pain) && (
          <a href="/dashboard" className="px-2 text-[14px] text-musgo underline hover:text-rubor">
            Limpar
          </a>
        )}
      </form>
      <a
        href={exportHref}
        className="inline-flex h-11 items-center rounded-full border-[1.5px] border-noite-900 px-5 text-[14px] font-semibold text-noite-900 hover:bg-noite-900 hover:text-leite"
      >
        Exportar CSV
      </a>
    </div>
  )
}

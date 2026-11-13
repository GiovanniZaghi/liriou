import type { ProductFilters } from '@/lib/api/types'
import { CATEGORY_OPTIONS } from '@/lib/products'
import { dashControl } from '../page-header'

/** Filtros via GET (funcionam sem JS). */
export function ProductsFilters({ filters }: { filters: ProductFilters }) {
  const hasFilters = Boolean(filters.q || filters.category || filters.status || filters.lowStock)

  return (
    <form role="search" className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor="estoque-busca">
        Buscar por nome, SKU ou cor
      </label>
      <input
        id="estoque-busca"
        name="q"
        type="search"
        defaultValue={filters.q}
        placeholder="Buscar nome, SKU ou cor"
        className={`${dashControl} w-full sm:w-[240px]`}
      />
      <label className="sr-only" htmlFor="estoque-categoria">
        Categoria
      </label>
      <select id="estoque-categoria" name="categoria" defaultValue={filters.category ?? ''} className={`${dashControl} cursor-pointer pr-8`}>
        <option value="">Todas as categorias</option>
        {CATEGORY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor="estoque-status">
        Vitrine
      </label>
      <select id="estoque-status" name="vitrine" defaultValue={filters.status ?? ''} className={`${dashControl} cursor-pointer pr-8`}>
        <option value="">Vitrine: todos</option>
        <option value="ativo">Na vitrine</option>
        <option value="oculto">Ocultos</option>
      </select>
      <label className="flex h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-linho bg-white px-4 text-[14px] text-tinta has-checked:border-rubor has-checked:text-rubor">
        <input type="checkbox" name="baixo" value="1" defaultChecked={filters.lowStock} className="accent-rubor" />
        Estoque baixo
      </label>
      <button type="submit" className="h-11 cursor-pointer rounded-full bg-noite-900 px-5 text-[14px] font-semibold text-leite hover:bg-noite-800">
        Filtrar
      </button>
      {hasFilters && (
        <a href="/dashboard/estoque" className="px-2 text-[14px] text-musgo underline hover:text-rubor">
          Limpar
        </a>
      )}
    </form>
  )
}

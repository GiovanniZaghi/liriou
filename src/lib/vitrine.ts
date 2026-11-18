import type { CatalogProduct, ProductCategory } from './api/types'
import { CATEGORY_OPTIONS } from './products'

export const VITRINE_PAGE_SIZE = 24

export const SORT_OPTIONS = [
  { value: 'destaques', label: 'Destaques' },
  { value: 'novidades', label: 'Novidades' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'a-z', label: 'Nome (A–Z)' },
] as const

export type VitrineSort = (typeof SORT_OPTIONS)[number]['value']

export interface VitrineFilters {
  q: string
  category: ProductCategory | null
  sort: VitrineSort
  /** Esconde os esgotados */
  inStock: boolean
  page: number
}

type RawParams = { q?: string; categoria?: string; ordem?: string; disponivel?: string; page?: string }

/** Lê a URL (?q=&categoria=&ordem=&disponivel=1&page=) com valores seguros. */
export function parseVitrineParams(p: RawParams): VitrineFilters {
  return {
    q: p.q?.trim().slice(0, 80) ?? '',
    category: CATEGORY_OPTIONS.some((c) => c.value === p.categoria) ? (p.categoria as ProductCategory) : null,
    sort: SORT_OPTIONS.some((s) => s.value === p.ordem) ? (p.ordem as VitrineSort) : 'destaques',
    inStock: p.disponivel === '1',
    page: Math.max(1, Math.floor(Number(p.page)) || 1),
  }
}

/** Monta a URL da vitrine mantendo os filtros (padrões ficam de fora para a URL ficar limpa). */
export function vitrineHref(f: Partial<VitrineFilters>) {
  const sp = new URLSearchParams()
  if (f.q) sp.set('q', f.q)
  if (f.category) sp.set('categoria', f.category)
  if (f.sort && f.sort !== 'destaques') sp.set('ordem', f.sort)
  if (f.inStock) sp.set('disponivel', '1')
  if (f.page && f.page > 1) sp.set('page', String(f.page))
  return `/vitrine${sp.size ? `?${sp}` : ''}`
}

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase('pt-BR')

/** Filtra e ordena a vitrine. A ordem "destaques" é a definida no dashboard (já vem assim da API). */
export function applyVitrineFilters(products: CatalogProduct[], f: VitrineFilters) {
  const terms = normalize(f.q).split(/\s+/).filter(Boolean)
  const filtered = products.filter((p) => {
    if (f.category && p.category !== f.category) return false
    if (f.inStock && !p.inStock) return false
    if (!terms.length) return true
    const text = normalize(`${p.name} ${p.colorName ?? ''} ${p.badge ?? ''} ${p.description}`)
    return terms.every((t) => text.includes(t))
  })

  const sorted = [...filtered]
  if (f.sort === 'menor-preco') sorted.sort((a, b) => a.price - b.price)
  if (f.sort === 'maior-preco') sorted.sort((a, b) => b.price - a.price)
  if (f.sort === 'novidades') sorted.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
  if (f.sort === 'a-z') sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  // Esgotados vão para o fim, mantendo a ordem escolhida entre eles
  sorted.sort((a, b) => Number(b.inStock) - Number(a.inStock))

  const totalPages = Math.max(1, Math.ceil(sorted.length / VITRINE_PAGE_SIZE))
  const page = Math.min(f.page, totalPages)
  return {
    total: sorted.length,
    page,
    totalPages,
    items: sorted.slice((page - 1) * VITRINE_PAGE_SIZE, page * VITRINE_PAGE_SIZE),
  }
}

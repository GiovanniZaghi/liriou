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

/**
 * Tons de cor da vitrine (os mesmos do mosaico da home).
 * A cor de cada produto é descoberta pelo nome (produto + cor); o código da cor só entra se o nome não disser nada.
 */
export const TONE_OPTIONS = [
  { value: 'marrom', label: 'Marrom e preto', swatch: '#5A3A2A', words: ['marrom', 'chocolate', 'cafe', 'castanho', 'preto', 'preta'] },
  { value: 'verde', label: 'Verde', swatch: '#6B7A3C', words: ['verde', 'salvia', 'musgo', 'oliva', 'azeitona', 'menta', 'esmeralda'] },
  { value: 'laranja', label: 'Laranja e amarelo', swatch: '#C25A1C', words: ['laranja', 'terracota', 'cobre', 'tangerina', 'amarelo', 'amarela', 'amarelinho', 'mostarda'] },
  { value: 'azul', label: 'Azul e roxo', swatch: '#8FB3E0', words: ['azul', 'petroleo', 'marinho', 'celeste', 'lilas', 'roxo', 'roxa', 'beringela', 'berinjela', 'lavanda'] },
] as const

export type VitrineTone = (typeof TONE_OPTIONS)[number]['value']

export interface VitrineFilters {
  q: string
  category: ProductCategory | null
  tone: VitrineTone | null
  sort: VitrineSort
  /** Esconde os esgotados */
  inStock: boolean
  page: number
}

type RawParams = { q?: string; categoria?: string; tom?: string; ordem?: string; disponivel?: string; page?: string }

/** Lê a URL (?q=&categoria=&tom=&ordem=&disponivel=1&page=) com valores seguros. */
export function parseVitrineParams(p: RawParams): VitrineFilters {
  return {
    q: p.q?.trim().slice(0, 80) ?? '',
    category: CATEGORY_OPTIONS.some((c) => c.value === p.categoria) ? (p.categoria as ProductCategory) : null,
    tone: TONE_OPTIONS.some((t) => t.value === p.tom) ? (p.tom as VitrineTone) : null,
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
  if (f.tone) sp.set('tom', f.tone)
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

/** Tom pelo matiz do código da cor (reserva para quando o nome não indica a cor). */
function toneFromHex(hex: string | null): VitrineTone | null {
  const m = hex?.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (!m) return null
  const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16) / 255)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  if (d < 0.12) return null // cinzas, preto e branco não têm tom
  const h = max === r ? 60 * (((g - b) / d) % 6) : max === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4)
  const hue = (h + 360) % 360
  if (hue >= 15 && hue < 60) return l < 0.35 ? 'marrom' : 'laranja'
  if (hue >= 60 && hue < 170) return 'verde'
  if (hue >= 170 && hue < 260) return 'azul'
  return null
}

/** Cores que existem na loja mas não estão entre os tons (o nome do produto manda sobre a cor cadastrada). */
const OTHER_COLORS = new Set(['rosa', 'pink', 'branca', 'branco', 'perola', 'perolada', 'bege', 'begezinha', 'nude', 'cinza', 'vermelha', 'vermelho', 'vinho'])

/** Em qual tom o produto entra (null = nenhum dos tons da vitrine). */
export function productTone(p: Pick<CatalogProduct, 'name' | 'colorName' | 'colorHex'>): VitrineTone | null {
  const words = normalize(`${p.name} ${p.colorName ?? ''}`).split(/[^a-z]+/)
  // O nome do produto vem antes da cor: a primeira palavra de cor encontrada decide
  for (const w of words) {
    if (OTHER_COLORS.has(w)) return null
    const tone = TONE_OPTIONS.find((t) => (t.words as readonly string[]).includes(w))
    if (tone) return tone.value
  }
  return toneFromHex(p.colorHex)
}

/** Filtra e ordena a vitrine. A ordem "destaques" é a definida no dashboard (já vem assim da API). */
export function applyVitrineFilters(products: CatalogProduct[], f: VitrineFilters) {
  const terms = normalize(f.q).split(/\s+/).filter(Boolean)
  const filtered = products.filter((p) => {
    if (f.category && p.category !== f.category) return false
    if (f.inStock && !p.inStock) return false
    if (f.tone && productTone(p) !== f.tone) return false
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

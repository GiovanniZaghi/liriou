import type { ProductCategory } from './api/types'

export const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'scrunchie', label: 'Scrunchie' },
  { value: 'touca', label: 'Touca' },
  { value: 'kit', label: 'Kit' },
  { value: 'acessorio', label: 'Acessório' },
]

export const categoryLabel = (c: ProductCategory) => CATEGORY_OPTIONS.find((o) => o.value === c)?.label ?? c

/** "Scrunchie Clássica Sálvia" → "scrunchie-classica-salvia" */
export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

/** Aceita "49,90", "49.90", "1.249,90" e "R$ 49,90". */
export function parsePrice(raw: string): number {
  const clean = raw.replace(/[^\d.,]/g, '')
  const normalized = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean
  return Math.round(Number(normalized) * 100) / 100
}

export const formatPriceInput = (n: number) => n.toFixed(2).replace('.', ',')

import 'server-only'

import { apiFetch } from './http'
import type { CatalogProduct, StoreSettings } from './types'

/** Revalida a vitrine a cada minuto (ou na hora, via revalidateTag('catalog') quando o dashboard editar). */
const CATALOG_CACHE = { revalidate: 60, tags: ['catalog'] }

const FALLBACK_SETTINGS: StoreSettings = { freeShippingThreshold: 150, installments: 3, shippingOptions: [] }

/** Produtos ativos da vitrine. Se a API estiver fora, a loja abre com a vitrine vazia em vez de quebrar. */
export async function getCatalog(): Promise<CatalogProduct[]> {
  try {
    const { data } = await apiFetch<{ data: CatalogProduct[] }>('/catalog/products', { next: CATALOG_CACHE })
    return data
  } catch (err) {
    console.error('[catalog] falha ao carregar produtos', err)
    return []
  }
}

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    return await apiFetch<StoreSettings>('/store/settings', { next: CATALOG_CACHE })
  } catch (err) {
    console.error('[catalog] falha ao carregar configurações da loja', err)
    return FALLBACK_SETTINGS
  }
}

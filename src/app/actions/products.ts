'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect, unstable_rethrow } from 'next/navigation'
import {
  createProduct,
  deleteProduct,
  registerStockMovement,
  updateProduct,
} from '@/lib/api/admin'
import { ApiError } from '@/lib/api/http'
import type { ProductCategory, ProductPayload, StockMovementType } from '@/lib/api/types'
import { parsePrice } from '@/lib/products'

export type ProductFormState = { error?: string; fields?: Record<string, string> }
export type ActionResult = { ok: boolean; error?: string }
export type StockMovementState = { ok?: boolean; error?: string; stock?: number; at?: number }

/** Vitrine e telas do estoque passam a mostrar a mudança na próxima visita. */
function refreshCatalog() {
  updateTag('catalog')
  revalidatePath('/dashboard/estoque', 'layout')
}

const CONFLICT_FIELDS: Record<string, [string, string]> = {
  PRODUCT_SLUG_TAKEN: ['slug', 'Já existe um produto com este endereço'],
  PRODUCT_SKU_TAKEN: ['sku', 'Já existe um produto com este SKU'],
}

function toFormError(err: unknown): ProductFormState {
  unstable_rethrow(err) // deixa passar o redirect de sessão expirada
  if (err instanceof ApiError) {
    const conflict = CONFLICT_FIELDS[err.code]
    if (conflict) return { error: conflict[1], fields: { [conflict[0]]: conflict[1] } }
    return { error: err.message, fields: err.fields }
  }
  console.error('[estoque]', err)
  return { error: 'Não foi possível salvar agora. Tente de novo.' }
}

const text = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim()
const optional = (fd: FormData, key: string) => text(fd, key) || null
const lines = (fd: FormData, key: string) =>
  text(fd, key)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
const int = (fd: FormData, key: string, fallback = 0) => {
  const n = Number.parseInt(text(fd, key), 10)
  return Number.isFinite(n) ? n : fallback
}

function parseProductForm(fd: FormData): ProductPayload {
  const category = text(fd, 'category') as ProductCategory
  const kit =
    category === 'kit' && text(fd, 'kitTag')
      ? { tag: text(fd, 'kitTag'), contents: text(fd, 'kitContents'), perks: lines(fd, 'kitPerks'), note: text(fd, 'kitNote') }
      : null

  return {
    name: text(fd, 'name'),
    slug: text(fd, 'slug'),
    sku: text(fd, 'sku'),
    category,
    price: parsePrice(text(fd, 'price')),
    description: text(fd, 'description'),
    colorName: optional(fd, 'colorName'),
    colorHex: optional(fd, 'colorHex'),
    badge: optional(fd, 'badge'),
    imageUrl: text(fd, 'imageUrl'),
    hoverImageUrl: optional(fd, 'hoverImageUrl'),
    gallery: lines(fd, 'gallery'),
    kit,
    minStock: int(fd, 'minStock'),
    sortOrder: int(fd, 'sortOrder'),
    isActive: fd.get('isActive') === 'on',
  }
}

/** Cria (productId = null) ou edita um produto. */
export async function saveProductAction(_prev: ProductFormState, fd: FormData): Promise<ProductFormState> {
  // Campo oculto (sem .bind): funciona igual com e sem JavaScript
  const productId = text(fd, 'productId') || null
  const payload = parseProductForm(fd)
  let id = productId
  try {
    if (productId) {
      await updateProduct(productId, payload)
    } else {
      const initialStock = int(fd, 'initialStock')
      id = (await createProduct({ ...payload, initialStock: initialStock > 0 ? initialStock : undefined })).id
    }
  } catch (err) {
    return toFormError(err)
  }

  refreshCatalog()
  redirect(`/dashboard/estoque/${id}?${productId ? 'salvo' : 'criado'}=1`)
}

/** Liga/desliga a exibição do produto na vitrine. */
export async function setVisibilityAction(productId: string, isActive: boolean): Promise<ActionResult> {
  try {
    await updateProduct(productId, { isActive })
    refreshCatalog()
    return { ok: true }
  } catch (err) {
    unstable_rethrow(err)
    return { ok: false, error: err instanceof ApiError ? err.message : 'Não foi possível atualizar a vitrine.' }
  }
}

export async function moveStockAction(_prev: StockMovementState, fd: FormData): Promise<StockMovementState> {
  const productId = text(fd, 'productId')
  const type = text(fd, 'type') as StockMovementType
  const quantity = int(fd, 'quantity')
  if (quantity <= 0) return { error: 'Informe uma quantidade maior que zero.' }

  try {
    const { product } = await registerStockMovement(productId, { type, quantity, reason: text(fd, 'reason') || undefined })
    refreshCatalog()
    return { ok: true, stock: product.stock, at: Date.now() }
  } catch (err) {
    unstable_rethrow(err)
    if (err instanceof ApiError && err.code === 'INSUFFICIENT_STOCK') {
      return { error: 'Saída maior que o estoque disponível.' }
    }
    return { error: err instanceof ApiError ? err.message : 'Não foi possível registrar a movimentação.' }
  }
}

export async function deleteProductAction(productId: string): Promise<ActionResult> {
  try {
    await deleteProduct(productId)
  } catch (err) {
    unstable_rethrow(err)
    return { ok: false, error: err instanceof ApiError ? err.message : 'Não foi possível excluir.' }
  }
  refreshCatalog()
  redirect('/dashboard/estoque?excluido=1')
}

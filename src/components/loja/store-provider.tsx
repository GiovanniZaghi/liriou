'use client'

import { createContext, use, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cartApi } from '@/lib/api/cart'
import { ApiError } from '@/lib/api/http'
import type { Cart, CatalogProduct, StoreSettings } from '@/lib/api/types'
import type { Reel } from '@/lib/content'

/**
 * Sacola: a fonte da verdade é a API (preço/estoque/cupom validados no servidor).
 * O navegador guarda o id + uma cópia da última resposta, para a sacola aparecer na hora
 * quando a cliente volta ao site — e é revalidada com a API logo em seguida.
 */
const CART_STORAGE_KEY = 'liriou:cart:v2'
/** Formato antigo (só no navegador, com slugs): migrado uma vez para a API */
const LEGACY_CART_KEY = 'liriou:cart'

export type StoreDialog =
  | { type: 'cart' }
  | { type: 'search' }
  | { type: 'creator' }
  | { type: 'welcome' }
  | { type: 'product'; productId: string }
  | { type: 'reel'; reel: Reel }

interface StoreContextValue {
  dialog: StoreDialog | null
  openDialog: (dialog: StoreDialog) => void
  /** Abre só se nenhum outro modal estiver aberto (pop-ups automáticos). */
  offerDialog: (dialog: StoreDialog) => void
  closeDialog: () => void

  products: CatalogProduct[]
  getProduct: (id: string) => CatalogProduct | undefined
  settings: StoreSettings

  cart: Cart | null
  /** false até ler a sacola salva neste navegador (evita mostrar "sacola vazia" piscando) */
  cartReady: boolean
  count: number
  /** Há alteração da sacola em andamento */
  pending: boolean
  addToCart: (productId: string, opts?: { openCart?: boolean }) => void
  updateQty: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
  /** null = aplicado; texto = motivo da recusa */
  applyCoupon: (code: string) => Promise<string | null>
  removeCoupon: () => void
  setShippingId: (optionId: string) => void
  /** A sacola virou pedido (ou sumiu no servidor): esquece a sacola local */
  clearCart: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

interface StoreProviderProps {
  products: CatalogProduct[]
  settings: StoreSettings
  children: React.ReactNode
}

export function StoreProvider({ products, settings, children }: StoreProviderProps) {
  const [dialog, setDialog] = useState<StoreDialog | null>(null)
  const [cart, setCart] = useState<Cart | null>(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [cartReady, setCartReady] = useState(false)

  // Refs: valor mais recente para as operações assíncronas (o estado do React chega atrasado)
  const cartRef = useRef<Cart | null>(null)
  const creatingRef = useRef<Promise<Cart> | null>(null)
  // Fila: uma alteração por vez, cada uma partindo da resposta anterior (cliques rápidos não se perdem)
  const queueRef = useRef<Promise<unknown>>(Promise.resolve())

  const productsById = new Map(products.map((p) => [p.id, p]))

  function commit(next: Cart | null, { persist = true } = {}) {
    cartRef.current = next
    setCart(next)
    if (persist) saveCart(next)
  }

  async function refresh(cartId: string) {
    try {
      commit(await cartApi.get(cartId))
    } catch (err) {
      // Sacola expirada/inexistente: começa uma nova no próximo "Adicionar". Erro de rede: mantém a cópia local.
      if (err instanceof ApiError && err.status === 404) commit(null)
    }
  }

  useEffect(() => {
    const saved = readSavedCart()
    if (saved) {
      commit(saved, { persist: false })
      void refresh(saved.id)
      setCartReady(true)
    } else {
      void migrateLegacyCart(products)
        .then((migrated) => migrated && commit(migrated))
        .finally(() => setCartReady(true))
    }

    // Outra aba mexeu na sacola
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) commit(readSavedCart(), { persist: false })
    }
    // Voltou para a aba: preços/estoque podem ter mudado
    const onVisible = () => {
      if (document.visibilityState === 'visible' && cartRef.current) void refresh(cartRef.current.id)
    }
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  async function ensureCartId(): Promise<string> {
    if (cartRef.current) return cartRef.current.id
    creatingRef.current ??= cartApi
      .create()
      .then((created) => {
        commit(created)
        return created
      })
      .finally(() => {
        creatingRef.current = null
      })
    return (await creatingRef.current).id
  }

  /** Enfileira uma alteração; se a sacola sumiu no servidor (404), recria e tenta de novo uma vez. */
  function mutate(op: (cartId: string, current: Cart | null) => Promise<Cart>, onError = showCartError) {
    const task = async () => {
      setPendingCount((n) => n + 1)
      try {
        try {
          commit(await op(await ensureCartId(), cartRef.current))
        } catch (err) {
          if (!(err instanceof ApiError && err.code === 'CART_NOT_FOUND')) throw err
          commit(null)
          commit(await op(await ensureCartId(), cartRef.current))
        }
        return true
      } catch (err) {
        onError(err)
        return false
      } finally {
        setPendingCount((n) => n - 1)
      }
    }
    const run = queueRef.current.then(task, task)
    queueRef.current = run
    return run
  }

  const quantityOf = (c: Cart | null, productId: string) =>
    c?.items.find((i) => i.productId === productId)?.quantity ?? 0

  const value: StoreContextValue = {
    dialog,
    openDialog: setDialog,
    offerDialog: (next) => setDialog((cur) => cur ?? next),
    closeDialog: () => setDialog(null),

    products,
    getProduct: (id) => productsById.get(id),
    settings,

    cart,
    cartReady,
    count: cart?.itemCount ?? 0,
    pending: pendingCount > 0,

    addToCart(productId, { openCart = false } = {}) {
      if (openCart) setDialog({ type: 'cart' })
      void mutate((id) => cartApi.addItem(id, productId, 1))
    },
    updateQty(productId, delta) {
      void mutate((id, current) => {
        const next = quantityOf(current, productId) + delta
        return next > 0 ? cartApi.setQuantity(id, productId, next) : cartApi.removeItem(id, productId)
      })
    },
    removeFromCart(productId) {
      void mutate((id) => cartApi.removeItem(id, productId))
    },
    async applyCoupon(code) {
      let reason = 'Cupom inválido.'
      const ok = await mutate(
        (id) => cartApi.applyCoupon(id, code),
        (err) => {
          // Motivos do cupom (inválido, expirado, mínimo...) voltam para a gaveta mostrar; o resto vira toast
          if (err instanceof ApiError && (err.code === 'INVALID_COUPON' || err.code.startsWith('COUPON_'))) reason = err.message
          else showCartError(err)
        },
      )
      return ok ? null : reason
    },
    removeCoupon() {
      void mutate((id) => cartApi.removeCoupon(id))
    },
    setShippingId(optionId) {
      void mutate((id) => cartApi.selectShipping(id, optionId))
    },
    clearCart() {
      commit(null)
    },
  }

  return <StoreContext value={value}>{children}</StoreContext>
}

export function useStore() {
  const ctx = use(StoreContext)
  if (!ctx) throw new Error('useStore precisa estar dentro de <StoreProvider>')
  return ctx
}

const ERROR_MESSAGES: Record<string, string> = {
  INSUFFICIENT_STOCK: 'Não temos essa quantidade em estoque no momento.',
  PRODUCT_UNAVAILABLE: 'Este produto está indisponível no momento.',
}

function showCartError(err: unknown) {
  if (err instanceof ApiError) {
    const fieldMessage = err.fields ? Object.values(err.fields)[0] : undefined
    toast.error(ERROR_MESSAGES[err.code] ?? fieldMessage ?? err.message)
    return
  }
  console.error('[sacola]', err)
  toast.error('Não foi possível atualizar a sacola. Tente de novo.')
}

function readSavedCart(): Cart | null {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? 'null')
    return saved && typeof saved.id === 'string' && Array.isArray(saved.items) ? (saved as Cart) : null
  } catch {
    return null
  }
}

function saveCart(cart: Cart | null) {
  try {
    if (cart) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    else localStorage.removeItem(CART_STORAGE_KEY)
  } catch {}
}

/** Sacola do formato antigo ({ lines: [{ productId: slug, qty }] }) → sacola na API. */
async function migrateLegacyCart(products: CatalogProduct[]): Promise<Cart | null> {
  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_CART_KEY) ?? 'null')
    if (!Array.isArray(legacy?.lines)) return null
    const idBySlug = new Map(products.map((p) => [p.slug, p.id]))
    const items = legacy.lines
      .map((l: { productId: string; qty: number }) => ({ productId: idBySlug.get(l.productId), quantity: l.qty }))
      .filter((i: { productId?: string; quantity: number }) => i.productId && i.quantity > 0)
    localStorage.removeItem(LEGACY_CART_KEY)
    return items.length ? await cartApi.create(items) : null
  } catch {
    return null
  }
}

'use client'

import { createContext, use, useEffect, useState } from 'react'
import { COUPONS, FREE_SHIPPING_THRESHOLD, getProduct, SHIPPING_OPTIONS, type Product, type Reel } from '@/lib/catalog'

const CART_STORAGE_KEY = 'liriou:cart'

export type StoreDialog =
  | { type: 'cart' }
  | { type: 'search' }
  | { type: 'creator' }
  | { type: 'welcome' }
  | { type: 'product'; productId: string }
  | { type: 'reel'; reel: Reel }

interface CartLine {
  productId: string
  qty: number
}

export interface CartItem extends Product {
  qty: number
}

interface StoreContextValue {
  dialog: StoreDialog | null
  openDialog: (dialog: StoreDialog) => void
  /** Abre só se nenhum outro modal estiver aberto (pop-ups automáticos). */
  offerDialog: (dialog: StoreDialog) => void
  closeDialog: () => void

  items: CartItem[]
  count: number
  subtotal: number
  discount: number
  shipping: number | null
  total: number
  coupon: string | null
  shippingId: string | null
  addToCart: (productId: string, opts?: { openCart?: boolean }) => void
  updateQty: (productId: string, delta: number) => void
  removeFromCart: (productId: string) => void
  applyCoupon: (code: string) => boolean
  setShippingId: (id: string) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<StoreDialog | null>(null)
  const [lines, setLines] = useState<CartLine[]>([])
  const [coupon, setCoupon] = useState<string | null>(null)
  const [shippingId, setShippingId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Sacola persiste só neste navegador (provisório, até existir checkout no servidor)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? 'null')
      if (Array.isArray(saved?.lines)) setLines(saved.lines.filter((l: CartLine) => getProduct(l.productId)))
      if (typeof saved?.coupon === 'string' && saved.coupon in COUPONS) setCoupon(saved.coupon)
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ lines, coupon }))
    } catch {}
  }, [hydrated, lines, coupon])

  const items = lines.flatMap((l) => {
    const product = getProduct(l.productId)
    return product ? [{ ...product, qty: l.qty }] : []
  })
  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discount = coupon ? subtotal * COUPONS[coupon] : 0
  const shippingPrice = SHIPPING_OPTIONS.find((o) => o.id === shippingId)?.price ?? null
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shippingPrice
  const total = Math.max(subtotal + (shipping ?? 0) - discount, 0)

  function addToCart(productId: string, { openCart = false } = {}) {
    setLines((prev) =>
      prev.some((l) => l.productId === productId)
        ? prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l))
        : [...prev, { productId, qty: 1 }],
    )
    if (openCart) setDialog({ type: 'cart' })
  }

  function updateQty(productId: string, delta: number) {
    setLines((prev) =>
      prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0),
    )
  }

  function applyCoupon(code: string) {
    const normalized = code.trim().toUpperCase()
    if (!(normalized in COUPONS)) return false
    setCoupon(normalized)
    return true
  }

  const value: StoreContextValue = {
    dialog,
    openDialog: setDialog,
    offerDialog: (next) => setDialog((cur) => cur ?? next),
    closeDialog: () => setDialog(null),
    items,
    count,
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    shippingId,
    addToCart,
    updateQty,
    removeFromCart: (productId) => setLines((prev) => prev.filter((l) => l.productId !== productId)),
    applyCoupon,
    setShippingId,
  }

  return <StoreContext value={value}>{children}</StoreContext>
}

export function useStore() {
  const ctx = use(StoreContext)
  if (!ctx) throw new Error('useStore precisa estar dentro de <StoreProvider>')
  return ctx
}

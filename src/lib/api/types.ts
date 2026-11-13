/** Contratos da API (liriou-nest). Valores monetários em reais. Datas em ISO 8601. */

export type ProductCategory = 'scrunchie' | 'touca' | 'kit' | 'acessorio'

export interface KitDetails {
  tag: string
  contents: string
  perks: string[]
  note: string
}

export interface CatalogProduct {
  id: string
  slug: string
  name: string
  description: string
  category: ProductCategory
  price: number
  colorName: string | null
  colorHex: string | null
  badge: string | null
  image: string
  hoverImage: string
  gallery: string[]
  kit: KitDetails | null
  inStock: boolean
}

export interface ShippingOption {
  id: string
  label: string
  price: number
}

export interface StoreSettings {
  freeShippingThreshold: number
  installments: number
  shippingOptions: ShippingOption[]
}

export interface CartItem {
  productId: string
  slug: string
  name: string
  colorName: string | null
  image: string
  unitPrice: number
  quantity: number
  lineTotal: number
  /** false quando o estoque atual não cobre a quantidade */
  available: boolean
}

export interface Cart {
  id: string
  items: CartItem[]
  itemCount: number
  coupon: {
    code: string
    /** Ex.: "10% OFF" ou "R$ 20,00 OFF" */
    label: string
    /** false = cupom na sacola, mas sem desconto agora (expirou, falta valor mínimo...) */
    applied: boolean
    notice: string | null
    minSubtotal: number
  } | null
  shippingOptionId: string | null
  totals: {
    subtotal: number
    discount: number
    /** null = frete ainda não escolhido */
    shipping: number | null
    total: number
    freeShipping: boolean
    missingForFreeShipping: number
  }
  updatedAt: string
}

export interface Paginated<T> {
  data: T[]
  meta: { total: number; page: number; pageSize: number; totalPages: number }
}

export interface Lead {
  id: string
  name: string
  email: string
  /** Só dígitos, com DDD */
  whatsapp: string
  pain: string | null
  utm: Record<string, string> | null
  consentAt: string
  createdAt: string
}

export interface LeadFilters {
  q?: string
  /** valor de PAIN_OPTIONS, ou 'none' para "não respondeu" */
  pain?: string
  page?: number
}

export interface LeadStats {
  total: number
  today: number
  last7: number
  withPain: number
  daily: { day: string; count: number }[]
  byPain: { pain: string | null; count: number }[]
}

/** Produto completo, visão do estoque (dashboard). */
export interface AdminProduct {
  id: string
  slug: string
  sku: string
  name: string
  description: string
  category: ProductCategory
  price: number
  colorName: string | null
  colorHex: string | null
  badge: string | null
  imageUrl: string
  hoverImageUrl: string | null
  gallery: string[]
  kit: KitDetails | null
  stock: number
  minStock: number
  isLowStock: boolean
  /** true = visível na vitrine */
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/** Corpo de criação/edição (POST/PATCH /admin/products) */
export interface ProductPayload {
  slug: string
  sku: string
  name: string
  description: string
  category: ProductCategory
  price: number
  colorName: string | null
  colorHex: string | null
  badge: string | null
  imageUrl: string
  hoverImageUrl: string | null
  gallery: string[]
  kit: KitDetails | null
  minStock: number
  isActive: boolean
  sortOrder: number
  initialStock?: number
}

export interface ProductFilters {
  q?: string
  category?: ProductCategory
  /** 'ativo' = na vitrine, 'oculto' = fora da vitrine */
  status?: 'ativo' | 'oculto'
  lowStock?: boolean
  page?: number
}

export type StockMovementType = 'entrada' | 'saida'

export interface StockMovement {
  id: string
  productId: string
  type: StockMovementType
  quantity: number
  balanceAfter: number
  reason: string | null
  createdBy: string | null
  createdAt: string
}

export interface InventorySummary {
  totalProducts: number
  activeProducts: number
  lowStock: number
  outOfStock: number
  unitsInStock: number
  inventoryValue: number
}

export interface LoginResponse {
  accessToken: string
  expiresAt: string
  admin: { id: string; name: string; email: string }
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface CheckoutCustomer {
  name: string
  email: string
  cpf: string
  phone: string
}

export interface CheckoutAddress {
  cep: string
  street: string
  number: string
  complement: string
  district: string
  city: string
  state: string
  recipient: string
}

export type OrderStatus = 'aguardando_pagamento' | 'pago' | 'cancelado'

export interface Order {
  id: string
  number: number
  status: OrderStatus
  customer: { name: string; email: string; cpf: string; phone: string }
  shippingAddress: Omit<CheckoutAddress, 'complement'> & { complement: string | null }
  shippingOption: { id: string; label: string }
  couponCode: string | null
  items: { productId: string; name: string; image: string; unitPrice: number; quantity: number; lineTotal: number }[]
  itemCount: number
  totals: { subtotal: number; discount: number; shipping: number; total: number }
  createdAt: string
}

// ─── Acompanhamento de clientes (dashboard) ───────────────────────────────────

/** Até onde a cliente chegou: sacola → identificação → entrega/revisão → pedido */
export type CheckoutStage = 'cart' | 'identified' | 'delivery' | 'ordered'

export interface JourneyRow {
  cartId: string
  stage: CheckoutStage
  customer: { name: string; email: string; cpf: string; phone: string } | null
  city: string | null
  state: string | null
  itemCount: number
  value: number
  order: { id: string; number: number; status: OrderStatus; total: number } | null
  createdAt: string
  lastActivityAt: string
}

export interface JourneyDetail extends JourneyRow {
  shippingAddress: Order['shippingAddress'] | null
  shippingOption: string | null
  couponCode: string | null
  items: { productId: string; name: string; sku: string; image: string; unitPrice: number; quantity: number; lineTotal: number }[]
  totals: { subtotal: number; discount: number; shipping: number | null; total: number }
  timeline: { createdAt: string; identifiedAt: string | null; deliveryAt: string | null; orderedAt: string | null }
  otherSessions: { cartId: string; stage: CheckoutStage; value: number; order: { id: string; number: number; status: OrderStatus } | null; lastActivityAt: string }[]
}

export interface JourneyFunnel {
  cart: number
  identified: number
  delivery: number
  ordered: number
  orderedValue: number
  openValue: number
}

export interface JourneyFilters {
  q?: string
  stage?: CheckoutStage
  page?: number
}

// ─── Cupons (dashboard) ───────────────────────────────────────────────────────

export type DiscountType = 'percent' | 'fixed'
export type CouponStatus = 'active' | 'inactive' | 'scheduled' | 'expired' | 'exhausted'

export interface AdminCoupon {
  id: string
  code: string
  description: string | null
  type: DiscountType
  /** percent: % · fixed: reais */
  value: number
  minSubtotal: number
  startsAt: string | null
  endsAt: string | null
  maxUses: number | null
  usedCount: number
  isActive: boolean
  status: CouponStatus
  createdAt: string
  updatedAt: string
}

export interface CouponPayload {
  code: string
  description: string | null
  type: DiscountType
  value: number
  minSubtotal: number
  startsAt: string | null
  endsAt: string | null
  maxUses: number | null
  isActive: boolean
}

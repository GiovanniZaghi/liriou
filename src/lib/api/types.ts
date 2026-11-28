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
  /** Preço "De" (riscado). null = sem promoção */
  compareAtPrice: number | null
  colorName: string | null
  colorHex: string | null
  badge: string | null
  image: string
  hoverImage: string
  gallery: string[]
  kit: KitDetails | null
  inStock: boolean
  /** ISO; ausente em respostas de versões antigas da API */
  createdAt?: string
}

/** Opção de frete cotada na Frenet para um CEP */
export interface ShippingQuoteOption {
  serviceCode: string
  carrier: string
  service: string
  /** "Correios · SEDEX" */
  label: string
  /** Preço para a cliente (0 quando a sacola tem frete grátis) */
  price: number
  originalPrice: number
  /** Prazo em dias úteis */
  deliveryDays: number
}

export interface ShippingQuoteResult {
  cep: string
  freeShipping: boolean
  options: ShippingQuoteOption[]
}

export interface StoreSettings {
  freeShippingThreshold: number
  /** Parcelas sem juros no cartão */
  installments: number
  /** Desconto extra (%) no Pix à vista */
  pixDiscountPercent: number
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
  /** Embalagem de Natal */
  giftWrap: boolean
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
  /** Frete escolhido (cotado para `cep`) */
  shipping: (ShippingQuoteOption & { cep: string }) | null
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
  /** Preço "De" (riscado). null = sem promoção */
  compareAtPrice: number | null
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
  /** Medidas de envio (frete Frenet) */
  weightGrams: number
  lengthCm: number
  widthCm: number
  heightCm: number
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
  /** Preço "De" (riscado). null = sem promoção */
  compareAtPrice: number | null
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
  weightGrams: number
  lengthCm: number
  widthCm: number
  heightCm: number
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
  /** Aniversário (opcional), DD/MM/AAAA como a cliente digitou */
  birthDate?: string
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
  giftWrap: boolean
  items: { productId: string; name: string; image: string; unitPrice: number; quantity: number; lineTotal: number }[]
  itemCount: number
  totals: { subtotal: number; discount: number; shipping: number; total: number }
  createdAt: string
}

// ─── Envio (Frenet) ───────────────────────────────────────────────────────────

export interface TrackingEvent {
  /** dd/MM/yyyy HH:mm */
  at: string
  description: string
  location: string
  type: string
}

export interface ShipmentInfo {
  orderId: string
  orderNumber: number
  shipping: {
    label: string
    carrier: string | null
    service: string | null
    deliveryDays: number | null
    /** O que a cliente pagou */
    charged: number
    /** Custo cotado na transportadora */
    quoted: number | null
  }
  /** Token de parceiro Frenet configurado na API */
  labelsEnabled: boolean
  canCreate: boolean
  blockedReason: string | null
  shipment: {
    id: string
    providerId: string
    status: string
    trackingNumber: string | null
    trackingUrl: string | null
    labelUrl: string | null
    declarationUrl: string | null
    lastEvent: TrackingEvent | null
    createdAt: string
    updatedAt: string
  } | null
}

// ─── Pagamento (Mercado Pago) ─────────────────────────────────────────────────

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto'
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded'

export interface Payment {
  id: string
  orderId: string
  orderStatus: OrderStatus
  method: PaymentMethod
  status: PaymentStatus
  /** Motivo do gateway (ex.: rejected_by_issuer, waiting_transfer) */
  statusDetail: string
  amount: number
  installments: number
  pix: { qrCode: string; qrCodeBase64: string | null; ticketUrl: string | null } | null
  boleto: { ticketUrl: string; digitableLine: string | null } | null
  expiresAt: string | null
  createdAt: string
}

export interface StartPaymentInput {
  method: PaymentMethod
  card?: { token: string; brand: string; installments: number }
}

// ─── Acompanhamento de clientes (dashboard) ───────────────────────────────────

/** Até onde a cliente chegou: sacola → identificação → entrega/revisão → pedido */
export type CheckoutStage = 'cart' | 'identified' | 'delivery' | 'ordered'

// ─── Clientes (dashboard): uma por e-mail ─────────────────────────────────────

export type CustomerSegment = 'buyers' | 'not_bought' | 'birthday_month'

export interface CustomerRow {
  email: string
  name: string
  phone: string
  /** AAAA-MM-DD, quando a cliente informou */
  birthDate: string | null
  city: string | null
  state: string | null
  /** Pedidos não cancelados */
  ordersCount: number
  paidOrdersCount: number
  /** Soma dos pedidos pagos */
  totalSpent: number
  lastOrderAt: string | null
  /** Sacolas com itens que não viraram pedido */
  openCartsCount: number
  openCartsValue: number
  firstSeenAt: string
  lastActivityAt: string
}

export interface CustomerDetail extends CustomerRow {
  cpf: string | null
  address: Order['shippingAddress'] | null
  orders: { id: string; number: number; status: OrderStatus; itemCount: number; total: number; shipmentStatus: string | null; createdAt: string }[]
  openCarts: {
    cartId: string
    stage: CheckoutStage
    itemCount: number
    value: number
    items: { name: string; quantity: number; image: string }[]
    lastActivityAt: string
  }[]
}

export interface CustomerFilters {
  q?: string
  segment?: CustomerSegment
  page?: number
}

// ─── Pedidos (dashboard) ──────────────────────────────────────────────────────

export interface AdminOrderRow {
  id: string
  number: number
  status: OrderStatus
  customer: { name: string; email: string; phone: string }
  city: string
  state: string
  itemCount: number
  total: number
  /** Embalagem de Natal */
  giftWrap: boolean
  /** Tentativa de pagamento mais recente */
  payment: { method: PaymentMethod; status: PaymentStatus; installments: number } | null
  shipment: { status: string; trackingNumber: string | null } | null
  /** Etapa que a cliente vê */
  stage: FulfillmentStage
  /** Entregue / recebido pela cliente (oculto da fila) */
  deliveredAt: string | null
  createdAt: string
}

export interface AdminOrderDetail extends AdminOrderRow {
  customer: AdminOrderRow['customer'] & { cpf: string; birthDate: string | null }
  shippingAddress: Order['shippingAddress']
  shippingLabel: string
  couponCode: string | null
  items: { productId: string; name: string; sku: string; image: string; unitPrice: number; quantity: number; lineTotal: number }[]
  totals: { subtotal: number; discount: number; shipping: number; total: number }
  payments: { id: string; method: PaymentMethod; status: PaymentStatus; statusDetail: string; amount: number; installments: number; createdAt: string }[]
  updatedAt: string
}

export interface OrdersSummary {
  total: number
  awaitingPayment: number
  paid: number
  cancelled: number
  /** Pagos sem etiqueta de envio */
  toShip: number
  paidValue: number
  awaitingValue: number
  today: number
  /** Entregues (aba Ocultos) */
  hidden: number
}

export interface OrderFilters {
  q?: string
  status?: OrderStatus
  toShip?: boolean
  /** Só os ocultos (entregues) */
  hidden?: boolean
  page?: number
}

export interface JourneyFunnel {
  cart: number
  identified: number
  delivery: number
  ordered: number
  orderedValue: number
  openValue: number
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

// ─── Área da cliente ──────────────────────────────────────────────────────────

/** Recebido → Pago → Separando → Enviado → Entregue (ou Cancelado) */
export type FulfillmentStage = 'recebido' | 'pago' | 'separando' | 'enviado' | 'entregue' | 'cancelado'

export interface CustomerOrder {
  number: number
  status: OrderStatus
  stage: FulfillmentStage
  total: number
  items: { name: string; quantity: number; image: string }[]
  shipping: { label: string; pickup: boolean; deliveryDays: number | null }
  tracking: {
    number: string | null
    url: string | null
    lastEvent: { at: string; description: string; location: string } | null
  } | null
  giftWrap: boolean
  city: string | null
  state: string | null
  deliveredAt: string | null
  createdAt: string
}

export interface CustomerOrdersLookup {
  firstName: string | null
  orders: CustomerOrder[]
}

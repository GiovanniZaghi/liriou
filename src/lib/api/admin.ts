import 'server-only'

import { redirect } from 'next/navigation'
import { getSessionToken } from '@/lib/session'
import { ApiError, apiFetch, toQuery, type ApiInit } from './http'
import type {
  AdminCoupon,
  AdminProduct,
  CouponPayload,
  InventorySummary,
  JourneyDetail,
  JourneyFilters,
  JourneyFunnel,
  JourneyRow,
  Lead,
  LeadFilters,
  LeadStats,
  Paginated,
  ProductFilters,
  ProductPayload,
  StockMovement,
  StockMovementType,
} from './types'

export const LEADS_PAGE_SIZE = 50

/** Chamada autenticada do dashboard: token do cookie httpOnly; sessão inválida → volta ao login. */
async function adminFetch<T>(path: string, init: ApiInit = {}): Promise<T> {
  const token = await getSessionToken()
  if (!token) redirect('/dashboard/login')
  try {
    return await apiFetch<T>(path, { cache: 'no-store', ...init, token })
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect('/dashboard/login?expirou=1')
    throw err
  }
}

export function listLeads({ q, pain, page = 1 }: LeadFilters) {
  return adminFetch<Paginated<Lead>>(`/admin/leads${toQuery({ q, pain, page, pageSize: LEADS_PAGE_SIZE })}`)
}

export function getLeadStats() {
  return adminFetch<LeadStats>('/admin/leads/stats')
}

// ─── Estoque ──────────────────────────────────────────────────────────────────

export const PRODUCTS_PAGE_SIZE = 25

export function listProducts({ q, category, status, lowStock, page = 1 }: ProductFilters) {
  const isActive = status === 'ativo' ? true : status === 'oculto' ? false : undefined
  return adminFetch<Paginated<AdminProduct>>(
    `/admin/products${toQuery({ q, category, isActive, lowStock: lowStock || undefined, page, pageSize: PRODUCTS_PAGE_SIZE })}`,
  )
}

export const getInventorySummary = () => adminFetch<InventorySummary>('/admin/products/summary')

export const getProduct = (id: string) => adminFetch<AdminProduct>(`/admin/products/${id}`)

export const listStockMovements = (id: string, page = 1) =>
  adminFetch<Paginated<StockMovement>>(`/admin/products/${id}/stock-movements${toQuery({ page, pageSize: 20 })}`)

export const createProduct = (body: ProductPayload) =>
  adminFetch<AdminProduct>('/admin/products', { method: 'POST', body })

export const updateProduct = (id: string, body: Partial<ProductPayload>) =>
  adminFetch<AdminProduct>(`/admin/products/${id}`, { method: 'PATCH', body })

export const deleteProduct = (id: string) => adminFetch<void>(`/admin/products/${id}`, { method: 'DELETE' })

export const registerStockMovement = (id: string, body: { type: StockMovementType; quantity: number; reason?: string }) =>
  adminFetch<{ product: AdminProduct; movement: StockMovement }>(`/admin/products/${id}/stock-movements`, {
    method: 'POST',
    body,
  })

/** CSV bruto (repassado como download pelo route handler /dashboard/export). */
export async function exportLeadsCsv({ q, pain }: LeadFilters): Promise<Response> {
  const token = await getSessionToken()
  const base = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
  return fetch(`${base}/admin/leads/export${toQuery({ q, pain })}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
}

// ─── Clientes ─────────────────────────────────────────────────────────────────

export const JOURNEYS_PAGE_SIZE = 30

export const getJourneyFunnel = () => adminFetch<JourneyFunnel>('/admin/customers/funnel')

export const listJourneys = ({ q, stage, page = 1 }: JourneyFilters) =>
  adminFetch<Paginated<JourneyRow>>(`/admin/customers${toQuery({ q, stage, page, pageSize: JOURNEYS_PAGE_SIZE })}`)

export const getJourney = (cartId: string) => adminFetch<JourneyDetail>(`/admin/customers/${cartId}`)

// ─── Cupons ───────────────────────────────────────────────────────────────────

export const COUPONS_PAGE_SIZE = 30

export const listCoupons = ({ q, page = 1 }: { q?: string; page?: number }) =>
  adminFetch<Paginated<AdminCoupon>>(`/admin/coupons${toQuery({ q, page, pageSize: COUPONS_PAGE_SIZE })}`)

export const getCoupon = (id: string) => adminFetch<AdminCoupon>(`/admin/coupons/${id}`)

export const createCoupon = (body: CouponPayload) => adminFetch<AdminCoupon>('/admin/coupons', { method: 'POST', body })

export const updateCoupon = (id: string, body: Partial<CouponPayload>) =>
  adminFetch<AdminCoupon>(`/admin/coupons/${id}`, { method: 'PATCH', body })

export const deleteCoupon = (id: string) => adminFetch<void>(`/admin/coupons/${id}`, { method: 'DELETE' })

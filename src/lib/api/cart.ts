import { apiFetch } from './http'
import type { Cart, CheckoutAddress, CheckoutCustomer, ShippingQuoteResult } from './types'

/** Sacola no servidor (chamado do navegador). Toda resposta devolve a sacola já recalculada. */
export const cartApi = {
  create: (items?: { productId: string; quantity: number }[]) =>
    apiFetch<Cart>('/carts', { method: 'POST', body: items?.length ? { items } : {} }),

  get: (cartId: string) => apiFetch<Cart>(`/carts/${cartId}`, { cache: 'no-store' }),

  addItem: (cartId: string, productId: string, quantity = 1) =>
    apiFetch<Cart>(`/carts/${cartId}/items`, { method: 'POST', body: { productId, quantity } }),

  setQuantity: (cartId: string, productId: string, quantity: number) =>
    apiFetch<Cart>(`/carts/${cartId}/items/${productId}`, { method: 'PUT', body: { quantity } }),

  removeItem: (cartId: string, productId: string) =>
    apiFetch<Cart>(`/carts/${cartId}/items/${productId}`, { method: 'DELETE' }),

  applyCoupon: (cartId: string, code: string) =>
    apiFetch<Cart>(`/carts/${cartId}/coupon`, { method: 'PUT', body: { code } }),

  removeCoupon: (cartId: string) => apiFetch<Cart>(`/carts/${cartId}/coupon`, { method: 'DELETE' }),

  /** Opções de frete (Frenet) para o CEP, com o peso real da sacola */
  quoteShipping: (cartId: string, cep: string) =>
    apiFetch<ShippingQuoteResult>(`/carts/${cartId}/shipping/quote`, { method: 'POST', body: { cep } }),

  /** Escolhe o frete; a API recota e grava o preço da transportadora */
  selectShipping: (cartId: string, cep: string, serviceCode: string) =>
    apiFetch<Cart>(`/carts/${cartId}/shipping`, { method: 'PUT', body: { cep, serviceCode } }),

  /** Checkout: etapa "Identificação" concluída (a loja passa a acompanhar onde a cliente parou) */
  saveCheckoutCustomer: (cartId: string, customer: CheckoutCustomer) =>
    apiFetch<Cart>(`/carts/${cartId}/checkout/customer`, { method: 'PUT', body: customer }),

  /** Checkout: etapa "Entrega" concluída */
  saveCheckoutDelivery: (cartId: string, address: CheckoutAddress, shippingOptionId: string) =>
    apiFetch<Cart>(`/carts/${cartId}/checkout/delivery`, { method: 'PUT', body: { address, shippingOptionId } }),
}

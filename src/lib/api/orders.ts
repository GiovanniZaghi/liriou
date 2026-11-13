import { apiFetch } from './http'
import type { CheckoutAddress, CheckoutCustomer, Order } from './types'

/** Checkout (chamado do navegador). */
export const ordersApi = {
  place: (input: { cartId: string; customer: CheckoutCustomer; address: CheckoutAddress; shippingOptionId: string }) =>
    apiFetch<Order>('/orders', { method: 'POST', body: input }),

  get: (orderId: string) => apiFetch<Order>(`/orders/${orderId}`, { cache: 'no-store' }),
}

import { apiFetch } from './http'
import type { CheckoutAddress, CheckoutCustomer, CustomerOrdersLookup, Order } from './types'

/** Checkout (chamado do navegador). */
export const ordersApi = {
  place: (input: { cartId: string; customer: CheckoutCustomer; address: CheckoutAddress; shippingOptionId: string }) =>
    apiFetch<Order>('/orders', { method: 'POST', body: input }),

  get: (orderId: string) => apiFetch<Order>(`/orders/${orderId}`, { cache: 'no-store' }),

  /** Área da cliente: pedidos pelo CPF da compra (POST para o CPF não ir na URL) */
  lookup: (cpf: string) =>
    apiFetch<CustomerOrdersLookup>('/customer/orders/lookup', { method: 'POST', body: { cpf }, cache: 'no-store' }),
}

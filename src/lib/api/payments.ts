import { apiFetch } from './http'
import type { Payment, StartPaymentInput } from './types'

/** Pagamento do pedido (chamado do navegador). O valor é sempre calculado pela API. */
export const paymentsApi = {
  start: (orderId: string, input: StartPaymentInput) =>
    apiFetch<Payment>(`/orders/${orderId}/payment`, { method: 'POST', body: input }),

  /** Último pagamento do pedido (null se ainda não houve tentativa) */
  latest: (orderId: string) => apiFetch<Payment | null>(`/orders/${orderId}/payment`, { cache: 'no-store' }),
}

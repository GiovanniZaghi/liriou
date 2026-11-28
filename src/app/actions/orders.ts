'use server'

import { revalidatePath } from 'next/cache'
import { unstable_rethrow } from 'next/navigation'
import { markOrderDelivered, unhideOrder } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/http'

export type OrderActionResult = { ok: boolean; error?: string }

const UUID_RE = /^[0-9a-f-]{36}$/i

/** Marca como entregue (oculta da fila) ou desoculta (desfaz). */
export async function setOrderDeliveredAction(orderId: string, delivered: boolean): Promise<OrderActionResult> {
  if (!UUID_RE.test(orderId)) return { ok: false, error: 'Pedido inválido.' }
  try {
    if (delivered) await markOrderDelivered(orderId)
    else await unhideOrder(orderId)
  } catch (err) {
    unstable_rethrow(err)
    return { ok: false, error: err instanceof ApiError ? err.message : 'Não foi possível atualizar o pedido.' }
  }
  revalidatePath('/dashboard/pedidos')
  revalidatePath(`/dashboard/pedidos/${orderId}`)
  return { ok: true }
}

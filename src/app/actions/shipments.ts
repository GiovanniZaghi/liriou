'use server'

import { revalidatePath } from 'next/cache'
import { unstable_rethrow } from 'next/navigation'
import { createShipment, refreshShipmentLabel } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/http'

export type ShipmentActionState = { error?: string; ok?: boolean }

const UUID_RE = /^[0-9a-f-]{36}$/i

/** Gera a etiqueta (intent=create) ou renova os links (intent=refresh). Id via campo oculto, sem .bind. */
export async function shipmentAction(_prev: ShipmentActionState, fd: FormData): Promise<ShipmentActionState> {
  const orderId = String(fd.get('orderId') ?? '')
  const cartId = String(fd.get('cartId') ?? '')
  if (!UUID_RE.test(orderId)) return { error: 'Pedido inválido.' }

  try {
    if (fd.get('intent') === 'refresh') await refreshShipmentLabel(orderId)
    else await createShipment(orderId)
  } catch (err) {
    unstable_rethrow(err)
    if (err instanceof ApiError) return { error: err.message }
    console.error('[envios]', err)
    return { error: 'Não foi possível falar com a Frenet agora. Tente de novo.' }
  }

  if (UUID_RE.test(cartId)) revalidatePath(`/dashboard/clientes/${cartId}`)
  return { ok: true }
}

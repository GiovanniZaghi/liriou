import type { CheckoutStage, FulfillmentStage, OrderStatus } from '@/lib/api/types'
import { stageInfo } from '@/lib/journey'
import { FULFILLMENT_STAGE, ORDER_STATUS } from '@/lib/orders'
import { cn } from '@/lib/utils'

const badge = 'rounded-full px-2.5 py-0.5 text-[12px] font-semibold whitespace-nowrap'

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const info = ORDER_STATUS[status]
  return <span className={cn(badge, info.tone)}>{info.label}</span>
}

/** Até onde a sacola chegou no checkout */
export function StageBadge({ stage }: { stage: CheckoutStage }) {
  const info = stageInfo(stage)
  return <span className={cn(badge, info.tone)}>{info.label}</span>
}

/** Etapa que a cliente vê: Recebido → Pago → Separando → Enviado → Entregue */
export function FulfillmentBadge({ stage }: { stage: FulfillmentStage }) {
  const info = FULFILLMENT_STAGE[stage]
  return <span className={cn(badge, info.tone)}>{info.label}</span>
}

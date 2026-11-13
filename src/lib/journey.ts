import type { CheckoutStage, OrderStatus } from './api/types'

/** Rótulo de "onde parou" para cada etapa do checkout. */
export const STAGE_OPTIONS: { value: CheckoutStage; label: string; short: string; tone: string }[] = [
  { value: 'cart', label: 'Parou na sacola', short: 'Sacola', tone: 'bg-linho text-tinta' },
  { value: 'identified', label: 'Parou na entrega', short: 'Identificada', tone: 'bg-petala/60 text-rubor' },
  { value: 'delivery', label: 'Parou na revisão', short: 'Entrega', tone: 'bg-[#fde9c8] text-[#8a5a00]' },
  { value: 'ordered', label: 'Pedido realizado', short: 'Pedido', tone: 'bg-folha/12 text-folha' },
]

export const stageInfo = (s: CheckoutStage) => STAGE_OPTIONS.find((o) => o.value === s) ?? STAGE_OPTIONS[0]

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  aguardando_pagamento: 'Aguardando pagamento',
  pago: 'Pago',
  cancelado: 'Cancelado',
}

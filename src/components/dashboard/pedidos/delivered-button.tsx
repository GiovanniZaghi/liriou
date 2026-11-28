'use client'

import { Check, Eye, Loader2 } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { setOrderDeliveredAction } from '@/app/actions/orders'
import { cn } from '@/lib/utils'

interface DeliveredButtonProps {
  orderId: string
  /** Já está entregue (oculto)? Então o botão é "Desocultar". */
  delivered: boolean
  size?: 'sm' | 'md'
}

/** Check "Entregue / Recebido pela cliente" (oculta da fila) ou "Desocultar". */
export function DeliveredButton({ orderId, delivered, size = 'sm' }: DeliveredButtonProps) {
  const [pending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      const res = await setOrderDeliveredAction(orderId, !delivered)
      if (!res.ok) toast.error(res.error ?? 'Não foi possível atualizar o pedido.')
      else toast.success(delivered ? 'Pedido de volta na fila.' : 'Marcado como entregue. O pedido foi para "Ocultos".')
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-full border font-semibold whitespace-nowrap transition-colors disabled:opacity-60',
        size === 'sm' ? 'h-8 px-3 text-[12px]' : 'h-11 w-full px-5 text-[14px]',
        delivered
          ? 'border-linho bg-white text-noite-900 hover:border-noite-900'
          : 'border-folha bg-folha/10 text-folha hover:bg-folha hover:text-white',
      )}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : delivered ? (
        <Eye className="size-3.5" aria-hidden />
      ) : (
        <Check className="size-3.5" aria-hidden />
      )}
      {delivered ? 'Desocultar' : size === 'sm' ? 'Entregue' : 'Entregue / Recebido pela cliente'}
    </button>
  )
}

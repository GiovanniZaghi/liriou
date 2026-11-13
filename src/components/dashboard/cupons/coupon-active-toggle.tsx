'use client'

import { useOptimistic, useTransition } from 'react'
import { toast } from 'sonner'
import { setCouponActiveAction } from '@/app/actions/coupons'
import { cn } from '@/lib/utils'

export function CouponActiveToggle({ id, code, isActive }: { id: string; code: string; isActive: boolean }) {
  const [pending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(isActive)

  function toggle() {
    const next = !optimistic
    startTransition(async () => {
      setOptimistic(next)
      const r = await setCouponActiveAction(id, next)
      if (r.ok) toast.success(next ? `Cupom ${code} ativado.` : `Cupom ${code} desativado.`)
      else toast.error(r.error ?? 'Não foi possível atualizar o cupom.')
    })
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={`Cupom ${code} ativo`}
      onClick={toggle}
      disabled={pending}
      className="inline-flex cursor-pointer items-center disabled:cursor-wait"
    >
      <span className={cn('relative h-6 w-11 rounded-full transition-colors', optimistic ? 'bg-folha' : 'bg-linho')}>
        <span className={cn('absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform', optimistic && 'translate-x-5')} />
      </span>
    </button>
  )
}

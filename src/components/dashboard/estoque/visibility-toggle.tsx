'use client'

import { useOptimistic, useTransition } from 'react'
import { toast } from 'sonner'
import { setVisibilityAction } from '@/app/actions/products'
import { cn } from '@/lib/utils'

/** Switch "Exibir na vitrine": muda na hora (otimista) e a loja é atualizada em seguida. */
export function VisibilityToggle({ productId, isActive, name }: { productId: string; isActive: boolean; name: string }) {
  const [pending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(isActive)

  function toggle() {
    const next = !optimistic
    startTransition(async () => {
      setOptimistic(next)
      const result = await setVisibilityAction(productId, next)
      if (result.ok) toast.success(next ? `“${name}” agora aparece na vitrine.` : `“${name}” saiu da vitrine.`)
      else toast.error(result.error ?? 'Não foi possível atualizar a vitrine.')
    })
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={`Exibir ${name} na vitrine`}
      onClick={toggle}
      disabled={pending}
      className="group inline-flex cursor-pointer items-center gap-2 disabled:cursor-wait"
    >
      <span
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors duration-200',
          optimistic ? 'bg-folha' : 'bg-linho',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200 ease-cetim',
            optimistic && 'translate-x-5',
          )}
        />
      </span>
      <span className={cn('text-[13px]', optimistic ? 'text-folha' : 'text-musgo')}>{optimistic ? 'Na vitrine' : 'Oculto'}</span>
    </button>
  )
}

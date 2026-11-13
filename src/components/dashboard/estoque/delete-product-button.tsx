'use client'

import { Trash2 } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { deleteProductAction } from '@/app/actions/products'
import { dashBtn } from '../page-header'

export function DeleteProductButton({ productId, name }: { productId: string; name: string }) {
  const [pending, startTransition] = useTransition()

  function remove() {
    if (!confirm(`Excluir “${name}”? Ele sai da vitrine e do estoque (o histórico de movimentações é mantido).`)) return
    startTransition(async () => {
      const result = await deleteProductAction(productId)
      if (result && !result.ok) toast.error(result.error ?? 'Não foi possível excluir.')
    })
  }

  return (
    <button type="button" onClick={remove} disabled={pending} className={dashBtn.danger}>
      <Trash2 className="size-4" aria-hidden /> {pending ? 'Excluindo…' : 'Excluir'}
    </button>
  )
}

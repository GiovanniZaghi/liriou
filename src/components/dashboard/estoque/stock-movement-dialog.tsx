'use client'

import { ArrowDownToLine, ArrowUpFromLine, X } from 'lucide-react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { moveStockAction, type StockMovementState } from '@/app/actions/products'
import { cn } from '@/lib/utils'
import { dashBtn } from '../page-header'

interface StockMovementDialogProps {
  productId: string
  productName: string
  stock: number
  /** Aparência do botão que abre o modal */
  variant?: 'ghost' | 'primary'
}

/** Registrar entrada/saída de estoque (modal nativo <dialog>: foco e Esc já resolvidos pelo navegador). */
export function StockMovementDialog({ productId, productName, stock, variant = 'ghost' }: StockMovementDialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [type, setType] = useState<'entrada' | 'saida'>('entrada')
  const [state, action, pending] = useActionState<StockMovementState, FormData>(moveStockAction, {})

  useEffect(() => {
    if (!state.ok) return
    toast.success(`Estoque de “${productName}” atualizado: ${state.stock} un.`)
    formRef.current?.reset()
    setType('entrada')
    ref.current?.close()
  }, [state.at])

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={variant === 'primary' ? dashBtn.primary : dashBtn.ghost}>
        <ArrowDownToLine className="size-4" aria-hidden /> Movimentar
      </button>

      <dialog
        ref={ref}
        aria-labelledby={`mov-${productId}`}
        className="m-auto w-[min(440px,calc(100vw-32px))] rounded-[24px] bg-leite p-0 text-tinta shadow-2xl backdrop:bg-noite-950/60"
      >
        <form ref={formRef} action={action} className="p-6">
          <input type="hidden" name="productId" value={productId} />
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 id={`mov-${productId}`} className="font-serif text-[26px] leading-tight text-noite-900">
                Movimentar estoque
              </h2>
              <p className="mt-1 text-[13px] text-musgo">
                {productName} · <strong className="font-semibold text-tinta">{stock} un.</strong> hoje
              </p>
            </div>
            <button type="button" onClick={() => ref.current?.close()} aria-label="Fechar" className="grid size-9 place-items-center rounded-full hover:bg-linho">
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <fieldset className="mb-4 grid grid-cols-2 gap-2">
            <legend className="sr-only">Tipo de movimentação</legend>
            {(
              [
                { value: 'entrada', label: 'Entrada', hint: 'compra, devolução', Icon: ArrowDownToLine },
                { value: 'saida', label: 'Saída', hint: 'venda, avaria, brinde', Icon: ArrowUpFromLine },
              ] as const
            ).map(({ value, label, hint, Icon }) => (
              <label
                key={value}
                className={cn(
                  'flex cursor-pointer flex-col gap-0.5 rounded-2xl border-[1.5px] bg-white p-3',
                  type === value ? (value === 'entrada' ? 'border-folha' : 'border-rubor') : 'border-linho',
                )}
              >
                <input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} className="sr-only" />
                <span className={cn('flex items-center gap-1.5 text-[14px] font-semibold', value === 'entrada' ? 'text-folha' : 'text-rubor')}>
                  <Icon className="size-4" aria-hidden /> {label}
                </span>
                <span className="text-[12px] text-musgo">{hint}</span>
              </label>
            ))}
          </fieldset>

          <label className="mb-3 block">
            <span className="mb-1 block text-[13px] font-medium">Quantidade</span>
            <input
              name="quantity"
              type="number"
              min={1}
              max={type === 'saida' ? stock : undefined}
              required
              inputMode="numeric"
              className="h-11 w-full rounded-xl border-[1.5px] border-linho bg-white px-3 text-[15px] outline-none focus:border-noite-900"
            />
          </label>
          <label className="mb-4 block">
            <span className="mb-1 block text-[13px] font-medium">
              Motivo <span className="font-normal text-musgo">(opcional)</span>
            </span>
            <input
              name="reason"
              maxLength={200}
              placeholder={type === 'entrada' ? 'Ex.: Compra fornecedor' : 'Ex.: Venda Instagram'}
              className="h-11 w-full rounded-xl border-[1.5px] border-linho bg-white px-3 text-[15px] outline-none focus:border-noite-900"
            />
          </label>

          {state.error && (
            <p role="alert" className="mb-3 rounded-xl bg-rubor/10 px-3 py-2 text-[13px] text-rubor">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className={`${dashBtn.primary} w-full`}>
            {pending ? 'Registrando…' : `Registrar ${type === 'entrada' ? 'entrada' : 'saída'}`}
          </button>
        </form>
      </dialog>
    </>
  )
}

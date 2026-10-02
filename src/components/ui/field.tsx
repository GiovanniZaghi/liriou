'use client'

import { useId, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface FieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  label: string
  error?: string
  valid?: boolean
  /** Muda a cada envio com erro para disparar o shake de novo */
  shakeKey?: number
}

/**
 * Campo (43:64): label flutua no foco ou com valor. Válido: check desenhado.
 * Erro: shake + mensagem expande.
 */
export function Field({ label, error, valid, shakeKey, className, value, ...props }: FieldProps) {
  const id = useId()
  const errorId = `${id}-erro`
  const hasValue = String(value ?? '').length > 0

  return (
    <div className={cn('w-full', className)}>
      <div
        key={error ? shakeKey : undefined}
        className={cn(
          'relative h-14 rounded-(--radius-field) border-[1.5px] bg-white transition-colors duration-(--t-base) ease-cetim',
          error ? 'shake border-rubor' : 'border-linho focus-within:border-noite-900',
        )}
      >
        <input
          id={id}
          value={value}
          placeholder=" "
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          className="peer size-full rounded-(--radius-field) bg-transparent pt-[18px] pr-11 pl-[14.5px] text-[16px] leading-[1.55] text-tinta outline-none"
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute top-[14.5px] left-[14.5px] origin-left text-[16px] leading-[1.55] text-musgo',
            'transition-transform duration-(--t-base) ease-cetim',
            'peer-focus:-translate-y-[11px] peer-focus:scale-[0.72]',
            hasValue && '-translate-y-[11px] scale-[0.72]',
          )}
        >
          {label}
        </label>
        {valid && !error && (
          <svg
            aria-hidden
            className="check-draw absolute top-1/2 right-4 -translate-y-1/2 text-folha"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows] duration-(--t-base) ease-cetim',
        message ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
    >
      <p id={id} className="overflow-hidden text-[12px] leading-[1.5] text-rubor">
        <span className="block pt-1.5">{message}</span>
      </p>
    </div>
  )
}

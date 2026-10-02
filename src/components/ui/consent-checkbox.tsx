'use client'

import { useId } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FieldError } from './field'

interface ConsentCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
}

/** Checkbox: consentimento LGPD (44:53). Obrigatório. Pop + check desenhado ao marcar. */
export function ConsentCheckbox({ checked, onChange, error }: ConsentCheckboxProps) {
  const id = useId()
  const errorId = `${id}-erro`

  return (
    <div className="w-full">
      <div className="flex items-start gap-2.5">
        <span className="relative shrink-0">
          <input
            id={id}
            name="consent"
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? errorId : undefined}
            className="peer absolute inset-0 z-10 size-6 cursor-pointer opacity-0"
          />
          <span
            key={String(checked)}
            className={cn(
              'grid size-6 place-items-center rounded-[7px] border-[1.5px] transition-colors duration-(--t-base) ease-cetim',
              'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-noite-900',
              checked ? 'pop border-noite-900 bg-noite-900' : error ? 'border-rubor bg-white' : 'border-linho bg-white',
            )}
          >
            {checked && (
              <svg aria-hidden className="check-draw text-leite" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </span>
        <label htmlFor={id} className="flex-1 cursor-pointer text-[13px] leading-[1.5] text-tinta">
          Tenho 18 anos ou mais e concordo com os{' '}
          <Link href="/termos" className="underline underline-offset-2 hover:text-rubor">
            Termos de Uso
          </Link>{' '}
          e o{' '}
          <Link href="/privacidade" className="underline underline-offset-2 hover:text-rubor">
            Aviso de Privacidade
          </Link>
          .
        </label>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

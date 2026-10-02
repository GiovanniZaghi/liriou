'use client'

import type { ComponentProps } from 'react'
import { track } from '@/lib/analytics'
import { ButtonLink } from '@/components/ui/button'

interface CtaLinkProps extends Omit<ComponentProps<typeof ButtonLink>, 'href'> {
  source: 'closing' | 'sticky'
}

/** CTA que leva ao formulário (#cadastro) e registra `cta_click`. */
export function CtaLink({ source, onClick, ...props }: CtaLinkProps) {
  return (
    <ButtonLink
      href="#cadastro"
      onClick={(e) => {
        track('cta_click', { cta: source })
        onClick?.(e)
        // Após rolar, leva o foco ao primeiro campo
        setTimeout(() => document.querySelector<HTMLInputElement>('#cadastro input[name="name"]')?.focus({ preventScroll: true }), 600)
      }}
      {...props}
    />
  )
}

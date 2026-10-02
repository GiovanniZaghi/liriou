'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { CtaLink } from './cta-link'

/**
 * Mobile / 01b Rolagem com CTA fixo: aparece depois que o formulário sai da tela
 * e some quando o formulário ou o bloco CTA final estão visíveis.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const form = document.getElementById('cadastro')
    const closing = document.getElementById('cta-titulo')
    if (!form) return

    const state = { formVisible: true, formAbove: false, closingVisible: false }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === form) {
          state.formVisible = e.isIntersecting
          state.formAbove = !e.isIntersecting && e.boundingClientRect.top < 0
        } else {
          state.closingVisible = e.isIntersecting
        }
      }
      setVisible(!state.formVisible && state.formAbove && !state.closingVisible)
    })
    io.observe(form)
    if (closing) io.observe(closing)
    return () => io.disconnect()
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-5 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 transition-[opacity,translate] duration-(--t-base) ease-cetim lg:hidden',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
      )}
      aria-hidden={!visible}
    >
      <CtaLink
        source="sticky"
        variant="rosa"
        fullWidth
        tabIndex={visible ? 0 : -1}
        className="shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
      >
        Quero meu acesso VIP
      </CtaLink>
    </div>
  )
}

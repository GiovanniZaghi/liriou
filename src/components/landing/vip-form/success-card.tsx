'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { track } from '@/lib/analytics'
import { shareMessage, site } from '@/lib/site'
import { ButtonLink } from '@/components/ui/button'

/** Estado de sucesso do card (Desktop / 02 Sucesso · Mobile / 06 Sucesso). */
export function SuccessCard() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${site.url}`)}`

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  async function copyLink() {
    track('copy_link')
    try {
      await navigator.clipboard.writeText(site.url)
      toast.success('Link copiado')
    } catch {
      toast.error('Não foi possível copiar o link')
    }
  }

  return (
    <div className="dissolve-in relative flex flex-col items-center gap-3 py-2 text-center" aria-live="polite">
      <svg aria-hidden width="56" height="56" viewBox="0 0 56 56" fill="none" className="check-draw mb-1">
        <circle cx="28" cy="28" r="26" stroke="#008037" strokeWidth="1.7" />
        <path d="M18 29l7 7 13-15" stroke="#008037" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="41" cy="11" r="3.5" fill="#ffcfdd" stroke="#b03a62" strokeWidth="1" />
      </svg>

      <h2 ref={titleRef} tabIndex={-1} className="display-s text-noite-900 outline-none">
        Você está na <em className="text-rubor italic">lista VIP.</em>
      </h2>
      <p className="max-w-[300px] text-[14px] leading-[1.5] text-musgo">
        Vamos te chamar no WhatsApp assim que a pré-venda abrir. Enquanto isso, chama uma amiga para a lista.
      </p>

      <ButtonLink
        variant="verde"
        fullWidth
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('share_whatsapp')}
        className="mt-3"
      >
        Enviar no WhatsApp
      </ButtonLink>
      <button
        type="button"
        onClick={copyLink}
        className="cursor-pointer text-[13px] leading-[1.5] font-semibold text-tinta underline underline-offset-4 hover:text-rubor"
      >
        Copiar link
      </button>
    </div>
  )
}

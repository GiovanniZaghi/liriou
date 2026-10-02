'use client'

import { Fragment } from 'react'
import { useMotionPaused } from '@/lib/motion'

const ITEMS = ['PRÉ-VENDA', 'LISTA VIP', 'BRINDE PARA AS PRIMEIRAS', 'CETIM DE ALTA GRAMATURA']

/** Fita de pré-venda: trilho em loop + controle Pausar/Retomar animações (WCAG 2.2.2). */
export function AnnouncementRibbon() {
  const { paused, toggle } = useMotionPaused()

  return (
    <div className="relative h-[34px] w-full overflow-hidden bg-petala">
      <p className="sr-only">{ITEMS.join(' · ')}</p>
      <div aria-hidden className="marquee absolute top-[9px] left-0 flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-[18px] pr-[18px]">
            {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
              <Fragment key={i}>
                <span className="text-[11px] leading-[1.2] font-semibold tracking-[0.2em] whitespace-nowrap text-noite-900">
                  {item}
                </span>
                <img alt="" src="/figma/ponto.svg" className="size-[5px] shrink-0" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={paused}
        aria-label={paused ? 'Retomar animações' : 'Pausar animações'}
        className="absolute inset-y-0 right-0 w-[44px] cursor-pointer bg-linear-to-r from-petala/0 via-petala via-35% to-petala"
      >
        {paused ? (
          <svg aria-hidden className="absolute top-[11px] left-[18px]" width="10" height="12" viewBox="0 0 10 12">
            <path d="M1 1l8 5-8 5z" fill="#0b2e1f" />
          </svg>
        ) : (
          <>
            <span className="absolute top-[11px] left-[18px] h-3 w-[2.2px] rounded-[1px] bg-noite-900" />
            <span className="absolute top-[11px] left-[24px] h-3 w-[2.2px] rounded-[1px] bg-noite-900" />
          </>
        )}
      </button>
    </div>
  )
}

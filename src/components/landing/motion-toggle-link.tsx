'use client'

import { useMotionPaused } from '@/lib/motion'

/** Mesmo controle da fita, como link no rodapé (WCAG 2.2.2). */
export function MotionToggleLink() {
  const { paused, toggle } = useMotionPaused()
  return (
    <button type="button" onClick={toggle} aria-pressed={paused} className="cursor-pointer underline hover:text-petala">
      {paused ? 'Retomar animações' : 'Pausar animações'}
    </button>
  )
}

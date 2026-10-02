'use client'

import { useSyncExternalStore } from 'react'
import { MOTION_STORAGE_KEY } from './site'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] })
  return () => observer.disconnect()
}

function isPaused() {
  return document.documentElement.dataset.motion === 'paused'
}

/** Estado global de "Pausar animações" (WCAG 2.2.2), guardado no <html> e no localStorage. */
export function useMotionPaused() {
  const paused = useSyncExternalStore(subscribe, isPaused, () => false)

  function toggle() {
    const next = !isPaused()
    if (next) document.documentElement.dataset.motion = 'paused'
    else delete document.documentElement.dataset.motion
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, next ? 'paused' : 'running')
    } catch {}
  }

  return { paused, toggle }
}

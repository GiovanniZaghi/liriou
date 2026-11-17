'use client'

import { useEffect } from 'react'

/**
 * Liga os elementos `[data-reveal]`: entram ao aparecer na tela, uma única vez.
 * Também observa o que surge depois (navegação entre páginas, filtros e paginação da vitrine),
 * senão esses elementos ficariam invisíveis.
 */
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    const watch = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches('[data-reveal]:not(.is-visible)')) io.observe(root)
      root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)').forEach((el) => io.observe(el))
    }

    watch(document)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) m.addedNodes.forEach((n) => n instanceof HTMLElement && watch(n))
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      io.disconnect()
    }
  }, [])

  return null
}

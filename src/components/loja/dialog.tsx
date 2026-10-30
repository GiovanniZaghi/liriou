'use client'

import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface DialogProps {
  label: string
  onClose: () => void
  /** `modal`: centralizado · `drawer`: gaveta à direita · `fullscreen`: cobre a tela */
  variant?: 'modal' | 'drawer' | 'fullscreen'
  panelClassName?: string
  children: React.ReactNode
}

/**
 * `<dialog>` nativo aberto como modal ao montar: foco preso, Esc e clique fora fecham.
 * Quem controla é o pai (renderiza só quando aberto).
 */
export function Dialog({ label, onClose, variant = 'modal', panelClassName, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal()
    return () => d?.close()
  }, [])

  const closeOnSelf = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <dialog
      ref={ref}
      aria-label={label}
      // Esc: fecha pelo estado (o evento `close` também dispara ao trocar de modal, então não é usado)
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={closeOnSelf}
      className={cn(
        'loja-dialog fixed inset-0 m-0 size-full max-h-none max-w-none bg-transparent p-0 text-grafite',
        variant === 'drawer' ? 'loja-drawer overflow-hidden' : 'overflow-y-auto',
      )}
    >
      {variant === 'modal' && (
        <div className="flex min-h-full items-center justify-center px-4 py-8" onClick={closeOnSelf}>
          <div className={cn('loja-dialog-panel relative w-full rounded-3xl bg-white shadow-2xl', panelClassName)}>
            {children}
          </div>
        </div>
      )}
      {variant === 'drawer' && (
        <div
          className={cn(
            'loja-dialog-panel ml-auto flex h-full w-full max-w-md flex-col bg-areia shadow-2xl',
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
      {variant === 'fullscreen' && (
        <div className={cn('loja-dialog-panel min-h-full bg-white/95 backdrop-blur-md', panelClassName)}>
          {children}
        </div>
      )}
    </dialog>
  )
}

export function CloseButton({ onClick, className, label = 'Fechar' }: { onClick: () => void; className?: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-4 right-4 z-10 rounded-full bg-algodao p-2.5 text-grafite transition-colors hover:bg-borda',
        className,
      )}
    >
      <X className="size-4" aria-hidden />
    </button>
  )
}

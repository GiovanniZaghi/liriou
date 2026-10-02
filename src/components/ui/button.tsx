import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'rosa' | 'verde'

const variants: Record<Variant, string> = {
  // Primário sobre fundo claro
  primary: 'bg-noite-900 text-leite border-petala/35 hover:bg-noite-800',
  // Rosa sobre fundo escuro (CTA principal)
  rosa: 'bg-petala text-noite-900 border-transparent hover:bg-[#ffdbe5]',
  // Verde para compartilhar
  verde: 'bg-folha text-leite border-transparent hover:bg-[#009140]',
}

interface ButtonStyleProps {
  variant?: Variant
  pulse?: boolean
  fullWidth?: boolean
}

export function buttonClasses({ variant = 'primary', pulse, fullWidth }: ButtonStyleProps = {}) {
  return cn(
    'btn-shine relative inline-flex h-14 cursor-pointer items-center justify-center overflow-hidden rounded-full border px-7',
    'text-[16px] leading-[1.2] font-semibold tracking-[0.01em] whitespace-nowrap',
    'shadow-[0_8px_18px_-8px_rgba(0,0,0,0.18)] transition-[background-color,box-shadow,translate] duration-200 ease-cetim',
    'hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(0,0,0,0.3)]',
    'disabled:cursor-wait disabled:hover:translate-y-0',
    variants[variant],
    pulse && 'btn-pulse',
    fullWidth && 'w-full',
  )
}

interface ButtonProps extends ComponentProps<'button'>, ButtonStyleProps {
  loading?: boolean
}

export function Button({ variant, pulse, fullWidth, loading, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonClasses({ variant, pulse: pulse && !loading, fullWidth }), className)}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      <span
        className={cn(
          'transition-[opacity,translate] duration-(--t-base) ease-cetim',
          loading && '-translate-y-3 opacity-0',
        )}
      >
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <span className="spinner" />
          <span className="sr-only">Enviando…</span>
        </span>
      )}
    </button>
  )
}

interface ButtonLinkProps extends ComponentProps<'a'>, ButtonStyleProps {}

export function ButtonLink({ variant, pulse, fullWidth, className, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonClasses({ variant, pulse, fullWidth }), className)} {...props} />
}

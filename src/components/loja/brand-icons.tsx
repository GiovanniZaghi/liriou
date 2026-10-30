// O lucide-react 1.x não traz ícones de marcas: versões em traço no mesmo estilo.

type IconProps = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  )
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v12.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M12 3c0 2.8 2.2 5 5 5" />
    </svg>
  )
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 20.5 4.8 16.6A8.5 8.5 0 1 1 7.6 19.3Z" />
      <path d="M9 9.2c0 3.2 2.6 5.8 5.8 5.8l.9-1.4-1.8-.9-.9.8a4.6 4.6 0 0 1-2.1-2.1l.8-.9-.9-1.8Z" />
    </svg>
  )
}

import Link from 'next/link'
import { PRE_SALE_PATH } from '@/lib/site'
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from './brand-icons'
import { DialogTrigger } from './triggers'
import { Wordmark } from './wordmark'

// TODO: trocar TikTok e WhatsApp pelos perfis oficiais da Líriou
const SOCIAL = [
  { href: 'https://www.instagram.com/lirio.u/', label: 'Instagram @lirio.u', icon: InstagramIcon },
  { href: 'https://tiktok.com', label: 'TikTok', icon: TikTokIcon },
  { href: 'https://whatsapp.com', label: 'WhatsApp', icon: WhatsAppIcon },
]

const link = 'text-leite/70 transition-colors hover:text-petala'

/** Rodapé em verde-noite, como a landing e o logo da marca. */
export function StoreFooter() {
  return (
    <footer className="mt-auto bg-noite-900 px-4 py-16 text-leite sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:flex-wrap md:text-left">
        <div>
          <Wordmark className="text-leite" />
          <p className="mt-2 text-xs text-leite/70">Cuidando de você (e do seu cabelo) com carinho. 🌸</p>
          <a href="https://www.instagram.com/lirio.u/" target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-semibold text-petala hover:underline">
            @lirio.u
          </a>
        </div>

        <div className="flex items-center gap-3">
          {SOCIAL.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex size-10 items-center justify-center rounded-full bg-leite/10 text-leite transition-colors hover:bg-petala hover:text-noite-900"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>

        <nav aria-label="Rodapé" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          <Link href="/#colecao" className={link}>
            Vitrine
          </Link>
          <DialogTrigger dialog={{ type: 'creator' }} className={link}>
            Seja Creator
          </DialogTrigger>
          <Link href={PRE_SALE_PATH} className={link}>
            Lista VIP
          </Link>
          <Link href="/termos" className={link}>
            Termos
          </Link>
          <Link href="/privacidade" className={link}>
            Privacidade
          </Link>
        </nav>
        <p className="text-xs text-leite/50">© 2026 Líriou. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

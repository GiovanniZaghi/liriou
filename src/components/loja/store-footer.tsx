import Link from 'next/link'
import { PRE_SALE_PATH } from '@/lib/site'
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from './brand-icons'
import { DialogTrigger } from './triggers'
import { Wordmark } from './wordmark'

// TODO: trocar pelos perfis oficiais da Líriou
const SOCIAL = [
  { href: 'https://instagram.com', label: 'Instagram', icon: InstagramIcon },
  { href: 'https://tiktok.com', label: 'TikTok', icon: TikTokIcon },
  { href: 'https://whatsapp.com', label: 'WhatsApp', icon: WhatsAppIcon },
]

export function StoreFooter() {
  return (
    <footer className="mt-auto border-t border-borda bg-algodao px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:flex-wrap md:text-left">
        <div>
          <Wordmark />
          <p className="mt-2 text-xs text-cinza">Cuidando de você (e do seu cabelo) com carinho. 🤎</p>
        </div>

        <div className="flex items-center gap-6 text-grafite">
          {SOCIAL.map(({ href, label, icon: Icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="transition-colors hover:text-salvia">
              <Icon className="size-5" />
            </a>
          ))}
        </div>

        <nav aria-label="Rodapé" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          <Link href="/#colecao" className="text-cinza transition-colors hover:text-grafite">
            Vitrine
          </Link>
          <DialogTrigger dialog={{ type: 'creator' }} className="text-cinza transition-colors hover:text-grafite">
            Seja Creator
          </DialogTrigger>
          <Link href={PRE_SALE_PATH} className="text-cinza transition-colors hover:text-grafite">
            Lista VIP
          </Link>
          <Link href="/termos" className="text-cinza transition-colors hover:text-grafite">
            Termos
          </Link>
          <Link href="/privacidade" className="text-cinza transition-colors hover:text-grafite">
            Privacidade
          </Link>
        </nav>
        <p className="text-xs text-cinza">© 2026 Líriou. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

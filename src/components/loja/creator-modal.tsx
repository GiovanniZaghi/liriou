'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CREATOR_KITS } from '@/lib/catalog'
import { maskPhone } from '@/lib/masks'
import { CloseButton, Dialog } from './dialog'
import { useStore } from './store-provider'
import { inputBase } from './styles'

const labelBase = 'mb-1 block text-xs font-semibold tracking-wider text-grafite uppercase'

export function CreatorModal() {
  const { closeDialog } = useStore()
  const [phone, setPhone] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: salvar inscrição no banco (Server Action) quando o dashboard de creators existir
    toast.success('Inscrição enviada! Seu Kit Creator está reservado e o cupom LIRIOU10 será ativado no seu perfil.')
    closeDialog()
  }

  return (
    <Dialog label="Seja uma Creator Líriou" onClose={closeDialog} panelClassName="max-w-2xl p-8 sm:p-12">
      <CloseButton onClick={closeDialog} />
      <span className="eyebrow text-salvia">Exclusivo Embaixadoras</span>
      <h2 className="mt-1 font-serif text-3xl text-grafite">Seja uma Creator Líriou</h2>
      <p className="mt-2 mb-6 text-xs leading-relaxed text-cinza">
        Preencha seus dados e escolha o seu <strong className="font-semibold text-grafite">Kit Creator</strong> para
        receber em casa antes do lançamento, com cupom exclusivo de 10% OFF para as suas seguidoras.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="creator-nome" className={labelBase}>
              Nome completo
            </label>
            <input id="creator-nome" name="name" required autoComplete="name" placeholder="Seu nome" className={inputBase} />
          </div>
          <div>
            <label htmlFor="creator-whatsapp" className={labelBase}>
              WhatsApp
            </label>
            <input
              id="creator-whatsapp"
              name="whatsapp"
              type="tel"
              required
              autoComplete="tel-national"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              className={inputBase}
            />
          </div>
          <div>
            <label htmlFor="creator-handle" className={labelBase}>
              Instagram ou TikTok (@)
            </label>
            <input id="creator-handle" name="handle" required placeholder="@seuhandle" className={inputBase} />
          </div>
          <div>
            <label htmlFor="creator-cidade" className={labelBase}>
              Cidade / Estado
            </label>
            <input id="creator-cidade" name="city" required placeholder="São Paulo - SP" className={inputBase} />
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 text-xs font-semibold tracking-wider text-grafite uppercase">
            Escolha o seu Kit Creator para envio antecipado:
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CREATOR_KITS.map((kit, i) => (
              <label
                key={kit.value}
                className="flex flex-col items-center rounded-2xl border-2 border-borda bg-white p-3 text-center transition-all hover:border-salvia has-checked:border-salvia has-checked:bg-algodao/50"
              >
                <input type="radio" name="creator_kit" value={kit.value} defaultChecked={i === 0} className="mb-2 accent-salvia" />
                <span className="text-xs font-medium text-grafite">{kit.label}</span>
                <span className="mt-1 text-[10px] text-cinza">{kit.detail}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-salvia py-4 text-xs font-medium text-white shadow-md transition-all hover:bg-salvia-900"
        >
          Confirmar inscrição e solicitar Kit Creator
        </button>
      </form>
    </Dialog>
  )
}

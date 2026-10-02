'use client'

import { logoutAction } from '@/app/actions/auth'

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await logoutAction()
        window.location.replace('/dashboard/login')
      }}
      className="cursor-pointer rounded-full border border-petala/35 px-4 py-1.5 font-medium text-leite hover:bg-petala hover:text-noite-900"
    >
      Sair
    </button>
  )
}

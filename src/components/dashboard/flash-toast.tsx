'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

/** Mostra um aviso vindo de um redirect (ex.: ?salvo=1) e limpa o parâmetro da URL. */
export function FlashToast({ message }: { message: string }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    toast.success(message)
    router.replace(pathname, { scroll: false })
  }, [])

  return null
}

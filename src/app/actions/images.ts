'use server'

import { unstable_rethrow } from 'next/navigation'
import { uploadImage } from '@/lib/api/admin'
import { ApiError } from '@/lib/api/http'

export type UploadImageResult = { ok: true; url: string } | { ok: false; error: string }

/** Repassa a foto para a API com o token da sessão (o cookie é httpOnly, o navegador não o enxerga). */
export async function uploadImageAction(fd: FormData): Promise<UploadImageResult> {
  const file = fd.get('file')
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Escolha uma imagem.' }
  try {
    const { url } = await uploadImage(file)
    return { ok: true, url }
  } catch (err) {
    unstable_rethrow(err) // sessão expirada → login
    if (err instanceof ApiError) {
      if (err.status === 413) return { ok: false, error: 'Imagem muito grande (máx. 5 MB).' }
      return { ok: false, error: err.fields?.file ?? err.message }
    }
    console.error('[upload]', err)
    return { ok: false, error: 'Não foi possível enviar a imagem. Tente de novo.' }
  }
}

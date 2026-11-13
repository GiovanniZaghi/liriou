/**
 * Cliente HTTP da API. No servidor usa API_URL (pode ser rede interna);
 * no navegador usa NEXT_PUBLIC_API_URL.
 */
function baseUrl() {
  const url =
    typeof window === 'undefined'
      ? process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_URL
  if (!url) throw new Error('NEXT_PUBLIC_API_URL não configurada (veja .env.example)')
  return url.replace(/\/$/, '')
}

/** Erro padronizado da API: `code` estável e `fields` com mensagens por campo (validação). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export type ApiInit = Omit<RequestInit, 'body'> & {
  body?: unknown
  token?: string
  next?: { revalidate?: number | false; tags?: string[] }
}

export async function apiFetch<T>(path: string, { body, token, headers, ...init }: ApiInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Não foi possível conectar. Verifique sua internet e tente de novo.')
  }

  if (res.status === 204) return undefined as T
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = Array.isArray(data?.message) ? data.message[0] : data?.message
    throw new ApiError(res.status, data?.code ?? 'HTTP_ERROR', message ?? 'Algo deu errado. Tente de novo.', data?.errors)
  }
  return data as T
}

export function toQuery(params: Record<string, string | number | boolean | undefined | null>) {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') sp.set(k, String(v))
  return sp.size ? `?${sp}` : ''
}

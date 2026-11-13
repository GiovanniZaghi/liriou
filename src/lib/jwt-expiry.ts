/**
 * Lê só o `exp` de um JWT (sem validar a assinatura — isso é papel da API).
 * Usado pelo proxy para mandar ao login quem tem cookie vencido, sem ida à API.
 */
export function isJwtExpired(token: string | undefined): boolean {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

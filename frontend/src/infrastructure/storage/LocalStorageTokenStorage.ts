import { ITokenStorage } from '../../domain/repositories/ITokenStorage'

const TOKEN_KEY = 'viaje-bem-token'
const USER_KEY = 'viaje-bem-user'

export class LocalStorageTokenStorage implements ITokenStorage {
  save(token: string, userData: Record<string, unknown>): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  }

  getUser(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as Record<string, unknown>
    } catch {
      return null
    }
  }

  remove(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

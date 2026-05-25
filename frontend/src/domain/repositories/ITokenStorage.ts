export interface ITokenStorage {
  save(token: string, userData: Record<string, unknown>): void
  getToken(): string | null
  getUser(): Record<string, unknown> | null
  remove(): void
}

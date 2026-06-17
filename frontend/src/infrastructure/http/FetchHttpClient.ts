import { ITokenStorage } from '../../domain/repositories/ITokenStorage'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export class FetchHttpClient {
  private readonly baseUrl: string
  constructor(baseUrl: string = API_URL) {
    // Garante que remove barras no final se existirem, sem condicionais malucas
    this.baseUrl = baseUrl.replace(/\/$/, '')
    //  constructor(baseUrl: string = API_URL) {
    //    // Ajusta URL para ambiente browser (docker → localhost)
    //    if (typeof window !== 'undefined') {
    //      try {
    //        const url = new URL(baseUrl)
    //        if (url.hostname === 'backend') {
    //          url.hostname = 'localhost'
    //          this.baseUrl = url.toString().replace(/\/$/, '')
    //        } else {
    //          this.baseUrl = baseUrl
    //        }
    //      } catch {
    //        this.baseUrl = baseUrl
    //      }
    //    } else {
    //      this.baseUrl = baseUrl
    //    }
  }

  private buildHeaders(tokenStorage: ITokenStorage): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    const token = tokenStorage.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null) as Record<string, unknown> | null
      const detail = errorData?.['detail']
      throw new Error(String(detail) || `HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json() as Promise<T>
  }

  async get<T>(endpoint: string, tokenStorage: ITokenStorage, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.buildHeaders(tokenStorage),
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, tokenStorage: ITokenStorage, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.buildHeaders(tokenStorage),
      body: JSON.stringify(body),
    })
    return this.handleResponse<T>(response)
  }

  async postForm<T>(endpoint: string, formData: URLSearchParams): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })
    return this.handleResponse<T>(response)
  }

  async patch<T>(endpoint: string, tokenStorage: ITokenStorage, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.buildHeaders(tokenStorage),
      body: JSON.stringify(body),
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, tokenStorage: ITokenStorage, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.buildHeaders(tokenStorage),
      body: JSON.stringify(body),
    })
    return this.handleResponse<T>(response)
  }
}

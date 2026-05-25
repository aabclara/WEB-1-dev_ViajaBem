import { IAuthRepository, LoginDTO, CadastrarDTO, AuthResponseDTO } from '../../domain/repositories/IAuthRepository'
import { ITokenStorage } from '../../domain/repositories/ITokenStorage'
import { Usuario } from '../../domain/entities/Usuario'
import { FetchHttpClient } from '../http/FetchHttpClient'
import { CredenciaisInvalidasError } from '../../domain/errors/CredenciaisInvalidasError'

interface ApiAuthResponse {
  access_token: string
  id: number
  nome: string
  apelido?: string
  email: string
  tipo: string
}

export class AuthHttpRepository implements IAuthRepository {
  constructor(
    private readonly httpClient: FetchHttpClient,
    private readonly tokenStorage: ITokenStorage,
  ) {}

  async login(credenciais: LoginDTO): Promise<AuthResponseDTO> {
    const formData = new URLSearchParams()
    formData.append('username', credenciais.email)
    formData.append('password', credenciais.senha)

    try {
      const data = await this.httpClient.postForm<ApiAuthResponse>('/auth/login', formData)
      return {
        accessToken: data.access_token,
        usuario: new Usuario({ id: data.id, nome: data.nome, apelido: data.apelido, email: data.email, tipo: data.tipo as 'ADMIN' | 'LIDER' }),
      }
    } catch {
      throw new CredenciaisInvalidasError()
    }
  }

  async cadastrar(dados: CadastrarDTO): Promise<AuthResponseDTO> {
    const data = await this.httpClient.post<ApiAuthResponse>('/auth/register', this.tokenStorage, {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      apelido: dados.apelido,
    })
    return {
      accessToken: data.access_token,
      usuario: new Usuario({ id: data.id, nome: data.nome, apelido: data.apelido, email: data.email, tipo: data.tipo as 'ADMIN' | 'LIDER' }),
    }
  }

  async buscarPerfil(): Promise<any> {
    return this.httpClient.get<any>('/auth/me', this.tokenStorage)
  }

  async atualizarPerfil(dados: any): Promise<any> {
    return this.httpClient.patch<any>('/auth/me', this.tokenStorage, dados)
  }
}

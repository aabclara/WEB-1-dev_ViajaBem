import { Usuario } from '../entities/Usuario'

export interface LoginDTO {
  email: string
  senha: string
}

export interface CadastrarDTO {
  nome: string
  email: string
  senha: string
  apelido?: string
}

export interface AuthResponseDTO {
  accessToken: string
  usuario: Usuario
}

export interface AtualizarPerfilDTO {
  nome: string
  apelido?: string
  telefone?: string
  senha?: string
}

export interface IAuthRepository {
  login(credenciais: LoginDTO): Promise<AuthResponseDTO>
  cadastrar(dados: CadastrarDTO): Promise<AuthResponseDTO>
  buscarPerfil(): Promise<any>
  atualizarPerfil(dados: AtualizarPerfilDTO): Promise<any>
}

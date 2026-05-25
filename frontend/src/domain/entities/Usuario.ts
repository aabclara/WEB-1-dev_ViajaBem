export type TipoUsuario = 'ADMIN' | 'LIDER'

export interface UsuarioProps {
  id: number
  nome: string
  apelido?: string
  email: string
  tipo: TipoUsuario
}

export class Usuario {
  readonly id: number
  readonly nome: string
  readonly apelido?: string
  readonly email: string
  readonly tipo: TipoUsuario

  constructor(props: UsuarioProps) {
    this.id = props.id
    this.nome = props.nome
    this.apelido = props.apelido
    this.email = props.email
    this.tipo = props.tipo
  }

  get ehAdmin(): boolean {
    return this.tipo === 'ADMIN'
  }

  get ehLider(): boolean {
    return this.tipo === 'LIDER'
  }

  get nomeExibicao(): string {
    return this.apelido ?? this.nome.split(' ')[0]
  }

  static fromApi(raw: Record<string, unknown>): Usuario {
    return new Usuario({
      id: raw['id'] as number,
      nome: raw['nome'] as string,
      apelido: raw['apelido'] as string | undefined,
      email: raw['email'] as string,
      tipo: raw['tipo'] as TipoUsuario,
    })
  }

  static fromStorage(raw: Record<string, unknown>): Usuario {
    return Usuario.fromApi(raw)
  }
}

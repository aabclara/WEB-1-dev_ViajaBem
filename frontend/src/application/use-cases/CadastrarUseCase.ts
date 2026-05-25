import { IAuthRepository, CadastrarDTO, AuthResponseDTO } from '../../domain/repositories/IAuthRepository'
import { ITokenStorage } from '../../domain/repositories/ITokenStorage'

export class CadastrarUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenStorage: ITokenStorage,
  ) {}

  async execute(dados: CadastrarDTO): Promise<AuthResponseDTO> {
    const response = await this.authRepository.cadastrar(dados)
    this.tokenStorage.save(response.accessToken, {
      id: response.usuario.id,
      nome: response.usuario.nome,
      apelido: response.usuario.apelido,
      email: response.usuario.email,
      tipo: response.usuario.tipo,
    })
    return response
  }
}

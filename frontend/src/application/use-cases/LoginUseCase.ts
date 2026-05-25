import { IAuthRepository, LoginDTO, AuthResponseDTO } from '../../domain/repositories/IAuthRepository'
import { ITokenStorage } from '../../domain/repositories/ITokenStorage'
import { CredenciaisInvalidasError } from '../../domain/errors/CredenciaisInvalidasError'

export class LoginUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenStorage: ITokenStorage,
  ) {}

  async execute(credenciais: LoginDTO): Promise<AuthResponseDTO> {
    try {
      const response = await this.authRepository.login(credenciais)
      this.tokenStorage.save(response.accessToken, {
        id: response.usuario.id,
        nome: response.usuario.nome,
        apelido: response.usuario.apelido,
        email: response.usuario.email,
        tipo: response.usuario.tipo,
      })
      return response
    } catch (err) {
      if (err instanceof CredenciaisInvalidasError) throw err
      throw new CredenciaisInvalidasError()
    }
  }
}

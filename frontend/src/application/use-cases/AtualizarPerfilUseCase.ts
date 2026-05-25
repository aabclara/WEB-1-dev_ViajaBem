import { IAuthRepository, AtualizarPerfilDTO } from '../../domain/repositories/IAuthRepository'

export class AtualizarPerfilUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(dados: AtualizarPerfilDTO): Promise<any> {
    return this.authRepository.atualizarPerfil(dados)
  }
}

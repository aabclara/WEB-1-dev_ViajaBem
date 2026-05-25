import { IAuthRepository } from '../../domain/repositories/IAuthRepository'

export class BuscarPerfilUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<any> {
    return this.authRepository.buscarPerfil()
  }
}

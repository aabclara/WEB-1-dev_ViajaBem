import { IReservaRepository } from '../../domain/repositories/IReservaRepository'

export class AtualizarPassageiroUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async execute(idPassageiro: number, dados: { nome: string, documento: string }): Promise<any> {
    return this.reservaRepository.atualizarPassageiro(idPassageiro, dados)
  }
}

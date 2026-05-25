import { Viagem } from '../../domain/entities/Viagem'
import { IViagemRepository } from '../../domain/repositories/IViagemRepository'
import { ViagemNaoEncontradaError } from '../../domain/errors/ViagemNaoEncontradaError'

export class BuscarViagemUseCase {
  constructor(private readonly viagemRepository: IViagemRepository) {}

  async execute(id: number): Promise<Viagem> {
    try {
      return await this.viagemRepository.buscarPorId(id)
    } catch {
      throw new ViagemNaoEncontradaError(id)
    }
  }
}

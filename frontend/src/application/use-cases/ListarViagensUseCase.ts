import { Viagem } from '../../domain/entities/Viagem'
import { IViagemRepository } from '../../domain/repositories/IViagemRepository'

export class ListarViagensUseCase {
  constructor(private readonly viagemRepository: IViagemRepository) {}

  async execute(): Promise<Viagem[]> {
    return this.viagemRepository.listarTodas()
  }
}

import { Viagem } from '../../domain/entities/Viagem'
import { IViagemRepository, CriarViagemDTO } from '../../domain/repositories/IViagemRepository'

export class CriarViagemUseCase {
  constructor(private readonly viagemRepository: IViagemRepository) {}

  async execute(dados: CriarViagemDTO): Promise<Viagem> {
    return this.viagemRepository.criar(dados)
  }
}

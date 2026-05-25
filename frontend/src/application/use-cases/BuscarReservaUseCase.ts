import { IReservaRepository } from '../../domain/repositories/IReservaRepository'
import { Reserva } from '../../domain/entities/Reserva'

export class BuscarReservaUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async execute(id: number): Promise<Reserva> {
    return this.reservaRepository.buscarPorId(id)
  }
}

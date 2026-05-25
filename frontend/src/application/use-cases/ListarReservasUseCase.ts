import { Reserva } from '../../domain/entities/Reserva'
import { IReservaRepository } from '../../domain/repositories/IReservaRepository'

export class ListarReservasUseCase {
  constructor(private readonly reservaRepository: IReservaRepository) {}

  async execute(): Promise<Reserva[]> {
    return this.reservaRepository.listarMinhas()
  }
}

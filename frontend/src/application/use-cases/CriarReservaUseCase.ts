import { Reserva } from '../../domain/entities/Reserva'
import { IReservaRepository, CriarReservaDTO } from '../../domain/repositories/IReservaRepository'
import { IViagemRepository } from '../../domain/repositories/IViagemRepository'
import { ReservaNaoAutorizadaError } from '../../domain/errors/ReservaNaoAutorizadaError'

export class CriarReservaUseCase {
  constructor(
    private readonly reservaRepository: IReservaRepository,
    private readonly viagemRepository: IViagemRepository,
  ) {}

  async execute(dados: CriarReservaDTO): Promise<Reserva> {
    const viagem = await this.viagemRepository.buscarPorId(dados.idViagem)

    if (viagem.estaEsgotada) {
      throw new ReservaNaoAutorizadaError('a viagem está esgotada')
    }

    if (dados.qtdVagas > viagem.vagasDisponiveis) {
      throw new ReservaNaoAutorizadaError(
        `quantidade solicitada (${dados.qtdVagas}) supera vagas disponíveis (${viagem.vagasDisponiveis})`
      )
    }

    return this.reservaRepository.criar(dados)
  }
}

import { IReservaRepository, CriarReservaDTO, AtualizarReservaDTO } from '../../domain/repositories/IReservaRepository'
import { ITokenStorage } from '../../domain/repositories/ITokenStorage'
import { Reserva } from '../../domain/entities/Reserva'
import { FetchHttpClient } from '../http/FetchHttpClient'

export class ReservaHttpRepository implements IReservaRepository {
  constructor(
    private readonly httpClient: FetchHttpClient,
    private readonly tokenStorage: ITokenStorage,
  ) {}

  async criar(dados: CriarReservaDTO): Promise<Reserva> {
    const data = await this.httpClient.post<Record<string, unknown>>('/reservas/', this.tokenStorage, {
      id_viagem: dados.idViagem,
      qtd_vagas: dados.qtdVagas,
    })
    return Reserva.fromApi(data)
  }

  async listarMinhas(): Promise<Reserva[]> {
    const data = await this.httpClient.get<Record<string, unknown>[]>('/reservas/', this.tokenStorage)
    return data.map(Reserva.fromApi)
  }

  async buscarPorId(id: number): Promise<Reserva> {
    const data = await this.httpClient.get<Record<string, unknown>>(`/reservas/${id}`, this.tokenStorage)
    return Reserva.fromApi(data)
  }

  async atualizar(id: number, dados: AtualizarReservaDTO): Promise<Reserva> {
    const data = await this.httpClient.patch<Record<string, unknown>>(`/reservas/${id}`, this.tokenStorage, {
      status: dados.status,
    })
    return Reserva.fromApi(data)
  }

  async atualizarPassageiro(idPassageiro: number, dados: { nome: string, documento: string }): Promise<any> {
    return this.httpClient.patch<any>(`/passageiros/${idPassageiro}`, this.tokenStorage, dados)
  }
}

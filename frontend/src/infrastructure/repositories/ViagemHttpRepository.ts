import { IViagemRepository, CriarViagemDTO } from '../../domain/repositories/IViagemRepository'
import { ITokenStorage } from '../../domain/repositories/ITokenStorage'
import { Viagem } from '../../domain/entities/Viagem'
import { FetchHttpClient } from '../http/FetchHttpClient'

export class ViagemHttpRepository implements IViagemRepository {
  constructor(
    private readonly httpClient: FetchHttpClient,
    private readonly tokenStorage: ITokenStorage,
  ) {}

  async listarTodas(): Promise<Viagem[]> {
    const data = await this.httpClient.get<Record<string, unknown>[]>('/viagens/', this.tokenStorage)
    return data.map(Viagem.fromApi)
  }

  async buscarPorId(id: number): Promise<Viagem> {
    const data = await this.httpClient.get<Record<string, unknown>>(`/viagens/${id}`, this.tokenStorage)
    return Viagem.fromApi(data)
  }

  async criar(dados: CriarViagemDTO): Promise<Viagem> {
    const body: Record<string, unknown> = {
      titulo: dados.titulo,
      descricao_precos: dados.descricaoPrecos,
      data_partida: dados.dataPartida,
      data_retorno: dados.dataRetorno,
      vagas_totais: dados.vagasTotais,
      descricao_curta: dados.descricaoCurta,
      itens_inclusos: dados.itensInclusos,
      url_capa: dados.urlCapa,
    }
    const data = await this.httpClient.post<Record<string, unknown>>('/admin/viagens/', this.tokenStorage, body)
    return Viagem.fromApi(data)
  }

  async listarAdmin(skip: number, limit: number): Promise<Viagem[]> {
    const data = await this.httpClient.get<Record<string, unknown>[]>('/admin/viagens/', this.tokenStorage, { skip, limit })
    return data.map(Viagem.fromApi)
  }
}

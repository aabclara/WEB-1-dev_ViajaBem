import { Viagem } from '../entities/Viagem'

export interface CriarViagemDTO {
  titulo: string
  descricaoPrecos: string
  dataPartida: string
  dataRetorno?: string
  vagasTotais: number
  descricaoCurta?: string
  itensInclusos?: string
  urlCapa?: string
}

export interface IViagemRepository {
  listarTodas(): Promise<Viagem[]>
  buscarPorId(id: number): Promise<Viagem>
  criar(dados: CriarViagemDTO): Promise<Viagem>
  listarAdmin(skip: number, limit: number): Promise<Viagem[]>
}

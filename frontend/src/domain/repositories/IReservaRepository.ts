import { Reserva } from '../entities/Reserva'

export interface CriarReservaDTO {
  idViagem: number
  qtdVagas: number
}

export interface AtualizarReservaDTO {
  status: string
}

export interface IReservaRepository {
  criar(dados: CriarReservaDTO): Promise<Reserva>
  listarMinhas(): Promise<Reserva[]>
  buscarPorId(id: number): Promise<Reserva>
  atualizar(id: number, dados: AtualizarReservaDTO): Promise<Reserva>
  atualizarPassageiro(idPassageiro: number, dados: { nome: string, documento: string }): Promise<any>
}

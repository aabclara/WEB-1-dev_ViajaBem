import { StatusReserva } from '../value-objects/StatusReserva'

export interface ReservaProps {
  id: number
  idViagem: number
  tituloViagem: string
  dataPartidaViagem: string
  qtdVagas: number
  status: StatusReserva
}

export class Reserva {
  readonly id: number
  readonly idViagem: number
  readonly tituloViagem: string
  readonly dataPartidaViagem: string
  readonly qtdVagas: number
  readonly status: StatusReserva

  constructor(props: ReservaProps) {
    this.id = props.id
    this.idViagem = props.idViagem
    this.tituloViagem = props.tituloViagem
    this.dataPartidaViagem = props.dataPartidaViagem
    this.qtdVagas = props.qtdVagas
    this.status = props.status
  }

  get estaFinalizada(): boolean {
    return new Date(this.dataPartidaViagem) < new Date()
  }

  get estaCancelada(): boolean {
    return this.status === StatusReserva.CANCELADO
  }

  static fromApi(raw: Record<string, unknown>): Reserva {
    return new Reserva({
      id: raw['id'] as number,
      idViagem: raw['id_viagem'] as number,
      tituloViagem: (raw['titulo_viagem'] as string) ?? '',
      dataPartidaViagem: raw['data_partida_viagem'] as string,
      qtdVagas: raw['qtd_vagas'] as number,
      status: raw['status'] as StatusReserva,
    })
  }
}

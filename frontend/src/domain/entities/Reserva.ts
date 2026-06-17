import { StatusReserva } from '../value-objects/StatusReserva'

export interface PassageiroProps {
  id: number
  nome: string | null
  documento: string | null
  eh_lider: boolean
}

export interface ReservaProps {
  id: number
  idViagem: number
  tituloViagem: string
  dataPartidaViagem: string
  qtdVagas: number
  status: StatusReserva
  passageiros?: PassageiroProps[]
}

export class Reserva {
  readonly id: number
  readonly idViagem: number
  readonly tituloViagem: string
  readonly dataPartidaViagem: string
  readonly qtdVagas: number
  readonly status: StatusReserva
  readonly passageiros: PassageiroProps[]

  constructor(props: ReservaProps) {
    this.id = props.id
    this.idViagem = props.idViagem
    this.tituloViagem = props.tituloViagem
    this.dataPartidaViagem = props.dataPartidaViagem
    this.qtdVagas = props.qtdVagas
    this.status = props.status
    this.passageiros = props.passageiros || []
  }

  get estaFinalizada(): boolean {
    return new Date(this.dataPartidaViagem) < new Date()
  }

  get estaCancelada(): boolean {
    return this.status === StatusReserva.CANCELADO
  }

  static fromApi(raw: Record<string, unknown>): Reserva {
    const rawPassageiros = (raw['passageiros'] as Record<string, unknown>[]) || []
    const passageiros = rawPassageiros.map((p) => ({
      id: p['id'] as number,
      nome: p['nome'] as string | null,
      documento: p['documento'] as string | null,
      eh_lider: p['eh_lider'] as boolean,
    }))

    return new Reserva({
      id: raw['id'] as number,
      idViagem: raw['id_viagem'] as number,
      tituloViagem: (raw['titulo_viagem'] as string) ?? '',
      dataPartidaViagem: raw['data_partida_viagem'] as string,
      qtdVagas: raw['qtd_vagas'] as number,
      status: raw['status'] as StatusReserva,
      passageiros,
    })
  }
}

import { StatusViagem } from '../value-objects/StatusViagem'

export interface ViagemProps {
  id: number
  titulo: string
  descricaoPrecos: string | null
  dataPartida: string
  dataRetorno?: string
  urlCapa?: string
  vagasTotais: number
  status: StatusViagem
  vagasDisponiveis: number
  descricaoCurta?: string
  itensInclusos?: string
}

export class Viagem {
  readonly id: number
  readonly titulo: string
  readonly descricaoPrecos: string | null
  readonly dataPartida: string
  readonly dataRetorno?: string
  readonly urlCapa?: string
  readonly vagasTotais: number
  readonly status: StatusViagem
  readonly vagasDisponiveis: number
  readonly descricaoCurta?: string
  readonly itensInclusos?: string

  constructor(props: ViagemProps) {
    this.id = props.id
    this.titulo = props.titulo
    this.descricaoPrecos = props.descricaoPrecos
    this.dataPartida = props.dataPartida
    this.dataRetorno = props.dataRetorno
    this.urlCapa = props.urlCapa
    this.vagasTotais = props.vagasTotais
    this.status = props.status
    this.vagasDisponiveis = props.vagasDisponiveis
    this.descricaoCurta = props.descricaoCurta
    this.itensInclusos = props.itensInclusos
  }

  get percentualOcupacao(): number {
    if (this.vagasTotais === 0) return 0
    const ocupadas = this.vagasTotais - this.vagasDisponiveis
    return Math.round((ocupadas / this.vagasTotais) * 100)
  }

  get ultimasVagas(): boolean {
    if (this.vagasTotais === 0) return false
    return this.vagasDisponiveis <= Math.ceil(this.vagasTotais * 0.1)
  }

  get estaEsgotada(): boolean {
    return this.vagasDisponiveis === 0 || this.status === StatusViagem.ESGOTADO
  }

  get itensInclososLista(): string[] {
    if (!this.itensInclusos) return []
    return this.itensInclusos.split(/,|\n/).map((i) => i.trim()).filter(Boolean)
  }

  /** Cria uma Viagem a partir de um objeto raw da API (snake_case) */
  static fromApi(raw: Record<string, unknown>): Viagem {
    return new Viagem({
      id: raw['id'] as number,
      titulo: raw['titulo'] as string,
      descricaoPrecos: (raw['descricao_precos'] as string | null) ?? null,
      dataPartida: raw['data_partida'] as string,
      dataRetorno: raw['data_retorno'] as string | undefined,
      urlCapa: raw['url_capa'] as string | undefined,
      vagasTotais: raw['vagas_totais'] as number,
      status: (raw['status'] as StatusViagem) ?? StatusViagem.ATIVO,
      vagasDisponiveis: raw['vagas_disponiveis'] as number,
      descricaoCurta: raw['descricao_curta'] as string | undefined,
      itensInclusos: raw['itens_inclusos'] as string | undefined,
    })
  }
}

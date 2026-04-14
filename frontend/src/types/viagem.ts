/** Matches the backend ViagemPublicaSchema */
export interface Viagem {
  id: number;
  titulo: string;
  descricao_precos: string | null;
  data_partida: string;
  vagas_totais: number;
  status: string;
  vagas_disponiveis: number;
  ultimas_vagas: boolean;
}

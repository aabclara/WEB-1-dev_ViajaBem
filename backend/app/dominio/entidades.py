from dataclasses import dataclass, field
from datetime import datetime, date
from typing import List, Optional
from .enums import TipoUsuario, StatusViagem, StatusReserva, SubstatusReserva

@dataclass
class EntidadeBase:
    id: Optional[int] = None
    criado_em: Optional[datetime] = None

@dataclass
class Usuario(EntidadeBase):
    email: str = ""
    senha_hash: str = ""
    nome: str = ""
    cpf: str = ""
    telefone: str = ""
    data_nascimento: Optional[date] = None
    tipo: TipoUsuario = TipoUsuario.LIDER
    apelido: Optional[str] = None
    reservas: List["ReservaGrupo"] = field(default_factory=list)

@dataclass
class Viagem(EntidadeBase):
    titulo: str = ""
    descricao_curta: Optional[str] = None
    itens_inclusos: Optional[str] = None
    descricao_precos: Optional[str] = None
    data_partida: Optional[date] = None
    data_retorno: Optional[date] = None
    url_capa: Optional[str] = None
    vagas_totais: int = 0
    status: StatusViagem = StatusViagem.ATIVO
    reservas: List["ReservaGrupo"] = field(default_factory=list)

    def validar_disponibilidade(self, vagas_solicitadas: int) -> None:
        if self.status == StatusViagem.ESGOTADO:
            raise ValueError("Viagem esgotada")
        # Conta as vagas já ocupadas (desconsidera reservas canceladas)
        vagas_ocupadas = sum(r.qtd_vagas for r in self.reservas if r.status != StatusReserva.CANCELADO)
        if self.vagas_totais - vagas_ocupadas < vagas_solicitadas:
            raise ValueError("Vagas insuficientes para esta viagem")

@dataclass
class ReservaGrupo(EntidadeBase):
    id_viagem: int = 0
    id_lider: int = 0
    qtd_vagas: int = 0
    valor_acordado: Optional[float] = None
    status: StatusReserva = StatusReserva.SOLICITADO
    substatus: SubstatusReserva = SubstatusReserva.AGUARDANDO_CONTATO
    data_expiracao: Optional[datetime] = None
    admin_responsavel_id: Optional[int] = None
    viagem: Optional[Viagem] = None
    lider: Optional[Usuario] = None
    titulo_viagem: Optional[str] = None
    data_partida_viagem: Optional[date] = None
    nome_lider: Optional[str] = None
    passageiros: List["Passageiro"] = field(default_factory=list)

    def calcular_resumo_financeiro(self) -> dict:
        if not self.valor_acordado:
            raise ValueError("Valor acordado não definido")
        from decimal import Decimal
        valor = Decimal(str(self.valor_acordado))
        sinal = round(valor * Decimal("0.5"), 2)
        restante = valor - sinal
        por_pessoa = round(valor / Decimal(str(self.qtd_vagas)), 2)
        return {
            "valor_acordado": valor,
            "sinal": sinal,
            "restante": restante,
            "valor_por_pessoa": por_pessoa
        }

    def calcular_valor_por_pessoa(self) -> Optional[float]:
        if not self.valor_acordado or not self.qtd_vagas:
            return None
        from decimal import Decimal
        return float(round(Decimal(str(self.valor_acordado)) / Decimal(str(self.qtd_vagas)), 2))

@dataclass
class Passageiro:
    id: Optional[int] = None
    id_reserva: int = 0
    nome: Optional[str] = None
    documento: Optional[str] = None
    eh_lider: bool = False
    reserva: Optional[ReservaGrupo] = None

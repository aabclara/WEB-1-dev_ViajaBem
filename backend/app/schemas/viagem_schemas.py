from datetime import date
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel
from app.infra.modelos import StatusViagem, StatusReserva, SubstatusReserva


class ViagemPublicaSchema(BaseModel):
    id: int
    titulo: str
    descricao_precos: Optional[str]
    data_partida: date
    vagas_totais: int
    status: StatusViagem
    vagas_disponiveis: int
    ultimas_vagas: bool

    model_config = {"from_attributes": True}


class CriarViagemSchema(BaseModel):
    titulo: str
    descricao_precos: Optional[str] = None
    data_partida: date
    vagas_totais: int


class AtualizarViagemSchema(BaseModel):
    titulo: Optional[str] = None
    descricao_precos: Optional[str] = None
    data_partida: Optional[date] = None
    vagas_totais: Optional[int] = None
    status: Optional[StatusViagem] = None


class PassageiroSchema(BaseModel):
    id: int
    nome: Optional[str]
    documento: Optional[str]
    eh_lider: bool

    model_config = {"from_attributes": True}


class CriarReservaSchema(BaseModel):
    id_viagem: int
    qtd_vagas: int


class ReservaSchema(BaseModel):
    id: int
    id_viagem: int
    id_lider: int
    qtd_vagas: int
    valor_acordado: Optional[Decimal]
    status: StatusReserva
    substatus: SubstatusReserva
    admin_responsavel_id: Optional[int]
    passageiros: list[PassageiroSchema] = []

    model_config = {"from_attributes": True}


class ResumoFinanceiroSchema(BaseModel):
    valor_acordado: Decimal
    sinal: Decimal
    restante: Decimal
    valor_por_pessoa: Decimal


class AcompanhanteSchema(BaseModel):
    titulo_viagem: str
    data_partida: date
    valor_por_pessoa: Optional[Decimal]


class AtualizarReservaAdminSchema(BaseModel):
    status: Optional[StatusReserva] = None
    substatus: Optional[SubstatusReserva] = None
    valor_acordado: Optional[Decimal] = None


class AtualizarPassageiroSchema(BaseModel):
    nome: Optional[str] = None
    documento: Optional[str] = None


class KanbanViagemSchema(BaseModel):
    id_viagem: int
    titulo: str
    colunas: dict[str, list[ReservaSchema]]


class ResumoWhatsappSchema(BaseModel):
    texto: str

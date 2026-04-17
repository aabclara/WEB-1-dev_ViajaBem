from datetime import date
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field
from app.infra.modelos import StatusViagem, StatusReserva, SubstatusReserva


class ViagemPublicaSchema(BaseModel):
    id: int = Field(..., description="ID da viagem", examples=[1])
    titulo: str = Field(..., description="Título descritivo da viagem", examples=["Final de Semana em Campos do Jordão"])
    descricao_precos: Optional[str] = Field(None, description="Resumo textual dos preços", examples=["A partir de R$ 350,00"])
    data_partida: date = Field(..., description="Data agendada para a partida", examples=["2026-05-15"])
    vagas_totais: int = Field(..., description="Capacidade máxima da viagem", examples=[46])
    status: StatusViagem = Field(..., description="Status atual da viagem", examples=["ATIVO"])
    descricao_curta: Optional[str] = Field(None, description="Resumo conciso da viagem", examples=["Aproveite um final de semana inesquecível na montanha."])
    itens_inclusos: Optional[str] = Field(None, description="Itens inclusos no pacote", examples=["Transporte, Seguro Viagem, Guia"])
    vagas_disponiveis: int = Field(..., description="Quantidade de vagas ainda disponíveis", examples=[10])
    ultimas_vagas: bool = Field(..., description="Indica se a viagem atingiu o limiar de últimas vagas", examples=[False])

    model_config = {"from_attributes": True}


class CriarViagemSchema(BaseModel):
    titulo: str = Field(..., description="Título da viagem", examples=["Bate-volta Campos do Jordão"])
    descricao_precos: Optional[str] = Field(None, description="Resumo de preços", examples=["R$ 150 (Adultos)"])
    data_partida: date = Field(..., description="Data da partida", examples=["2026-06-20"])
    vagas_totais: int = Field(..., description="Capacidade", examples=[40])
    descricao_curta: Optional[str] = None
    itens_inclusos: Optional[str] = None


class AtualizarViagemSchema(BaseModel):
    titulo: Optional[str] = None
    descricao_precos: Optional[str] = None
    data_partida: Optional[date] = None
    vagas_totais: Optional[int] = None
    status: Optional[StatusViagem] = None
    descricao_curta: Optional[str] = None
    itens_inclusos: Optional[str] = None


class PassageiroSchema(BaseModel):
    id: int = Field(..., description="ID do passageiro", examples=[123])
    nome: Optional[str] = Field(None, description="Nome do passageiro", examples=["João da Silva"])
    documento: Optional[str] = Field(None, description="Documento do passageiro", examples=["123.456.789-00"])
    eh_lider: bool = Field(..., description="Indica se é o líder do grupo", examples=[True])

    model_config = {"from_attributes": True}


class CriarReservaSchema(BaseModel):
    id_viagem: int
    qtd_vagas: int


class ReservaSchema(BaseModel):
    id: int = Field(..., description="ID da reserva", examples=[45])
    id_viagem: int = Field(..., description="ID da viagem associada", examples=[1])
    id_lider: int = Field(..., description="ID do líder reservante", examples=[10])
    qtd_vagas: int = Field(..., description="Vagas reservadas", examples=[2])
    valor_acordado: Optional[Decimal] = Field(None, description="Valor final acordado para a reserva", examples=[300.00])
    status: StatusReserva = Field(..., description="Status atual da reserva", examples=["SOLICITADO"])
    substatus: SubstatusReserva = Field(..., description="Substatus ou pendência da reserva", examples=["AGUARDANDO_CONTATO"])
    admin_responsavel_id: Optional[int] = Field(None, description="ID do admin responsável", examples=[1])
    titulo_viagem: Optional[str] = Field(None, description="Título da viagem associada")
    data_partida_viagem: Optional[date] = Field(None, description="Data de partida da viagem associada")
    nome_lider: Optional[str] = Field(None, description="Nome do líder da reserva")
    passageiros: list[PassageiroSchema] = Field(default=[], description="Lista de passageiros vinculados")

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

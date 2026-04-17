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
    vagas_totais: int = 0
    status: StatusViagem = StatusViagem.ATIVO
    reservas: List["ReservaGrupo"] = field(default_factory=list)

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
    passageiros: List["Passageiro"] = field(default_factory=list)

@dataclass
class Passageiro:
    id: Optional[int] = None
    id_reserva: int = 0
    nome: Optional[str] = None
    documento: Optional[str] = None
    eh_lider: bool = False
    reserva: Optional[ReservaGrupo] = None

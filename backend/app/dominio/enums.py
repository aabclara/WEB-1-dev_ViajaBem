import enum

class TipoUsuario(str, enum.Enum):
    LIDER = "LIDER"
    ADMIN = "ADMIN"


class StatusViagem(str, enum.Enum):
    ATIVO = "ATIVO"
    ESGOTADO = "ESGOTADO"


class StatusReserva(str, enum.Enum):
    SOLICITADO = "SOLICITADO"
    EM_CONTATO = "EM_CONTATO"
    BLOQUEADO = "BLOQUEADO"
    CONFIRMADO = "CONFIRMADO"
    CANCELADO = "CANCELADO"


class SubstatusReserva(str, enum.Enum):
    AGUARDANDO_CONTATO = "AGUARDANDO_CONTATO"
    EM_ATENDIMENTO = "EM_ATENDIMENTO"
    AGUARDANDO_PIX = "AGUARDANDO_PIX"

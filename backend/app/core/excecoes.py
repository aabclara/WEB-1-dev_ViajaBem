class DominioException(Exception):
    """Classe base para exceções de domínio."""
    def __init__(self, mensagem: str):
        self.mensagem = mensagem
        super().__init__(self.mensagem)

class ViagemNaoEncontradaException(DominioException):
    def __init__(self, mensagem="Viagem não encontrada"):
        super().__init__(mensagem)

class ViagemEsgotadaException(DominioException):
    def __init__(self, mensagem="Viagem esgotada"):
        super().__init__(mensagem)

class ReservaNaoEncontradaException(DominioException):
    def __init__(self, mensagem="Reserva não encontrada"):
        super().__init__(mensagem)

class AcessoNegadoException(DominioException):
    def __init__(self, mensagem="Acesso negado"):
        super().__init__(mensagem)

class ValorAcordadoNaoDefinidoException(DominioException):
    def __init__(self, mensagem="Valor acordado ainda não definido"):
        super().__init__(mensagem)

class PassageiroNaoEncontradoException(DominioException):
    def __init__(self, mensagem="Passageiro não encontrado"):
        super().__init__(mensagem)

class EdicaoBloqueadaException(DominioException):
    def __init__(self, mensagem="Edição bloqueada"):
        super().__init__(mensagem)

class CancelamentoBloqueadoException(DominioException):
    def __init__(self, mensagem="Cancelamento não permitido: viagem em menos de 7 dias"):
        super().__init__(mensagem)

class VagasInsuficientesException(DominioException):
    def __init__(self, mensagem="Vagas insuficientes para bloqueio", candidatos=[]):
        super().__init__(mensagem)
        self.candidatos = candidatos

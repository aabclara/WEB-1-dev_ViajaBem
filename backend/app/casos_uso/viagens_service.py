from app.dominio.entidades import Viagem
from app.repositorios.viagem_repositorio import ViagemRepositorio
from app.core.configuracao import configuracoes

class ViagensService:
    def __init__(self, repositorio: ViagemRepositorio):
        self.repositorio = repositorio

    async def calcular_vagas_disponiveis(self, viagem: Viagem) -> tuple[int, bool]:
        if not viagem.id: # Prevenção de erro para entidades não persistidas
            return viagem.vagas_totais, False
            
        ocupadas = await self.repositorio.calcular_vagas_ocupadas(viagem.id)
        disponiveis = viagem.vagas_totais - ocupadas
        ultimas = disponiveis < configuracoes.LIMIAR_ULTIMAS_VAGAS and disponiveis > 0
        return disponiveis, ultimas


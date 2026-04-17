from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.infra.modelos import Viagem, ReservaGrupo, StatusReserva
from app.core.configuracao import configuracoes

class ViagensService:
    def __init__(self, sessao: AsyncSession):
        self.sessao = sessao

    async def calcular_vagas_disponiveis(self, viagem: Viagem) -> tuple[int, bool]:
        resultado = await self.sessao.execute(
            select(func.coalesce(func.sum(ReservaGrupo.qtd_vagas), 0)).where(
                ReservaGrupo.id_viagem == viagem.id,
                ReservaGrupo.status.in_([StatusReserva.BLOQUEADO, StatusReserva.CONFIRMADO]),
            )
        )
        ocupadas = int(resultado.scalar())
        disponiveis = viagem.vagas_totais - ocupadas
        ultimas = disponiveis < configuracoes.LIMIAR_ULTIMAS_VAGAS and disponiveis > 0
        return disponiveis, ultimas

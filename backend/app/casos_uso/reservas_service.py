from datetime import date, timedelta
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.tempo import obter_agora
from app.core.configuracao import configuracoes
from app.infra.modelos import ReservaGrupo, Passageiro

class ReservasService:
    def __init__(self, sessao: AsyncSession):
        self.sessao = sessao

    def dentro_da_trava_seguro(self, data_partida: date) -> bool:
        """Retorna True se estamos dentro da trava de 7 dias antes da partida."""
        hoje = obter_agora().date()
        return hoje >= (data_partida - timedelta(days=configuracoes.DIAS_TRAVA_SEGURO))

    async def criar_slots_passageiros(self, reserva: ReservaGrupo, nome_lider: str) -> List[Passageiro]:
        """Cria os slots vazios de passageiros para a reserva recém-criada."""
        passageiros = []
        for i in range(reserva.qtd_vagas):
            eh_lider = i == 0
            passageiro = Passageiro(
                id_reserva=reserva.id,
                nome=nome_lider if eh_lider else None,
                documento=None,
                eh_lider=eh_lider,
            )
            self.sessao.add(passageiro)
            passageiros.append(passageiro)
        
        await self.sessao.flush()
        return passageiros

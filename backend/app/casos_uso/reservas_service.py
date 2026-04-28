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

    async def criar_reserva(self, id_viagem: int, id_lider: int, qtd_vagas: int, nome_lider: str) -> ReservaGrupo:
        from app.repositorios.reserva_repositorio import ViagemRepositorio, ReservaRepositorio
        from app.infra.mapeadores import MapeadorViagem
        from app.core.excecoes import ViagemNaoEncontradaException, ViagemEsgotadaException
        from app.infra.modelos import StatusReserva, SubstatusReserva

        viagem_repo = ViagemRepositorio(self.sessao)
        viagem_model = await viagem_repo.buscar_por_id(id_viagem)
        if not viagem_model:
            raise ViagemNaoEncontradaException()

        # Usando dominio para validacao
        dominio_viagem = MapeadorViagem.para_dominio(viagem_model)
        try:
            dominio_viagem.validar_disponibilidade(qtd_vagas)
        except ValueError as e:
            if "esgotada" in str(e).lower():
                raise ViagemEsgotadaException()
            raise ValueError(str(e)) # Mapear para http exception no controller

        reserva = ReservaGrupo(
            id_viagem=id_viagem,
            id_lider=id_lider,
            qtd_vagas=qtd_vagas,
            status=StatusReserva.SOLICITADO,
            substatus=SubstatusReserva.AGUARDANDO_CONTATO,
        )
        self.sessao.add(reserva)
        await self.sessao.flush()

        await self.criar_slots_passageiros(reserva, nome_lider)
        await self.sessao.commit()
        await self.sessao.refresh(reserva)
        
        # Reloading to get relations
        repo = ReservaRepositorio(self.sessao)
        return await repo.buscar_por_id(reserva.id)

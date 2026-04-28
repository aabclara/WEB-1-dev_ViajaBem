from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.infra.modelos import ReservaGrupo as ReservaModel, Viagem as ViagemModel
from app.dominio.entidades import ReservaGrupo
from app.infra.mapeadores import MapeadorReserva

class ReservaRepositorio:
    def __init__(self, sessao: AsyncSession):
        self.sessao = sessao

    async def listar_por_lider(self, id_lider: int) -> list[ReservaGrupo]:
        resultado = await self.sessao.execute(
            select(ReservaModel)
            .options(selectinload(ReservaModel.viagem))
            .where(ReservaModel.id_lider == id_lider)
            .order_by(ReservaModel.criado_em.desc())
        )
        modelos = resultado.scalars().all()
        entidades = []
        for m in modelos:
            entidade = MapeadorReserva.para_dominio(m)
            # Acoplando dados da viagem para o schema carregar
            if m.viagem:
                entidade.titulo_viagem = m.viagem.titulo
                entidade.data_partida_viagem = m.viagem.data_partida
            entidades.append(entidade)
        return entidades

    async def buscar_por_id(self, id_reserva: int) -> ReservaModel | None:
        resultado = await self.sessao.execute(
            select(ReservaModel)
            .options(
                selectinload(ReservaModel.passageiros),
                selectinload(ReservaModel.viagem),
                selectinload(ReservaModel.lider)
            )
            .where(ReservaModel.id == id_reserva)
        )
        return resultado.scalar_one_or_none()

    async def salvar(self, reserva: ReservaModel) -> ReservaModel:
        self.sessao.add(reserva)
        await self.sessao.flush()
        return reserva

class ViagemRepositorio:
    def __init__(self, sessao: AsyncSession):
        self.sessao = sessao

    async def buscar_por_id(self, id_viagem: int) -> ViagemModel | None:
        resultado = await self.sessao.execute(select(ViagemModel).where(ViagemModel.id == id_viagem))
        return resultado.scalar_one_or_none()

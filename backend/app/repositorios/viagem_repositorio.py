from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.infra.modelos import Viagem as ViagemModel, ReservaGrupo as ReservaModel, StatusReserva as StatusInfra
from app.dominio.entidades import Viagem
from app.infra.mapeadores import MapeadorViagem

class ViagemRepositorio:
    def __init__(self, sessao: AsyncSession):
        self.sessao = sessao

    async def buscar_por_id(self, id_viagem: int) -> Viagem | None:
        resultado = await self.sessao.execute(
            select(ViagemModel).where(ViagemModel.id == id_viagem)
        )
        modelo = resultado.scalar_one_or_none()
        return MapeadorViagem.para_dominio(modelo) if modelo else None

    async def calcular_vagas_ocupadas(self, id_viagem: int) -> int:
        resultado = await self.sessao.execute(
            select(func.coalesce(func.sum(ReservaModel.qtd_vagas), 0)).where(
                ReservaModel.id_viagem == id_viagem,
                ReservaModel.status.in_([StatusInfra.BLOQUEADO, StatusInfra.CONFIRMADO]),
            )
        )
        return int(resultado.scalar())

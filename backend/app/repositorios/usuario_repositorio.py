from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.infra.modelos import Usuario

class UsuarioRepositorio:
    def __init__(self, sessao: AsyncSession):
        self.sessao = sessao

    async def obter_por_id(self, id_usuario: int) -> Usuario | None:
        resultado = await self.sessao.execute(
            select(Usuario).where(Usuario.id == id_usuario)
        )
        return resultado.scalar_one_or_none()

    async def obter_por_email(self, email: str) -> Usuario | None:
        resultado = await self.sessao.execute(
            select(Usuario).where(Usuario.email == email)
        )
        return resultado.scalar_one_or_none()

    async def atualizar(self, usuario: Usuario) -> Usuario:
        await self.sessao.commit()
        await self.sessao.refresh(usuario)
        return usuario

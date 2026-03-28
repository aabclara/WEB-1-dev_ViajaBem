from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.configuracao import configuracoes

motor = create_async_engine(configuracoes.DATABASE_URL, echo=False)
FabricaSessao = async_sessionmaker(motor, expire_on_commit=False)


async def obter_sessao() -> AsyncSession:
    async with FabricaSessao() as sessao:
        yield sessao

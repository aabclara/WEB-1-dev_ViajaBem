import asyncio
from sqlalchemy import select
from app.core.configuracao import configuracoes
if configuracoes.DATABASE_URL.startswith("postgresql://"):
    configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
if "sslmode=" in configuracoes.DATABASE_URL:
    configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace("sslmode=", "ssl=")

from app.core.banco import FabricaSessao
from app.infra.modelos import Viagem

async def main():
    async with FabricaSessao() as sessao:
        resultado = await sessao.execute(select(Viagem))
        viagens = resultado.scalars().all()
        print(f"Total de viagens: {len(viagens)}")
        for v in viagens:
            print(f"ID: {v.id} | Titulo: {v.titulo} | Status: {v.status} | Partida: {v.data_partida} | Retorno: {v.data_retorno}")

if __name__ == "__main__":
    asyncio.run(main())

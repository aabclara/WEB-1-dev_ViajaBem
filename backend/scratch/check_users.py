import asyncio
from sqlalchemy import select
from app.core.configuracao import configuracoes
if configuracoes.DATABASE_URL.startswith("postgresql://"):
    configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
if "sslmode=" in configuracoes.DATABASE_URL:
    configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace("sslmode=", "ssl=")

from app.core.banco import FabricaSessao
from app.infra.modelos import Passageiro

async def main():
    async with FabricaSessao() as sessao:
        resultado = await sessao.execute(select(Passageiro))
        passageiros = resultado.scalars().all()
        print(f"Total de passageiros: {len(passageiros)}")
        for p in passageiros:
            print(f"ID: {p.id} | Reserva ID: {p.id_reserva} | Nome: {p.nome} | Documento: {p.documento} | Lider: {p.eh_lider}")

if __name__ == "__main__":
    asyncio.run(main())

import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text


async def main():
    from app.core.configuracao import configuracoes
    if configuracoes.DATABASE_URL.startswith("postgresql://"):
        configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    if "sslmode=" in configuracoes.DATABASE_URL:
        configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace("sslmode=", "ssl=")
    engine = create_async_engine(configuracoes.DATABASE_URL)
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TYPE status_viagem ADD VALUE 'FINALIZADO'"))
            print("FINALIZADO OK")
        except Exception as e:
            print("FINALIZADO:", e)
        try:
            await conn.execute(text("ALTER TYPE status_viagem ADD VALUE 'CANCELADO'"))
            print("CANCELADO OK")
        except Exception as e:
            print("CANCELADO:", e)


if __name__ == "__main__":
    asyncio.run(main())

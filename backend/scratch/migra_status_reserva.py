import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.configuracao import configuracoes


async def main():
    if configuracoes.DATABASE_URL.startswith("postgresql://"):
        configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace(
            "postgresql://", "postgresql+asyncpg://", 1
        )
    if "sslmode=" in configuracoes.DATABASE_URL:
        configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace(
            "sslmode=", "ssl="
        )
    engine = create_async_engine(configuracoes.DATABASE_URL)
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TYPE status_reserva ADD VALUE 'EM_CONTATO'"))
            print("EM_CONTATO OK")
        except Exception as e:
            print("EM_CONTATO:", e)


if __name__ == "__main__":
    asyncio.run(main())

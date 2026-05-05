import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def main():
    engine = create_async_engine('postgresql+asyncpg://viajebem:viajebem_senha@viajebem_db:5432/viajebem_db')
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

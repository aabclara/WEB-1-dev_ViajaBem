import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def main():
    engine = create_async_engine('postgresql+asyncpg://viajebem:viajebem_senha@viajebem_db:5432/viajebem_db')
    async with engine.begin() as conn:
        res = await conn.execute(text("SELECT id, titulo, data_retorno, status FROM viagem"))
        for row in res:
            print(f"ID: {row[0]}, Titulo: {row[1]}, Retorno: {row[2]}, Status: {row[3]}")

if __name__ == "__main__":
    asyncio.run(main())

import asyncio
from app.core.configuracao import configuracoes

if configuracoes.DATABASE_URL.startswith("postgresql://"):
    configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace(
        "postgresql://", "postgresql+asyncpg://", 1
    )
if "sslmode=" in configuracoes.DATABASE_URL:
    configuracoes.DATABASE_URL = configuracoes.DATABASE_URL.replace("sslmode=", "ssl=")

from app.core.seguranca import criar_token_acesso
from app.core.banco import FabricaSessao
from app.infra.modelos import Usuario
from sqlalchemy import select


async def main():
    async with FabricaSessao() as sessao:
        res = await sessao.execute(select(Usuario))
        usuarios = res.scalars().all()
        for u in usuarios:
            token = criar_token_acesso(
                {"sub": str(u.id), "email": u.email, "tipo": u.tipo.value}
            )
            print(f"User: {u.email} ({u.tipo.value})")
            print(f"Token: {token}\n")


if __name__ == "__main__":
    asyncio.run(main())

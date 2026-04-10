import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from datetime import date

from app.main import app
from app.core.banco import obter_sessao
from app.infra.modelos import Base, Usuario, TipoUsuario, Viagem, StatusViagem
from app.core.seguranca import gerar_hash_senha

# Banco de testes em memória (SQLite async)
DATABASE_URL_TESTE = "sqlite+aiosqlite:///:memory:"
motor_teste = create_async_engine(DATABASE_URL_TESTE, echo=False)
FabricaSessaoTeste = async_sessionmaker(motor_teste, expire_on_commit=False)


@pytest_asyncio.fixture(scope="session", autouse=True)
async def criar_tabelas():
    async with motor_teste.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with motor_teste.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def sessao_teste():
    async with FabricaSessaoTeste() as sessao:
        yield sessao
        await sessao.rollback()


@pytest_asyncio.fixture
async def cliente(sessao_teste: AsyncSession):
    async def _obter_sessao_teste():
        yield sessao_teste

    app.dependency_overrides[obter_sessao] = _obter_sessao_teste
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


async def _criar_usuario(sessao, email="lider@test.com", tipo=TipoUsuario.LIDER, cpf="12345678901"):
    u = Usuario(
        email=email, senha_hash=gerar_hash_senha("Senha123!"),
        nome="Teste", cpf=cpf, telefone="11999999999",
        data_nascimento=date(1990, 5, 15), tipo=tipo,
    )
    sessao.add(u)
    await sessao.commit()
    await sessao.refresh(u)
    return u


async def _token(cliente, email, senha="Senha123!"):
    r = await cliente.post("/auth/login", data={"username": email, "password": senha})
    return r.json()["access_token"]

import os
import time
from contextlib import asynccontextmanager
from datetime import date

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from app.core.banco import FabricaSessao
from app.core.configuracao import configuracoes
from app.core.seguranca import gerar_hash_senha
from app.infra.modelos import Usuario, TipoUsuario
from app.api.rotas.autenticacao import roteador_auth
from app.api.rotas.viagens import roteador_viagens
from app.api.rotas.reservas import roteador_reservas
from app.api.rotas.passageiros import roteador_passageiros
from app.api.rotas.admin import roteador_admin

from app.core.excecoes import (
    DominioException, ViagemNaoEncontradaException, ViagemEsgotadaException,
    ReservaNaoEncontradaException, AcessoNegadoException, ValorAcordadoNaoDefinidoException,
    PassageiroNaoEncontradoException, EdicaoBloqueadaException, 
    CancelamentoBloqueadoException, VagasInsuficientesException
)



async def _criar_admin_seed():
    async with FabricaSessao() as sessao:
        resultado = await sessao.execute(
            select(Usuario).where(Usuario.tipo == TipoUsuario.ADMIN)
        )
        if resultado.scalar_one_or_none() is None:
            admin = Usuario(
                email=configuracoes.ADMIN_EMAIL,
                senha_hash=gerar_hash_senha(configuracoes.ADMIN_SENHA),
                nome=configuracoes.ADMIN_NOME,
                cpf="00000000000",
                telefone="00000000000",
                data_nascimento=date(1990, 1, 1),
                tipo=TipoUsuario.ADMIN,
            )
            sessao.add(admin)
            await sessao.commit()


@asynccontextmanager
async def ciclo_de_vida(app: FastAPI):
    # Configuração de Fuso Horário (Unix/Docker)
    os.environ["TZ"] = configuracoes.TIMEZONE
    if hasattr(time, "tzset"):
        time.tzset()
    
    await _criar_admin_seed()
    yield


app = FastAPI(
    title="Viaje Bem API",
    description="Plataforma de gestão de combos de viagens",
    version="1.0.0",
    lifespan=ciclo_de_vida,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roteador_auth)
app.include_router(roteador_viagens)
app.include_router(roteador_reservas)
app.include_router(roteador_passageiros)
app.include_router(roteador_admin)

@app.exception_handler(DominioException)
async def dominio_exception_handler(request: Request, exc: DominioException):
    status_map = {
        ViagemNaoEncontradaException: 404,
        ViagemEsgotadaException: 409,
        ReservaNaoEncontradaException: 404,
        AcessoNegadoException: 403,
        ValorAcordadoNaoDefinidoException: 422,
        PassageiroNaoEncontradoException: 404,
        EdicaoBloqueadaException: 422,
        CancelamentoBloqueadoException: 422,
        VagasInsuficientesException: 409,
    }
    status_code = status_map.get(type(exc), 400)
    content = {"detail": exc.mensagem}
    if isinstance(exc, VagasInsuficientesException):
        content = {
            "detail": {
                "mensagem": exc.mensagem,
                "candidatos_cancelamento": exc.candidatos
            }
        }
    
    return JSONResponse(
        status_code=status_code,
        content=content,
    )



@app.get("/", tags=["Saúde"])
async def raiz():
    return {"status": "ok", "sistema": "Viaje Bem API"}

from datetime import date, datetime, timezone, timedelta
from app.core.tempo import obter_agora
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.core.banco import obter_sessao
from app.core.seguranca import requerer_lider, requerer_admin, obter_usuario_atual
from app.core.configuracao import configuracoes
from app.infra.modelos import (
    Viagem, ReservaGrupo, Passageiro, Usuario,
    StatusViagem, StatusReserva, SubstatusReserva,
)
from app.schemas.viagem_schemas import (
    CriarReservaSchema, ReservaSchema, ResumoFinanceiroSchema,
    AcompanhanteSchema, PassageiroSchema,
)

from app.core.excecoes import (
    ViagemNaoEncontradaException, ViagemEsgotadaException, ReservaNaoEncontradaException,
    AcessoNegadoException, ValorAcordadoNaoDefinidoException
)
from app.casos_uso.reservas_service import ReservasService

from app.repositorios.reserva_repositorio import ReservaRepositorio

roteador_reservas = APIRouter(prefix="/reservas", tags=["Reservas"])

@roteador_reservas.get("/", response_model=list[ReservaSchema])
async def listar_minhas_reservas(
    usuario: Usuario = Depends(obter_usuario_atual),
    sessao: AsyncSession = Depends(obter_sessao),
):
    repo = ReservaRepositorio(sessao)
    reservas = await repo.listar_por_lider(usuario.id)
    print(f"DEBUG: Encontradas {len(reservas)} reservas para o usuário {usuario.id}")
    return reservas

@roteador_reservas.post("/", response_model=ReservaSchema, status_code=status.HTTP_201_CREATED)
async def criar_reserva(
    dados: CriarReservaSchema,
    usuario: Usuario = Depends(requerer_lider),
    sessao: AsyncSession = Depends(obter_sessao),
):
    try:
        servico_reservas = ReservasService(sessao)
        reserva_model = await servico_reservas.criar_reserva(
            id_viagem=dados.id_viagem,
            id_lider=usuario.id,
            qtd_vagas=dados.qtd_vagas,
            nome_lider=usuario.nome
        )
        return reserva_model
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@roteador_reservas.get("/{id_reserva}", response_model=ReservaSchema)
async def obter_reserva(
    id_reserva: int,
    usuario: Usuario = Depends(obter_usuario_atual),
    sessao: AsyncSession = Depends(obter_sessao),
):
    repo = ReservaRepositorio(sessao)
    reserva_model = await repo.buscar_por_id(id_reserva)
    
    if not reserva_model:
        raise ReservaNaoEncontradaException()
    if usuario.tipo != "ADMIN" and reserva_model.id_lider != usuario.id:
        raise AcessoNegadoException()

    from app.infra.mapeadores import MapeadorReserva, MapeadorPassageiro
    dominio_reserva = MapeadorReserva.para_dominio(reserva_model)
    
    if reserva_model.lider:
        dominio_reserva.nome_lider = reserva_model.lider.nome
    if reserva_model.viagem:
        dominio_reserva.titulo_viagem = reserva_model.viagem.titulo
        dominio_reserva.data_partida_viagem = reserva_model.viagem.data_partida
    if reserva_model.passageiros:
        dominio_reserva.passageiros = [MapeadorPassageiro.para_dominio(p) for p in reserva_model.passageiros]

    return dominio_reserva


@roteador_reservas.get("/{id_reserva}/resumo", response_model=ResumoFinanceiroSchema)
async def resumo_financeiro(
    id_reserva: int,
    usuario: Usuario = Depends(obter_usuario_atual),
    sessao: AsyncSession = Depends(obter_sessao),
):
    repo = ReservaRepositorio(sessao)
    reserva_model = await repo.buscar_por_id(id_reserva)
    
    if not reserva_model:
        raise ReservaNaoEncontradaException()
    if usuario.tipo != "ADMIN" and reserva_model.id_lider != usuario.id:
        raise AcessoNegadoException()

    from app.infra.mapeadores import MapeadorReserva
    dominio_reserva = MapeadorReserva.para_dominio(reserva_model)
    try:
        resumo = dominio_reserva.calcular_resumo_financeiro()
        return ResumoFinanceiroSchema(**resumo)
    except ValueError as e:
        raise ValorAcordadoNaoDefinidoException()


@roteador_reservas.get("/{id_reserva}/link-acompanhante", response_model=AcompanhanteSchema)
async def link_acompanhante(
    id_reserva: int,
    sessao: AsyncSession = Depends(obter_sessao),
):
    repo = ReservaRepositorio(sessao)
    reserva_model = await repo.buscar_por_id(id_reserva)
    
    if not reserva_model:
        raise ReservaNaoEncontradaException()

    from app.infra.mapeadores import MapeadorReserva
    dominio_reserva = MapeadorReserva.para_dominio(reserva_model)
    por_pessoa = dominio_reserva.calcular_valor_por_pessoa()

    return AcompanhanteSchema(
        titulo_viagem=reserva_model.viagem.titulo if reserva_model.viagem else "",
        data_partida=reserva_model.viagem.data_partida if reserva_model.viagem else None,
        valor_por_pessoa=por_pessoa,
    )


@roteador_reservas.get("/{id_reserva}/passageiros", response_model=list[PassageiroSchema])
async def listar_passageiros(
    id_reserva: int,
    usuario: Usuario = Depends(obter_usuario_atual),
    sessao: AsyncSession = Depends(obter_sessao),
):
    repo = ReservaRepositorio(sessao)
    reserva_model = await repo.buscar_por_id(id_reserva)
    
    if not reserva_model:
        raise ReservaNaoEncontradaException()
    if usuario.tipo != "ADMIN" and reserva_model.id_lider != usuario.id:
        raise AcessoNegadoException()

    return reserva_model.passageiros

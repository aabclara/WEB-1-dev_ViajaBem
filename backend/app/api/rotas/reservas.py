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

roteador_reservas = APIRouter(prefix="/reservas", tags=["Reservas"])





@roteador_reservas.post("/", response_model=ReservaSchema, status_code=status.HTTP_201_CREATED)
async def criar_reserva(
    dados: CriarReservaSchema,
    usuario: Usuario = Depends(requerer_lider),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res_viagem = await sessao.execute(select(Viagem).where(Viagem.id == dados.id_viagem))
    viagem = res_viagem.scalar_one_or_none()
    if not viagem:
        raise ViagemNaoEncontradaException()
    if viagem.status == StatusViagem.ESGOTADO:
        raise ViagemEsgotadaException()

    reserva = ReservaGrupo(
        id_viagem=dados.id_viagem,
        id_lider=usuario.id,
        qtd_vagas=dados.qtd_vagas,
        status=StatusReserva.SOLICITADO,
        substatus=SubstatusReserva.AGUARDANDO_CONTATO,
    )
    sessao.add(reserva)
    await sessao.flush()  # Obter id da reserva

    # Criar slots de passageiros automaticamente
    servico_reservas = ReservasService(sessao)
    await servico_reservas.criar_slots_passageiros(reserva, usuario.nome)

    await sessao.commit()
    await sessao.refresh(reserva)

    res = await sessao.execute(
        select(ReservaGrupo).options(selectinload(ReservaGrupo.passageiros)).where(ReservaGrupo.id == reserva.id)
    )
    return res.scalar_one()


@roteador_reservas.get("/{id_reserva}", response_model=ReservaSchema)
async def obter_reserva(
    id_reserva: int,
    usuario: Usuario = Depends(obter_usuario_atual),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res = await sessao.execute(
        select(ReservaGrupo).options(selectinload(ReservaGrupo.passageiros)).where(ReservaGrupo.id == id_reserva)
    )
    reserva = res.scalar_one_or_none()
    if not reserva:
        raise ReservaNaoEncontradaException()
    if usuario.tipo != "ADMIN" and reserva.id_lider != usuario.id:
        raise AcessoNegadoException()
    return reserva


@roteador_reservas.get("/{id_reserva}/resumo", response_model=ResumoFinanceiroSchema)
async def resumo_financeiro(
    id_reserva: int,
    usuario: Usuario = Depends(obter_usuario_atual),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res = await sessao.execute(select(ReservaGrupo).where(ReservaGrupo.id == id_reserva))
    reserva = res.scalar_one_or_none()
    if not reserva:
        raise ReservaNaoEncontradaException()
    if usuario.tipo != "ADMIN" and reserva.id_lider != usuario.id:
        raise AcessoNegadoException()
    if not reserva.valor_acordado:
        raise ValorAcordadoNaoDefinidoException()

    valor = Decimal(str(reserva.valor_acordado))
    sinal = round(valor * Decimal("0.5"), 2)
    restante = valor - sinal
    por_pessoa = round(valor / Decimal(str(reserva.qtd_vagas)), 2)
    return ResumoFinanceiroSchema(valor_acordado=valor, sinal=sinal, restante=restante, valor_por_pessoa=por_pessoa)


@roteador_reservas.get("/{id_reserva}/link-acompanhante", response_model=AcompanhanteSchema)
async def link_acompanhante(
    id_reserva: int,
    sessao: AsyncSession = Depends(obter_sessao),
):
    res = await sessao.execute(
        select(ReservaGrupo).options(selectinload(ReservaGrupo.viagem)).where(ReservaGrupo.id == id_reserva)
    )
    reserva = res.scalar_one_or_none()
    if not reserva:
        raise ReservaNaoEncontradaException()

    por_pessoa = None
    if reserva.valor_acordado:
        por_pessoa = round(Decimal(str(reserva.valor_acordado)) / Decimal(str(reserva.qtd_vagas)), 2)

    return AcompanhanteSchema(
        titulo_viagem=reserva.viagem.titulo,
        data_partida=reserva.viagem.data_partida,
        valor_por_pessoa=por_pessoa,
    )


@roteador_reservas.get("/{id_reserva}/passageiros", response_model=list[PassageiroSchema])
async def listar_passageiros(
    id_reserva: int,
    usuario: Usuario = Depends(obter_usuario_atual),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res_r = await sessao.execute(select(ReservaGrupo).where(ReservaGrupo.id == id_reserva))
    reserva = res_r.scalar_one_or_none()
    if not reserva:
        raise ReservaNaoEncontradaException()
    if usuario.tipo != "ADMIN" and reserva.id_lider != usuario.id:
        raise AcessoNegadoException()

    res_p = await sessao.execute(select(Passageiro).where(Passageiro.id_reserva == id_reserva))
    return res_p.scalars().all()

from datetime import date, datetime, timezone
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

roteador_reservas = APIRouter(prefix="/reservas", tags=["Reservas"])


def _trava_seguro(data_partida: date) -> bool:
    """Retorna True se estamos dentro da trava de 7 dias."""
    hoje = date.today()
    return hoje >= (data_partida - __import__("datetime").timedelta(days=configuracoes.DIAS_TRAVA_SEGURO))


@roteador_reservas.post("/", response_model=ReservaSchema, status_code=status.HTTP_201_CREATED)
async def criar_reserva(
    dados: CriarReservaSchema,
    usuario: Usuario = Depends(requerer_lider),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res_viagem = await sessao.execute(select(Viagem).where(Viagem.id == dados.id_viagem))
    viagem = res_viagem.scalar_one_or_none()
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada")
    if viagem.status == StatusViagem.ESGOTADO:
        raise HTTPException(status_code=409, detail="Viagem esgotada")

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
    for i in range(dados.qtd_vagas):
        eh_lider = i == 0
        passageiro = Passageiro(
            id_reserva=reserva.id,
            nome=usuario.nome if eh_lider else None,
            documento=None,
            eh_lider=eh_lider,
        )
        sessao.add(passageiro)

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
        raise HTTPException(status_code=404, detail="Reserva não encontrada")
    if usuario.tipo != "ADMIN" and reserva.id_lider != usuario.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
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
        raise HTTPException(status_code=404, detail="Reserva não encontrada")
    if usuario.tipo != "ADMIN" and reserva.id_lider != usuario.id:
        raise HTTPException(status_code=403, detail="Acesso negado")
    if not reserva.valor_acordado:
        raise HTTPException(status_code=422, detail="Valor acordado ainda não definido")

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
        raise HTTPException(status_code=404, detail="Reserva não encontrada")

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
        raise HTTPException(status_code=404, detail="Reserva não encontrada")
    if usuario.tipo != "ADMIN" and reserva.id_lider != usuario.id:
        raise HTTPException(status_code=403, detail="Acesso negado")

    res_p = await sessao.execute(select(Passageiro).where(Passageiro.id_reserva == id_reserva))
    return res_p.scalars().all()

import csv
import io
import datetime as dt
from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.core.banco import obter_sessao
from app.core.seguranca import requerer_admin
from app.core.configuracao import configuracoes
from app.infra.modelos import (
    Viagem, ReservaGrupo, Passageiro, Usuario,
    StatusViagem, StatusReserva, SubstatusReserva,
)
from app.schemas.viagem_schemas import (
    ViagemPublicaSchema, CriarViagemSchema, AtualizarViagemSchema,
    ReservaSchema, AtualizarReservaAdminSchema, KanbanViagemSchema,
    ResumoWhatsappSchema, PassageiroSchema,
)

roteador_admin = APIRouter(prefix="/admin", tags=["Admin"])


# ─── Helpers ─────────────────────────────────────────────────────────────────

async def _vagas_disponiveis(id_viagem: int, sessao: AsyncSession) -> int:
    res_viagem = await sessao.execute(select(Viagem).where(Viagem.id == id_viagem))
    viagem = res_viagem.scalar_one()
    res = await sessao.execute(
        select(func.coalesce(func.sum(ReservaGrupo.qtd_vagas), 0)).where(
            ReservaGrupo.id_viagem == id_viagem,
            ReservaGrupo.status.in_([StatusReserva.BLOQUEADO, StatusReserva.CONFIRMADO]),
        )
    )
    ocupadas = int(res.scalar())
    return viagem.vagas_totais - ocupadas


def _dentro_da_trava(data_partida: date) -> bool:
    return date.today() >= (data_partida - dt.timedelta(days=configuracoes.DIAS_TRAVA_SEGURO))


# ─── Viagens (Admin) ─────────────────────────────────────────────────────────

@roteador_admin.get("/viagens/", tags=["Admin — Viagens"])
async def listar_viagens_admin(
    busca: str | None = Query(None),
    admin: Usuario = Depends(requerer_admin),
    sessao: AsyncSession = Depends(obter_sessao),
):
    query = select(Viagem)
    if busca:
        query = query.where(Viagem.titulo.ilike(f"%{busca}%"))
    resultado = await sessao.execute(query.order_by(Viagem.data_partida))
    viagens = resultado.scalars().all()

    resposta = []
    for v in viagens:
        contagens = {}
        for s in StatusReserva:
            res = await sessao.execute(
                select(func.count()).where(ReservaGrupo.id_viagem == v.id, ReservaGrupo.status == s)
            )
            contagens[s.value] = int(res.scalar())
        resposta.append({"id": v.id, "titulo": v.titulo, "data_partida": v.data_partida,
                         "status": v.status, "vagas_totais": v.vagas_totais, "reservas_por_status": contagens})
    return resposta


@roteador_admin.post("/viagens/", status_code=status.HTTP_201_CREATED, tags=["Admin — Viagens"])
async def criar_viagem(
    dados: CriarViagemSchema,
    admin: Usuario = Depends(requerer_admin),
    sessao: AsyncSession = Depends(obter_sessao),
):
    viagem = Viagem(
        titulo=dados.titulo,
        descricao_precos=dados.descricao_precos,
        data_partida=dados.data_partida,
        vagas_totais=dados.vagas_totais,
        status=StatusViagem.ATIVO,
    )
    sessao.add(viagem)
    await sessao.commit()
    await sessao.refresh(viagem)
    return {"id": viagem.id, "titulo": viagem.titulo, "status": viagem.status}


@roteador_admin.patch("/viagens/{id_viagem}", tags=["Admin — Viagens"])
async def editar_viagem(
    id_viagem: int,
    dados: AtualizarViagemSchema,
    admin: Usuario = Depends(requerer_admin),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res = await sessao.execute(select(Viagem).where(Viagem.id == id_viagem))
    viagem = res.scalar_one_or_none()
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada")
    for campo, valor in dados.model_dump(exclude_none=True).items():
        setattr(viagem, campo, valor)
    await sessao.commit()
    await sessao.refresh(viagem)
    return viagem


# ─── Kanban ──────────────────────────────────────────────────────────────────

@roteador_admin.get("/viagens/{id_viagem}/reservas", response_model=KanbanViagemSchema, tags=["Admin — Kanban"])
async def kanban_reservas(
    id_viagem: int,
    admin: Usuario = Depends(requerer_admin),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res_v = await sessao.execute(select(Viagem).where(Viagem.id == id_viagem))
    viagem = res_v.scalar_one_or_none()
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada")

    res_r = await sessao.execute(
        select(ReservaGrupo)
        .options(selectinload(ReservaGrupo.passageiros))
        .where(ReservaGrupo.id_viagem == id_viagem)
    )
    reservas = res_r.scalars().all()

    colunas: dict[str, list] = {s.value: [] for s in StatusReserva}
    for r in reservas:
        colunas[r.status.value].append(r)

    return KanbanViagemSchema(id_viagem=viagem.id, titulo=viagem.titulo, colunas=colunas)


# ─── Reservas (Admin) ────────────────────────────────────────────────────────

@roteador_admin.patch("/reservas/{id_reserva}", response_model=ReservaSchema, tags=["Admin — Reservas"])
async def atualizar_reserva_admin(
    id_reserva: int,
    dados: AtualizarReservaAdminSchema,
    admin: Usuario = Depends(requerer_admin),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res = await sessao.execute(
        select(ReservaGrupo)
        .options(selectinload(ReservaGrupo.passageiros), selectinload(ReservaGrupo.viagem))
        .where(ReservaGrupo.id == id_reserva)
        .with_for_update()
    )
    reserva = res.scalar_one_or_none()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")

    viagem = reserva.viagem

    # Trava de seguro para CANCELADO
    if dados.status == StatusReserva.CANCELADO and _dentro_da_trava(viagem.data_partida):
        raise HTTPException(
            status_code=422,
            detail="Cancelamento não permitido: viagem em menos de 7 dias",
        )

    # Trava de concorrência para BLOQUEADO
    if dados.status == StatusReserva.BLOQUEADO:
        res_ocupadas = await sessao.execute(
            select(func.coalesce(func.sum(ReservaGrupo.qtd_vagas), 0)).where(
                ReservaGrupo.id_viagem == viagem.id,
                ReservaGrupo.status.in_([StatusReserva.BLOQUEADO, StatusReserva.CONFIRMADO]),
                ReservaGrupo.id != reserva.id,
            )
        )
        ocupadas = int(res_ocupadas.scalar())
        if ocupadas + reserva.qtd_vagas > viagem.vagas_totais:
            # Buscar candidatos a cancelamento
            res_candidatos = await sessao.execute(
                select(ReservaGrupo).where(
                    ReservaGrupo.id_viagem == viagem.id,
                    ReservaGrupo.status == StatusReserva.SOLICITADO,
                    ReservaGrupo.id != reserva.id,
                )
            )
            candidatos = [
                {"id": c.id, "qtd_vagas": c.qtd_vagas} for c in res_candidatos.scalars().all()
            ]
            raise HTTPException(
                status_code=409,
                detail={
                    "mensagem": "Vagas insuficientes para bloqueio",
                    "candidatos_cancelamento": candidatos,
                },
            )

    # Aplicar atualizações
    if dados.status is not None:
        reserva.status = dados.status
    if dados.substatus is not None:
        reserva.substatus = dados.substatus
    if dados.valor_acordado is not None:
        reserva.valor_acordado = dados.valor_acordado
    reserva.admin_responsavel_id = admin.id

    await sessao.commit()
    await sessao.refresh(reserva)
    return reserva


@roteador_admin.get("/reservas/{id_reserva}/resumo-whatsapp", response_model=ResumoWhatsappSchema, tags=["Admin — Reservas"])
async def resumo_whatsapp(
    id_reserva: int,
    admin: Usuario = Depends(requerer_admin),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res = await sessao.execute(
        select(ReservaGrupo).options(selectinload(ReservaGrupo.viagem)).where(ReservaGrupo.id == id_reserva)
    )
    reserva = res.scalar_one_or_none()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")
    if not reserva.valor_acordado:
        raise HTTPException(status_code=422, detail="Defina o valor acordado antes de gerar o resumo")

    valor = Decimal(str(reserva.valor_acordado))
    sinal = round(valor * Decimal("0.5"), 2)
    restante = valor - sinal
    por_pessoa = round(valor / Decimal(str(reserva.qtd_vagas)), 2)

    texto = (
        f"*Viaje Bem — Resumo da Reserva #{reserva.id}*\n"
        f"🗺 Viagem: {reserva.viagem.titulo}\n"
        f"📅 Partida: {reserva.viagem.data_partida.strftime('%d/%m/%Y')}\n"
        f"👥 Vagas: {reserva.qtd_vagas}\n"
        f"💰 Valor Total: R$ {valor:.2f}\n"
        f"✅ Sinal (50%%): R$ {sinal:.2f}\n"
        f"🔜 Restante: R$ {restante:.2f}\n"
        f"👤 Por Pessoa: R$ {por_pessoa:.2f}\n"
        f"🔑 Chave PIX: {configuracoes.CHAVE_PIX}"
    )
    return ResumoWhatsappSchema(texto=texto)


# ─── Exportação ANTT ─────────────────────────────────────────────────────────

@roteador_admin.get("/viagens/{id_viagem}/exportar-passageiros", tags=["Admin — Exportação"])
async def exportar_passageiros(
    id_viagem: int,
    formato: str = Query("json", pattern="^(json|csv)$"),
    admin: Usuario = Depends(requerer_admin),
    sessao: AsyncSession = Depends(obter_sessao),
):
    res_v = await sessao.execute(select(Viagem).where(Viagem.id == id_viagem))
    viagem = res_v.scalar_one_or_none()
    if not viagem:
        raise HTTPException(status_code=404, detail="Viagem não encontrada")

    res = await sessao.execute(
        select(Passageiro)
        .join(ReservaGrupo, Passageiro.id_reserva == ReservaGrupo.id)
        .where(
            ReservaGrupo.id_viagem == id_viagem,
            ReservaGrupo.status == StatusReserva.CONFIRMADO,
        )
    )
    passageiros = res.scalars().all()

    dados = [
        {
            "id": p.id,
            "nome": p.nome or "PENDENTE",
            "documento": p.documento or "PENDENTE",
            "eh_lider": p.eh_lider,
        }
        for p in passageiros
    ]

    if formato == "csv":
        saida = io.StringIO()
        escritor = csv.DictWriter(saida, fieldnames=["id", "nome", "documento", "eh_lider"])
        escritor.writeheader()
        escritor.writerows(dados)
        saida.seek(0)
        return StreamingResponse(
            io.BytesIO(saida.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=passageiros_viagem_{id_viagem}.csv"},
        )

    return dados

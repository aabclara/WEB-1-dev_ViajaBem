import pytest
from datetime import date, timedelta
from app.infra.modelos import TipoUsuario, StatusViagem, StatusReserva, SubstatusReserva

pytestmark = pytest.mark.asyncio


async def _setup_reserva(sessao, email_lider, cpf_lider, dias=30, qtd=3):
    from app.infra.modelos import Viagem, ReservaGrupo, Passageiro
    from passlib.context import CryptContext
    from app.infra.modelos import Usuario
    bcrypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

    lider = Usuario(
        email=email_lider, senha_hash=bcrypt.hash("Senha123!"),
        nome="Lider", cpf=cpf_lider, telefone="11999",
        data_nascimento=date(1990, 1, 1), tipo=TipoUsuario.LIDER,
    )
    sessao.add(lider)
    await sessao.flush()

    viagem = Viagem(
        titulo="Viagem Teste", data_partida=date.today() + timedelta(days=dias),
        vagas_totais=20, status=StatusViagem.ATIVO,
    )
    sessao.add(viagem)
    await sessao.flush()

    reserva = ReservaGrupo(
        id_viagem=viagem.id, id_lider=lider.id, qtd_vagas=qtd,
        status=StatusReserva.SOLICITADO, substatus=SubstatusReserva.AGUARDANDO_CONTATO,
    )
    sessao.add(reserva)
    await sessao.flush()

    for i in range(qtd):
        p = Passageiro(id_reserva=reserva.id, eh_lider=(i == 0))
        if i == 0:
            p.nome = lider.nome
        sessao.add(p)

    await sessao.commit()
    return lider, viagem, reserva


class TestPassageiros:
    async def test_acesso_restrito_por_reserva(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        lider1, viagem, reserva = await _setup_reserva(sessao_teste, "lider_p1@test.com", "11100011100")
        lider2 = await _criar_usuario(sessao_teste, email="lider_p2@test.com", cpf="22200022200")
        tk2 = await _token(cliente, "lider_p2@test.com")
        r = await cliente.get(
            f"/reservas/{reserva.id}/passageiros",
            headers={"Authorization": f"Bearer {tk2}"},
        )
        assert r.status_code == 403

    async def test_atualizar_passageiro_dentro_do_prazo(self, cliente, sessao_teste):
        from app.infra.modelos import Passageiro
        from sqlalchemy import select
        lider, viagem, reserva = await _setup_reserva(sessao_teste, "lider_upd@test.com", "33300033300", dias=30)
        res = await sessao_teste.execute(
            select(Passageiro).where(Passageiro.id_reserva == reserva.id, Passageiro.eh_lider.is_(False))
        )
        acompanhante = res.scalars().first()
        from tests.conftest import _token
        tk = await _token(cliente, "lider_upd@test.com")
        r = await cliente.patch(
            f"/passageiros/{acompanhante.id}",
            json={"nome": "Maria Silva", "documento": "12345678"},
            headers={"Authorization": f"Bearer {tk}"},
        )
        assert r.status_code == 200
        assert r.json()["nome"] == "Maria Silva"

    async def test_edicao_bloqueada_dentro_de_7_dias(self, cliente, sessao_teste):
        from app.infra.modelos import Passageiro
        from sqlalchemy import select
        lider, viagem, reserva = await _setup_reserva(sessao_teste, "lider_blq@test.com", "44400044400", dias=3)
        res = await sessao_teste.execute(
            select(Passageiro).where(Passageiro.id_reserva == reserva.id, Passageiro.eh_lider.is_(False))
        )
        acompanhante = res.scalars().first()
        from tests.conftest import _token
        tk = await _token(cliente, "lider_blq@test.com")
        r = await cliente.patch(
            f"/passageiros/{acompanhante.id}",
            json={"nome": "Bloqueado"},
            headers={"Authorization": f"Bearer {tk}"},
        )
        assert r.status_code == 422
        assert "7 dias" in r.json()["detail"]

    async def test_exportacao_pendente(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        admin = await _criar_usuario(sessao_teste, email="admin_exp@test.com", tipo=TipoUsuario.ADMIN, cpf="55500055500")
        lider, viagem, reserva = await _setup_reserva(sessao_teste, "lider_exp@test.com", "66600066600", dias=60)
        reserva.status = StatusReserva.CONFIRMADO
        await sessao_teste.commit()
        tk = await _token(cliente, "admin_exp@test.com")
        r = await cliente.get(
            f"/admin/viagens/{viagem.id}/exportar-passageiros",
            headers={"Authorization": f"Bearer {tk}"},
        )
        assert r.status_code == 200
        docs = [p["documento"] for p in r.json()]
        assert all(d == "PENDENTE" for d in docs)

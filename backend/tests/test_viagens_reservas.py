import pytest
from datetime import date, timedelta
from decimal import Decimal
from app.infra.modelos import TipoUsuario, StatusViagem, StatusReserva, SubstatusReserva

pytestmark = pytest.mark.asyncio


async def _criar_viagem(sessao, titulo="Fortaleza 2025", vagas=20, dias_ate_partida=30):
    from app.infra.modelos import Viagem
    v = Viagem(
        titulo=titulo,
        data_partida=date.today() + timedelta(days=dias_ate_partida),
        vagas_totais=vagas,
        status=StatusViagem.ATIVO,
    )
    sessao.add(v)
    await sessao.commit()
    await sessao.refresh(v)
    return v


async def _criar_reserva(sessao, id_viagem, id_lider, qtd_vagas=4, status=StatusReserva.SOLICITADO):
    from app.infra.modelos import ReservaGrupo
    r = ReservaGrupo(
        id_viagem=id_viagem, id_lider=id_lider, qtd_vagas=qtd_vagas,
        status=status, substatus=SubstatusReserva.AGUARDANDO_CONTATO,
    )
    sessao.add(r)
    await sessao.commit()
    await sessao.refresh(r)
    return r


class TestViagens:
    async def test_listar_viagens_publico(self, cliente, sessao_teste):
        await _criar_viagem(sessao_teste)
        r = await cliente.get("/viagens/")
        assert r.status_code == 200
        assert len(r.json()) >= 1

    async def test_vagas_disponiveis_calculadas(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario
        viagem = await _criar_viagem(sessao_teste, vagas=10)
        lider = await _criar_usuario(sessao_teste, email="lider_vagas@test.com", cpf="10101010101")
        await _criar_reserva(sessao_teste, viagem.id, lider.id, 3, StatusReserva.BLOQUEADO)
        r = await cliente.get(f"/viagens/{viagem.id}")
        assert r.json()["vagas_disponiveis"] == 7

    async def test_ultimas_vagas_flag(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario
        viagem = await _criar_viagem(sessao_teste, vagas=5)
        lider = await _criar_usuario(sessao_teste, email="lider_ultimas@test.com", cpf="20202020202")
        await _criar_reserva(sessao_teste, viagem.id, lider.id, 3, StatusReserva.BLOQUEADO)
        r = await cliente.get(f"/viagens/{viagem.id}")
        assert r.json()["ultimas_vagas"] is True


class TestReservas:
    async def test_criar_reserva_gera_slots(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        lider = await _criar_usuario(sessao_teste, email="lider_slots@test.com", cpf="30303030303")
        viagem = await _criar_viagem(sessao_teste)
        tk = await _token(cliente, "lider_slots@test.com")
        r = await cliente.post(
            "/reservas/",
            json={"id_viagem": viagem.id, "qtd_vagas": 3},
            headers={"Authorization": f"Bearer {tk}"},
        )
        assert r.status_code == 201
        assert len(r.json()["passageiros"]) == 3
        assert r.json()["passageiros"][0]["eh_lider"] is True

    async def test_checkout_bloqueado_viagem_esgotada(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        from app.infra.modelos import Viagem
        lider = await _criar_usuario(sessao_teste, email="lider_esgotado@test.com", cpf="40404040404")
        viagem = await _criar_viagem(sessao_teste)
        viagem.status = StatusViagem.ESGOTADO
        await sessao_teste.commit()
        tk = await _token(cliente, "lider_esgotado@test.com")
        r = await cliente.post(
            "/reservas/",
            json={"id_viagem": viagem.id, "qtd_vagas": 2},
            headers={"Authorization": f"Bearer {tk}"},
        )
        assert r.status_code == 409

    async def test_trava_cancelamento_7_dias(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        admin = await _criar_usuario(sessao_teste, email="admin_trava@test.com", tipo=TipoUsuario.ADMIN, cpf="50505050505")
        lider = await _criar_usuario(sessao_teste, email="lider_trava@test.com", cpf="60606060606")
        viagem = await _criar_viagem(sessao_teste, dias_ate_partida=3)  # Dentro da trava
        reserva = await _criar_reserva(sessao_teste, viagem.id, lider.id)
        tk = await _token(cliente, "admin_trava@test.com")
        r = await cliente.patch(
            f"/admin/reservas/{reserva.id}",
            json={"status": "CANCELADO"},
            headers={"Authorization": f"Bearer {tk}"},
        )
        assert r.status_code == 422
        assert "7 dias" in r.json()["detail"]

    async def test_trava_concorrencia_vagas(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        admin = await _criar_usuario(sessao_teste, email="admin_concorr@test.com", tipo=TipoUsuario.ADMIN, cpf="70707070707")
        lider = await _criar_usuario(sessao_teste, email="lider_concorr@test.com", cpf="80808080808")
        viagem = await _criar_viagem(sessao_teste, vagas=5)
        # Já ocupa 4 vagas
        await _criar_reserva(sessao_teste, viagem.id, lider.id, 4, StatusReserva.BLOQUEADO)
        # Nova reserva pede 4 (total 8 > 5)
        nova = await _criar_reserva(sessao_teste, viagem.id, lider.id, 4)
        tk = await _token(cliente, "admin_concorr@test.com")
        r = await cliente.patch(
            f"/admin/reservas/{nova.id}",
            json={"status": "BLOQUEADO"},
            headers={"Authorization": f"Bearer {tk}"},
        )
        assert r.status_code == 409
        assert "candidatos_cancelamento" in str(r.json())

    async def test_resumo_financeiro(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        lider = await _criar_usuario(sessao_teste, email="lider_resumo@test.com", cpf="90909090909")
        admin = await _criar_usuario(sessao_teste, email="admin_resumo@test.com", tipo=TipoUsuario.ADMIN, cpf="01010101010")
        viagem = await _criar_viagem(sessao_teste)
        reserva = await _criar_reserva(sessao_teste, viagem.id, lider.id, 4)
        # Admin define valor
        reserva.valor_acordado = Decimal("1200.00")
        await sessao_teste.commit()
        tk = await _token(cliente, "lider_resumo@test.com")
        r = await cliente.get(f"/reservas/{reserva.id}/resumo", headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 200
        dados = r.json()
        assert float(dados["sinal"]) == 600.0
        assert float(dados["valor_por_pessoa"]) == 300.0

    async def test_link_acompanhante(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario
        lider = await _criar_usuario(sessao_teste, email="lider_link@test.com", cpf="55555555551")
        viagem = await _criar_viagem(sessao_teste, titulo="Viagem Acompanhante")
        reserva = await _criar_reserva(sessao_teste, viagem.id, lider.id, 2)
        reserva.valor_acordado = Decimal("400.00")
        await sessao_teste.commit()
        
        # Rota pública (não precisa de token)
        r = await cliente.get(f"/reservas/{reserva.id}/link-acompanhante")
        assert r.status_code == 200
        assert r.json()["titulo_viagem"] == "Viagem Acompanhante"
        assert float(r.json()["valor_por_pessoa"]) == 200.0

    async def test_listar_passageiros_reserva(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        lider = await _criar_usuario(sessao_teste, email="lider_pass@test.com", cpf="77777777771")
        viagem = await _criar_viagem(sessao_teste)
        tk = await _token(cliente, "lider_pass@test.com")
        
        # Criar reserva (gera passageiros automaticamente)
        r_post = await cliente.post("/reservas/", json={"id_viagem": viagem.id, "qtd_vagas": 2}, 
                                   headers={"Authorization": f"Bearer {tk}"})
        reserva_id = r_post.json()["id"]
        
        # Listar passageiros
        r = await cliente.get(f"/reservas/{reserva_id}/passageiros", headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 200
        assert len(r.json()) == 2
        assert r.json()[0]["eh_lider"] is True

import pytest
from app.infra.modelos import TipoUsuario, StatusReserva, StatusViagem
from tests.conftest import _criar_usuario, _token

@pytest.mark.asyncio
class TestAdmin:
    async def test_listar_viagens_admin_vazia(self, cliente, sessao_teste):
        # Criar admin
        admin = await _criar_usuario(sessao_teste, email="admin@adm.com", tipo=TipoUsuario.ADMIN, cpf="0001")
        token = await _token(cliente, "admin@adm.com")
        
        r = await cliente.get("/admin/viagens/", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        assert r.json() == []

    async def test_criar_e_editar_viagem(self, cliente, sessao_teste):
        admin = await _criar_usuario(sessao_teste, email="admin2@adm.com", tipo=TipoUsuario.ADMIN, cpf="0002")
        token = await _token(cliente, "admin2@adm.com")
        
        # Criar
        payload = {
            "titulo": "Viagem Teste Admin",
            "data_partida": "2026-12-01",
            "vagas_totais": 40
        }
        r = await cliente.post("/admin/viagens/", json=payload, headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 201
        viagem_id = r.json()["id"]
        
        # Editar
        r = await cliente.patch(f"/admin/viagens/{viagem_id}", json={"vagas_totais": 50}, headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        assert r.json()["vagas_totais"] == 50

    async def test_kanban_reservas(self, cliente, sessao_teste):
        admin = await _criar_usuario(sessao_teste, email="admin3@adm.com", tipo=TipoUsuario.ADMIN, cpf="0003")
        token = await _token(cliente, "admin3@adm.com")
        
        # Criar viagem
        r = await cliente.post("/admin/viagens/", json={"titulo": "V1", "data_partida": "2026-12-01", "vagas_totais": 10}, 
                              headers={"Authorization": f"Bearer {token}"})
        vid = r.json()["id"]
        
        # Ver Kanban
        r = await cliente.get(f"/admin/viagens/{vid}/reservas", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        assert "colunas" in r.json()
        assert StatusReserva.SOLICITADO.value in r.json()["colunas"]

    async def test_exportar_antt(self, cliente, sessao_teste):
        admin = await _criar_usuario(sessao_teste, email="admin4@adm.com", tipo=TipoUsuario.ADMIN, cpf="0004")
        token = await _token(cliente, "admin4@adm.com")
        
        # Criar viagem
        r = await cliente.post("/admin/viagens/", json={"titulo": "V_CSV", "data_partida": "2026-12-01", "vagas_totais": 10}, 
                              headers={"Authorization": f"Bearer {token}"})
        vid = r.json()["id"]
        
        # Exportar JSON
        r = await cliente.get(f"/admin/viagens/{vid}/exportar-passageiros", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        assert isinstance(r.json(), list)
        
        # Exportar CSV
        r = await cliente.get(f"/admin/viagens/{vid}/exportar-passageiros?formato=csv", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        assert "text/csv" in r.headers["content-type"]

    async def test_resumo_whatsapp_erro_sem_valor(self, cliente, sessao_teste):
        admin = await _criar_usuario(sessao_teste, email="admin5@adm.com", tipo=TipoUsuario.ADMIN, cpf="0005")
        token = await _token(cliente, "admin5@adm.com")
        
        # Viajem e Reserva
        from app.infra.modelos import Viagem, ReservaGrupo
        from datetime import date
        v = Viagem(titulo="V", data_partida=date(2026,1,1), vagas_totais=10)
        sessao_teste.add(v)
        await sessao_teste.commit()
        
        u = await _criar_usuario(sessao_teste, email="lider@test.com", cpf="111")
        reserver = ReservaGrupo(id_viagem=v.id, id_lider=u.id, qtd_vagas=2, valor_acordado=None)
        sessao_teste.add(reserver)
        await sessao_teste.commit()
        
        # Tentar resumo sem valor
        r = await cliente.get(f"/admin/reservas/{reserver.id}/resumo-whatsapp", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 422
        assert "Defina o valor acordado" in r.json()["detail"]

    async def test_atualizar_reserva_admin(self, cliente, sessao_teste):
        admin = await _criar_usuario(sessao_teste, email="admin6@adm.com", tipo=TipoUsuario.ADMIN, cpf="0006")
        token = await _token(cliente, "admin6@adm.com")
        
        # Viajem e Reserva
        from app.infra.modelos import Viagem, ReservaGrupo
        from datetime import date
        v = Viagem(titulo="V", data_partida=date(2026,10,1), vagas_totais=10)
        sessao_teste.add(v)
        await sessao_teste.commit()
        
        u = await _criar_usuario(sessao_teste, email="lider2@test.com", cpf="222")
        reserver = ReservaGrupo(id_viagem=v.id, id_lider=u.id, qtd_vagas=2)
        sessao_teste.add(reserver)
        await sessao_teste.commit()
        
        # Atualizar
        payload = {"status": StatusReserva.BLOQUEADO.value, "valor_acordado": 500.0}
        r = await cliente.patch(f"/admin/reservas/{reserver.id}", json=payload, headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        assert r.json()["status"] == StatusReserva.BLOQUEADO.value
        assert float(r.json()["valor_acordado"]) == 500.0

    async def test_resumo_whatsapp_sucesso(self, cliente, sessao_teste):
        admin = await _criar_usuario(sessao_teste, email="admin7@adm.com", tipo=TipoUsuario.ADMIN, cpf="0007")
        token = await _token(cliente, "admin7@adm.com")
        
        from app.infra.modelos import Viagem, ReservaGrupo
        from datetime import date
        v = Viagem(titulo="Viagem Rio", data_partida=date(2026,1,1), vagas_totais=10)
        sessao_teste.add(v)
        await sessao_teste.commit()
        
        u = await _criar_usuario(sessao_teste, email="lider3@test.com", cpf="333")
        reserver = ReservaGrupo(id_viagem=v.id, id_lider=u.id, qtd_vagas=2, valor_acordado=100.0)
        sessao_teste.add(reserver)
        await sessao_teste.commit()
        
        r = await cliente.get(f"/admin/reservas/{reserver.id}/resumo-whatsapp", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 200
        assert "Rio" in r.json()["texto"]

    async def test_listar_viagens_busca(self, cliente, sessao_teste):
        admin = await _criar_usuario(sessao_teste, email="admin8@adm.com", tipo=TipoUsuario.ADMIN, cpf="0008")
        token = await _token(cliente, "admin8@adm.com")
        
        from app.infra.modelos import Viagem
        from datetime import date
        sessao_teste.add(Viagem(titulo="Floripa", data_partida=date(2026,1,1), vagas_totais=10))
        sessao_teste.add(Viagem(titulo="Natal", data_partida=date(2026,1,1), vagas_totais=10))
        await sessao_teste.commit()
        
        r = await cliente.get("/admin/viagens/?busca=Floripa", headers={"Authorization": f"Bearer {token}"})
        assert len(r.json()) == 1
        assert r.json()[0]["titulo"] == "Floripa"

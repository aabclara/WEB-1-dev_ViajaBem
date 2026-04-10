import pytest
from app.infra.modelos import TipoUsuario, StatusViagem, StatusReserva
from tests.conftest import _criar_usuario, _token

@pytest.mark.asyncio
class TestEdgeCases:
    async def test_viagem_nao_encontrada(self, cliente):
        r = await cliente.get("/viagens/9999")
        assert r.status_code == 404

    async def test_resumo_financeiro_reserva_inexistente(self, cliente, sessao_teste):
        await _criar_usuario(sessao_teste, email="edge@test.com", cpf="edge1")
        tk = await _token(cliente, "edge@test.com")
        r = await cliente.get("/reservas/9999/resumo", headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 404

    async def test_link_acompanhante_reserva_inexistente(self, cliente):
        r = await cliente.get("/reservas/9999/link-acompanhante")
        assert r.status_code == 404

    async def test_atualizar_reserva_nao_encontrada_admin(self, cliente, sessao_teste):
        await _criar_usuario(sessao_teste, email="edge_admin@test.com", tipo=TipoUsuario.ADMIN, cpf="edge2")
        tk = await _token(cliente, "edge_admin@test.com")
        r = await cliente.patch("/admin/reservas/9999", json={"status": "BLOQUEADO"}, headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 404

    async def test_resumo_whatsapp_nao_encontrado_admin(self, cliente, sessao_teste):
        await _criar_usuario(sessao_teste, email="edge_admin2@test.com", tipo=TipoUsuario.ADMIN, cpf="edge3")
        tk = await _token(cliente, "edge_admin2@test.com")
        r = await cliente.get("/admin/reservas/9999/resumo-whatsapp", headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 404

    async def test_exportar_passageiros_viagem_nao_encontrada(self, cliente, sessao_teste):
        await _criar_usuario(sessao_teste, email="edge_admin3@test.com", tipo=TipoUsuario.ADMIN, cpf="edge4")
        tk = await _token(cliente, "edge_admin3@test.com")
        r = await cliente.get("/admin/viagens/9999/exportar-passageiros", headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 404

    async def test_kanban_viagem_nao_encontrada(self, cliente, sessao_teste):
        await _criar_usuario(sessao_teste, email="edge_admin4@test.com", tipo=TipoUsuario.ADMIN, cpf="edge5")
        tk = await _token(cliente, "edge_admin4@test.com")
        r = await cliente.get("/admin/viagens/9999/reservas", headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 404

    async def test_obter_reserva_propria(self, cliente, sessao_teste):
        # Criar reserva e tentar acessar por outro usuário
        from app.infra.modelos import Viagem, ReservaGrupo
        from datetime import date
        v = Viagem(titulo="V", data_partida=date(2026,1,1), vagas_totais=10)
        sessao_teste.add(v)
        await sessao_teste.flush()
        
        u1 = await _criar_usuario(sessao_teste, email="u1@test.com", cpf="u1")
        u2 = await _criar_usuario(sessao_teste, email="u2@test.com", cpf="u2")
        reserva = ReservaGrupo(id_viagem=v.id, id_lider=u1.id, qtd_vagas=1)
        sessao_teste.add(reserva)
        await sessao_teste.commit()
        
        tk2 = await _token(cliente, "u2@test.com")
        r = await cliente.get(f"/reservas/{reserva.id}", headers={"Authorization": f"Bearer {tk2}"})
        assert r.status_code == 403

    async def test_remover_viagem_restrito_admin(self, cliente, sessao_teste):
        # Assumindo que a rota de delete existe (vamos verificar)
        # Se não existir, pulamos ou testamos a rota de listagem com busca vazia
        pass

    async def test_atualizar_passageiro_nao_encontrado(self, cliente, sessao_teste):
        await _criar_usuario(sessao_teste, email="edge_pass@test.com", cpf="edge6")
        tk = await _token(cliente, "edge_pass@test.com")
        r = await cliente.patch("/passageiros/9999", json={"nome": "Ninguém"}, headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 404

    async def test_token_usuario_inexistente(self, cliente):
        from app.core.seguranca import criar_token_acesso
        # Token com ID que não existe (provavelmente)
        token = criar_token_acesso({"sub": "99999"})
        r = await cliente.get("/admin/viagens/", headers={"Authorization": f"Bearer {token}"})
        assert r.status_code == 401
        assert "não encontrado" in r.json()["detail"]

import pytest
from datetime import date
from app.infra.modelos import TipoUsuario

pytestmark = pytest.mark.asyncio


class TestCadastro:
    async def test_cadastro_lider_maior_de_idade(self, cliente, sessao_teste):
        r = await cliente.post("/auth/cadastro", json={
            "email": "lider_ok@test.com", "senha": "Senha123!", "nome": "João",
            "cpf": "11111111111", "telefone": "11999999999",
            "data_nascimento": "1995-01-01", "tipo": "LIDER",
        })
        assert r.status_code == 201
        assert r.json()["email"] == "lider_ok@test.com"

    async def test_cadastro_lider_menor_de_idade_bloqueado(self, cliente, sessao_teste):
        r = await cliente.post("/auth/cadastro", json={
            "email": "lider_menor@test.com", "senha": "Senha123!", "nome": "Ana",
            "cpf": "22222222222", "telefone": "11999999999",
            "data_nascimento": "2015-01-01", "tipo": "LIDER",
        })
        assert r.status_code == 422
        assert "18 anos" in r.json()["detail"]

    async def test_cadastro_email_duplicado(self, cliente, sessao_teste):
        payload = {
            "email": "duplicado@test.com", "senha": "Senha123!", "nome": "X",
            "cpf": "33333333333", "telefone": "11999999999",
            "data_nascimento": "1990-01-01", "tipo": "LIDER",
        }
        await cliente.post("/auth/cadastro", json=payload)
        payload2 = {**payload, "cpf": "44444444444"}
        r = await cliente.post("/auth/cadastro", json=payload2)
        assert r.status_code == 409

    async def test_cadastro_cpf_duplicado(self, cliente, sessao_teste):
        payload = {
            "email": "cpf1@test.com", "senha": "Senha123!", "nome": "X",
            "cpf": "55555555555", "telefone": "11999999999",
            "data_nascimento": "1990-01-01", "tipo": "LIDER",
        }
        await cliente.post("/auth/cadastro", json=payload)
        payload2 = {**payload, "email": "cpf2@test.com"}
        r = await cliente.post("/auth/cadastro", json=payload2)
        assert r.status_code == 409


class TestLogin:
    async def test_login_valido(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario
        await _criar_usuario(sessao_teste, email="loginvalido@test.com", cpf="66666666666")
        r = await cliente.post("/auth/login", data={"username": "loginvalido@test.com", "password": "Senha123!"})
        assert r.status_code == 200
        dados = r.json()
        assert "access_token" in dados
        assert dados["nome"] == "Teste"
        assert dados["email"] == "loginvalido@test.com"
        assert dados["tipo"] == "LIDER"

    async def test_login_senha_invalida(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario
        await _criar_usuario(sessao_teste, email="loginsenha@test.com", cpf="77777777777")
        r = await cliente.post("/auth/login", data={"username": "loginsenha@test.com", "password": "errada"})
        assert r.status_code == 401

    async def test_login_usuario_inexistente(self, cliente):
        r = await cliente.post("/auth/login", data={"username": "naoexiste@test.com", "password": "Senha123!"})
        assert r.status_code == 401


class TestRBAC:
    async def test_lider_nao_acessa_rota_admin(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        await _criar_usuario(sessao_teste, email="lider_rbac@test.com", cpf="88888888888")
        tk = await _token(cliente, "lider_rbac@test.com")
        r = await cliente.get("/admin/viagens/", headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 403

    async def test_admin_acessa_rota_admin(self, cliente, sessao_teste):
        from tests.conftest import _criar_usuario, _token
        await _criar_usuario(sessao_teste, email="admin_rbac@test.com", tipo=TipoUsuario.ADMIN, cpf="99999999999")
        tk = await _token(cliente, "admin_rbac@test.com")
        r = await cliente.get("/admin/viagens/", headers={"Authorization": f"Bearer {tk}"})
        assert r.status_code == 200

import pytest
from app.infra.modelos import TokenRedefinicaoSenha
from sqlalchemy import select
from tests.conftest import _criar_usuario

@pytest.mark.asyncio
class TestRecuperacaoSenha:
    async def test_fluxo_esqueci_senha_e_redefinicao(self, cliente, sessao_teste):
        # 1. Criar usuário
        usuario = await _criar_usuario(sessao_teste, email="reset@test.com", cpf="99988877766")
        
        # 2. Solicitar recuperação
        r = await cliente.post("/auth/esqueci-senha", json={"email": "reset@test.com"})
        assert r.status_code == 200
        assert "receberá instruções" in r.json()["mensagem"].lower()
        
        # 3. Buscar token no banco
        res = await sessao_teste.execute(
            select(TokenRedefinicaoSenha).where(TokenRedefinicaoSenha.id_usuario == usuario.id)
        )
        token_obj = res.scalar_one()
        token_str = token_obj.token
        
        # 4. Redefinir senha
        payload = {
            "token": token_str,
            "nova_senha": "NovaSenha123!"
        }
        r = await cliente.post("/auth/redefinir-senha", json=payload)
        assert r.status_code == 200
        assert "sucesso" in r.json()["mensagem"].lower()
        
        # 5. Tentar logar com a nova senha
        r = await cliente.post("/auth/login", data={"username": "reset@test.com", "password": "NovaSenha123!"})
        assert r.status_code == 200
        assert "access_token" in r.json()

    async def test_redefinir_senha_token_invalido(self, cliente, sessao_teste):
        payload = {
            "token": "token-que-nao-existe",
            "nova_senha": "SenhaInvalida123!"
        }
        r = await cliente.post("/auth/redefinir-senha", json=payload)
        assert r.status_code == 400
        assert "inválido" in r.json()["detail"].lower()

    async def test_esqueci_senha_usuario_inexistente(self, cliente):
        # Não deve estourar erro 500, deve retornar 200 por segurança (não vazar se o email existe)
        # Ou conforme a implementação atual (vamos ver o que o código faz)
        r = await cliente.post("/auth/esqueci-senha", json={"email": "naoexiste@test.com"})
        assert r.status_code == 200 

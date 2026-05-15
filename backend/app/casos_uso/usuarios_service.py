from app.infra.modelos import Usuario
from app.repositorios.usuario_repositorio import UsuarioRepositorio
from app.core.seguranca import gerar_hash_senha
from app.schemas.usuario_schemas import AtualizarUsuarioSchema

class UsuariosService:
    def __init__(self, repositorio: UsuarioRepositorio):
        self.repositorio = repositorio

    async def atualizar_perfil(self, usuario: Usuario, dados: AtualizarUsuarioSchema) -> Usuario:
        if dados.nome is not None:
            usuario.nome = dados.nome
        if dados.apelido is not None:
            usuario.apelido = dados.apelido
        if dados.telefone is not None:
            usuario.telefone = dados.telefone
        if dados.senha is not None and len(dados.senha.strip()) > 0:
            usuario.senha_hash = gerar_hash_senha(dados.senha)
            
        return await self.repositorio.atualizar(usuario)

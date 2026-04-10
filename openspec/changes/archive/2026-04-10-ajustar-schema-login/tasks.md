# Tasks: Ajuste no Schema de Resposta do Login

## 1. Atualização do Schema Backend

- [x] 1.1 Adicionar campos `nome: str`, `email: str` e `tipo: TipoUsuario` à classe `TokenSchema` em `backend/app/schemas/usuario_schemas.py`.

## 2. Atualização da Rota de Login

- [x] 2.1 Modificar o retorno da função `login` em `backend/app/api/rotas/autenticacao.py` para incluir os novos campos extraídos do objeto `usuario`.

## 3. Validação e Testes

- [x] 3.1 Acessar `/docs` (Swagger UI), realizar login com o admin e verificar se o JSON de resposta contém os novos campos.
- [x] 3.2 Executar os testes automatizados com `pytest` para garantir a integridade do endpoint.

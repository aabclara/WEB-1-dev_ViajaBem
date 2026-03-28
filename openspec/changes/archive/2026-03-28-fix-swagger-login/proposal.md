# Proposal: Compatibilidade do Login com Swagger Authorize

## Why

O botão de "Authorize" (cadeado) na interface do Swagger UI envia as credenciais no formato `application/x-www-form-urlencoded`. Atualmente, a rota `/auth/login` está configurada para receber um JSON (`LoginSchema`), o que resulta em erro `422 Unprocessable Entity` ao tentar autenticar via Swagger. Para uma melhor experiência de desenvolvimento e testes de API, a rota de login deve ser compatível com o padrão OAuth2 do FastAPI.

## What Changes

Esta mudança ajusta a rota de login no backend para utilizar as dependências padrão do FastAPI para fluxos OAuth2:

- **Refatoração da Rota de Login**: 
    - Alterar o parâmetro de entrada de `dados: LoginSchema` para `dados: OAuth2PasswordRequestForm = Depends()`.
    - Adaptar a lógica interna para acessar `dados.username` (mapeado para o e-mail) e `dados.password`.
- **Manutenção de Esquemas**: O `LoginSchema` pode ser mantido para chamadas JSON programáticas se necessário, mas a rota principal focará no `OAuth2PasswordRequestForm` para garantir que o Swagger funcione nativamente.

## Impact

- `backend/app/api/rotas/autenticacao.py`: Modificado para aceitar formulários via `Depends(OAuth2PasswordRequestForm)`.
- Experiência do Desenvolvedor: O botão "Authorize" do Swagger funcionará corretamente, permitindo testar rotas protegidas diretamente pelo navegador.

## Requirement Changes

- Nenhuma mudança nos requisitos de negócio; trata-se de um ajuste técnico de interface (DX).

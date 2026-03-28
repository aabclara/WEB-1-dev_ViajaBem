# Design: Compatibilidade do Login com Swagger Authorize

## Context

A interface do Swagger UI exige que a rota de autenticação configurada em `OAuth2PasswordBearer` suporte o envio de dados via formulário (`application/x-www-form-urlencoded`). Atualmente, o backend espera JSON para o login, o que impede o funcionamento do botão "Authorize" nativo do Swagger.

## Goals / Non-Goals

**Goals:**
- Ajustar a rota `/auth/login` para aceitar `OAuth2PasswordRequestForm`.
- Manter a segurança e a validação de credenciais existentes.
- Garantir que o Swagger UI consiga autenticar com sucesso.

**Non-Goals:**
- Alterar o esquema de resposta (permanecer com `TokenSchema`).
- Mudar a URL da rota de autenticação.

---

## Technical Details

### Refatoração da Rota de Login

No arquivo `backend/app/api/rotas/autenticacao.py`:

- **Dependência**: Usar `OAuth2PasswordRequestForm` como uma dependência do FastAPI.
- **Logica**: O campo `username` do formulário será tratado como o e-mail do usuário.

```python
from fastapi.security import OAuth2PasswordRequestForm

@roteador_auth.post("/login", response_model=TokenSchema)
async def login(
    dados: OAuth2PasswordRequestForm = Depends(),
    sessao: AsyncSession = Depends(obter_sessao),
):
    resultado = await sessao.execute(select(Usuario).where(Usuario.email == dados.username))
    usuario = resultado.scalar_one_or_none()
    # ... resto da validação usando dados.password ...
```

### Compatibilidade

Esta mudança permite que o Swagger envie os dados de forma correta. O sistema continuará a emitir JWTs compatíveis com o restante da aplicação.

---

## Decisions

| Decisão | Rationale |
|---|---|
| OAuth2PasswordRequestForm | É o padrão do FastAPI para integração com Swagger Authorize. |
| Uso do campo `username` para E-mail | O formulário padrão do OAuth2 utiliza `username`, mas nosso sistema utiliza `email` como identificador único. |

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Quebra de clientes que enviam JSON | Como o frontend Next.js será desenvolvido para usar a mesma API, ele pode ser ajustado para enviar via form-data ou a rota pode ser adaptada para suportar ambos se necessário. No entanto, o padrão form-data é o mais comum para rotas de token OAuth2. |

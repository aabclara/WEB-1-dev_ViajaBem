# Design: Login Response Schema Adjustment

## Context
The current login response lacks basic user profile information. The frontend team needs this data to personalize the UI immediately after authentication without having to manually decode the JWT.

## Goals
- Include `nome`, `email`, and `tipo` in the `TokenSchema`.
- Ensure the login endpoint populates these fields.

## Non-Goals
- Changing the JWT generation logic.
- Adding complex user profile data (e.g., CPF, telephone).

## Decisions
- Use `TipoUsuario` enum from the domain models.
- Keep the new fields as part of the `TokenSchema` directly.

## Implementation Details

### Schema Update
Modify `backend/app/schemas/usuario_schemas.py`:
```python
class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    nome: str
    email: str
    tipo: TipoUsuario
```

### Route Update
Modify `backend/app/api/rotas/autenticacao.py`:
```python
@roteador_auth.post("/login", response_model=TokenSchema)
async def login(...):
    ...
    return TokenSchema(
        access_token=token,
        nome=usuario.nome,
        email=usuario.email,
        tipo=usuario.tipo
    )
```

## Risks / Trade-offs
- Slight increase in response payload size (negligible).
- No breaking changes for existing JWT consumers.

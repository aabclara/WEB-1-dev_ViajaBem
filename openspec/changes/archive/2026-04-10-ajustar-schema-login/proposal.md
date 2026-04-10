# Proposal: Login Response Schema Adjustment

## Why
Including basic user data (name, email, and type) in the login response simplifies frontend integration. Currently, the frontend would need to decode the JWT to access this information, which adds unnecessary complexity for immediate UI updates (like showing the user's name or directing them to the correct dashboard).

## What Changes
- **Schema**: Update `TokenSchema` in `backend/app/schemas/usuario_schemas.py` to include `nome`, `email`, and `tipo`.
- **API**: Modify `POST /auth/login` in `backend/app/api/rotas/autenticacao.py` to return the logged-in user's details.

## Impact
- **Backend**: Small additive change to the login response model.
- **Frontend**: Immediate access to user profile data upon login.
- **Security**: No change in security; this data is already present in the JWT.

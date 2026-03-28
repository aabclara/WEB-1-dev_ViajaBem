# Tasks: Compatibilidade do Login com Swagger Authorize

## 1. Ajuste Técnico no Backend

- [x] 1.1 Modificar `backend/app/api/rotas/autenticacao.py` para importar `OAuth2PasswordRequestForm` de `fastapi.security`.
- [x] 1.2 Atualizar a função `login` para usar `dados: OAuth2PasswordRequestForm = Depends()` no lugar de `LoginSchema`.
- [x] 1.3 Adaptar as referências internas de `dados.email` para `dados.username` e `dados.password`.

## 2. Validação

- [x] 2.1 Acessar `/docs` (Swagger) e clicar no botão "Authorize".
- [x] 2.2 Inserir as credenciais do ADMIN (admin@viajebem.com.br / TroqueEssaSenha123!).
- [x] 2.3 Confirmar que o login é bem-sucedido e o token é salvo no navegador (ícone de cadeado fechado).
- [x] 2.4 Testar uma rota protegida (ex: `/admin/usuarios`) via Swagger para confirmar que o token está sendo enviado corretamente.

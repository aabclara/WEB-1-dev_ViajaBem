# Tasks: Correção do Erro de Hash no Seed do Admin

## 1. Atualização de Dependências

- [x] 1.1 Substituir `passlib[bcrypt]==1.7.4` por `bcrypt==4.2.1` no arquivo `backend/requirements.txt`.

## 2. Refatoração da Lógica de Hashing

- [x] 2.1 Implementar `gerar_hash_senha` e `verificar_senha` em `backend/app/core/seguranca.py` usando a biblioteca `bcrypt`.
- [x] 2.2 Remover referências ao `passlib.context.CryptContext` em `backend/app/main.py`.
- [x] 2.3 Atualizar a função `_criar_admin_seed` em `backend/app/main.py` para usar a nova função de hash.
- [x] 2.4 Remover referências ao `passlib` em `backend/app/api/rotas/autenticacao.py` e atualizar as chamadas de hash/verificação.

## 3. Validação

- [x] 3.1 Executar `docker-compose up --build backend` para reinstalar as dependências e testar o startup.
- [x] 3.2 Verificar logs para confirmar que o erro "72 bytes" foi resolvido e o ADMIN foi criado.

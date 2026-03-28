# Proposal: Correção do Erro de Hash no Seed do Admin

## Why

O backend falha ao iniciar com o erro `ValueError: password cannot be longer than 72 bytes`. Este erro é causado por uma incompatibilidade conhecida entre a biblioteca `passlib` (versão 1.7.4) e versões mais recentes da biblioteca `bcrypt` em ambientes Python 3.12+. O `passlib` tenta realizar verificações internas de bugs ao inicializar o `CryptContext`, disparando erroneamente a exceção de limite de 72 bytes mesmo para senhas curtas.

## What Changes

Esta mudança substitui o uso do `passlib` pelo uso direto da biblioteca `bcrypt`, que é mais moderna, segura e compatível com Python 3.12+:

- **Dependências (`requirements.txt`)**: Substituir `passlib[bcrypt]` por `bcrypt==4.2.1`.
- **Refatoração de Segurança**: Criar funções utilitárias em `app.core.seguranca` (ou um novo arquivo) para `gerar_hash` e `verificar_senha` usando a biblioteca `bcrypt` nativamente.
- **Atualização de Seed e Rotas**:
    - Alterar `backend/app/main.py` para usar as novas funções de hash no seed do ADMIN.
    - Alterar `backend/app/api/rotas/autenticacao.py` para usar as novas funções no cadastro e login de usuários.
- **Configuração**: Eliminar o `CryptContext` do código.

## Impact

- `backend/requirements.txt`: Mudança na biblioteca de hashing.
- `backend/app/main.py`: Atualização no processo de seed.
- `backend/app/api/rotas/autenticacao.py`: Atualização na lógica de autenticação.
- Estabilidade: O sistema passará a iniciar corretamente no Docker sem erros de 72 bytes.

## Requirement Changes

- Nenhuma mudança nos requisitos de negócio; trata-se de uma atualização proativa de biblioteca para compatibilidade técnica.

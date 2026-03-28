# Design: Correção do Erro de Hash no Seed do Admin

## Context

A biblioteca `passlib` está instável em ambientes Python 3.12 com `bcrypt` 4.0+, causando falhas no startup do backend mesmo para senhas curtas. A solução técnica é utilizar a biblioteca `bcrypt` diretamente para o hashing de senhas.

## Goals / Non-Goals

**Goals:**
- Remover a dependência de `passlib`.
- Implementar hashing de senhas robusto usando `bcrypt` nativo.
- Centralizar a lógica de hashing em `app.core.seguranca`.

**Non-Goals:**
- Mudar o algoritmo de hash (permanecer com bcrypt).
- Mudar a estrutura do banco de dados (o campo `senha_hash` permanece o mesmo).

---

## Technical Details

### Novas Funções de Segurança

O arquivo `backend/app/core/seguranca.py` ganhará duas novas funções:

1.  **`gerar_hash_senha(senha: str) -> str`**:
    - Converte a string da senha para bytes (`utf-8`).
    - Gera um salt aleatório usando `bcrypt.gensalt()`.
    - Retorna o hash decodificado para string para armazenamento.
2.  **`verificar_senha(senha: str, senha_hash: str) -> bool`**:
    - Converte ambos os parâmetros para bytes.
    - Utiliza `bcrypt.checkpw()` para validação segura.

### Atualização de Dependências

O arquivo `requirements.txt` será atualizado:
- De: `passlib[bcrypt]==1.7.4`
- Para: `bcrypt==4.2.1`

---

## Decisions

| Decisão | Rationale |
|---|---|
| Uso direto do `bcrypt` | Elimina a camada problemática do `passlib` e resolve o bug de "72 bytes" no Python 3.12. |
| Bcrypt v4.2.1 | Versão estável e moderna com suporte pleno a Python 3.12. |

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Incompatibilidade de hashes antigos | Como o sistema está em fase inicial e o banco foi resetado recentemente, não há risco de invalidar hashes de usuários reais. |

## Why

As Viagens atualmente possuem informações limitadas no banco de dados. Para oferecer uma experiência mais rica e informativa no frontend (como a seção "O que está incluso" e resumos na listagem), é necessário que esses dados sejam dinâmicos e venham do backend, em vez de serem valores fixos (placeholders).

## What Changes

- Alteração do modelo de dados `Viagem` no SQLAlchemy para incluir os campos `itens_inclusos` (texto longo) e `descricao_curta` (texto breve).
- Atualização dos Schemas Pydantic para refletir esses novos campos nas requisições e respostas da API.
- Criação de uma migração de banco de dados (Alembic) para aplicar as mudanças na tabela `viagens`.
- Atualização do frontend para exibir esses dados reais nas páginas de listagem e detalhes.

## Capabilities

### New Capabilities
- `viagem-detailed-content`: Permite o armazenamento e exibição de detalhes específicos como itens inclusos e descrições breves para cada viagem.

### Modified Capabilities
- (Nenhuma)

## Impact

- **Backend**: `app/infra/modelos.py`, `app/schemas/viagem_schemas.py`, API endpoints de Viagens.
- **Banco de Dados**: Nova migração necessária.
- **Frontend**: `app/page.tsx` (exibindo descrição curta) e `app/viagens/[id]/page.tsx` (exibindo itens inclusos reais).

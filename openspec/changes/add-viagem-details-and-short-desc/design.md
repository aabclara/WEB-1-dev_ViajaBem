## Context

Atualmente, o modelo `Viagem` no backend armazena apenas título, descrição de preços, data e vagas. O frontend utiliza placeholders estáticos para "Itens Inclusos" e não exibe uma descrição breve nas listagens. Para tornar o sistema mais flexível e informativo, precisamos persistir esses dados no banco de dados.

## Goals / Non-Goals

**Goals:**
- Adicionar os campos `descricao_curta` e `itens_inclusos` ao modelo `Viagem`.
- Garantir que as viagens existentes continuem funcionando (campos serão nullable ou terão valor padrão).
- Expor esses campos via API para o frontend.
- Refatorar o frontend para consumir os dados reais.

**Non-Goals:**
- Criar interface administrativa para editar esses campos (será feito via banco/seed por enquanto, conforme contexto atual do projeto).

## Decisions

- **Modelo SQLAlchemy**: 
    - `descricao_curta`: `String(255)` para garantir um resumo conciso.
    - `itens_inclusos`: `Text` para permitir listas longas de benefícios.
- **Banco de Dados**: Utilizar Alembic para gerar uma migração que adicione as colunas à tabela `viagem`.
- **Schemas Pydantic**: Adicionar os campos ao `ViagemPublicaSchema` e `CriarViagemSchema`.
- **Frontend**: 
    - Na Home (`app/page.tsx`), substituir o texto genérico pela `descricao_curta`.
    - Na página de Detalhes (`app/viagens/[id]/page.tsx`), substituir a lista estática pelos `itens_inclusos` (processando quebras de linha ou formato de lista).

## Risks / Trade-offs

- **Dados Existentes**: As viagens já cadastradas ficarão com esses campos vazios até que sejam atualizadas manualmente ou via script SQL.
- **Formatação**: `itens_inclusos` como `Text` no banco pode exigir um tratamento no frontend (ex: split por vírgula ou quebra de linha) para manter a estética de lista.

## 1. Backend e Banco de Dados

- [ ] 1.1 Adicionar os campos `descricao_curta` e `itens_inclusos` ao modelo `Viagem` em `app/infra/modelos.py`.
- [ ] 1.2 Gerar arquivo de migração do banco de dados utilizando Alembic.
- [ ] 1.3 Executar a migração para atualizar a tabela `viagens`.
- [ ] 1.4 Atualizar os schemas Pydantic em `app/schemas/viagem_schemas.py` para incluir os novos campos.

## 2. Frontend

- [ ] 2.1 Atualizar a listagem de viagens na Home (`app/page.tsx`) para exibir a `descricao_curta`.
- [ ] 2.2 Refatorar a página de detalhes (`app/viagens/[id]/page.tsx`) para renderizar os `itens_inclusos` dinâmicos do banco de dados em vez da lista estática.
- [ ] 2.3 Validar a visualização responsiva e o tratamento de nulos caso os novos campos não estejam preenchidos.

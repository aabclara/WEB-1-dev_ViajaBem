## ADDED Requirements

### Requirement: Arquitetura Cliente Exclusiva (SPA) no Frontend
A página não deve fazer a resolução e fetch server-side usando Server Components de forma que mascare o papel do cliente como a entidade primária consumindo a aplicação web.

#### Scenario: Páginas Inicial e de Painel
- **WHEN** O usuário acessa a aplicação.
- **THEN** O processo de fetch da API FastAPI deve originar-se do navegador (usando hooks React em Client Components), tornando evidente a arquitetura do SPA.

### Requirement: Paginação e Controle de Listas Pelo Navegador
Os processos de buscar listas amplas devem ser guiados por paginação nativa (limit/offset ou cursor) oriunda do controle no cliente.

#### Scenario: Visualizando a Lista de Viagens no Painel
- **WHEN** O administrador acessa a visualização das "Viagens Cadastradas".
- **THEN** A requisição ao backend só trará um número limitado de itens correspondente a página solicitada, permitindo navegação para páginas subsequentes diretamente a partir do navegador.

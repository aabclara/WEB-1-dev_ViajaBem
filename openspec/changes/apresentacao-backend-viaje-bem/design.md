## Context

O backend do Viaje Bem é uma API moderna construída com **FastAPI**, utilizando **SQLAlchemy** (Assíncrono) para persistência de dados em um banco de dados PostgreSQL. A arquitetura segue princípios de separação de responsabilidades (Clean Architecture), embora a lógica de negócio esteja atualmente integrada nas rotas e modelos de infraestrutura para agilidade.

## Goals / Non-Goals

**Goals:**
- Apresentar a estrutura de pastas e a organização do código.
- Detalhar o esquema de banco de dados e os relacionamentos entre entidades.
- Explicar o fluxo de autenticação e autorização (RBAC).
- Demonstrar as principais rotas de API (Públicas, Líder e Admin).

**Non-Goals:**
- Documentar o frontend de forma profunda.
- Descrever procedimentos de deploy em infraestrutura de nuvem (foco no código).

## Decisions

### 1. Arquitetura e Estrutura de Pastas
A organização do código em `backend/app` divide as responsabilidades em:
- `api/`: Definição de rotas, middlewares e lógica de orquestração.
- `core/`: Configurações globais, segurança (JWT) e conexão com banco de dados.
- `infra/modelos.py`: Definição de tabelas e relacionamentos via SQLAlchemy.
- `schemas/`: Validação de entrada e saída de dados via Pydantic.

### 2. Modelagem de Dados
O sistema baseia-se em quatro pilares principais:
- **Usuario**: Gerencia `LIDER` e `ADMIN`. Autenticação via `email` e `senha_hash`.
- **Viagem**: O produto principal, com título, data de partida e total de vagas.
- **ReservaGrupo**: O elo entre Usuário e Viagem. Gerencia a quantidade de vagas bloqueadas e o status da reserva.
- **Passageiro**: Detalhes individuais de quem participará da viagem, vinculados a uma reserva.

### 3. Segurança e Controle de Acesso
Utilizamos **JWT (JSON Web Tokens)** para autenticação sem estado.
- **Password Hashing**: Implementado com `bcrypt`.
- **Role-Based Access Control (RBAC)**: Dependências de rota (`requerer_admin`, `requerer_lider`) garantem que apenas usuários autorizados acessem endpoints críticos.

### 4. Gestão de Reservas (Admin)
O backend implementa regras de negócio complexas para o administrador:
- **Trava de Segurança**: Cancelamentos são bloqueados se a viagem estiver a menos de 7 dias da partida.
- **Gestão de Vagas**: O sistema calcula vagas disponíveis em tempo real, considerando apenas reservas em estados `BLOQUEADO` ou `CONFIRMADO`.
- **Kanban**: Endpoint especializado que agrupa reservas por status para visualização gerencial.

## Risks / Trade-offs

- **Lógica nas Rotas**: Atualmente, parte da lógica de negócio reside nos arquivos de rotas em `app/api/rotas/`. Isso agiliza o desenvolvimento inicial, mas pode exigir refatoração para a camada de `casos_uso` à medida que a complexidade aumentar.
- **Concorrência**: O bloqueio de vagas utiliza `with_for_update()` para evitar race conditions durante o processo de reserva simultânea.

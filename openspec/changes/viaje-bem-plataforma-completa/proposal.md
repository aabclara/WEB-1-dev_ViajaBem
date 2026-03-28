# Proposal: Viaje Bem — Plataforma de Gestão de Combos de Viagens

## Why

Agências e líderes de grupos que organizam viagens curtas carecem de uma ferramenta digital integrada para gerenciar reservas em grupo, controle de vagas, comunicação financeira e CRM operacional. A solução atual (planilhas + WhatsApp manual) é propensa a erros, conflitos de vagas e retrabalho administrativo.

## What Changes

Lançamento completo da plataforma **Viaje Bem**, uma aplicação web full-stack composta por:

### Back-end (FastAPI + PostgreSQL)
- **Autenticação JWT + RBAC** com dois papéis: `LIDER` e `ADMIN`.
- **Seed automático** do primeiro usuário ADMIN.
- **Fluxo de "Esqueci minha Senha"** via token de redefinição, com MailHog no Docker para testes de e-mail.
- **Validação de maioridade** no cadastro de Líderes (≥ 18 anos).
- **Entidades de domínio**: `usuario`, `viagem`, `reserva_grupo`, `passageiro`.
- **Travas de negócio**: bloqueio de edição/cancelamento dentro de 7 dias da partida; controle de concorrência de vagas.
- **TDD** com cobertura de todos os casos de uso críticos.

### Front-end (Next.js)
- **Vitrine pública** de viagens com cards, selo "Últimas Vagas" e bloqueio de checkout quando esgotada.
- **Fluxo de reserva guiado**: login obrigatório → cadastro de reserva → geração automática de slots de passageiros.
- **Painel do Líder**: progresso da reserva, preenchimento de acompanhantes, resumo financeiro (Sinal 50% / Restante 50% / Valor por Pessoa).
- **Link do Acompanhante**: página de leitura com informações da viagem e valor individual.
- **CRM do Admin (SuperAdmin)**: lista de viagens com busca, Kanban por status/substatus, ferramentas de venda (Copiar Resumo WhatsApp, chave PIX), exportação de passageiros para ANTT/Seguro.

### Infraestrutura (Docker)
- Stack completa: FastAPI, Next.js, PostgreSQL, MailHog.
- Ambiente de desenvolvimento reproduzível via `docker-compose`.

## Impacted Areas

- `backend/`: nova aplicação FastAPI (Clean Architecture).
- `frontend/`: nova aplicação Next.js.
- `docker-compose.yml`: orquestração de todos os serviços.
- `openspec/specs/`: especificações detalhadas por domínio.

## Requirement Changes

- Nenhuma especificação anterior é alterada — este é o lançamento inicial da plataforma.

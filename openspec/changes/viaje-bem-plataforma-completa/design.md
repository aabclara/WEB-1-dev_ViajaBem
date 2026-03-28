# Design: Viaje Bem — Plataforma de Gestão de Combos de Viagens

## Context

A plataforma "Viaje Bem" é lançada do zero como um sistema web full-stack para gestão de combos de viagens curtas, substituindo processos manuais (planilhas + WhatsApp). Requer um backend robusto com regras de negócio complexas, um frontend moderno e CRM operacional.

## Goals / Non-Goals

**Goals:**
- Autenticação JWT com RBAC (LIDER, ADMIN) e seed automático do primeiro ADMIN.
- Gestão de entidades: `usuario`, `viagem`, `reserva_grupo`, `passageiro`.
- Fluxo completo de reserva em grupo com geração automática de slots de passageiros.
- Painel financeiro para Líderes (sinal/restante/por pessoa).
- CRM Kanban para Admins com substatus anti-conflito.
- Exportação de passageiros (ANTT/Seguro) e ferramentas de venda (WhatsApp/PIX).
- Travas de negócio: maioridade, 7 dias ante-partida, concorrência de vagas.
- Stack: FastAPI + Next.js + PostgreSQL + Docker + MailHog.
- TDD no backend para todos os casos críticos.

**Non-Goals:**
- Pagamento online integrado (apenas gestão de PIX manual).
- App mobile nativo.
- Multi-tenancy (plataforma single-tenant).
- Internacionalização (idioma único: Português).

---

## Architecture

### Visão Geral

```
┌─────────────────────────────────────────────────────┐
│                    Docker Compose                    │
│  ┌──────────┐  ┌──────────┐  ┌──────┐  ┌────────┐  │
│  │ Next.js  │  │ FastAPI  │  │  PG  │  │MailHog │  │
│  │ :3000    │→ │ :8000    │→ │:5432 │  │ :8025  │  │
│  └──────────┘  └──────────┘  └──────┘  └────────┘  │
└─────────────────────────────────────────────────────┘
```

### Back-end (FastAPI — Clean Architecture)

Estrutura de camadas:

```
backend/
├── app/
│   ├── api/          # Routers FastAPI (HTTP layer)
│   ├── core/         # Config, segurança (JWT), dependências
│   ├── dominio/      # Entidades, regras de negócio puras
│   ├── casos_uso/    # Casos de uso (lógica de aplicação)
│   ├── repositorios/ # Interfaces de repositório
│   ├── infra/        # SQLAlchemy models, implementações concretas
│   └── schemas/      # Pydantic schemas (DTOs)
├── tests/            # Testes TDD por camada
├── alembic/          # Migrações de BD
└── Dockerfile
```

**Convenção de nomenclatura**: Todo o código (variáveis, funções, modelos de BD, rotas) em **Português**.

### Front-end (Next.js — App Router)

```
frontend/
├── app/
│   ├── (publico)/           # Vitrine de viagens
│   ├── (auth)/              # Login, cadastro, senha
│   ├── lider/               # Painel do Líder
│   ├── acompanhante/[id]/   # Página pública do acompanhante
│   └── admin/               # CRM SuperAdmin (Kanban, exportação)
├── components/
└── lib/                     # API client, hooks, utils
```

### Banco de Dados (PostgreSQL)

**Modelo de dados principal:**

```sql
-- usuario
id, email (UNIQUE), senha_hash, nome, apelido, cpf (UNIQUE),
telefone, data_nascimento, tipo ENUM('LIDER','ADMIN'), criado_em

-- viagem
id, titulo, descricao_precos (TEXT/Markdown), data_partida,
vagas_totais, status ENUM('ATIVO','ESGOTADO'), criado_em

-- reserva_grupo
id, id_viagem (FK), id_lider (FK→usuario), qtd_vagas,
valor_acordado (DECIMAL), status ENUM('SOLICITADO','BLOQUEADO','CONFIRMADO','CANCELADO'),
substatus ENUM('AGUARDANDO_CONTATO','EM_ATENDIMENTO','AGUARDANDO_PIX'),
data_expiracao, admin_responsavel_id (FK→usuario), criado_em

-- passageiro
id, id_reserva (FK), nome, documento (VARCHAR), eh_lider (BOOLEAN)
```

---

## Key Flows

### 1. Autenticação e RBAC
- JWT com `tipo` no payload → guards `RequererLider`, `RequererAdmin`.
- Seed: na inicialização, verifica se existe ADMIN; se não, cria com credenciais de env vars.
- "Esqueci minha senha": gera token UUID com expiração 1h → envia e-mail via SMTP (MailHog em dev) → endpoint de redefinição valida o token.

### 2. Fluxo de Reserva
1. Líder acessa vitrine → seleciona viagem → obrigatório login.
2. POST `/reservas/` → cria `reserva_grupo` em `SOLICITADO/AGUARDANDO_CONTATO`.
3. Sistema cria automaticamente `qtd_vagas` registros de `passageiro` (primeiro = líder, demais com nome/doc vazio).
4. Líder preenche dados dos acompanhantes no Painel.

### 3. Trava de Concorrência de Vagas
- Antes de mover para `BLOQUEADO`: `SUM(qtd_vagas WHERE status IN ['BLOQUEADO','CONFIRMADO']) + nova_qtd ≤ viagem.vagas_totais`.
- Se falhar → sugere cancelamento de reservas em `SOLICITADO`.

### 4. Trava de Seguro (7 dias)
- `hoje ≥ data_partida - 7 dias` → bloquear: edição de passageiros, cancelamento com reembolso.

### 5. CRM Kanban
- Colunas: `SOLICITADO | BLOQUEADO | CONFIRMADO | CANCELADO`.
- Substatus visível no card para coordenação entre admins.
- Ação "Copiar Resumo WhatsApp": gera texto com valor total, sinal (50%), restante (50%), valor por pessoa e chave PIX.
- Exportação ANTT: seleciona passageiros da viagem, substitui doc nulo por `"PENDENTE"`.

### 6. Vitrine Pública
- Selo "Últimas Vagas" se `vagas_disponíveis < 5`.
- Botão "Reservar" desabilitado se `status == 'ESGOTADO'`.
- Vagas disponíveis = `viagem.vagas_totais - SUM(qtd_vagas WHERE status IN ['BLOQUEADO','CONFIRMADO'])`.

---

## Decisions

| Decisão | Rationale |
|---|---|
| FastAPI + SQLAlchemy | Mais rápido para prototipagem acadêmica com tipagem forte (Pydantic) |
| Alembic para migrações | Padrão do ecossistema FastAPI; versionamento de schema |
| JWT stateless | Sem necessidade de session store; simplifica escala horizontal |
| Next.js App Router | Server Components para SEO na vitrine pública; Client Components no admin |
| MailHog no Docker | Testes de e-mail sem provedor real; zero configuração extra |
| Clean Architecture no backend | Testabilidade (TDD) e separação de responsabilidades exigidas pela disciplina |
| Todo código em Português | Requisito explícito da disciplina WEB 1 |

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Concorrência de vagas com múltiplos admins simultâneos | `SELECT FOR UPDATE` na transação de bloqueio |
| Expiração de reservas SOLICITADAS sem ação admin | Tarefa agendada (APScheduler) ou check lazy no acesso |
| Trava de 7 dias pode surpreender o usuário | Aviso visual no frontend e mensagem de erro clara na API |
| Senha hash: usar bcrypt | `passlib[bcrypt]` já incluso como dependência do FastAPI ecosystem |

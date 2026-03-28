# Tasks: Viaje Bem — Plataforma de Gestão de Combos de Viagens

## 1. Infraestrutura e Configuração Inicial

- [ ] 1.1 Criar `docker-compose.yml` com serviços: `backend` (FastAPI), `frontend` (Next.js), `db` (PostgreSQL), `mailhog`
- [ ] 1.2 Criar `backend/Dockerfile` multi-stage para FastAPI
- [ ] 1.3 Criar `frontend/Dockerfile` para Next.js
- [ ] 1.4 Configurar variáveis de ambiente (`.env.example`) para JWT_SECRET, DATABASE_URL, SMTP, ADMIN_EMAIL, ADMIN_SENHA, CHAVE_PIX
- [ ] 1.5 Configurar Alembic para migrações de banco de dados
- [ ] 1.6 Criar estrutura de pastas Clean Architecture no backend (`api/`, `core/`, `dominio/`, `casos_uso/`, `repositorios/`, `infra/`, `schemas/`)

## 2. Modelos de Banco de Dados e Migrações

- [ ] 2.1 Criar model SQLAlchemy `usuario` (id, email, senha_hash, nome, apelido, cpf, telefone, data_nascimento, tipo ENUM)
- [ ] 2.2 Criar model SQLAlchemy `viagem` (id, titulo, descricao_precos, data_partida, vagas_totais, status ENUM)
- [ ] 2.3 Criar model SQLAlchemy `reserva_grupo` (id, id_viagem, id_lider, qtd_vagas, valor_acordado, status ENUM, substatus ENUM, data_expiracao, admin_responsavel_id)
- [ ] 2.4 Criar model SQLAlchemy `passageiro` (id, id_reserva, nome, documento, eh_lider)
- [ ] 2.5 Gerar e aplicar migração Alembic inicial com todas as tabelas

## 3. Autenticação e Autorização (Backend)

- [ ] 3.1 Implementar hashing de senha com `passlib[bcrypt]`
- [ ] 3.2 Implementar geração e validação de JWT (`python-jose`) com payload: id, email, tipo
- [ ] 3.3 Criar dependências FastAPI: `obter_usuario_atual`, `requerer_lider`, `requerer_admin`
- [ ] 3.4 Criar endpoint `POST /auth/cadastro` com validação de maioridade (≥ 18 anos para LIDER)
- [ ] 3.5 Criar endpoint `POST /auth/login` retornando `access_token`
- [ ] 3.6 Criar endpoint `POST /auth/esqueci-senha` — gera token UUID, salva no BD, envia e-mail via SMTP
- [ ] 3.7 Criar endpoint `POST /auth/redefinir-senha` — valida token (expira em 1h), atualiza senha_hash
- [ ] 3.8 Implementar seed automático: verificar/criar primeiro ADMIN na inicialização do app
- [ ] 3.9 Escrever testes TDD para: cadastro com maioridade, login inválido, RBAC, fluxo de redefinição de senha

## 4. Domínio: Viagens (Backend)

- [ ] 4.1 Criar endpoint `GET /viagens/` (público) — lista viagens ATIVAS com `vagas_disponíveis` e flag `ultimas_vagas`
- [ ] 4.2 Criar endpoint `GET /viagens/{id}` — detalhe da viagem com vagas calculadas
- [ ] 4.3 Criar endpoint `POST /admin/viagens/` — ADMIN cria viagem
- [ ] 4.4 Criar endpoint `PATCH /admin/viagens/{id}` — ADMIN edita viagem
- [ ] 4.5 Criar endpoint `GET /admin/viagens/` — lista todas as viagens com busca por título e totais de reservas por status
- [ ] 4.6 Escrever testes TDD para: cálculo de vagas_disponíveis, flag ultimas_vagas, bloqueio de checkout

## 5. Domínio: Reservas (Backend)

- [ ] 5.1 Criar endpoint `POST /reservas/` (LIDER) — cria reserva e slots de passageiros automaticamente
- [ ] 5.2 Criar endpoint `GET /reservas/{id}` (LIDER proprietário ou ADMIN)
- [ ] 5.3 Criar endpoint `GET /reservas/{id}/resumo` — retorna valor_acordado, sinal, restante, valor_por_pessoa
- [ ] 5.4 Criar endpoint `GET /reservas/{id}/link-acompanhante` (público)
- [ ] 5.5 Criar endpoint `PATCH /admin/reservas/{id}` — ADMIN atualiza status, substatus, valor_acordado, admin_responsavel_id
- [ ] 5.6 Implementar trava de concorrência de vagas no `BLOQUEADO` com `SELECT FOR UPDATE`
- [ ] 5.7 Implementar trava de seguro: bloquear cancelamento e edição de passageiros se `hoje >= data_partida - 7 dias`
- [ ] 5.8 Criar endpoint `GET /admin/reservas/{id}/resumo-whatsapp` — gera texto formatado com valores e chave PIX
- [ ] 5.9 Criar endpoint `GET /admin/viagens/{id}/reservas` — retorna reservas agrupadas por status (Kanban)
- [ ] 5.10 Escrever testes TDD para: criação de slots, trava de concorrência, trava de 7 dias, resumo financeiro

## 6. Domínio: Passageiros (Backend)

- [ ] 6.1 Criar endpoint `GET /reservas/{id}/passageiros` (LIDER proprietário ou ADMIN)
- [ ] 6.2 Criar endpoint `PATCH /passageiros/{id}` — Líder atualiza nome/documento de acompanhante (com trava de 7 dias)
- [ ] 6.3 Criar endpoint `GET /admin/viagens/{id}/exportar-passageiros` — lista passageiros com doc nulo → "PENDENTE", suporte a `?formato=csv|json`
- [ ] 6.4 Escrever testes TDD para: acesso restrito por reserva, trava de edição, exportação com PENDENTE

## 7. Frontend: Vitrine Pública (Next.js)

- [ ] 7.1 Configurar projeto Next.js com App Router e instalar dependências (axios, zustand ou context API)
- [ ] 7.2 Criar página `/` — lista de viagens com cards, badge "Últimas Vagas", botão desabilitado se ESGOTADO
- [ ] 7.3 Criar página `/viagens/[id]` — detalhe da viagem com descrição em Markdown e botão de reserva

## 8. Frontend: Autenticação (Next.js)

- [ ] 8.1 Criar página `/entrar` — formulário de login com redirect pós-auth
- [ ] 8.2 Criar página `/cadastro` — formulário de cadastro de Líder
- [ ] 8.3 Criar página `/esqueci-senha` — formulário para solicitar redefinição
- [ ] 8.4 Criar página `/redefinir-senha/[token]` — formulário de nova senha
- [ ] 8.5 Implementar middleware Next.js para proteção de rotas autenticadas

## 9. Frontend: Painel do Líder (Next.js)

- [ ] 9.1 Criar página `/lider/reservas` — lista de reservas do líder autenticado
- [ ] 9.2 Criar página `/lider/reservas/[id]` — detalhe da reserva com progresso e resumo financeiro (sinal, restante, por pessoa)
- [ ] 9.3 Criar componente de formulário de passageiro (nome + documento) para preenchimento de acompanhantes
- [ ] 9.4 Criar página `/acompanhante/[id]` — página pública de leitura com info da viagem e valor individual

## 10. Frontend: CRM Admin (Next.js)

- [ ] 10.1 Criar página `/admin` — home com lista de viagens e busca por texto
- [ ] 10.2 Criar página `/admin/viagens/[id]` — Kanban de reservas com colunas por status
- [ ] 10.3 Implementar componente Kanban com drag-and-drop ou ações de botão para mover cards entre colunas
- [ ] 10.4 Exibir substatus no card da reserva para coordenação entre admins
- [ ] 10.5 Implementar botão "Copiar Resumo WhatsApp" — chama API e copia texto para clipboard
- [ ] 10.6 Implementar botão "Exportar Passageiros" — baixa JSON/CSV dos passageiros da viagem
- [ ] 10.7 Criar formulário modal/inline para admin definir `valor_acordado` e alterar substatus

## 11. Qualidade e Validação Final

- [ ] 11.1 Garantir cobertura de testes TDD ≥ 80% nos casos de uso do backend
- [ ] 11.2 Validar funcionamento de `docker-compose up` do zero (fresh start)
- [ ] 11.3 Testar fluxo de e-mail completo via MailHog (solicitar → receber → redefinir)
- [ ] 11.4 Testar trava de concorrência com duas requisições simultâneas de BLOQUEADO
- [ ] 11.5 Validar exportação ANTT com passageiros com e sem documento

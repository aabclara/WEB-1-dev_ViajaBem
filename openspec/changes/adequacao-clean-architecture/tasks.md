## 1. Adequações do Clean Architecture (Backend)

- [x] 1.1 Criar uma classe abstrata/interface em `app/dominio/` para representar características e operações da IA, conforme design original.
- [x] 1.2 Transferir as regras de negócio intrínsecas (como cálculos de valores e verificação de lotação/status) dos roteadores e casos de uso diretamente para métodos nas `dataclasses` em `app/dominio/entidades.py`.
- [x] 1.3 Adaptar os Casos de Uso (`casos_uso/`) para chamarem os métodos de validação e modificação do estado presentes nas entidades enriquecidas.
- [x] 1.4 Remover quaisquer chamadas diretas ou referências de ORM/Banco (como `select`, `func`, `selectinload` do SQLAlchemy) dos controllers (`api/rotas/`) e encapsular a lógica de queries totalmente nos Repositórios (`repositorios/`).
- [x] 1.5 Refatorar os arquivos em `api/rotas/` para manterem-se enxutos, apenas delegando a requisição HTTP aos Casos de Uso.

## 2. Adequações do Frontend SPA e Clean Architecture

- [x] 2.1 Refatorar os principais endpoints do front (ex: `app/page.tsx`, `app/painel/page.tsx`) adicionando a diretiva `"use client"` e convertendo fetch no servidor (SSR) para chamadas dinâmicas pós-mount no navegador (SPA).
- [x] 2.2 Criar arquivos na camada de serviço do frontend (ex: `src/lib/services/apiClient.ts`) para isolar todas as chamadas HTTP e injetar as interfaces corretamente nos componentes UI, implementando uma divisão de camadas visando o Clean Architecture.
- [x] 2.3 Ajustar as requisições que retornam listas globais (como "Viagens Cadastradas") para suportarem e aplicarem limite (limit) e deslocamento (offset) gerenciados pelo componente no navegador.
- [x] 2.4 (Opcional - mas recomendável) Preparar os endpoints no Backend (FastAPI) em `/admin/viagens/` para aceitar os parâmetros de paginação requeridos pelo frontend.

## 3. Integração e Validação

- [x] 3.1 Revisar os testes automatizados do backend que eventualmente falharem por causa da forte modificação da injeção de repositórios e mudanças nos Casos de Uso.
- [x] 3.2 Executar os containers (`docker-compose up`) e testar manualmente a submissão de nova reserva e carregamento de listas no frontend, garantindo total conformidade no console do navegador e zero erros de vazamento de arquitetura.

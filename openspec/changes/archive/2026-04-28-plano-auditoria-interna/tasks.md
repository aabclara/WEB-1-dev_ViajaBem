## 1. Auditoria do Backend (FastAPI)

- [x] 1.1 Inspecionar a camada de domínio (`domain/`) para certificar que ela é rica e contém todas as regras e verificações do negócio.
- [x] 1.2 Buscar e validar a presença de uma classe abstrata que define as características da IA, conforme requisitado pelo modelo do projeto.
- [x] 1.3 Revisar os casos de uso (`use_cases/`) e os controladores (`controllers/` ou routers) para garantir que não há vazamento de lógica de domínio para estas camadas externas (Clean Architecture).
- [x] 1.4 Verificar todas as dependências e imports nas camadas superiores para confirmar que não existe acoplamento de repositórios com a lógica de negócio ou controllers.

## 2. Auditoria do Frontend (Next.js)

- [x] 2.1 Revisar a configuração e estrutura do Next.js para garantir que o projeto está operando com foco no navegador como o cliente principal da aplicação web (SPA).
- [x] 2.2 Rastrear as chamadas de rede no frontend (fetch/axios) para confirmar que as requisições saem do Next.js diretamente para o servidor FastAPI.
- [x] 2.3 Analisar a implementação de listas de dados para validar que a paginação é feita e controlada a partir do navegador.
- [x] 2.4 Verificar se os princípios do Clean Architecture estão sendo seguidos na organização e fluxo de dados dentro do frontend.

## 3. Consolidação de Resultados

- [x] 3.1 Registrar todos os achados (conformidades e não-conformidades).
- [x] 3.2 Gerar um relatório final com possíveis sugestões de refatoração para corrigir qualquer vazamento ou acoplamento encontrado.

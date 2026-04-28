## ADDED Requirements

### Requirement: Relatório de Auditoria Arquitetural Backend
A auditoria MUST gerar um checklist ou relatório validando as regras do Clean Architecture no backend.

#### Scenario: Validação de Domínio Rico e IA
- **WHEN** O auditor inspeciona a camada de domínio (`domain/`)
- **THEN** O domínio deve conter regras de negócio claras e uma classe abstrata definindo as características da IA, sem dependências externas.

#### Scenario: Validação de Vazamento e Acoplamento
- **WHEN** O auditor inspeciona `use_cases/`, `controllers/` ou equivalentes
- **THEN** Não deve haver lógica de negócio em controllers ou dependência direta/acoplamento a bibliotecas de repositório (ORM) fora da camada de repositório.

### Requirement: Relatório de Auditoria Arquitetural Frontend
A auditoria MUST verificar se o Next.js está sendo utilizado como uma SPA estrita.

#### Scenario: Requisições e Paginação
- **WHEN** O auditor inspeciona as chamadas de API no frontend e os componentes de lista
- **THEN** O Next.js deve realizar requisições diretamente para o servidor FastAPI, atuando apenas como cliente, e a paginação deve ser tratada como estado no navegador.

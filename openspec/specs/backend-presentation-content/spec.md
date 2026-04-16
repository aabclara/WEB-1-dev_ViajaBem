## ADDED Requirements

### Requirement: Detalhamento da Arquitetura
A apresentação deve conter uma visão clara da estrutura de diretórios e a responsabilidade de cada camada do backend.

#### Scenario: Visualização da Estrutura
- **WHEN** o usuário consultar a documentação de arquitetura
- **THEN** deve encontrar a explicação das pastas `api`, `core`, `infra` e `schemas`.

### Requirement: Explicação dos Modelos de Dados
Deve haver uma especificação detalhada de como as entidades se relacionam.

#### Scenario: Relacionamento entre Tabelas
- **WHEN** analisando o modelo `ReservaGrupo`
- **THEN** deve ser possível identificar suas chaves estrangeiras para `Viagem` e `Usuario` (Líder).

### Requirement: Fluxo de Autenticação
A especificação deve detalhar o uso de JWT e Bcrypt.

#### Scenario: Login do Usuário
- **WHEN** as credenciais são validadas
- **THEN** um token JWT com as claims `sub`, `email` e `tipo` deve ser gerado.

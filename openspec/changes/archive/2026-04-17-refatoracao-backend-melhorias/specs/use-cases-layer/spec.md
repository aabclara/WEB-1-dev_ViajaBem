## ADDED Requirements

### Requirement: Deslocamento das lógicas de validação de negócios para Casos de Uso
O sistema MUST delegar todas as validações estruturais pesadas, tais como limite de assentos disponíveis e tolerância de tempo, aos serviços declarados sob a camada de `casos_uso`, eximindo os roteadores/endpoints (`app/api/rotas`) dessas obrigações.

#### Scenario: Rota com ação de negócio sendo processada
- **WHEN** a rota de API correspondente a criação ou verificação receber o payload de HTTP request.
- **THEN** a lógica repassada MUST ser executada por um Caso de Uso instanciado a partir do controlador de injeção de dependências (`Depends`).

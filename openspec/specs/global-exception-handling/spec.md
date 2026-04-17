## ADDED Requirements

### Requirement: Centralização Lógica de Captura de Erros
O `main.py` MUST definir handlers de exceção registrando mapeadores (globais) para exceções de Domínio puras (em formato `.add_exception_handler()`). 

#### Scenario: Disparo de falha funcional
- **WHEN** um serviço interno processar um erro e laçar propositalmente uma exceção em `raise ExceptionDeDominio` em vez de um `HTTPException()`.
- **THEN** o middleware/handler MUST traduzir automaticamente para o código HTTP apropriado contendo a payload amigável ao usuário.

### Requirement: Definição de Exceções Próprias
O sistema MUST expor, na pasta de núcleo (`core/excecoes.py` ou `dominio/excecoes.py`), exceções auto-explicativas que não invocam dependências diretas de bibliotecas externas Web.

#### Scenario: Refatoração de Erro Existente
- **WHEN** encontrarmos retornos estáticos `status_code=400` com erro de reserva esgotada na API.
- **THEN** alteramos para lançamento de `ReservaLotadaException`.

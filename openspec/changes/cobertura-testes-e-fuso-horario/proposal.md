# Proposal: Cobertura de Testes e Fuso Horário

## Why

Aumentar a confiabilidade do projeto através do monitoramento da cobertura de testes e garantir que todas as operações com datas e horários utilizem o fuso horário oficial de Brasília (`America/Sao_Paulo`), evitando inconsistências em reservas e logs.

## What Changes

- **Cobertura de Testes**: Instalação do `pytest-cov` e configuração para gerar relatórios de cobertura.
- **Fuso Horário**: Configuração global do backend (FastAPI, SQLAlchemy e Pydantic) para utilizar o timezone `America/Sao_Paulo`.
- **Scripts**: Adição de comandos no container para facilitar a execução dos testes com relatório de cobertura.

## Impact

- **Backend**: Mudança na forma como `datetime.now()` e objetos de data são manipulados (deve-se usar sempre timezone-aware).
- **Dependências**: Adição de `pytest-cov` e possivelmente `tzdata` no backend.
- **Banco de Dados**: Garantir que as colunas com timezone reflitam o fuso correto.

## Requirement Changes

- N/A (Novos requisitos técnicos internos)

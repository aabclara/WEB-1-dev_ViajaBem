# Design: Cobertura de Testes e Fuso Horário

Este documento descreve as decisões técnicas para a implementação de relatórios de cobertura e a padronização do fuso horário na aplicação "Viaje Bem".

## Context

Atualmente, a aplicação utiliza o fuso horário padrão do sistema (que pode variar entre UTC em containers e local na máquina do desenvolvedor). Além disso, não há uma forma visual de acompanhar quais partes do código estão sendo exercitadas pelos testes automatizados.

## Goals / Non-Goals

**Goals:**
- Unificar o fuso horário em `America/Sao_Paulo` para todas as datas e horários da aplicação.
- Integrar `pytest-cov` para gerar relatórios detalhados de cobertura de testes.
- Garantir que objetos `datetime` sejam "timezone-aware".

**Non-Goals:**
- Mudar a lógica de persistência de datas já existentes (apenas garantir que novas datas e leituras respeitem o fuso).

## Decisions

### 1. Fuso Horário (Timezone)
- **Biblioteca**: Utilizaremos a biblioteca padrão `zoneinfo` (Python 3.12) para gerenciar o fuso `America/Sao_Paulo`.
- **Configuração Global**: Centralizar o fuso em `app/core/configuracao.py` através da variável `TIMEZONE`.
- **Manipulação**: Substituir chamadas de `datetime.now()` ou `datetime.utcnow()` por uma função helper que garanta o fuso correto.
- **Banco de Dados**: Manter as colunas do PostgreSQL como `TIMESTAMP WITH TIME ZONE`. O SQLAlchemy deve ser configurado para converter automaticamente entre o fuso local e UTC na persistência.

### 2. Cobertura de Testes
- **Ferramenta**: `pytest-cov`.
- **Relatórios**:
    - **Terminal**: Resumo das porcentagens por arquivo.
    - **HTML**: Relatório detalhado gerado na pasta `htmlcov/` para inspeção visual.
- **Configuração**: Definida no arquivo `backend/pytest.ini` via parâmetro `addopts`.

## Risks / Trade-offs

- **Compatibilidade SQLite**: O SQLite lida com timezones de forma limitada. Os testes podem precisar de adaptação para garantir que as comparações de data ignorem microssegundos ou lidem com strings ISO8601 corretamente.
- **Relatório de Cobertura em Docker**: A pasta `htmlcov/` deve ser mapeada em um volume se o usuário desejar visualizá-la fora do container.

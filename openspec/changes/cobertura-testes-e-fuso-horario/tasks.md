# Tasks: Cobertura de Testes e Fuso Horário

## 1. Dependências e Configuração Global

- [ ] 1.1 Adicionar `pytest-cov`, `tzdata` e `pytz` ao `backend/requirements.txt`.
- [ ] 1.2 Definir `TIMEZONE = "America/Sao_Paulo"` em `backend/app/core/configuracao.py`.
- [ ] 1.3 Criar helper em `backend/app/core/seguranca.py` (ou core/utils) para obter data/hora local atualizada.

## 2. Ajuste nos Modelos e Banco de Dados

- [ ] 2.1 Verificar em `backend/app/infra/modelos.py` se todos os campos `DateTime` possuem `timezone=True`.
- [ ] 2.2 Reconstruir o banco de dados de teste (nos containers) para garantir que as alterações de tipo de coluna (se houver) sejam aplicadas.

## 3. Configuração do Pytest

- [ ] 3.1 Adicionar configuração de cobertura ao `backend/pytest.ini`: `--cov=app --cov-report=term-missing --cov-report=html`.
- [ ] 3.2 Garantir que a pasta `htmlcov/` seja ignorada no `.gitignore`.

## 4. Validação e Relatórios

- [ ] 4.1 Executar os testes no container e verificar se o relatório terminal mostra a cobertura.
- [ ] 4.2 Verificar se as datas retornadas pela API refletem o fuso horário de Brasília.

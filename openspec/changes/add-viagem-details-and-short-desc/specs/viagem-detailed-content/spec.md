## ADDED Requirements

### Requirement: Dynamic Trip Inclusions
O sistema deve permitir o armazenamento de uma lista ou texto descrevendo o que está incluso no pacote de viagem (ex: "Seguro, Guia, Transporte").

#### Scenario: Visualização de Itens Inclusos
- **WHEN** um usuário acessa os detalhes de uma viagem.
- **THEN** o sistema deve exibir os itens inclusos cadastrados especificamente para aquela viagem.

### Requirement: Trip Short Description
O sistema deve permitir o armazenamento de uma descrição breve (resumo) para cada viagem.

#### Scenario: Visualização de Resumo na Listagem
- **WHEN** um usuário visualiza a lista de viagens na Home.
- **THEN** o sistema deve exibir a descrição curta de cada viagem abaixo do título.

# Spec: Inicialização Técnica do Frontend

## Added Requirements

### Requirement: Ambiente de Build Funcional
O frontend deve ser capaz de ser compilado e executado dentro de um container Docker sem erros de dependências.

#### Scenario: Build com dependências corretas
- **WHEN** o comando `npm run dev` (ou `npm ci`) é executado no diretório `frontend/`
- **THEN** o processo deve ser concluído com sucesso e o servidor Next.js deve iniciar na porta 3000

---

### Requirement: Configuração de Estilo e Ícones
O projeto deve utilizar Tailwind CSS para estilização e Lucide React para ícones, conforme as diretivas do projeto.

#### Scenario: Tailwind CSS ativo
- **WHEN** uma classe Utilitária do Tailwind (ex: `flex`, `bg-blue-500`) é aplicada em um componente
- **THEN** o estilo correspondente deve ser renderizado no navegador

#### Scenario: Ícones Lucide visíveis
- **WHEN** um componente da biblioteca `lucide-react` (ex: `<Bus />`) é utilizado
- **THEN** o ícone deve ser exibido corretamente sem emojis

---

### Requirement: Linguagem Ubíqua em Português
Todo o conteúdo visível ao usuário e os nomes de componentes internos devem seguir o idioma definido.

#### Scenario: Conteúdo da Vitrine em Português
- **WHEN** a página inicial (`/`) é carregada
- **THEN** o título principal deve ser "Viaje Bem" e as descrições devem estar em Português do Brasil

#### Scenario: Nomenclatura de Código
- **WHEN** um novo componente é criado (ex: `CardViagem`)
- **THEN** o nome do arquivo e da função exportada devem estar em Português

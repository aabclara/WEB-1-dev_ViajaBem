# Spec: Autenticação e Autorização

## Added Requirements

### Requirement: Cadastro de Usuário
Novos usuários podem se cadastrar com e-mail, senha, nome, CPF, telefone e data de nascimento. O sistema é multi-papel: `LIDER` e `ADMIN`.

#### Scenario: Cadastro de Líder maior de idade
- **WHEN** um usuário se cadastra com tipo `LIDER` e data_nascimento que resulta em ≥ 18 anos
- **THEN** o cadastro é criado com sucesso e retorna 201

#### Scenario: Bloqueio de Líder menor de idade
- **WHEN** um usuário tenta se cadastrar com tipo `LIDER` e data_nascimento que resulta em < 18 anos
- **THEN** retorna 422 com mensagem "Líderes devem ter pelo menos 18 anos"

#### Scenario: E-mail duplicado
- **WHEN** um usuário tenta se cadastrar com e-mail já existente
- **THEN** retorna 409 com mensagem de conflito

#### Scenario: CPF duplicado
- **WHEN** um usuário tenta se cadastrar com CPF já existente
- **THEN** retorna 409 com mensagem de conflito

---

### Requirement: Login JWT
Usuários autenticados recebem um token JWT contendo `id`, `email` e `tipo`.

#### Scenario: Login com credenciais válidas
- **WHEN** o usuário envia e-mail e senha corretos para `POST /auth/login`
- **THEN** retorna 200 com `access_token` e `token_type: bearer`

#### Scenario: Login com senha inválida
- **WHEN** o usuário envia senha incorreta
- **THEN** retorna 401 com mensagem "Credenciais inválidas"

---

### Requirement: Controle de Acesso por Papel (RBAC)
Rotas protegidas verificam o campo `tipo` no JWT.

#### Scenario: ADMIN acessa rota de admin
- **WHEN** um ADMIN faz requisição em rota `/admin/*` com token válido
- **THEN** retorna 200

#### Scenario: LIDER tenta acessar rota de admin
- **WHEN** um LIDER faz requisição em rota `/admin/*`
- **THEN** retorna 403 com mensagem "Acesso negado"

---

### Requirement: Seed do Primeiro ADMIN
Na inicialização, se não existir nenhum usuário ADMIN, o sistema cria automaticamente um com credenciais definidas via variáveis de ambiente.

#### Scenario: Seed na inicialização sem admin
- **WHEN** a aplicação inicia e não há nenhum usuário com tipo `ADMIN` no banco
- **THEN** um usuário ADMIN é criado automaticamente com e-mail e senha das env vars

#### Scenario: Sem seed se já existe ADMIN
- **WHEN** a aplicação inicia e já existe pelo menos um ADMIN
- **THEN** nenhum novo usuário é criado

---

### Requirement: Fluxo "Esqueci minha Senha"
Usuário solicita redefinição de senha via e-mail. Um token de uso único com expiração de 1 hora é enviado.

#### Scenario: Solicitar redefinição
- **WHEN** usuário envia `POST /auth/esqueci-senha` com e-mail cadastrado
- **THEN** retorna 200 e um e-mail com link de redefinição é enviado via SMTP (MailHog em dev)

#### Scenario: Token expirado
- **WHEN** usuário tenta redefinir senha com token expirado (> 1h)
- **THEN** retorna 400 com mensagem "Token expirado ou inválido"

#### Scenario: E-mail não cadastrado (segurança)
- **WHEN** usuário envia e-mail não cadastrado
- **THEN** retorna 200 (sem revelar se o e-mail existe no sistema)

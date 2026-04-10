# Spec: Login Schema Adjustment

## Added Requirements

### Requirement: Enhanced Login Response Body
The login response body MUST include the user's name, email, and type in addition to the access token.

#### Scenario: Successful Admin Login
- **WHEN** an Admin user logs in with valid credentials
- **THEN** the response body MUST contain `access_token`, `nome`, `email`, and `tipo` as "ADMIN"

#### Scenario: Successful Lider Login
- **WHEN** a Lider user logs in with valid credentials
- **THEN** the response body MUST contain `access_token`, `nome`, `email`, and `tipo` as "LIDER"

#### Scenario: Schema Validation
- **WHEN** the login endpoint returns a response
- **THEN** the fields `nome`, `email`, and `tipo` MUST NOT be null

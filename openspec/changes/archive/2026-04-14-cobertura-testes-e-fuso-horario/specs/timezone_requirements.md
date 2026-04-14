# Spec: Timezone Requirements

## Added Requirements

### Requirement: Local Timezone Consistency
The application MUST record and display all user-facing dates and times using the `America/Sao_Paulo` timezone by default.

#### Scenario: Data Persistence
- **WHEN** a record is created (e.g., `criado_em`)
- **THEN** it MUST be stored in the database with timezone information (UTC recommended for storage, but interpreted as SP time for display)

#### Scenario: API Response
- **WHEN** an API response contains a date or time field
- **THEN** it MUST include timezone offset or be in the configured local timezone string format

#### Scenario: Validation
- **WHEN** a date is received from the frontend
- **THEN** it MUST be interpreted according to the application's configured timezone if not specified.

### Requirement: Test Coverage Visibility
The development environment MUST provide a way to verify the extent of automated test execution across the backend codebase.

#### Scenario: Coverage Reporting
- **WHEN** running the full test suite
- **THEN** a coverage report (HTML or Terminal) MUST be generated showing line-by-line coverage for the `app/` directory.

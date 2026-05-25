export class CredenciaisInvalidasError extends Error {
  constructor() {
    super('Credenciais inválidas. Verifique seu email e senha.')
    this.name = 'CredenciaisInvalidasError'
  }
}

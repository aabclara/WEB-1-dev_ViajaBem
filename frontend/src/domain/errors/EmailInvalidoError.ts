export class EmailInvalidoError extends Error {
  constructor(email: string) {
    super(`Email inválido: "${email}". Um endereço de email válido deve conter "@".`)
    this.name = 'EmailInvalidoError'
  }
}

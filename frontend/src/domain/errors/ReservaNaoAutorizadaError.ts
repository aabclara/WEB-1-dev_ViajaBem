export class ReservaNaoAutorizadaError extends Error {
  constructor(motivo: string) {
    super(`Reserva não autorizada: ${motivo}`)
    this.name = 'ReservaNaoAutorizadaError'
  }
}

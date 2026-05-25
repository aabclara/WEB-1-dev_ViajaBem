export class ViagemNaoEncontradaError extends Error {
  constructor(id: number) {
    super(`Viagem com id ${id} não foi encontrada.`)
    this.name = 'ViagemNaoEncontradaError'
  }
}

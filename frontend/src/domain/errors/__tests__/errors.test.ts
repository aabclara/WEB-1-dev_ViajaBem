import { describe, it, expect } from 'vitest'
import { EmailInvalidoError } from '../EmailInvalidoError'
import { ViagemNaoEncontradaError } from '../ViagemNaoEncontradaError'
import { ReservaNaoAutorizadaError } from '../ReservaNaoAutorizadaError'
import { CredenciaisInvalidasError } from '../CredenciaisInvalidasError'

describe('Erros de Domínio', () => {
  it('EmailInvalidoError é instância de Error e tem nome correto', () => {
    const err = new EmailInvalidoError('invalido')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('EmailInvalidoError')
    expect(err.message).toContain('invalido')
  })

  it('ViagemNaoEncontradaError contém o id da viagem na mensagem', () => {
    const err = new ViagemNaoEncontradaError(42)
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('ViagemNaoEncontradaError')
    expect(err.message).toContain('42')
  })

  it('ReservaNaoAutorizadaError é instância de Error', () => {
    const err = new ReservaNaoAutorizadaError('viagem esgotada')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('ReservaNaoAutorizadaError')
    expect(err.message).toContain('viagem esgotada')
  })

  it('CredenciaisInvalidasError é instância de Error', () => {
    const err = new CredenciaisInvalidasError()
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('CredenciaisInvalidasError')
  })
})

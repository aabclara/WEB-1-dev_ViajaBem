import { describe, it, expect } from 'vitest'
import { Email } from '../Email'
import { EmailInvalidoError } from '../../errors/EmailInvalidoError'

describe('Email — create()', () => {
  it('retorna instância válida com email correto', () => {
    const email = Email.create('Usuario@Example.com')
    expect(email.value).toBe('usuario@example.com')
  })

  it('normaliza para lowercase', () => {
    const email = Email.create('TESTE@DOMINIO.COM')
    expect(email.value).toBe('teste@dominio.com')
  })

  it('lança EmailInvalidoError sem o caractere @', () => {
    expect(() => Email.create('invalido')).toThrow(EmailInvalidoError)
  })

  it('lança EmailInvalidoError com string vazia', () => {
    expect(() => Email.create('')).toThrow(EmailInvalidoError)
  })

  it('instâncias diferentes com mesmo valor são iguais em valor', () => {
    const email1 = Email.create('user@example.com')
    const email2 = Email.create('user@example.com')
    expect(email1.value).toBe(email2.value)
  })
})

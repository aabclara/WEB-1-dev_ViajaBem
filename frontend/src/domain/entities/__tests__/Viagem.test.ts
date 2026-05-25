import { describe, it, expect } from 'vitest'
import { Viagem } from '../Viagem'
import { StatusViagem } from '../../value-objects/StatusViagem'

function makeViagem(overrides: Partial<{ vagasTotais: number; vagasDisponiveis: number; status: StatusViagem }> = {}): Viagem {
  return new Viagem({
    id: 1,
    titulo: 'Viagem Teste',
    descricaoPrecos: '350',
    dataPartida: '2026-07-01',
    vagasTotais: overrides.vagasTotais ?? 40,
    status: overrides.status ?? StatusViagem.ATIVO,
    vagasDisponiveis: overrides.vagasDisponiveis ?? 20,
  })
}

describe('Viagem — percentualOcupacao', () => {
  it('calcula corretamente com 50% de ocupação', () => {
    const viagem = makeViagem({ vagasTotais: 40, vagasDisponiveis: 20 })
    expect(viagem.percentualOcupacao).toBe(50)
  })

  it('retorna 0 quando vagasTotais é 0', () => {
    const viagem = makeViagem({ vagasTotais: 0, vagasDisponiveis: 0 })
    expect(viagem.percentualOcupacao).toBe(0)
  })

  it('retorna 75 quando 30 de 40 vagas estão ocupadas', () => {
    const viagem = makeViagem({ vagasTotais: 40, vagasDisponiveis: 10 })
    expect(viagem.percentualOcupacao).toBe(75)
  })
})

describe('Viagem — ultimasVagas', () => {
  it('retorna true quando vagas disponíveis são 10% ou menos do total', () => {
    const viagem = makeViagem({ vagasTotais: 40, vagasDisponiveis: 4 })
    expect(viagem.ultimasVagas).toBe(true)
  })

  it('retorna false quando há vagas suficientes', () => {
    const viagem = makeViagem({ vagasTotais: 40, vagasDisponiveis: 20 })
    expect(viagem.ultimasVagas).toBe(false)
  })
})

describe('Viagem — estaEsgotada', () => {
  it('retorna true quando vagasDisponiveis é 0', () => {
    const viagem = makeViagem({ vagasDisponiveis: 0 })
    expect(viagem.estaEsgotada).toBe(true)
  })

  it('retorna true quando status é ESGOTADO', () => {
    const viagem = makeViagem({ status: StatusViagem.ESGOTADO, vagasDisponiveis: 5 })
    expect(viagem.estaEsgotada).toBe(true)
  })

  it('retorna false quando há vagas disponíveis e status é ATIVO', () => {
    const viagem = makeViagem({ vagasDisponiveis: 10, status: StatusViagem.ATIVO })
    expect(viagem.estaEsgotada).toBe(false)
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CriarReservaUseCase } from '../CriarReservaUseCase'
import { IReservaRepository } from '../../../domain/repositories/IReservaRepository'
import { IViagemRepository } from '../../../domain/repositories/IViagemRepository'
import { Viagem } from '../../../domain/entities/Viagem'
import { Reserva } from '../../../domain/entities/Reserva'
import { StatusViagem } from '../../../domain/value-objects/StatusViagem'
import { StatusReserva } from '../../../domain/value-objects/StatusReserva'
import { ReservaNaoAutorizadaError } from '../../../domain/errors/ReservaNaoAutorizadaError'

function makeViagemMock(vagasDisponiveis: number, status: StatusViagem = StatusViagem.ATIVO): Viagem {
  return new Viagem({ id: 1, titulo: 'Teste', descricaoPrecos: '200', dataPartida: '2026-08-01', vagasTotais: 40, status, vagasDisponiveis })
}

const reservaMock = new Reserva({ id: 10, idViagem: 1, tituloViagem: 'Teste', dataPartidaViagem: '2026-08-01', qtdVagas: 2, status: StatusReserva.SOLICITADO })

describe('CriarReservaUseCase', () => {
  let mockReservaRepo: IReservaRepository
  let mockViagemRepo: IViagemRepository

  beforeEach(() => {
    mockReservaRepo = { 
      criar: vi.fn().mockResolvedValue(reservaMock),
      listarMinhas: vi.fn(),
      buscarPorId: vi.fn(),
      atualizar: vi.fn(),
      atualizarPassageiro: vi.fn(), 
    }
    mockViagemRepo = { listarTodas: vi.fn(), buscarPorId: vi.fn(), criar: vi.fn(), listarAdmin: vi.fn() }
  })

  it('cria reserva com sucesso quando há vagas disponíveis', async () => {
    vi.mocked(mockViagemRepo.buscarPorId).mockResolvedValue(makeViagemMock(20))
    const useCase = new CriarReservaUseCase(mockReservaRepo, mockViagemRepo)
    const resultado = await useCase.execute({ idViagem: 1, qtdVagas: 2 })

    expect(resultado.id).toBe(10)
    expect(mockReservaRepo.criar).toHaveBeenCalledOnce()
  })

  it('lança ReservaNaoAutorizadaError quando viagem está esgotada', async () => {
    vi.mocked(mockViagemRepo.buscarPorId).mockResolvedValue(makeViagemMock(0, StatusViagem.ESGOTADO))
    const useCase = new CriarReservaUseCase(mockReservaRepo, mockViagemRepo)

    await expect(useCase.execute({ idViagem: 1, qtdVagas: 1 })).rejects.toThrow(ReservaNaoAutorizadaError)
  })

  it('lança ReservaNaoAutorizadaError quando qtdVagas supera disponíveis', async () => {
    vi.mocked(mockViagemRepo.buscarPorId).mockResolvedValue(makeViagemMock(1))
    const useCase = new CriarReservaUseCase(mockReservaRepo, mockViagemRepo)

    await expect(useCase.execute({ idViagem: 1, qtdVagas: 5 })).rejects.toThrow(ReservaNaoAutorizadaError)
  })
})

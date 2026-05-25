import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListarViagensUseCase } from '../ListarViagensUseCase'
import { IViagemRepository } from '../../../domain/repositories/IViagemRepository'
import { Viagem } from '../../../domain/entities/Viagem'
import { StatusViagem } from '../../../domain/value-objects/StatusViagem'

const viagemMock = new Viagem({
  id: 1,
  titulo: 'Arraial do Cabo',
  descricaoPrecos: '350',
  dataPartida: '2026-08-01',
  vagasTotais: 40,
  status: StatusViagem.ATIVO,
  vagasDisponiveis: 30,
})

function makeMockRepository(): IViagemRepository {
  return {
    listarTodas: vi.fn().mockResolvedValue([viagemMock]),
    buscarPorId: vi.fn(),
    criar: vi.fn(),
    listarAdmin: vi.fn(),
  }
}

describe('ListarViagensUseCase', () => {
  let mockRepo: IViagemRepository

  beforeEach(() => {
    mockRepo = makeMockRepository()
  })

  it('retorna lista de viagens do repositório mockado', async () => {
    const useCase = new ListarViagensUseCase(mockRepo)
    const resultado = await useCase.execute()

    expect(resultado).toHaveLength(1)
    expect(resultado[0].titulo).toBe('Arraial do Cabo')
  })

  it('chama listarTodas exatamente uma vez', async () => {
    const useCase = new ListarViagensUseCase(mockRepo)
    await useCase.execute()

    expect(mockRepo.listarTodas).toHaveBeenCalledTimes(1)
  })

  it('retorna lista vazia quando repositório não tem viagens', async () => {
    vi.mocked(mockRepo.listarTodas).mockResolvedValue([])
    const useCase = new ListarViagensUseCase(mockRepo)
    const resultado = await useCase.execute()

    expect(resultado).toHaveLength(0)
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginUseCase } from '../LoginUseCase'
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository'
import { ITokenStorage } from '../../../domain/repositories/ITokenStorage'
import { Usuario } from '../../../domain/entities/Usuario'
import { CredenciaisInvalidasError } from '../../../domain/errors/CredenciaisInvalidasError'

const usuarioMock = new Usuario({ id: 1, nome: 'Maria Silva', email: 'maria@email.com', tipo: 'LIDER' })

describe('LoginUseCase', () => {
  let mockAuthRepo: IAuthRepository
  let mockTokenStorage: ITokenStorage

  beforeEach(() => {
    mockAuthRepo = {
      login: vi.fn().mockResolvedValue({ accessToken: 'token-abc', usuario: usuarioMock }),
      cadastrar: vi.fn(),
      buscarPerfil: vi.fn(),
      atualizarPerfil: vi.fn(),
    }
    mockTokenStorage = {
      save: vi.fn(),
      getToken: vi.fn().mockReturnValue(null),
      getUser: vi.fn().mockReturnValue(null),
      remove: vi.fn(),
    }
  })

  it('executa com sucesso e persiste o token no storage', async () => {
    const useCase = new LoginUseCase(mockAuthRepo, mockTokenStorage)
    const resultado = await useCase.execute({ email: 'maria@email.com', senha: '123456' })

    expect(resultado.accessToken).toBe('token-abc')
    expect(mockTokenStorage.save).toHaveBeenCalledOnce()
    expect(mockTokenStorage.save).toHaveBeenCalledWith('token-abc', expect.objectContaining({ email: 'maria@email.com' }))
  })

  it('lança CredenciaisInvalidasError quando repositório falha', async () => {
    vi.mocked(mockAuthRepo.login).mockRejectedValue(new Error('Unauthorized'))
    const useCase = new LoginUseCase(mockAuthRepo, mockTokenStorage)

    await expect(useCase.execute({ email: 'errado@email.com', senha: 'errado' })).rejects.toThrow(CredenciaisInvalidasError)
    expect(mockTokenStorage.save).not.toHaveBeenCalled()
  })
})

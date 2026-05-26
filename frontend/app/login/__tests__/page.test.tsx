import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '../page'
import { loginUseCase } from '@/src/infrastructure/di/container'

// Mockamos apenas a Injeção de Dependência do Caso de Uso
// Assim, o componente E o custom hook (useLogin) são testados em integração real!
vi.mock('@/src/infrastructure/di/container', () => ({
  loginUseCase: {
    execute: vi.fn(),
  }
}))

describe('LoginPage (Integração de UI)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar os inputs e o botão corretamente', () => {
    render(<LoginPage />)
    
    // Verifica a presença dos elementos na tela
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('deve chamar o loginUseCase ao preencher e submeter o formulário', async () => {
    // Simulamos a resposta de sucesso do caso de uso
    vi.mocked(loginUseCase.execute).mockResolvedValueOnce({ 
      accessToken: 'token-valido-123', 
      usuario: { id: 1, nome: 'Maria', email: 'maria@email.com', tipo: 'CLIENTE', apelido: null } 
    } as any)

    // Precisamos mockar o window.location para o redirecionamento pós-login não falhar no JSDOM
    const originalLocation = window.location
    delete (window as any).location
    window.location = { ...originalLocation, href: '' }

    render(<LoginPage />)

    // Capturando os elementos
    const emailInput = screen.getByLabelText(/E-mail/i)
    const senhaInput = screen.getByLabelText(/Senha/i)
    const submitBtn = screen.getByRole('button', { name: /entrar/i })

    // Comportamento real do usuário: preenchendo os campos
    fireEvent.change(emailInput, { target: { value: 'maria@email.com' } })
    fireEvent.change(senhaInput, { target: { value: '123456' } })
    
    // Submetendo o form
    fireEvent.click(submitBtn)

    // A asserção verifica se a UI fez a ponte corretamente até a infraestrutura
    await waitFor(() => {
      expect(loginUseCase.execute).toHaveBeenCalledWith({
        email: 'maria@email.com',
        senha: '123456'
      })
    })

    // Restaura o objeto original do navegador
    window.location = originalLocation
  })

  it('deve exibir mensagem de erro na UI quando o login falha', async () => {
    // Simulamos uma rejeição (ex: credenciais inválidas)
    vi.mocked(loginUseCase.execute).mockRejectedValueOnce(new Error('Credenciais inválidas'))

    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'errado@email.com' } })
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'errado' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    // Verifica se a mensagem de erro apareceu no DOM para o usuário ver
    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
    })
  })
})

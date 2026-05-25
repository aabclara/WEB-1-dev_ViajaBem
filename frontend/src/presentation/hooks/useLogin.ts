'use client'

import { useState, useCallback } from 'react'
import { loginUseCase } from '../../infrastructure/di/container'

export function useLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      await loginUseCase.execute({ email, senha })
      window.location.href = '/painel'
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha ao entrar')
    } finally {
      setCarregando(false)
    }
  }, [email, senha])

  return { email, setEmail, senha, setSenha, mostrarSenha, setMostrarSenha, erro, carregando, handleSubmit }
}

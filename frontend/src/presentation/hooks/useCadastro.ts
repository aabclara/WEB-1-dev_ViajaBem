'use client'

import { useState, useCallback } from 'react'
import { httpClient, tokenStorage } from '../../infrastructure/di/container'

interface CadastroForm {
  nome: string
  email: string
  senha: string
  cpf: string
  telefone: string
  data_nascimento: string
}

export function useCadastro() {
  const [formData, setFormData] = useState<CadastroForm>({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    telefone: '',
    data_nascimento: '',
  })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      // 1. Cadastrar
      await httpClient.post('/auth/cadastro', tokenStorage, {
        ...formData,
        tipo: 'LIDER',
      })

      // 2. Login automático
      const loginParams = new URLSearchParams()
      loginParams.append('username', formData.email)
      loginParams.append('password', formData.senha)

      interface LoginApiResponse {
        access_token: string
        id: number
        nome: string
        apelido?: string
        email: string
        tipo: string
      }

      try {
        const dataLogin = await httpClient.postForm<LoginApiResponse>('/auth/login', loginParams)
        tokenStorage.save(dataLogin.access_token, {
          id: dataLogin.id,
          nome: dataLogin.nome,
          apelido: dataLogin.apelido,
          email: dataLogin.email,
          tipo: dataLogin.tipo,
        })
        const params = new URLSearchParams(window.location.search)
        const redirectUrl = params.get('redirect')
        window.location.href = redirectUrl ? decodeURIComponent(redirectUrl) : '/painel'
      } catch {
        const params = new URLSearchParams(window.location.search)
        const redirectUrl = params.get('redirect')
        const redirectSuffix = redirectUrl ? `&redirect=${encodeURIComponent(redirectUrl)}` : ''
        window.location.href = `/login?msg=cadastro_ok${redirectSuffix}`
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao realizar cadastro')
      setCarregando(false)
    }
  }, [formData])

  return { formData, handleChange, mostrarSenha, setMostrarSenha, erro, carregando, handleSubmit }
}

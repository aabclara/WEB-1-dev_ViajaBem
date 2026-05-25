import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { buscarPerfilUseCase, atualizarPerfilUseCase, tokenStorage } from '../../infrastructure/di/container'

export function usePerfil() {
  const router = useRouter()
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [msgSucesso, setMsgSucesso] = useState('')
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    nome: '',
    apelido: '',
    email: '',
    cpf: '',
    telefone: '',
    data_nascimento: '',
    tipo: '',
    senha: '',
  })

  useEffect(() => {
    const userStr = tokenStorage.getUser()
    if (!userStr) {
      router.push('/login')
      return
    }

    const carregarPerfil = async () => {
      try {
        const data = await buscarPerfilUseCase.execute()
        setForm({
          nome: data.nome || '',
          apelido: data.apelido || '',
          email: data.email || '',
          cpf: data.cpf || '',
          telefone: data.telefone || '',
          data_nascimento: data.data_nascimento || '',
          tipo: data.tipo || '',
          senha: '',
        })
      } catch (err: any) {
        setErro('Não foi possível carregar o perfil.')
      } finally {
        setCarregando(false)
      }
    }

    carregarPerfil()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setErro('')
    setMsgSucesso('')

    try {
      const payload: any = {
        nome: form.nome,
        apelido: form.apelido,
        telefone: form.telefone,
      }
      if (form.senha.trim()) {
        payload.senha = form.senha
      }

      await atualizarPerfilUseCase.execute(payload)
      setMsgSucesso('Perfil atualizado com sucesso!')
      
      // Atualizar no local storage
      const currentUser = tokenStorage.getUser() as any
      if (currentUser) {
        let mudouHeader = false
        if (currentUser.nome !== form.nome) {
          currentUser.nome = form.nome
          mudouHeader = true
        }
        if (currentUser.apelido !== form.apelido) {
          currentUser.apelido = form.apelido
          mudouHeader = true
        }
        if (mudouHeader) {
          const currentToken = tokenStorage.getToken() || ''
          tokenStorage.save(currentToken, currentUser)
        }
        
        setForm((prev) => ({ ...prev, senha: '' }))
        
        if (mudouHeader) {
          window.location.reload()
        } else {
          setTimeout(() => {
            setMsgSucesso('')
          }, 3000)
        }
      }
    } catch (err: any) {
      setErro(err.message || 'Erro ao salvar alterações')
    } finally {
      setSalvando(false)
    }
  }

  return {
    form, setForm,
    carregando,
    salvando,
    msgSucesso,
    erro,
    handleSubmit,
    router
  }
}

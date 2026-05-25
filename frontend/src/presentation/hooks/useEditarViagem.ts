import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { httpClient, tokenStorage } from '../../infrastructure/di/container'

export function useEditarViagem(id: string) {
  const router = useRouter()
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [msgSucesso, setMsgSucesso] = useState('')
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    titulo: '',
    descricao_precos: '',
    data_partida: '',
    data_retorno: '',
    vagas_totais: 0,
    descricao_curta: '',
    itens_inclusos: '',
    status: 'ATIVO',
    url_capa: ''
  })

  useEffect(() => {
    const rawUser = tokenStorage.getUser()
    if (!rawUser || rawUser.tipo !== 'ADMIN') {
      router.push('/painel')
      return
    }

    const carregarViagem = async () => {
      try {
        const data = await httpClient.get<any>(`/viagens/${id}`, tokenStorage)
        setForm({
          titulo: data.titulo,
          descricao_precos: data.descricao_precos || '',
          data_partida: data.data_partida,
          vagas_totais: data.vagas_totais,
          descricao_curta: data.descricao_curta || '',
          itens_inclusos: data.itens_inclusos || '',
          status: data.status,
          data_retorno: data.data_retorno || '',
          url_capa: data.url_capa || ''
        })
      } catch (err: any) {
        setErro(err.message || 'Falha ao carregar dados da viagem')
      } finally {
        setCarregando(false)
      }
    }

    carregarViagem()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setErro('')

    try {
      await httpClient.patch(`/admin/viagens/${id}`, tokenStorage, form)
      setMsgSucesso('Alterações salvas com sucesso!')
      setTimeout(() => {
        router.push(`/painel/kanban/${id}`)
      }, 1500)
    } catch (err: any) {
      setErro(err.message || 'Erro ao salvar alterações')
    } finally {
      setSalvando(false)
    }
  }

  return { form, setForm, carregando, salvando, msgSucesso, erro, handleSubmit, router }
}

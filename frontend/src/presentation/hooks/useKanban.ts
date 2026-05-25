import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { httpClient, tokenStorage } from '../../infrastructure/di/container'

export interface KanbanReserva {
  id: number;
  id_viagem: number;
  id_lider: number;
  nome_lider?: string;
  qtd_vagas: number;
  status: string;
  substatus: string;
  valor_acordado?: number;
  titulo_viagem?: string;
  passageiros: any[];
}

export interface KanbanData {
  id_viagem: number;
  titulo: string;
  colunas: Record<string, KanbanReserva[]>;
}

export function useKanban(idViagem: string) {
  const router = useRouter()
  const [data, setData] = useState<KanbanData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true)
      const result = await httpClient.get<KanbanData>(`/admin/viagens/${idViagem}/reservas`, tokenStorage)
      setData(result)
      setErro('')
    } catch (err: any) {
      setErro(err.message || 'Falha ao carregar dados do Kanban')
    } finally {
      setCarregando(false)
    }
  }, [idViagem])

  useEffect(() => {
    const rawUser = tokenStorage.getUser()
    if (!rawUser || rawUser.tipo !== 'ADMIN') {
      router.push('/painel')
      return
    }
    carregarDados()
  }, [carregarDados, router])

  const handleMudarStatus = async (idReserva: number, novoStatus: string) => {
    try {
      await httpClient.patch(`/admin/reservas/${idReserva}`, tokenStorage, { status: novoStatus })
      await carregarDados()
    } catch (err) {
      console.error('Erro ao mudar status:', err)
    }
  }

  return {
    data,
    carregando,
    erro,
    handleMudarStatus,
    router
  }
}

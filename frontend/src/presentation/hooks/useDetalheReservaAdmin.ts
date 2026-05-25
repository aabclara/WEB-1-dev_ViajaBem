import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { httpClient, tokenStorage } from '../../infrastructure/di/container'

export function useDetalheReservaAdmin(idReserva: string) {
  const router = useRouter()
  const [reserva, setReserva] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [atualizando, setAtualizando] = useState(false)

  const carregarReserva = useCallback(async () => {
    try {
      setLoading(true)
      const data = await httpClient.get<any>(`/reservas/${idReserva}`, tokenStorage)
      setReserva(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [idReserva])

  useEffect(() => {
    const rawUser = tokenStorage.getUser()
    if (!rawUser || rawUser.tipo !== 'ADMIN') {
      router.push('/painel')
      return
    }
    carregarReserva()
  }, [carregarReserva, router])

  const handleCobrarWhatsApp = async () => {
    try {
      const data = await httpClient.get<any>(`/admin/reservas/${idReserva}/resumo-whatsapp`, tokenStorage)
      if (data && data.texto) {
        const numeroLider = '5511999999999' // Fictício ou buscar do perfil real
        const textoEncoded = encodeURIComponent(data.texto)
        window.open(`https://wa.me/${numeroLider}?text=${textoEncoded}`, '_blank')
      }
    } catch (error) {
      console.error(error)
      alert('Defina o valor acordado antes de gerar o resumo.')
    }
  }

  const mudarStatus = async (novoStatus: string) => {
    setAtualizando(true)
    try {
      await httpClient.patch(`/admin/reservas/${idReserva}`, tokenStorage, { status: novoStatus })
      await carregarReserva()
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Erro ao mudar status')
    } finally {
      setAtualizando(false)
    }
  }

  return { reserva, loading, atualizando, handleCobrarWhatsApp, mudarStatus }
}

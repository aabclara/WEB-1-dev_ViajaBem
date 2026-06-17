'use client'

import { useState, useEffect, useCallback } from 'react'
import { Viagem } from '../../domain/entities/Viagem'
import { buscarViagemUseCase, criarReservaUseCase, tokenStorage } from '../../infrastructure/di/container'

export function useDetalheViagem(id: number | string) {
  const [viagem, setViagem] = useState<Viagem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [qtdVagas, setQtdVagas] = useState(1)

  useEffect(() => {
    async function carregar() {
      try {
        const data = await buscarViagemUseCase.execute(Number(id))
        setViagem(data)
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Viagem não encontrada')
      } finally {
        setIsLoading(false)
      }
    }
    carregar()
  }, [id])

  const handleReserva = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!viagem) return

    if (!tokenStorage.getToken()) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }

    setErro(null)
    setEnviando(true)
    try {
      await criarReservaUseCase.execute({ idViagem: viagem.id, qtdVagas })
      setSucesso(true)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao realizar reserva')
    } finally {
      setEnviando(false)
    }
  }, [viagem, qtdVagas])

  const incrementarVagas = useCallback(() => {
    if (viagem) setQtdVagas((q) => Math.min(viagem.vagasDisponiveis, q + 1))
  }, [viagem])

  const decrementarVagas = useCallback(() => {
    setQtdVagas((q) => Math.max(1, q - 1))
  }, [])

  return { viagem, isLoading, erro, enviando, sucesso, qtdVagas, handleReserva, incrementarVagas, decrementarVagas }
}

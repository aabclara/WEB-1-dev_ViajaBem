'use client'

import { useState, useEffect } from 'react'
import { Reserva } from '../../domain/entities/Reserva'
import { buscarReservaUseCase, atualizarPassageiroUseCase } from '../../infrastructure/di/container'

export function useReservaDetalhe(id: number) {
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const carregarReserva = async () => {
    setIsLoading(true)
    try {
      const data = await buscarReservaUseCase.execute(id)
      setReserva(data)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar reserva')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      carregarReserva()
    }
  }, [id])

  const atualizarPassageiro = async (idPassageiro: number, dados: { nome: string, documento: string }) => {
    await atualizarPassageiroUseCase.execute(idPassageiro, dados)
    await carregarReserva()
  }

  return { reserva, isLoading, erro, atualizarPassageiro, carregarReserva }
}

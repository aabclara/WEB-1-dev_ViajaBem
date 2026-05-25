'use client'

import { useState, useEffect } from 'react'
import { Viagem } from '../../domain/entities/Viagem'
import { listarViagensUseCase } from '../../infrastructure/di/container'

export function useViagens() {
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      try {
        const data = await listarViagensUseCase.execute()
        setViagens(data)
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao carregar viagens')
      } finally {
        setIsLoading(false)
      }
    }
    carregar()
  }, [])

  return { viagens, isLoading, erro }
}

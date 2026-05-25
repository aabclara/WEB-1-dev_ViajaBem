'use client'

import { useState, useEffect, useCallback } from 'react'
import { Viagem } from '../../domain/entities/Viagem'
import { Usuario } from '../../domain/entities/Usuario'
import { listarViagensUseCase, criarViagemUseCase, listarReservasUseCase, tokenStorage } from '../../infrastructure/di/container'
import { CriarViagemDTO } from '../../domain/repositories/IViagemRepository'
import { Reserva } from '../../domain/entities/Reserva'

const VIAGENS_POR_PAGINA = 50

interface AdminViagemRaw {
  id: number
  titulo: string
  data_partida: string
  status: string
  vagas_totais: number
  reservas_por_status: Record<string, number>
}

export function usePainelAdmin() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [viagensAdmin, setViagensAdmin] = useState<AdminViagemRaw[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [carregando, setCarregando] = useState(true)
  const [exibirForm, setExibirForm] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(0)
  const [novaViagem, setNovaViagem] = useState<CriarViagemDTO>({
    titulo: '', descricaoPrecos: '', dataPartida: '', dataRetorno: '', vagasTotais: 40, descricaoCurta: '', itensInclusos: '', urlCapa: '',
  })
  const [criando, setCriando] = useState(false)
  const [msgSucesso, setMsgSucesso] = useState('')
  const [erroForm, setErroForm] = useState('')

  const carregarDados = useCallback(async (user: Usuario, pagina: number) => {
    try {
      if (user.ehAdmin) {
        // Para admin, usa o apiClient legado via httpClient até refatoração completa
        const { httpClient, tokenStorage: ts } = await import('../../infrastructure/di/container')
        const data = await httpClient.get<AdminViagemRaw[]>('/admin/viagens/', ts, {
          skip: pagina * VIAGENS_POR_PAGINA,
          limit: VIAGENS_POR_PAGINA,
        })
        setViagensAdmin(data)
      } else {
        const data = await listarReservasUseCase.execute()
        setReservas(data)
      }
    } catch (err) {
      console.error('Erro ao carregar dados do painel:', err)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    const rawUser = tokenStorage.getUser()
    if (!rawUser) {
      window.location.href = '/login'
      return
    }
    const user = Usuario.fromStorage(rawUser)
    setUsuario(user)
    carregarDados(user, paginaAtual)
  }, [paginaAtual, carregarDados])

  const handleCriarViagem = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setCriando(true)
    setErroForm('')

    try {
      await criarViagemUseCase.execute(novaViagem)
      setMsgSucesso('Viagem criada com sucesso!')
      setNovaViagem({ titulo: '', descricaoPrecos: '', dataPartida: '', dataRetorno: '', vagasTotais: 40, descricaoCurta: '', itensInclusos: '', urlCapa: '' })
      if (usuario) await carregarDados(usuario, paginaAtual)
      setTimeout(() => { setExibirForm(false); setMsgSucesso('') }, 2000)
    } catch (err) {
      setErroForm(err instanceof Error ? err.message : 'Erro ao criar viagem')
    } finally {
      setCriando(false)
    }
  }, [novaViagem, usuario, paginaAtual, carregarDados])

  return {
    usuario, viagens, viagensAdmin, reservas, carregando, exibirForm, setExibirForm,
    paginaAtual, setPaginaAtual, novaViagem, setNovaViagem, criando, msgSucesso, erroForm, handleCriarViagem,
  }
}

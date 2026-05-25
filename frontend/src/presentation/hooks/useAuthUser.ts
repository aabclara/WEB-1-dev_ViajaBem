'use client'

import { useState, useEffect } from 'react'
import { Usuario } from '../../domain/entities/Usuario'
import { tokenStorage } from '../../infrastructure/di/container'

export function useAuthUser() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const carregar = () => {
      const raw = tokenStorage.getUser()
      setUsuario(raw ? Usuario.fromStorage(raw) : null)
    }

    carregar()
    window.addEventListener('storage', carregar)
    return () => window.removeEventListener('storage', carregar)
  }, [])

  const logout = () => {
    tokenStorage.remove()
    window.location.href = '/login'
  }

  return { usuario, logout }
}

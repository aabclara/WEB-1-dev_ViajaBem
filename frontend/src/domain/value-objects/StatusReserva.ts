export const StatusReserva = {
  SOLICITADO: 'SOLICITADO',
  CONFIRMADO: 'CONFIRMADO',
  CANCELADO: 'CANCELADO',
  BLOQUEADO: 'BLOQUEADO',
} as const

export type StatusReserva = (typeof StatusReserva)[keyof typeof StatusReserva]

export function isStatusReservaValido(value: string): value is StatusReserva {
  return Object.values(StatusReserva).includes(value as StatusReserva)
}

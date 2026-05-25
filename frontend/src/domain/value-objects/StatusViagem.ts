export const StatusViagem = {
  ATIVO: 'ATIVO',
  FINALIZADO: 'FINALIZADO',
  ESGOTADO: 'ESGOTADO',
  CANCELADO: 'CANCELADO',
} as const

export type StatusViagem = (typeof StatusViagem)[keyof typeof StatusViagem]

export function isStatusViagemValido(value: string): value is StatusViagem {
  return Object.values(StatusViagem).includes(value as StatusViagem)
}

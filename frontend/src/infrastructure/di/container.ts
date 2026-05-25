/**
 * Container de Injeção de Dependência — único ponto de wiring da aplicação.
 * Os hooks de presentation importam apenas as instâncias exportadas aqui.
 */
import { FetchHttpClient } from '../http/FetchHttpClient'
import { LocalStorageTokenStorage } from '../storage/LocalStorageTokenStorage'
import { ViagemHttpRepository } from '../repositories/ViagemHttpRepository'
import { ReservaHttpRepository } from '../repositories/ReservaHttpRepository'
import { AuthHttpRepository } from '../repositories/AuthHttpRepository'
import { ListarViagensUseCase } from '../../application/use-cases/ListarViagensUseCase'
import { BuscarViagemUseCase } from '../../application/use-cases/BuscarViagemUseCase'
import { CriarReservaUseCase } from '../../application/use-cases/CriarReservaUseCase'
import { LoginUseCase } from '../../application/use-cases/LoginUseCase'
import { CadastrarUseCase } from '../../application/use-cases/CadastrarUseCase'
import { CriarViagemUseCase } from '../../application/use-cases/CriarViagemUseCase'
import { ListarReservasUseCase } from '../../application/use-cases/ListarReservasUseCase'
import { BuscarPerfilUseCase } from '../../application/use-cases/BuscarPerfilUseCase'
import { AtualizarPerfilUseCase } from '../../application/use-cases/AtualizarPerfilUseCase'
import { AtualizarPassageiroUseCase } from '../../application/use-cases/AtualizarPassageiroUseCase'
import { BuscarReservaUseCase } from '../../application/use-cases/BuscarReservaUseCase'

// --- Infraestrutura base ---
export const tokenStorage = new LocalStorageTokenStorage()
export const httpClient = new FetchHttpClient()

// --- Repositórios concretos ---
export const viagemRepository = new ViagemHttpRepository(httpClient, tokenStorage)
export const reservaRepository = new ReservaHttpRepository(httpClient, tokenStorage)
export const authRepository = new AuthHttpRepository(httpClient, tokenStorage)

// --- Casos de Uso ---
export const listarViagensUseCase = new ListarViagensUseCase(viagemRepository)
export const buscarViagemUseCase = new BuscarViagemUseCase(viagemRepository)
export const criarReservaUseCase = new CriarReservaUseCase(reservaRepository, viagemRepository)
export const loginUseCase = new LoginUseCase(authRepository, tokenStorage)
export const cadastrarUseCase = new CadastrarUseCase(authRepository, tokenStorage)
export const criarViagemUseCase = new CriarViagemUseCase(viagemRepository)
export const listarReservasUseCase = new ListarReservasUseCase(reservaRepository)
export const buscarPerfilUseCase = new BuscarPerfilUseCase(authRepository)
export const atualizarPerfilUseCase = new AtualizarPerfilUseCase(authRepository)
export const atualizarPassageiroUseCase = new AtualizarPassageiroUseCase(reservaRepository)
export const buscarReservaUseCase = new BuscarReservaUseCase(reservaRepository)

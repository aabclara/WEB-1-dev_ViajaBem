"use client";

import { useParams } from "next/navigation";
import {
  CalendarDays,
  Users,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Ticket,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useDetalheViagem } from "@/src/presentation/hooks/useDetalheViagem";

export default function DetalheViagemPage() {
  const { id } = useParams();
  const {
    viagem, isLoading, erro, enviando, sucesso,
    qtdVagas, handleReserva, incrementarVagas, decrementarVagas,
  } = useDetalheViagem(id as string);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-stone-50">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (erro && !viagem) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Ops! Ocorreu um erro</h2>
        <p className="text-viaje-neutral mb-8">{erro}</p>
        <Link href="/" className="flex items-center gap-2 text-primary font-bold hover:underline">
          <ArrowLeft size={18} />
          Voltar para a Home
        </Link>
      </div>
    );
  }

  if (!viagem) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para viagens
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative">
                {viagem.urlCapa && (
                  <div className="mb-6 -mx-8 -mt-8 h-64 relative overflow-hidden">
                    <img src={viagem.urlCapa} alt={viagem.titulo} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                  <MapPin size={16} />
                  Destino Confirmado
                </div>
                <h1 className="text-4xl font-black text-stone-800 tracking-tight mb-4">{viagem.titulo}</h1>
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2 text-stone-600 font-medium">
                    <CalendarDays size={20} className="text-primary" />
                    {new Date(viagem.dataPartida).toLocaleDateString("pt-BR")}
                    {viagem.dataRetorno && ` a ${new Date(viagem.dataRetorno).toLocaleDateString("pt-BR")}`}
                  </div>
                  <div className="flex items-center gap-2 text-stone-600 font-medium">
                    <Users size={20} className="text-secondary" />
                    {viagem.vagasDisponiveis} vagas restantes
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 mb-2 text-on-surface-variant">
                  <p className="font-medium leading-relaxed">
                    {viagem.descricaoCurta || `Embarque conosco nessa jornada inesquecível para ${viagem.titulo}.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
                <CheckCircle2 size={24} className="text-secondary" />
                O que está incluso
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(viagem.itensInclososLista.length > 0
                  ? viagem.itensInclososLista
                  : ["Transporte ida e volta", "Seguro viagem", "Guia acompanhante", "Embarques selecionados"]
                ).map((item) => (
                  <li key={item} className="flex items-center gap-3 text-on-surface-variant font-medium">
                    <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <ChevronRight size={14} strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border-2 border-primary p-8 shadow-xl sticky top-32">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 rotate-3">
                  <Ticket size={32} />
                </div>
                <h2 className="text-2xl font-black text-stone-800 tracking-tight">Reservar Vagas</h2>
                <p className="text-stone-500 font-medium">Garanta seu lugar agora</p>
              </div>

              {erro && (
                <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-bold">{erro}</div>
              )}

              {sucesso ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-stone-800 mb-2">Reserva Solicitada!</h3>
                  <p className="text-stone-600">Redirecionando para o seu painel...</p>
                </div>
              ) : (
                <form onSubmit={handleReserva} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Valor por pessoa</label>
                    <div className="text-3xl font-black text-primary">
                      {viagem.descricaoPrecos ? `R$ ${viagem.descricaoPrecos}` : "R$ ---"}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="qtdVagas" className="block text-sm font-bold text-stone-700 mb-2">
                      Quantidade de pessoas
                    </label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={decrementarVagas} className="w-12 h-12 rounded-xl border-2 border-stone-200 flex items-center justify-center text-2xl font-bold hover:border-primary transition-colors hover:text-primary active:scale-95">-</button>
                      <div className="flex-1 text-center text-2xl font-black text-stone-800">{qtdVagas}</div>
                      <button type="button" onClick={incrementarVagas} className="w-12 h-12 rounded-xl border-2 border-stone-200 flex items-center justify-center text-2xl font-bold hover:border-primary transition-colors hover:text-primary active:scale-95">+</button>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={enviando || viagem.estaEsgotada}
                      className="w-full h-14 bg-primary text-on-primary rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                      {enviando ? <><Loader2 size={24} className="animate-spin" /> Reservando...</> : "Confirmar Reserva"}
                    </button>
                    {viagem.estaEsgotada && (
                      <p className="mt-3 text-center text-error text-sm font-bold">Viagem esgotada</p>
                    )}
                  </div>
                </form>
              )}

              <p className="mt-8 text-center text-xs text-stone-400 leading-relaxed">
                Ao clicar em confirmar, você solicita as vagas e nossa equipe entrará em contato para finalizar o pagamento e documentação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

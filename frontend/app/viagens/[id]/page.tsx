"use client";

import { useState, useEffect } from "react";
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
import { API_URL, getAuthToken } from "@/src/lib/auth";
import type { Viagem } from "@/src/types/viagem";

export default function DetalheViagemPage() {
  const { id } = useParams();
  const [viagem, setViagem] = useState<Viagem | null>(null);
  const [qtdVagas, setQtdVagas] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const res = await fetch(`${API_URL}/viagens/${id}`);
        if (!res.ok) throw new Error("Viagem não encontrada");
        const data = await res.json();
        setViagem(data);
      } catch (err: any) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, [id]);

  const handleReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();

    if (!token) {
      window.location.href = `/login?redirect=/viagens/${id}`;
      return;
    }

    setErro("");
    setEnviando(true);

    try {
      const res = await fetch(`${API_URL}/reservas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id_viagem: Number(id),
          qtd_vagas: qtdVagas
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Erro ao realizar reserva");
      }

      setSucesso(true);
      setTimeout(() => {
        window.location.href = "/painel";
      }, 2500);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
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
        <Link 
          href="/" 
          className="flex items-center gap-2 text-primary font-bold hover:underline"
        >
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
        {/* Header de navegação */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-on-surface-variant font-bold hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para viagens
        </Link>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Lado Esquerdo: Detalhes da Viagem (3 colunas) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm overflow-hidden relative">
               {/* Visual Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                  <MapPin size={16} />
                  Destino Confirmado
                </div>
                
                <h1 className="text-4xl font-black text-stone-800 tracking-tight mb-4">
                  {viagem.titulo}
                </h1>

                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2 text-stone-600 font-medium">
                    <CalendarDays size={20} className="text-primary" />
                    {new Date(viagem.data_partida).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-2 text-stone-600 font-medium">
                    <Users size={20} className="text-secondary" />
                    {viagem.vagas_disponiveis} vagas restantes
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 mb-2 text-on-surface-variant">
                  <p className="font-medium leading-relaxed">
                    {viagem.descricao_curta || `Embarque conosco nessa jornada inesquecível para ${viagem.titulo}. Garantimos conforto, segurança e a melhor experiência de viagem coletiva.`}
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
                {(viagem.itens_inclusos 
                  ? viagem.itens_inclusos.split(/,|\n/).map(i => i.trim()).filter(Boolean)
                  : ["Transporte ida e volta", "Seguro viagem", "Guia acompanhante", "Embarques selecionados"]
                ).map(item => (
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

          {/* Lado Direito: Card de Reserva (2 colunas) */}
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
                <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-bold">
                  {erro}
                </div>
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
                    <label className="block text-sm font-bold text-stone-700 mb-2">
                      Valor por pessoa
                    </label>
                    <div className="text-3xl font-black text-primary">
                      {viagem.descricao_precos || "R$ ---"}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="qtdVagas" className="block text-sm font-bold text-stone-700 mb-2">
                      Quantidade de pessoas
                    </label>
                    <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => setQtdVagas(Math.max(1, qtdVagas - 1))}
                        className="w-12 h-12 rounded-xl border-2 border-stone-200 flex items-center justify-center text-2xl font-bold hover:border-primary transition-colors hover:text-primary active:scale-95"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center text-2xl font-black text-stone-800">
                        {qtdVagas}
                      </div>
                      <button 
                         type="button"
                         onClick={() => setQtdVagas(Math.min(viagem.vagas_disponiveis, qtdVagas + 1))}
                         className="w-12 h-12 rounded-xl border-2 border-stone-200 flex items-center justify-center text-2xl font-bold hover:border-primary transition-colors hover:text-primary active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={enviando || viagem.vagas_disponiveis === 0}
                      className="w-full h-14 bg-primary text-on-primary rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                    >
                      {enviando ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          Reservando...
                        </>
                      ) : (
                        "Confirmar Reserva"
                      )}
                    </button>
                    {viagem.vagas_disponiveis === 0 && (
                      <p className="mt-3 text-center text-error text-sm font-bold">
                        Viagem esgotada
                      </p>
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

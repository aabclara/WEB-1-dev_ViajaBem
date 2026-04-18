"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  CalendarDays, 
  Loader2, 
  ChevronRight, 
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical
} from "lucide-react";
import { getAuthToken, API_URL, getAuthUser } from "@/src/lib/auth";

interface Reserva {
  id: number;
  id_viagem: number;
  id_lider: number;
  nome_lider?: string;
  qtd_vagas: number;
  status: string;
  substatus: string;
  valor_acordado?: number;
  titulo_viagem?: string;
  passageiros: any[];
}

interface KanbanData {
  id_viagem: number;
  titulo: string;
  colunas: Record<string, Reserva[]>;
}

const statusConfig: Record<string, { label: string; description: string; color: string; bgColor: string; icon: any }> = {
  SOLICITADO: { label: "Solicitado", description: "Aguardando contato e negociação", color: "bg-amber-100 border-amber-300 text-amber-800", bgColor: "bg-amber-500/5", icon: Clock },
  EM_CONTATO: { label: "Em Contato", description: "Atendimento iniciado", color: "bg-purple-100 border-purple-300 text-purple-800", bgColor: "bg-purple-500/5", icon: MessageCircle },
  BLOQUEADO: { label: "Bloqueado", description: "Sinal confirmado", color: "bg-blue-100 border-blue-300 text-blue-800", bgColor: "bg-blue-500/5", icon: MoreVertical },
  CONFIRMADO: { label: "Confirmado", description: "Valor total pago", color: "bg-emerald-100 border-emerald-300 text-emerald-800", bgColor: "bg-emerald-500/5", icon: CheckCircle2 },
  CANCELADO: { label: "Cancelado", description: "Reserva descartada", color: "bg-rose-100 border-rose-300 text-rose-800", bgColor: "bg-rose-500/5", icon: XCircle },
};

export default function KanbanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<KanbanData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDados = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/admin/viagens/${id}/reservas`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        throw new Error("Falha ao carregar dados do Kanban");
      }
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.tipo !== "ADMIN") {
      router.push("/painel");
      return;
    }
    carregarDados();
  }, [id]);

  const handleMudarStatus = async (idReserva: number, novoStatus: string) => {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_URL}/admin/reservas/${idReserva}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: novoStatus })
      });
      if (res.ok) {
        await carregarDados();
      }
    } catch (err) {
      console.error("Erro ao mudar status:", err);
    }
  };

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50 text-viaje-primary">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (erro || !data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-stone-50 p-8 text-center">
        <AlertCircle size={48} className="text-error mb-4" />
        <h2 className="text-2xl font-bold text-stone-800">Ops! Algo deu errado</h2>
        <p className="text-stone-500 mt-2">{erro || "Não conseguimos carregar o painel desta viagem."}</p>
        <Link href="/painel" className="mt-8 bg-viaje-primary text-white px-8 py-3 rounded-2xl font-bold">
          Voltar ao Painel
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-stone-200 px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/painel")}
              className="p-3 hover:bg-stone-100 rounded-2xl transition-colors text-stone-400"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-widest text-viaje-primary bg-viaje-primary/10 px-2 py-0.5 rounded-md">
                   Gestão de Viagem
                </span>
                <span className="text-stone-300">|</span>
                <span className="text-sm font-bold text-stone-400">ID #{data.id_viagem}</span>
              </div>
              <h1 className="text-2xl font-black text-stone-800 tracking-tight">{data.titulo}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-100 text-stone-600 font-bold hover:bg-stone-200 transition-all">
                Exportar Lista (ANTT)
             </button>
             <Link 
               href={`/painel/kanban/${id}/editar`}
               className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-viaje-primary text-white font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
             >
                Editar Viagem
             </Link>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="px-4 py-8 sm:px-8 overflow-x-auto">
        <div className="mx-auto max-w-7xl flex gap-6 min-w-[1200px] h-[calc(100vh-14rem)]">
          {Object.entries(statusConfig).map(([statusKey, config]) => {
            const reservasNoStatus = data.colunas[statusKey] || [];
            return (
              <div key={statusKey} className={`flex-1 flex flex-col min-w-[280px] ${config.bgColor} rounded-3xl p-4 transition-colors duration-500`}>
                <div className={`mb-4 p-4 rounded-2xl border flex items-center justify-between ${config.color}`}>
                   <div className="flex items-center gap-3">
                      <config.icon size={20} />
                      <div>
                         <span className="font-black uppercase tracking-tighter block leading-none">{config.label}</span>
                         <span className="text-[10px] font-bold opacity-60 block mt-0.5">{config.description}</span>
                      </div>
                   </div>
                   <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/50 text-xs font-black">
                      {reservasNoStatus.length}
                   </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
                   {reservasNoStatus.length === 0 ? (
                     <div className="h-20 flex items-center justify-center border-2 border-dashed border-stone-200 rounded-2xl">
                        <p className="text-xs font-bold text-stone-300">Nenhuma reserva</p>
                     </div>
                   ) : (
                     reservasNoStatus.map((reserva) => (
                       <Link href={`/painel/kanban/${id}/reserva/${reserva.id}`} key={reserva.id} className="block bg-white p-4 rounded-2xl border border-stone-200 shadow-sm group hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-3">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">R#{reserva.id}</span>
                                <div className="flex items-center gap-1 text-stone-400">
                                   <Users size={12} />
                                   <span className="text-xs font-bold">{reserva.qtd_vagas}</span>
                                </div>
                             </div>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1 hover:bg-stone-50 rounded-lg text-stone-300">
                                   <MoreVertical size={16} />
                                </button>
                             </div>
                          </div>

                          <h4 className="font-bold text-stone-800 text-sm mb-1 leading-tight">{reserva.nome_lider || `Líder ID #${reserva.id_lider}`}</h4>
                          <p className="text-xs font-semibold text-stone-400 mb-4">R$ {reserva.valor_acordado?.toFixed(2) || "---"}</p>

                           <div className="flex gap-2">
                             {statusKey !== "CONFIRMADO" && (
                               <button 
                                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMudarStatus(reserva.id, "CONFIRMADO"); }}
                                 className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tighter hover:bg-emerald-100 transition-colors"
                               >
                                 Confirmar
                               </button>
                             )}
                             {statusKey !== "CANCELADO" && (
                               <button 
                                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMudarStatus(reserva.id, "CANCELADO"); }}
                                 className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-tighter hover:bg-rose-100 transition-colors"
                               >
                                 Cancelar
                               </button>
                             )}
                             <button 
                               onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                               className="p-2 rounded-xl bg-stone-100 text-stone-400 hover:bg-viaje-primary/10 hover:text-viaje-primary transition-colors">
                                <MessageCircle size={14} />
                             </button>
                          </div>
                       </Link>
                     ))
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

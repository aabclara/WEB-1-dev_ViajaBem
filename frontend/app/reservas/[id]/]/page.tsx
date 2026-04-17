"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  CalendarDays, 
  Loader2, 
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  User,
  CreditCard
} from "lucide-react";
import { getAuthToken, API_URL, getAuthUser } from "@/src/lib/auth";

interface Passenger {
  id: number;
  nome: string;
  documento: string;
  eh_lider: boolean;
}

interface Reserva {
  id: number;
  id_viagem: number;
  id_lider: number;
  qtd_vagas: number;
  status: string;
  substatus: string;
  valor_acordado?: number;
  titulo_viagem?: string;
  data_partida_viagem?: string;
  passageiros: Passenger[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any; desc: string }> = {
  SOLICITADO: { 
    label: "Aguardando Aprovação", 
    color: "bg-amber-50 text-amber-600 border-amber-200", 
    icon: Clock,
    desc: "Sua reserva foi recebida e estamos verificando a disponibilidade."
  },
  BLOQUEADO: { 
    label: "Vaga Reservada", 
    color: "bg-stone-50 text-stone-600 border-stone-200", 
    icon: User,
    desc: "Suas vagas estão reservadas. Aguardando confirmação de pagamento."
  },
  CONFIRMADO: { 
    label: "Reserva Confirmada", 
    color: "bg-emerald-50 text-emerald-600 border-emerald-200", 
    icon: CheckCircle2,
    desc: "Tudo pronto! Sua viagem está confirmada."
  },
  CANCELADO: { 
    label: "Reserva Cancelada", 
    color: "bg-rose-50 text-rose-600 border-rose-200", 
    icon: XCircle,
    desc: "Esta reserva foi cancelada."
  },
};

export default function ReservaDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarReserva = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/reservas/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setReserva(json);
      } else {
        throw new Error("Não conseguimos encontrar sua reserva.");
      }
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarReserva();
  }, [id]);

  if (carregando) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-stone-50 text-viaje-primary">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (erro || !reserva) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-stone-50 p-8 text-center">
        <AlertCircle size={48} className="text-error mb-4" />
        <h2 className="text-2xl font-bold text-stone-800">Reserva não encontrada</h2>
        <p className="text-stone-500 mt-2 max-w-md">{erro}</p>
        <Link href="/painel" className="mt-8 bg-viaje-primary text-white px-8 py-3 rounded-2xl font-bold">
          Voltar ao Meu Painel
        </Link>
      </div>
    );
  }

  const config = statusConfig[reserva.status] || statusConfig.SOLICITADO;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb / Back Navigation */}
        <button 
          onClick={() => router.push("/painel")}
          className="mb-8 flex items-center gap-2 text-stone-400 font-bold hover:text-stone-600 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar para o Painel
        </button>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 mb-8 shadow-sm">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-black uppercase tracking-widest bg-stone-100 text-stone-500 px-2 py-0.5 rounded">Reserva #{reserva.id}</span>
                   <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${config.color}`}>
                      {config.label}
                   </div>
                </div>
                <h1 className="text-3xl font-black text-stone-800 tracking-tight mb-4">
                  {reserva.titulo_viagem || "Detalhes da Viagem"}
                </h1>
                <div className="flex flex-wrap gap-6">
                   <div className="flex items-center gap-2 text-stone-500">
                      <CalendarDays size={18} className="text-viaje-primary" />
                      <span className="font-bold">{reserva.data_partida_viagem ? new Date(reserva.data_partida_viagem).toLocaleDateString() : "---"}</span>
                   </div>
                   <div className="flex items-center gap-2 text-stone-500">
                      <Users size={18} className="text-viaje-primary" />
                      <span className="font-bold">{reserva.qtd_vagas} Passageiros</span>
                   </div>
                   <div className="flex items-center gap-2 text-stone-500">
                      <CreditCard size={18} className="text-viaje-primary" />
                      <span className="font-bold">R$ {reserva.valor_acordado?.toFixed(2) || "A definir"}</span>
                   </div>
                </div>
              </div>

              <div className="flex flex-col items-center p-6 bg-stone-50 rounded-2xl min-w-[200px]">
                 <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 text-center">Status do Pagamento</p>
                 <div className={`p-3 rounded-full mb-3 ${config.color}`}>
                    <config.icon size={32} />
                 </div>
                 <p className="text-sm font-bold text-stone-800 text-center">{config.label}</p>
              </div>
           </div>

           <div className="mt-8 pt-8 border-t border-stone-100 flex items-start gap-4">
              <div className="p-3 bg-viaje-primary/10 text-viaje-primary rounded-xl">
                 <ShieldCheck size={24} />
              </div>
              <div>
                 <p className="text-sm font-black text-stone-800 uppercase tracking-tighter">Orientações</p>
                 <p className="text-stone-500 text-sm">{config.desc}</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Passenger List (Left Column) */}
           <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-black text-stone-800 flex items-center gap-2">
                 <Users size={22} className="text-viaje-primary" />
                 Lista de Passageiros
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                 {reserva.passageiros.map((p, idx) => (
                   <div key={p.id} className="bg-white p-5 rounded-2xl border border-stone-200 flex items-center justify-between shadow-sm group hover:border-viaje-primary transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 font-bold group-hover:text-viaje-primary transition-colors">
                            {idx + 1}
                         </div>
                         <div>
                            <p className="font-bold text-stone-800">{p.nome || "Não informado"}</p>
                            <p className="text-xs font-semibold text-stone-400">{p.documento || "Documento pendente"}</p>
                         </div>
                      </div>
                      {p.eh_lider && (
                        <span className="text-[10px] font-black uppercase tracking-tighter bg-viaje-primary/10 text-viaje-primary px-2 py-0.5 rounded">Líder</span>
                      )}
                   </div>
                 ))}
              </div>
           </div>

           {/* Sidebar Actions (Right Column) */}
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
                 <h3 className="text-sm font-black text-stone-800 uppercase tracking-widest mb-4">Ações Rápidas</h3>
                 <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-stone-100 text-stone-600 font-bold hover:bg-stone-200 transition-all">
                       Editar Dados
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-100 text-emerald-700 font-bold hover:bg-emerald-200 transition-all">
                       <MessageCircle size={18} />
                       Whatsapp Admin
                    </button>
                 </div>
              </div>

              <div className="bg-viaje-primary rounded-3xl p-6 text-white shadow-lg shadow-primary/20">
                 <h3 className="text-sm font-black uppercase tracking-widest mb-4 opacity-70">Resumo da Conta</h3>
                 <div className="space-y-2 mb-6">
                    <div className="flex justify-between font-bold">
                       <span>Total</span>
                       <span>R$ {reserva.valor_acordado?.toFixed(2) || "---"}</span>
                    </div>
                    <div className="flex justify-between text-sm opacity-80">
                       <span>Sinal (pago)</span>
                       <span>---</span>
                    </div>
                 </div>
                 <button className="w-full py-3 bg-white text-viaje-primary rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition-all">
                    Ver comprovantes
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

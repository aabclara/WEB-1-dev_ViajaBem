"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  UserCircle2, 
  CheckCircle2, 
  XCircle,
  MessageCircle
} from "lucide-react";
import { getAuthToken, API_URL } from "@/src/lib/auth";

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  SOLICITADO: { label: "AGUARDANDO CONTATO", bg: "bg-amber-100", text: "text-amber-800", icon: Calendar },
  EM_CONTATO: { label: "EM ATENDIMENTO", bg: "bg-purple-100", text: "text-purple-800", icon: MessageCircle },
  BLOQUEADO: { label: "AGUARDANDO SINAL", bg: "bg-blue-100", text: "text-blue-800", icon: Users },
  CONFIRMADO: { label: "CONFIRMADO", bg: "bg-emerald-100", text: "text-emerald-800", icon: CheckCircle2 },
  CANCELADO: { label: "CANCELADO", bg: "bg-rose-100", text: "text-rose-800", icon: XCircle },
};

export default function ReservaDetalhesPage() {
  const { id: idViagem, idReserva } = useParams();
  const router = useRouter();
  
  const [reserva, setReserva] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    carregarReserva();
  }, [idReserva]);

  const carregarReserva = async () => {
    try {
      const response = await fetch(`${API_URL}/reservas/${idReserva}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReserva(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCobrarWhatsApp = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/reservas/${idReserva}/resumo-whatsapp`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      const data = await response.json();
      if (response.ok && data.texto) {
        const numeroLider = "5511999999999"; // Fictício ou buscar do perfil real
        const textoEncoded = encodeURIComponent(data.texto);
        window.open(`https://wa.me/${numeroLider}?text=${textoEncoded}`, '_blank');
      }
    } catch (error) {
      console.error(error);
      alert("Defina o valor acordado antes de gerar o resumo.");
    }
  };

  const mudarStatus = async (novoStatus: string) => {
    setAtualizando(true);
    try {
      const resp = await fetch(`${API_URL}/admin/reservas/${idReserva}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}` 
        },
        body: JSON.stringify({ status: novoStatus })
      });
      if (resp.ok) {
        carregarReserva(); // Recarregar dados
      } else {
        const err = await resp.json();
        alert(err.detail || "Erro ao mudar status");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAtualizando(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FDF9EC] flex items-center justify-center p-4">Carregando...</div>;
  }

  if (!reserva) {
    return <div className="min-h-screen bg-[#FDF9EC] flex items-center justify-center p-4">Reserva não encontrada.</div>;
  }

  // Preencher a lista de passageiros vazios (tracejadas) de acordo com qty vagas
  const confirmados = reserva.passageiros?.filter((p: any) => p.nome && p.documento) || [];
  const vagasRestantes = reserva.qtd_vagas - confirmados.length;
  const vagasVazias = Array.from({ length: vagasRestantes > 0 ? vagasRestantes : 0 });

  const currentStatusConfig = statusConfig[reserva.status] || statusConfig.SOLICITADO;

  return (
    <div className="min-h-screen bg-[#FFFDF6] py-8 px-4 md:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6 pb-32">
        
        {/* Voltar ao Kanban (Topo) */}
        <div>
          <Link href={`/painel/kanban/${idViagem}`} className="inline-flex items-center gap-2 text-stone-500 font-bold hover:text-stone-800 transition-colors">
            <ArrowLeft size={20} />
            Voltar ao Kanban
          </Link>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-stone-800 leading-tight mb-2">
                {reserva.titulo_viagem || "Viagem Desconhecida"}
              </h1>
              <p className="text-lg font-medium text-stone-600">
                Lead: <span className="font-bold text-stone-800">{reserva.nome_lider}</span>
              </p>
            </div>
            
            {/* Status Select Badge */}
            <div>
              <select 
                value={reserva.status}
                onChange={(e) => mudarStatus(e.target.value)}
                disabled={atualizando}
                className={`appearance-none font-black text-xs px-4 py-2 rounded-full tracking-tighter uppercase cursor-pointer outline-none ${currentStatusConfig.bg} ${currentStatusConfig.text}`}
              >
                <option value="SOLICITADO">{statusConfig.SOLICITADO.label}</option>
                <option value="EM_CONTATO">{statusConfig.EM_CONTATO.label}</option>
                <option value="BLOQUEADO">{statusConfig.BLOQUEADO.label}</option>
                <option value="CONFIRMADO">{statusConfig.CONFIRMADO.label}</option>
                <option value="CANCELADO">{statusConfig.CANCELADO.label}</option>
              </select>
            </div>
          </div>

          <div className="flex gap-8 text-stone-400 font-medium">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{reserva.data_partida_viagem ? new Date(reserva.data_partida_viagem).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric'}) : "Em breve"}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300 self-center" />
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{confirmados.length} Passageiros confirmados</span>
            </div>
          </div>
        </div>

        {/* Informações da Vaga e Lista */}
        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xl font-bold text-stone-800">Lista de Passageiros</h2>
            <span className="text-sm font-semibold text-stone-500 bg-[#F4F7F8] px-3 py-1 rounded-lg">Vagas: {vagasRestantes} disponíveis</span>
          </div>

          <div className="space-y-4">
            {confirmados.map((p: any, idx: number) => (
              <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center">
                  <UserCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 text-lg">{p.nome}</h3>
                  <p className="text-sm text-stone-500 font-medium">RG: {p.documento}</p>
                </div>
              </div>
            ))}

            {vagasVazias.map((_, idx) => (
               <div key={`vazia-${idx}`} className="p-6 rounded-2xl border-2 border-dashed border-stone-200 flex items-center justify-center bg-white/50">
                   <p className="text-stone-400 font-medium">Espaço para novo passageiro disponível</p>
               </div>
            ))}
          </div>
        </div>

        {/* Botão de WhatsApp */}
        <button 
          onClick={handleCobrarWhatsApp}
          className="w-full mt-8 py-4 bg-[#EAF7EC] text-[#2FA851] font-bold rounded-2xl hover:bg-[#dcf3e0] transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle size={20} />
          Cobrar via WhatsApp
        </button>

      </div>

      {/* Roda-pé Fixo */}
      <div className="fixed bottom-0 left-0 w-full bg-[#FFFDF6] border-t border-stone-200/50 p-4">
         <div className="max-w-2xl mx-auto flex gap-4">
            <button 
              onClick={() => mudarStatus("CONFIRMADO")}
              className="flex-1 py-4 bg-[#0ECDB9] text-white font-bold rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-[#0ECDB9]/20 hover:bg-[#0bb5a2] transition-colors"
            >
              <CheckCircle2 size={20} />
              Confirmar Sinal
            </button>
            <button 
              onClick={() => mudarStatus("CANCELADO")}
              className="flex-1 py-4 bg-white text-stone-700 font-bold rounded-2xl border border-stone-200 flex justify-center items-center gap-2 hover:bg-stone-50 transition-colors"
            >
              <XCircle size={20} />
              Cancelar
            </button>
         </div>
      </div>
    </div>
  );
}

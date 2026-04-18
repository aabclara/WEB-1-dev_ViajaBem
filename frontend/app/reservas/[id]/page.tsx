"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  UserCircle2, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getAuthToken, API_URL } from "@/src/lib/auth";

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  SOLICITADO: { label: "AGUARDANDO CONTATO", bg: "bg-amber-100", text: "text-amber-800" },
  EM_CONTATO: { label: "EM ATENDIMENTO", bg: "bg-purple-100", text: "text-purple-800" },
  BLOQUEADO: { label: "AGUARDANDO SINAL", bg: "bg-blue-100", text: "text-blue-800" },
  CONFIRMADO: { label: "CONFIRMADO", bg: "bg-emerald-100", text: "text-emerald-800" },
  CANCELADO: { label: "CANCELADO", bg: "bg-rose-100", text: "text-rose-800" },
};

export default function LiderReservaDetalhesPage() {
  const { id } = useParams();
  
  const [reserva, setReserva] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formDocumento, setFormDocumento] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState("");
  const [erroForm, setErroForm] = useState("");

  useEffect(() => {
    carregarReserva();
  }, [id]);

  const carregarReserva = async () => {
    try {
      const response = await fetch(`${API_URL}/reservas/${id}`, {
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

  const abrirForm = (passageiroId: number, nome: string = "", documento: string = "") => {
    setEditingId(passageiroId);
    setFormNome(nome || "");
    setFormDocumento(documento || "");
    setErroForm("");
    setMsgSucesso("");
  };

  const handleSalvarPassageiro = async (e: React.FormEvent, passageiroId: number) => {
    e.preventDefault();
    setSalvando(true);
    setErroForm("");
    
    try {
      const response = await fetch(`${API_URL}/passageiros/${passageiroId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ nome: formNome, documento: formDocumento })
      });
      
      if (response.ok) {
        setMsgSucesso("Dados salvos com sucesso!");
        await carregarReserva();
        setTimeout(() => setEditingId(null), 1500);
      } else {
        const errorData = await response.json();
        setErroForm(errorData.detail || "Erro ao salvar os dados.");
      }
    } catch (error) {
      setErroForm("Erro de rede. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FDF9EC] flex items-center justify-center p-4">Carregando...</div>;
  }

  if (!reserva) {
    return <div className="min-h-screen bg-[#FDF9EC] flex items-center justify-center p-4">Reserva não encontrada.</div>;
  }

  const confirmados = reserva.passageiros?.filter((p: any) => p.nome && p.documento) || [];
  const currentStatusConfig = statusConfig[reserva.status] || statusConfig.SOLICITADO;

  return (
    <div className="min-h-screen bg-[#FFFDF6] py-8 px-4 md:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6 pb-24">
        
        {/* Voltar ao Painel (Topo) */}
        <div>
          <Link href={`/painel`} className="inline-flex items-center gap-2 text-stone-500 font-bold hover:text-stone-800 transition-colors">
            <ArrowLeft size={20} />
            Voltar para as Viagens
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
                Reserva <span className="font-bold text-stone-800">#R{reserva.id}</span>
              </p>
            </div>
            
            {/* Status Badge (Static for Leader) */}
            <div>
              <div
                className={`font-black text-xs px-4 py-2 rounded-full tracking-tighter uppercase inline-block ${currentStatusConfig.bg} ${currentStatusConfig.text}`}
              >
                {currentStatusConfig.label}
              </div>
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
            <h2 className="text-xl font-bold text-stone-800">Passageiros no Combo</h2>
            <span className="text-sm font-semibold text-stone-500 bg-[#F4F7F8] px-3 py-1 rounded-lg">Combo de {reserva.qtd_vagas}</span>
          </div>

          <div className="space-y-4">
            {reserva.passageiros.map((p: any, idx: number) => {
              const isFilled = p.nome && p.documento;
              const isEditing = editingId === p.id;
              
              return (
                <div key={p.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-500 ${isFilled ? "border-stone-100" : "border-dashed border-stone-200 bg-white/50"}`}>
                  
                  {/* Visão Resumida */}
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {isFilled ? (
                        <>
                          <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center">
                            <UserCircle2 size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                               {p.nome}
                               {p.eh_lider && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-black px-2 py-0.5 rounded-md">Líder</span>}
                            </h3>
                            <p className="text-sm text-stone-500 font-medium">RG: {p.documento}</p>
                          </div>
                        </>
                      ) : (
                        <div className="w-full flex items-center">
                           <p className="text-stone-400 font-medium italic">Vaga vazia (faltam dados)</p>
                        </div>
                      )}
                    </div>
                    
                    {!isEditing && (
                      <button 
                         onClick={() => abrirForm(p.id, p.nome, p.documento)}
                         className={`px-4 py-2 font-bold rounded-xl text-sm transition-colors ${isFilled ? "bg-stone-100 text-stone-600 hover:bg-stone-200" : "bg-[#2FA851]/10 text-[#2FA851] hover:bg-[#2FA851]/20"}`}
                      >
                         {isFilled ? "Editar" : "Preencher"}
                      </button>
                    )}
                  </div>

                  {/* Formulário Expandido */}
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isEditing ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <form onSubmit={(e) => handleSalvarPassageiro(e, p.id)} className="p-6 border-t border-stone-100 bg-stone-50/30">
                       {msgSucesso && isEditing && (
                        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-2 font-bold text-sm">
                          <CheckCircle2 size={16} /> {msgSucesso}
                        </div>
                       )}
                       {erroForm && isEditing && (
                         <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center gap-2 font-bold text-sm">
                           <AlertCircle size={16} /> {erroForm}
                         </div>
                       )}
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Nome Completo</label>
                           <input 
                             type="text" 
                             required
                             value={formNome}
                             onChange={(e) => setFormNome(e.target.value)}
                             placeholder="Ex: João da Silva"
                             className="w-full rounded-xl border border-stone-200 bg-white p-3 text-stone-800 focus:ring-2 focus:ring-[#f6c042]/20 focus:border-[#f6c042] outline-none"
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Documento (RG/CPF)</label>
                           <input 
                             type="text" 
                             required
                             value={formDocumento}
                             onChange={(e) => setFormDocumento(e.target.value)}
                             placeholder="Apenas números e traços"
                             className="w-full rounded-xl border border-stone-200 bg-white p-3 text-stone-800 focus:ring-2 focus:ring-[#f6c042]/20 focus:border-[#f6c042] outline-none"
                           />
                         </div>
                       </div>
                       
                       <div className="mt-4 flex gap-3">
                          <button 
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-5 py-3 rounded-xl border border-stone-200 font-bold text-stone-500 hover:bg-stone-100 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button 
                            type="submit"
                            disabled={salvando}
                            className="flex-1 max-w-[200px] flex items-center justify-center bg-[#f6c042] text-stone-800 font-black rounded-xl hover:bg-[#eab331] transition-colors disabled:opacity-50"
                          >
                            {salvando ? <Loader2 size={18} className="animate-spin" /> : "Salvar Passageiro"}
                          </button>
                       </div>
                    </form>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  MapPin,
  Users,
  CalendarDays,
  Loader2,
  Plus,
  X,
  Ticket,
  ChevronRight,
  Search,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Calendar
} from "lucide-react";
import { usePainelAdmin } from "@/src/presentation/hooks/usePainelAdmin";

interface AdminViagem {
  id: number;
  titulo: string;
  data_partida: string;
  status: string;
  vagas_totais: number;
  reservas_por_status: Record<string, number>;
}

interface LiderReserva {
  id: number;
  id_viagem: number;
  titulo_viagem: string;
  data_partida_viagem: string;
  qtd_vagas: number;
  status: string;
}


const cards = [
  { title: "Viagens Ativas", id: "ativas", icon: MapPin, accent: "bg-viaje-primary/10 text-viaje-primary" },
  { title: "Solicitações", id: "solicitacoes", icon: Ticket, accent: "bg-viaje-secondary/10 text-viaje-secondary" },
] as const;

export default function PainelPage() {
  const {
    usuario, viagensAdmin, reservas, carregando, exibirForm, setExibirForm,
    paginaAtual, setPaginaAtual, novaViagem, setNovaViagem, criando, msgSucesso, erroForm, handleCriarViagem,
  } = usePainelAdmin();

  if (carregando) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-stone-50 text-viaje-primary">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (!usuario) return null;

  const papelAmigavel = usuario.ehAdmin ? "Administrador" : "Líder";

  // Resumo para ADMIN (usa viagensAdmin — raw API response)
  const resumoAtivasAdmin = viagensAdmin.filter(v => v.status === "ATIVO").length;
  const resumoSolicitacoesAdmin = viagensAdmin.reduce((acc, v) => acc + (v.reservas_por_status?.SOLICITADO || 0), 0);

  // Resumo para LIDER (usa Reserva entities)
  const resumoAtivasLider = Array.from(new Set(reservas.filter(r => r.status !== "CANCELADO").map(r => r.idViagem))).length;
  const resumoSolicitacoesLider = reservas.filter(r => r.status === "SOLICITADO").length;
  const resumoGruposLider = reservas.filter(r => r.status === "CONFIRMADO" || r.status === "BLOQUEADO").length;


  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Painel */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-viaje-primary/10 text-viaje-primary shadow-sm">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-800 tracking-tight">
                Olá, {papelAmigavel} {usuario.nomeExibicao}!
              </h1>
              <p className="text-stone-500 font-medium">Bora organizar as próximas aventuras?</p>
            </div>
          </div>

          {usuario.ehAdmin && (
            <button
              onClick={() => setExibirForm(true)}
              className="flex items-center justify-center gap-2 bg-viaje-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Plus size={20} />
              Nova Viagem
            </button>
          )}

          {usuario.tipo === "LIDER" && (
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-viaje-secondary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Search size={20} />
              Nova Reserva
            </Link>
          )}
        </div>

        {/* Cards Informativos */}
        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 mb-12`}>
          {cards.map((card) => {
            let value = "--";
            if (usuario.tipo === "ADMIN") {
              if (card.id === "ativas") value = String(resumoAtivasAdmin);
              if (card.id === "solicitacoes") value = String(resumoSolicitacoesAdmin);
            } else if (usuario.tipo === "LIDER") {
              if (card.id === "ativas") value = String(resumoAtivasLider);
              if (card.id === "solicitacoes") value = String(resumoSolicitacoesLider);
            }
            return (
              <div
                key={card.id}
                className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.accent}`}>
                  <card.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    {usuario.tipo === "LIDER" && card.id === "ativas" ? "Minhas Viagens Ativas" :
                      usuario.tipo === "LIDER" && card.id === "solicitacoes" ? "Reservas Pendentes" :
                        card.title}
                  </p>
                  <p className="text-3xl font-black text-stone-800">{value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Seção Expansível de Cadastro (Admin) */}
        {usuario.tipo === "ADMIN" && (
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${exibirForm ? "max-h-[1200px] opacity-100 mb-12" : "max-h-0 opacity-0"}`}>
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-stone-800">Nova Viagem</h3>
                  <p className="text-stone-500 text-sm">Preencha os dados da próxima aventura</p>
                </div>
                <button onClick={() => setExibirForm(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-400">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCriarViagem} className="p-8 space-y-6">
                {msgSucesso && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-3 font-bold">
                    <CheckCircle2 size={20} /> {msgSucesso}
                  </div>
                )}
                {erroForm && (
                  <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-3 font-bold">
                    <AlertCircle size={20} /> {erroForm}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Título da Viagem</label>
                    <input
                      type="text"
                      required
                      value={novaViagem.titulo}
                      onChange={e => setNovaViagem({ ...novaViagem, titulo: e.target.value })}
                      placeholder="Ex: Final de Semana em Campos do Jordão"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Data de Partida</label>
                    <input
                      type="date"
                      required
                      value={novaViagem.dataPartida}
                      onChange={e => setNovaViagem({...novaViagem, dataPartida: e.target.value})}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Data de Retorno</label>
                    <input
                      type="date"
                      value={novaViagem.dataRetorno}
                      onChange={e => setNovaViagem({...novaViagem, dataRetorno: e.target.value})}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Vagas Totais</label>
                    <input
                      type="number"
                      required
                      value={novaViagem.vagasTotais}
                      onChange={e => setNovaViagem({...novaViagem, vagasTotais: Number(e.target.value)})}
                      placeholder="40"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">URL da Foto de Capa</label>
                    <input
                      type="url"
                      value={novaViagem.urlCapa}
                      onChange={e => setNovaViagem({...novaViagem, urlCapa: e.target.value})}
                      placeholder="Ex: https://imagem.com/foto.jpg"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Resumo de Preços</label>
                    <input
                      type="text"
                      required
                      value={novaViagem.descricaoPrecos}
                      onChange={e => setNovaViagem({...novaViagem, descricaoPrecos: e.target.value})}
                      placeholder="Ex: R$ 350 (Adultos)"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Descrição Curta (para a Home)</label>
                    <input
                      type="text"
                      required
                      maxLength={255}
                      value={novaViagem.descricaoCurta}
                      onChange={e => setNovaViagem({...novaViagem, descricaoCurta: e.target.value})}
                      placeholder="Uma frase marcante sobre a viagem"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Itens Inclusos</label>
                    <textarea
                      rows={3}
                      required
                      value={novaViagem.itensInclusos}
                      onChange={e => setNovaViagem({...novaViagem, itensInclusos: e.target.value})}
                      placeholder="Ex: Transporte, Guia, Seguro (separe por vírgula)"
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setExibirForm(false)}
                    className="flex-1 py-4 border border-stone-200 text-stone-500 rounded-2xl font-bold hover:bg-stone-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={criando}
                    className="flex-[2] py-4 bg-viaje-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {criando ? <Loader2 size={24} className="animate-spin" /> : "Criar Viagem"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listagem de Viagens (Admin) */}
        {usuario.tipo === "ADMIN" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-stone-800 flex items-center gap-2">
                <MapPin size={22} className="text-primary" />
                Viagens Cadastradas
              </h2>
            </div>

            {viagensAdmin.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-stone-200 bg-white p-20 text-center">
                <p className="text-stone-400 font-medium">Nenhuma viagem encontrada. Comece criando uma!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {viagensAdmin.map((v) => (
                  <div key={v.id} className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <Link href={`/painel/kanban/${v.id}`} className="flex items-center gap-4 group/item">
                      <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-primary font-bold group-hover/item:bg-primary/10 transition-colors">
                        {v.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800 text-lg group-hover/item:text-primary transition-colors">{v.titulo}</h4>
                        <div className="flex gap-4 mt-1">
                          <span className="text-sm text-stone-500 flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {v.data_partida ? new Date(v.data_partida).toLocaleDateString() : "---"}
                          </span>
                          <span className="text-sm text-stone-500 flex items-center gap-1.5">
                            <Users size={14} />
                            {v.vagas_totais} vagas totais
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            v.status === 'ATIVO' ? 'bg-emerald-100 text-emerald-700' :
                            v.status === 'FINALIZADO' ? 'bg-stone-200 text-stone-600' :
                            v.status === 'ESGOTADO' ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {v.status === 'FINALIZADO' ? 'Finalizada' : v.status}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {Object.entries(v.reservas_por_status || {}).map(([key, val]) => (
                          val > 0 && (
                            <div
                              key={key}
                              title={`${val} ${key}`}
                              className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-black shadow-sm
                                   ${key === "SOLICITADO" ? "bg-amber-100 text-amber-700" :
                                  key === "CONFIRMADO" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}`}
                            >
                              {val}
                            </div>
                          )
                        ))}
                      </div>
                      <Link
                        href={`/painel/kanban/${v.id}`}
                        className="p-2.5 rounded-xl bg-stone-50 text-stone-400 hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Listagem de Reservas (Líder) */}
        {usuario.tipo === "LIDER" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-stone-800 flex items-center gap-2">
                <Ticket size={22} className="text-secondary" />
                Minhas Viagens e Reservas
              </h2>
            </div>

            {reservas.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-stone-200 bg-white p-20 text-center">
                <Users size={48} className="mx-auto text-stone-200 mb-4" />
                <h3 className="text-xl font-bold text-stone-800">Suas Viagens aparecerão aqui</h3>
                <p className="text-stone-400 mt-2">Você ainda não tem grupos ou reservas confirmadas.</p>
                <Link href="/" className="inline-block mt-8 bg-viaje-secondary text-white px-8 py-3 rounded-2xl font-bold shadow-md">
                  Explorar Destinos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reservas.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold
                          ${(r.dataPartidaViagem && new Date(r.dataPartidaViagem) < new Date()) ? "bg-stone-100 text-stone-500" :
                            r.status === "SOLICITADO" ? "bg-amber-100 text-amber-700" :
                          r.status === "CONFIRMADO" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                        R{r.id}
                      </div>
                      <div>
                           <h4 className="font-bold text-stone-800 text-sm mb-3 leading-tight">{r.tituloViagem || `Reserva #${r.id}`}</h4>
                        <div className="flex gap-4 mt-1">
                          <span className="text-sm text-stone-500 flex items-center gap-1.5">
                            <Calendar size={12} /> Partida: {r.dataPartidaViagem ? new Date(r.dataPartidaViagem).toLocaleDateString('pt-BR') : 'TBA'}
                          </span>
                          <span className="text-sm text-stone-500 flex items-center gap-1.5">
                            <Users size={14} />
                              <span>{r.qtdVagas} {r.qtdVagas === 1 ? 'vaga' : 'vagas'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">Status</p>
                        <span className={`text-sm font-black
                             ${(r.dataPartidaViagem && new Date(r.dataPartidaViagem) < new Date()) ? "text-stone-500" :
                               r.status === "SOLICITADO" ? "text-amber-500" :
                               r.status === "CONFIRMADO" ? "text-emerald-500" :
                               r.status === "CANCELADO" ? "text-rose-500" : "text-stone-500"}`}>
                          {(r.dataPartidaViagem && new Date(r.dataPartidaViagem) < new Date()) ? "FINALIZADA" : r.status.replace('_', ' ')}
                        </span>
                      </div>
                      <Link
                        href={`/reservas/${r.id}`}
                        className="flex items-center gap-2 bg-stone-100 text-stone-600 px-5 py-2.5 rounded-xl font-bold hover:bg-viaje-primary/10 hover:text-viaje-primary transition-all"
                      >
                        Ver Detalhes
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



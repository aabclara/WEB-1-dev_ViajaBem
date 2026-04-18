"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2
} from "lucide-react";
import { getAuthToken, API_URL, getAuthUser } from "@/src/lib/auth";

export default function EditarViagemPage() {
  const { id } = useParams();
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState("");
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    descricao_precos: "",
    data_partida: "",
    data_retorno: "",
    vagas_totais: 0,
    descricao_curta: "",
    itens_inclusos: "",
    status: "ATIVO",
    url_capa: ""
  });

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.tipo !== "ADMIN") {
      router.push("/painel");
      return;
    }

    const carregarViagem = async () => {
      const token = getAuthToken();
      try {
        const res = await fetch(`${API_URL}/viagens/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setForm({
            titulo: data.titulo,
            descricao_precos: data.descricao_precos || "",
            data_partida: data.data_partida,
            vagas_totais: data.vagas_totais,
            descricao_curta: data.descricao_curta || "",
            itens_inclusos: data.itens_inclusos || "",
            status: data.status,
            data_retorno: data.data_retorno || "",
            url_capa: data.url_capa || ""
          });
        } else {
          throw new Error("Falha ao carregar dados da viagem");
        }
      } catch (err: any) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarViagem();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    const token = getAuthToken();

    try {
      const res = await fetch(`${API_URL}/admin/viagens/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMsgSucesso("Alterações salvas com sucesso!");
        setTimeout(() => {
          router.push(`/painel/kanban/${id}`);
        }, 1500);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Erro ao salvar alterações");
      }
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-50 text-viaje-primary">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  if (erro && !form.titulo) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-stone-50 p-8 text-center">
        <AlertCircle size={48} className="text-error mb-4" />
        <h2 className="text-2xl font-bold text-stone-800">Ops! Algo deu errado</h2>
        <p className="text-stone-500 mt-2">{erro}</p>
        <Link href="/painel" className="mt-8 bg-viaje-primary text-white px-8 py-3 rounded-2xl font-bold">
          Voltar ao Painel
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="bg-white border-b border-stone-200 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-3xl flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-3 hover:bg-stone-100 rounded-2xl transition-colors text-stone-400"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-stone-800 tracking-tight">Editar Viagem</h1>
              <p className="text-stone-500 text-sm font-bold opacity-70">ID #{id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl">
           <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                 {msgSucesso && (
                   <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center gap-3 font-bold">
                     <CheckCircle2 size={20} /> {msgSucesso}
                   </div>
                 )}
                 {erro && (
                   <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-error flex items-center gap-3 font-bold">
                     <AlertCircle size={20} /> {erro}
                   </div>
                 )}

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                       <label className="block text-sm font-bold text-stone-700 mb-2">Título da Viagem</label>
                       <input
                         type="text"
                         required
                         value={form.titulo}
                         onChange={e => setForm({...form, titulo: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-stone-700 mb-2">Data de Partida</label>
                       <input
                         type="date"
                         required
                         value={form.data_partida}
                         onChange={e => setForm({...form, data_partida: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-stone-700 mb-2">Data de Retorno</label>
                       <input
                         type="date"
                         value={form.data_retorno}
                         onChange={e => setForm({...form, data_retorno: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>
                    
                    <div>
                       <label className="block text-sm font-bold text-stone-700 mb-2">Vagas Totais</label>
                       <input
                         type="number"
                         required
                         value={form.vagas_totais}
                         onChange={e => setForm({...form, vagas_totais: Number(e.target.value)})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-stone-700 mb-2">URL da Foto de Capa</label>
                       <input
                         type="url"
                         value={form.url_capa}
                         onChange={e => setForm({...form, url_capa: e.target.value})}
                         placeholder="Ex: https://imagem.com/foto.jpg"
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>

                    <div className="sm:col-span-2">
                       <label className="block text-sm font-bold text-stone-700 mb-2">Resumo de Preços</label>
                       <input
                         type="text"
                         required
                         value={form.descricao_precos}
                         onChange={e => setForm({...form, descricao_precos: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>

                    <div className="sm:col-span-2">
                       <label className="block text-sm font-bold text-stone-700 mb-2">Descrição Curta (Home)</label>
                       <input
                         type="text"
                         required
                         value={form.descricao_curta}
                         onChange={e => setForm({...form, descricao_curta: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>

                    <div className="sm:col-span-2">
                       <label className="block text-sm font-bold text-stone-700 mb-2">Itens Inclusos</label>
                       <textarea
                         rows={4}
                         required
                         value={form.itens_inclusos}
                         onChange={e => setForm({...form, itens_inclusos: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                       ></textarea>
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-stone-700 mb-2">Status da Viagem</label>
                       <select 
                         value={form.status}
                         onChange={e => setForm({...form, status: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       >
                          <option value="ATIVO">Ativo</option>
                          <option value="ESGOTADO">Esgotado</option>
                          <option value="CANCELADO">Cancelado</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-stone-100 flex gap-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 py-4 border border-stone-200 text-stone-500 rounded-2xl font-bold hover:bg-stone-50 transition-colors"
                    >
                      Descartar
                    </button>
                    <button
                      type="submit"
                      disabled={salvando}
                      className="flex-[2] py-4 bg-viaje-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {salvando ? <Loader2 size={24} className="animate-spin" /> : <><Save size={20} /> Salvar Alterações</>}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Save, User, Lock, Mail, CreditCard, CalendarDays, Phone } from "lucide-react";
import { apiClient } from "@/src/lib/services/apiClient";
import { getAuthUser } from "@/src/lib/auth";

export default function PerfilPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState("");
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    nome: "",
    apelido: "",
    email: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    tipo: "",
    senha: "",
  });

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const carregarPerfil = async () => {
      try {
        const data = await apiClient.get("/auth/me");
        setForm({
          nome: data.nome || "",
          apelido: data.apelido || "",
          email: data.email || "",
          cpf: data.cpf || "",
          telefone: data.telefone || "",
          data_nascimento: data.data_nascimento || "",
          tipo: data.tipo || "",
          senha: "",
        });
      } catch (err: any) {
        setErro("Não foi possível carregar o perfil.");
      } finally {
        setCarregando(false);
      }
    };

    carregarPerfil();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setMsgSucesso("");

    try {
      const payload: any = {
        nome: form.nome,
        apelido: form.apelido,
        telefone: form.telefone,
      };
      if (form.senha.trim()) {
        payload.senha = form.senha;
      }

      const res = await apiClient.patch("/auth/me", payload);
      setMsgSucesso("Perfil atualizado com sucesso!");
      
      // Update local storage auth user name if it changed
      const currentUser = JSON.parse(localStorage.getItem("viaje-bem-user") || "{}");
      let mudouHeader = false;
      
      if (currentUser.nome !== form.nome) {
        currentUser.nome = form.nome;
        mudouHeader = true;
      }
      if (currentUser.apelido !== form.apelido) {
        currentUser.apelido = form.apelido;
        mudouHeader = true;
      }
      
      if (mudouHeader) {
        localStorage.setItem("viaje-bem-user", JSON.stringify(currentUser));
      }
      
      setForm((prev) => ({ ...prev, senha: "" }));
      
      if (mudouHeader) {
        window.location.reload();
      } else {
        setTimeout(() => {
          setMsgSucesso("");
        }, 3000);
      }
    } catch (err: any) {
      setErro(err.message || "Erro ao salvar alterações");
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

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-20">
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
              <h1 className="text-2xl font-black text-stone-800 tracking-tight">Meu Perfil</h1>
              <p className="text-stone-500 text-sm font-bold opacity-70">Visualize e edite seus dados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl">
           <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
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
                    {/* Campos Editáveis */}
                    <div className="sm:col-span-2">
                       <h3 className="text-lg font-black text-stone-800 border-b border-stone-100 pb-2 mb-4">Dados Principais</h3>
                    </div>

                    <div className="sm:col-span-2">
                       <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><User size={16}/> Nome Completo</label>
                       <input
                         type="text"
                         required
                         value={form.nome}
                         onChange={e => setForm({...form, nome: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-stone-700 mb-2">Apelido</label>
                       <input
                         type="text"
                         value={form.apelido}
                         onChange={e => setForm({...form, apelido: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Phone size={16}/> Telefone (WhatsApp)</label>
                       <input
                         type="tel"
                         required
                         value={form.telefone}
                         onChange={e => setForm({...form, telefone: e.target.value})}
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                    </div>

                    <div className="sm:col-span-2 mt-4">
                       <h3 className="text-lg font-black text-stone-800 border-b border-stone-100 pb-2 mb-4">Segurança</h3>
                    </div>

                    <div className="sm:col-span-2">
                       <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Lock size={16}/> Nova Senha</label>
                       <input
                         type="password"
                         value={form.senha}
                         onChange={e => setForm({...form, senha: e.target.value})}
                         placeholder="Deixe em branco para não alterar"
                         className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                       />
                       <p className="text-xs text-stone-400 mt-2">Ao preencher este campo, sua senha atual será substituída.</p>
                    </div>

                    <div className="sm:col-span-2 mt-4">
                       <h3 className="text-lg font-black text-stone-800 border-b border-stone-100 pb-2 mb-4 text-stone-400">Dados Protegidos (Apenas Leitura)</h3>
                    </div>

                    <div className="opacity-60">
                       <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><Mail size={16}/> E-mail</label>
                       <input
                         type="email"
                         disabled
                         value={form.email}
                         className="w-full rounded-xl border border-stone-200 bg-stone-100 p-3 text-stone-500 cursor-not-allowed"
                       />
                    </div>

                    <div className="opacity-60">
                       <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><CreditCard size={16}/> CPF</label>
                       <input
                         type="text"
                         disabled
                         value={form.cpf}
                         className="w-full rounded-xl border border-stone-200 bg-stone-100 p-3 text-stone-500 cursor-not-allowed"
                       />
                    </div>

                    <div className="opacity-60 sm:col-span-2">
                       <label className="block text-sm font-bold text-stone-700 mb-2 flex items-center gap-2"><CalendarDays size={16}/> Data de Nascimento</label>
                       <input
                         type="date"
                         disabled
                         value={form.data_nascimento}
                         className="w-full rounded-xl border border-stone-200 bg-stone-100 p-3 text-stone-500 cursor-not-allowed"
                       />
                    </div>
                 </div>

                 <div className="pt-8 border-t border-stone-100 flex gap-4">
                    <button
                      type="submit"
                      disabled={salvando}
                      className="w-full py-4 bg-viaje-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

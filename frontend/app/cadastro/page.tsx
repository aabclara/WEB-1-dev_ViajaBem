"use client";

import { useState } from "react";
import { UserPlus, Mail, Lock, User, Phone, CreditCard, Calendar, Loader2, Eye, EyeOff } from "lucide-react";
import { API_URL, saveAuthData } from "@/src/lib/auth";

export default function CadastroPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // 1. Criar a conta
      const resCadastro = await fetch(`${API_URL}/auth/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tipo: "LIDER",
        }),
      });

      const dataCadastro = await resCadastro.json();

      if (!resCadastro.ok) {
        throw new Error(dataCadastro.detail || "Erro ao realizar cadastro");
      }

      // 2. Login automático se o cadastro deu certo
      const loginParams = new URLSearchParams();
      loginParams.append("username", formData.email);
      loginParams.append("password", formData.senha);

      const resLogin = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: loginParams,
      });

      if (!resLogin.ok) {
        // Se falhar o login automático, manda pro manual
        window.location.href = "/login?msg=cadastro_ok";
        return;
      }

      const dataLogin = await resLogin.json();
      saveAuthData(dataLogin);
      
      // 3. Sucesso e Redirecionamento direto
      window.location.href = "/painel";
      
    } catch (err: any) {
      setErro(err.message);
      setCarregando(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-stone-50 py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-variant bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-bold text-on-background">Cadastro</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Crie sua conta para começar a viajar
          </p>
        </div>

        {erro && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-medium">
            {erro}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-on-surface mb-1.5">
              Nome completo
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome"
                className="w-full rounded-lg border border-outline bg-white py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-on-surface mb-1.5">
                CPF
              </label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  id="cpf"
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="w-full rounded-lg border border-outline bg-white py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="data_nascimento" className="block text-sm font-medium text-on-surface mb-1.5">
                Nascimento
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  id="data_nascimento"
                  type="date"
                  required
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-outline bg-white py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-on-surface mb-1.5">
              Telefone
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="telefone"
                type="tel"
                required
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="w-full rounded-lg border border-outline bg-white py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-outline bg-white py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-on-surface mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                required
                value={formData.senha}
                onChange={handleChange}
                placeholder="Crie uma senha"
                className="w-full rounded-lg border border-outline bg-white py-2.5 pl-10 pr-10 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition-colors"
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-full bg-secondary py-2.5 text-sm font-semibold text-on-primary transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 mt-4"
          >
            {carregando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Criar Conta"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Já tem uma conta?{" "}
          <a href="/login" className="font-medium text-secondary hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}


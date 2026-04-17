"use client";

import { useState } from "react";
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { API_URL, saveAuthData } from "@/src/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      // FastAPI OAuth2 espera Form Data (username/password)
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", senha);

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Falha ao entrar");
      }

      saveAuthData(data);
      window.location.href = "/painel";
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-stone-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-viaje-primary/10 text-viaje-primary">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-bold text-stone-800">Login</h1>
          <p className="mt-1 text-sm text-viaje-neutral">
            Entre na sua conta para continuar
          </p>
        </div>

        {erro && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-medium">
            {erro}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-viaje-neutral" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-stone-300 bg-stone-50 py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:border-viaje-primary focus:outline-none focus:ring-2 focus:ring-viaje-primary/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-stone-700 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-viaje-neutral" />
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                className="w-full rounded-lg border border-stone-300 bg-stone-50 py-2.5 pl-10 pr-10 text-sm text-stone-800 placeholder:text-stone-400 focus:border-viaje-primary focus:outline-none focus:ring-2 focus:ring-viaje-primary/20"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-viaje-neutral hover:text-viaje-primary transition-colors"
                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-full bg-viaje-primary py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {carregando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-viaje-neutral">
          Ainda nao tem conta?{" "}
          <a href="/cadastro" className="font-medium text-viaje-primary hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}


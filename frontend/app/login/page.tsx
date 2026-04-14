import { LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
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

        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-viaje-neutral" />
              <input
                id="email"
                type="email"
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
                type="password"
                placeholder="Sua senha"
                className="w-full rounded-lg border border-stone-300 bg-stone-50 py-2.5 pl-10 pr-4 text-sm text-stone-800 placeholder:text-stone-400 focus:border-viaje-primary focus:outline-none focus:ring-2 focus:ring-viaje-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-viaje-primary py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Entrar
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

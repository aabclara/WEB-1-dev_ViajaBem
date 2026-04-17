import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function CadastroPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-stone-50 px-4">
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

        <form className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-on-surface mb-1.5">
              Nome completo
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                id="nome"
                type="text"
                placeholder="Seu nome"
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
                type="password"
                placeholder="Crie uma senha"
                className="w-full rounded-lg border border-outline bg-white py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-secondary py-2.5 text-sm font-semibold text-on-primary transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Criar Conta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Ja tem uma conta?{" "}
          <a href="/login" className="font-medium text-secondary hover:underline">
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}

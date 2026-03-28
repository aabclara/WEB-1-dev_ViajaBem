import { Bus } from "lucide-react";

export default function PaginaInicial() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="flex items-center gap-3 mb-6 text-blue-600 dark:text-blue-400">
        <Bus size={48} strokeWidth={2.5} />
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Viaje Bem
        </h1>
      </div>
      
      <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
        Bem-vindo à sua plataforma de gestão de combos de viagens. 
        Explore destinos incríveis e gerencie seus grupos com facilidade.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95">
          Ver Viagens Disponíveis
        </button>
        <button className="px-6 py-3 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 font-semibold rounded-lg transition-all shadow-sm active:scale-95">
          Área do Líder
        </button>
      </div>

      <footer className="mt-16 text-sm text-slate-500">
        © {new Date().getFullYear()} Viaje Bem — Todos os direitos reservados.
      </footer>
    </div>
  );
}

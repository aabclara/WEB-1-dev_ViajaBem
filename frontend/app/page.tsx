import { Bus, SearchX } from "lucide-react";
import { ViagemCard } from "@/src/components/ViagemCard";
import type { Viagem } from "@/src/types/viagem";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchViagens(): Promise<Viagem[]> {
  try {
    const res = await fetch(`${API_URL}/viagens/`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function PaginaInicial() {
  const viagens = await fetchViagens();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-stone-100 to-white">
      {/* Hero */}
      <section className="flex flex-col items-center px-4 pt-16 pb-10 text-center">
        <div className="flex items-center gap-3 mb-4 text-viaje-primary">
          <Bus size={48} strokeWidth={2.5} />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Viaje Bem
          </h1>
        </div>

        <p className="max-w-xl text-lg text-viaje-neutral leading-relaxed">
          Explore destinos incriveis e reserve sua proxima viagem com facilidade.
        </p>
      </section>

      {/* Viagens Grid */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-xl font-semibold text-stone-800">
          Viagens Disponiveis
        </h2>

        {viagens.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {viagens.map((viagem) => (
              <ViagemCard key={viagem.id} viagem={viagem} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-16 text-center">
            <SearchX size={40} className="mb-3 text-viaje-neutral/40" />
            <p className="text-viaje-neutral font-medium">
              Nenhuma viagem disponivel no momento.
            </p>
            <p className="mt-1 text-sm text-viaje-neutral/70">
              Volte em breve para conferir novas oportunidades.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-viaje-neutral/70">
        &copy; {new Date().getFullYear()} Viaje Bem — Todos os direitos reservados.
      </footer>
    </div>
  );
}

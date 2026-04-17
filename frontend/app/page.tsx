import Link from "next/link";
import { CalendarCheck, SearchX, Bus } from "lucide-react";
import type { Viagem } from "@/src/types/viagem";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000";

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

function ViagemCard({ viagem }: { viagem: Viagem }) {
  const ocupacao = viagem.vagas_totais > 0
    ? Math.round(((viagem.vagas_totais - viagem.vagas_disponiveis) / viagem.vagas_totais) * 100)
    : 0;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      {/* Image area */}
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-container-high">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/10 to-surface-container-high">
          <CalendarCheck size={48} className="text-primary/40" />
        </div>

        {/* Badge */}
        {viagem.ultimas_vagas && (
          <div className="absolute top-4 right-4 bg-error text-on-error text-sm font-bold px-3 py-1 rounded-full shadow-sm">
            Ultimas Vagas
          </div>
        )}
        {!viagem.ultimas_vagas && ocupacao >= 70 && (
          <div className="absolute top-4 right-4 bg-primary text-on-primary text-sm font-bold px-3 py-1 rounded-full shadow-sm">
            Em Alta
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-on-background">
          {viagem.titulo}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          {viagem.descricao_precos ? (
            <>
              <span className="text-primary text-2xl font-black">
                {viagem.descricao_precos}
              </span>
            </>
          ) : (
            <span className="text-on-surface-variant text-sm font-medium">
              Consulte valores
            </span>
          )}
        </div>

        {/* Occupation bar */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-on-background">Ocupacao</span>
            <span className={viagem.ultimas_vagas ? "text-error" : "text-primary"}>
              {ocupacao}%
            </span>
          </div>
          <div className="h-3 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${ocupacao}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link href={`/viagens/${viagem.id}`}>
          <button className="w-full h-14 bg-secondary text-on-secondary rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform">
            <CalendarCheck size={20} />
            Reservar Agora
          </button>
        </Link>
      </div>
    </div>
  );
}

export default async function PaginaInicial() {
  const viagens = await fetchViagens();

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 flex flex-col items-center text-center pt-10">
        <div className="mb-10">
          <div className="mx-auto flex items-center justify-center gap-3">
            <Bus size={48} strokeWidth={2.2} className="text-primary" />
            <span className="text-4xl font-black tracking-tighter text-on-background">
              Viaje Bem
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-on-background max-w-4xl mb-4">
          Viagens rápidas. <br />
          Experiências inesquecíveis.
        </h1>

        <p className="text-base font-medium text-on-surface-variant max-w-2xl mb-10">
          A forma mais inteligente de viajar. Conforto e segurança garantidos!
        </p>

        <div className="flex flex-row gap-6">
          <Link
            href="#viagens"
            className="h-14 px-10 bg-primary text-on-primary rounded-xl font-bold text-lg shadow-sm hover:scale-[1.02] transition-transform active:scale-95 flex items-center"
          >
            Explorar Destinos
          </Link>
          <Link
            href="/sobre"
            className="h-14 px-10 bg-secondary text-on-secondary rounded-xl font-bold text-lg shadow-sm hover:scale-[1.02] transition-transform active:scale-95 flex items-center"
          >
            Conheça nossa agência
          </Link>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="viagens" className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-extrabold text-on-background tracking-tight">
            Próximas Saídas
          </h2>
          <div className="h-1 w-24 bg-primary rounded-full" />
        </div>

        {viagens.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {viagens.map((viagem) => (
              <ViagemCard key={viagem.id} viagem={viagem} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest py-16 text-center shadow-sm">
            <SearchX size={40} className="mb-3 text-on-surface-variant/40" />
            <p className="text-on-surface-variant font-medium">
              Nenhuma viagem disponível no momento.
            </p>
            <p className="mt-1 text-sm text-on-surface-variant/70">
              Volte em breve para conferir novas oportunidades.
            </p>
          </div>
        )}
      </section>

    </div>
  );
}

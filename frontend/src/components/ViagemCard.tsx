import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import type { Viagem } from "@/src/types/viagem";

interface ViagemCardProps {
  viagem: Viagem;
}

export function ViagemCard({ viagem }: ViagemCardProps) {
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
            <span className="text-primary text-2xl font-black">
              {viagem.descricao_precos}
            </span>
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

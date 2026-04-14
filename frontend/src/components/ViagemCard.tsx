import { MapPin, CalendarDays, Users } from "lucide-react";
import { Button } from "@/src/components/Button";
import type { Viagem } from "@/src/types/viagem";

interface ViagemCardProps {
  viagem: Viagem;
}

export function ViagemCard({ viagem }: ViagemCardProps) {
  /** Format ISO date to locale "23 abr. 2026" */
  const dataFormatada = new Date(viagem.data_partida + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  /** Derive destination from title (e.g. "Bertioga - 2026.1" → "Bertioga") */
  const destino = viagem.titulo.split("-")[0]?.trim() ?? viagem.titulo;

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-stone-800 leading-snug">
          {viagem.titulo}
        </h3>

        {viagem.descricao_precos && (
          <p className="mt-1 text-sm text-viaje-neutral line-clamp-2">
            {viagem.descricao_precos}
          </p>
        )}

        {/* Meta info */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-viaje-neutral">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-viaje-primary" />
            {destino}
          </span>

          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-viaje-primary" />
            {dataFormatada}
          </span>

          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-viaje-primary" />
            {viagem.vagas_disponiveis}/{viagem.vagas_totais} vagas
          </span>
        </div>

        {/* Ultimas vagas badge */}
        {viagem.ultimas_vagas && (
          <span className="mt-3 inline-block rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold text-red-700">
            Ultimas vagas
          </span>
        )}
      </div>

      {/* Action */}
      <div className="mt-6">
        <Button variant="primary" className="w-full">
          Ver Detalhes
        </Button>
      </div>
    </article>
  );
}

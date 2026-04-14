import { LayoutDashboard, MapPin, Users, CalendarDays } from "lucide-react";

const cards = [
  {
    title: "Viagens Ativas",
    value: "--",
    icon: MapPin,
    accent: "bg-viaje-primary/10 text-viaje-primary",
  },
  {
    title: "Grupos",
    value: "--",
    icon: Users,
    accent: "bg-viaje-secondary/10 text-viaje-secondary",
  },
  {
    title: "Proximos Embarques",
    value: "--",
    icon: CalendarDays,
    accent: "bg-viaje-tertiary/10 text-viaje-tertiary",
  },
] as const;

export default function PainelPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Titulo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-viaje-primary/10 text-viaje-primary">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Painel do Lider</h1>
            <p className="text-sm text-viaje-neutral">
              Gerencie suas viagens e grupos
            </p>
          </div>
        </div>

        {/* Cards resumo */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
          {cards.map(({ title, value, icon: Icon, accent }) => (
            <div
              key={title}
              className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm text-viaje-neutral">{title}</p>
                <p className="text-2xl font-bold text-stone-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder de conteudo */}
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-viaje-neutral">
            Area de gestao — conteudo sera adicionado em breve.
          </p>
        </div>
      </div>
    </div>
  );
}

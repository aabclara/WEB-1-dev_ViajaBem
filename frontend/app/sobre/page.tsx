import Link from "next/link";
import { Bus } from "lucide-react";

export const metadata = {
  title: "Sobre - Viaje Bem",
  description: "História, missão, propósito e objetivo da agência Viaje Bem.",
};

export default function SobrePage() {
  return (
    <section className="max-w-4xl mx-auto px-8 py-20 text-on-background">
      <div className="flex items-center gap-4 mb-8">
        <Bus size={48} className="text-primary" />
        <h1 className="text-4xl font-black tracking-tighter">Sobre a Viaje Bem</h1>
      </div>
      <article className="space-y-6 text-lg leading-relaxed">
        <p>
          <strong>Missão:</strong> Facilitar viagens coletivas acessíveis, proporcionando conforto, segurança e economia para grupos de amigos, famílias e comunidades.
        </p>
        <p>
          <strong>Propósito:</strong> Conectar pessoas a destinos incríveis por meio de uma plataforma inteligente que otimiza a ocupação dos veículos, reduzindo custos e impactos ambientais.
        </p>
        <p>
          <strong>Objetivo:</strong> Tornar a experiência de viajar em grupo tão simples quanto reservar um voo individual, oferecendo transparência nos preços, suporte dedicado e opções personalizadas para cada tipo de viagem.
        </p>
        <p>
          Desde a sua fundação, a Viaje Bem tem investido em tecnologia de ponta e em parcerias estratégicas para garantir que cada viagem seja planejada com excelência e entregue com qualidade.
        </p>
        <Link
          href="/"
          className="inline-block mt-8 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
        >
          Voltar à Home
        </Link>
      </article>
    </section>
  );
}

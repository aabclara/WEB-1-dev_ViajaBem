import Link from "next/link";
import { Database, BarChart3, ShieldCheck, Scale, Home, Mail } from "lucide-react";

export default function TermosPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-16 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-on-background tracking-tighter mb-6">
          Política de Privacidade
        </h1>
        <p className="text-on-surface-variant text-lg font-medium max-w-2xl mx-auto mb-16">
          Sua privacidade é nossa prioridade. Entenda como protegemos seus dados e
          garantimos uma jornada segura através da Viaje Bem.
        </p>

        <div className="space-y-6 text-left">
          {/* Card: Coleta de Dados */}
          <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-6 items-start transition-all border-l-4 border-l-transparent hover:border-l-viaje-tertiary">
            <div className="p-3 rounded-full bg-secondary/10 text-secondary shrink-0">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-background mb-3">Coleta de Dados</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Coletamos informações essenciais para personalizar sua experiência de viagem,
                incluindo nome, e-mail, preferências de destino e dados de transação. Estes
                dados são capturados apenas com seu consentimento explícito durante o uso da
                plataforma.
              </p>
            </div>
          </div>

          {/* Card: Uso das Informações */}
          <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-6 items-start transition-all border-l-4 border-l-transparent hover:border-l-viaje-tertiary">
            <div className="p-3 rounded-full bg-secondary/10 text-secondary shrink-0">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-background mb-3">Uso das Informações</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Utilizamos seus dados para processar reservas, enviar atualizações críticas
                sobre seu itinerário e oferecer sugestões personalizadas através do nosso
                algoritmo de recomendação, garantindo que cada jornada seja única e eficiente.
              </p>
            </div>
          </div>

          {/* Card: Segurança e Proteção */}
          <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-6 items-start transition-all border-l-4 border-l-transparent hover:border-l-viaje-tertiary">
            <div className="p-3 rounded-full bg-secondary/10 text-secondary shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-background mb-3">Segurança e Proteção</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Implementamos protocolos de criptografia de ponta a ponta e auditorias de
                segurança regulares. Seus dados financeiros nunca são armazenados diretamente
                em nossos servidores, utilizando gateways de pagamento certificados
                internacionalmente.
              </p>
            </div>
          </div>

          {/* Card: Seus Direitos */}
          <div className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant/30 shadow-sm flex flex-col md:flex-row gap-6 items-start transition-all border-l-4 border-l-transparent hover:border-l-viaje-tertiary">
            <div className="p-3 rounded-full bg-secondary/10 text-secondary shrink-0">
              <Scale size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-background mb-3">Seus Direitos</h2>
              <p className="text-on-surface-variant leading-relaxed">
                Em conformidade com a LGPD, você possui o direito de acessar, retificar ou
                excluir seus dados a qualquer momento. Nossa interface de usuário permite a
                exportação de seus dados em formatos legíveis por máquina mediante solicitação.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white rounded-lg p-10 border-2 border-primary shadow-sm">
          <h3 className="text-xl font-bold text-on-background mb-4">Ainda tem dúvidas?</h3>
          <p className="text-on-surface-variant mb-8 font-medium">
            Nossa equipe de suporte está pronta para ajudar com qualquer questão legal ou técnica.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95"
            >
              <Home size={18} />
              Voltar ao Início
            </Link>
            <Link
              href="/suporte"
              className="px-8 py-3 bg-secondary text-on-secondary rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95"
            >
              <Mail size={18} />
              Contato Suporte
            </Link>
          </div>
        </div>

        <p className="mt-12 text-on-surface-variant/40 text-xs font-bold uppercase tracking-widest">
          Última atualização: Abril de 2024
        </p>
      </div>
    </div>
  );
}

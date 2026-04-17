import { Bus } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-12 bg-background border-t border-outline-variant/30">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 w-full max-w-7xl mx-auto gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <Bus size={24} strokeWidth={2} className="text-primary" />
            <span className="text-xl font-black text-on-background">Viaje Bem</span>
          </div>
          <p className="text-on-surface-variant font-medium text-sm">
            &copy; {new Date().getFullYear()} Viaje Bem. Sua agência de viagens.
          </p>
        </div>
        <div className="flex gap-8">
          <a className="text-on-surface-variant font-medium text-lg hover:text-primary transition-colors" href="/termos">
            Termos e Privacidade
          </a>
          <a className="text-on-surface-variant font-medium text-lg hover:text-primary transition-colors" href="/suporte">
            Suporte
          </a>
          <a className="text-on-surface-variant font-medium text-lg hover:text-primary transition-colors" href="/contato">
            Contato
          </a>
        </div>
      </div>
    </footer>
  );
}

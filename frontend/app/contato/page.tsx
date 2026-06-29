"use client";

import Link from "next/link";
import { MessageCircle, Mail, Instagram, ArrowLeft, Send } from "lucide-react";

export default function ContatoPage() {
  return (
    <div className="min-h-[80vh] bg-background flex items-center justify-center py-12 px-6 sm:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-surface-container-lowest p-8 sm:p-12 rounded-3xl border border-surface-variant/30 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-on-background mb-3">
            Fale Conosco
          </h1>
          <p className="text-on-surface-variant font-medium text-base sm:text-lg max-w-md mx-auto">
            Quer tirar dúvidas, dar sugestões ou planejar sua próxima aventura? Escolha um canal de atendimento abaixo.
          </p>
        </div>

        {/* Canais de Contato */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-4">
          {/* WhatsApp Card */}
          <div className="relative group overflow-hidden bg-surface-container rounded-2xl p-6 border border-surface-variant/20 hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle size={26} />
            </div>
            <h3 className="font-bold text-lg text-on-background mb-1">WhatsApp</h3>
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mt-2">
              Em Breve
            </span>
          </div>

          {/* Email Card */}
          <div className="relative group overflow-hidden bg-surface-container rounded-2xl p-6 border border-surface-variant/20 hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Mail size={26} />
            </div>
            <h3 className="font-bold text-lg text-on-background mb-1">E-mail</h3>
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mt-2">
              Em Breve
            </span>
          </div>

          {/* Instagram Card */}
          <div className="relative group overflow-hidden bg-surface-container rounded-2xl p-6 border border-surface-variant/20 hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Instagram size={26} />
            </div>
            <h3 className="font-bold text-lg text-on-background mb-1">Instagram</h3>
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mt-2">
              Em Breve
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-surface-variant/30 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
          >
            <ArrowLeft size={18} />
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}

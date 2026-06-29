"use client";

import Link from "next/link";
import { MessageCircle, Mail, Instagram, ArrowLeft, Send } from "lucide-react";

export default function ContatoPage() {
  return (
    <div className="min-h-[80vh] bg-background flex items-center justify-center py-12 px-6 sm:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-surface-container-lowest p-8 sm:p-12 rounded-3xl border border-surface-variant/30 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-on-background mb-3">
            Fale Conosco
          </h1>
          <p className="text-on-surface-variant font-medium text-base sm:text-lg max-w-md mx-auto">
            Quer tirar dúvidas, dar sugestões ou planejar sua próxima aventura? Escolha um canal de atendimento abaixo.
          </p>
        </div>

        {/* Canais de Contato */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-6 border border-surface-variant/30 border-l-[6px] border-l-emerald-500 shadow-sm flex flex-col items-center text-center justify-between gap-4 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-background">WhatsApp</h3>
              <p className="text-sm text-on-surface-variant mt-1">Atendimento rápido por mensagem em breve.</p>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
              Em Breve
            </span>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-3xl p-6 border border-surface-variant/30 border-l-[6px] border-l-secondary shadow-sm flex flex-col items-center text-center justify-between gap-4 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-background">E-mail</h3>
              <p className="text-sm text-on-surface-variant mt-1">Envie suas dúvidas por correio eletrônico.</p>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
              Em Breve
            </span>
          </div>

          {/* Instagram Card */}
          <div className="bg-white rounded-3xl p-6 border border-surface-variant/30 border-l-[6px] border-l-pink-500 shadow-sm flex flex-col items-center text-center justify-between gap-4 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-600 flex items-center justify-center flex-shrink-0">
              <Instagram size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-background">Instagram</h3>
              <p className="text-sm text-on-surface-variant mt-1">Acompanhe nossas novidades e promoções.</p>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap">
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

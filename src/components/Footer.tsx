'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Building,
  FileText,
  HelpCircle,
  BookOpen,
  Sliders,
} from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound } from '@/lib/sound';

interface FooterProps {
  onOpenTerms?: () => void;
  onOpenFaq?: () => void;
  onOpenHelp?: () => void;
  onOpenSimulator?: () => void;
}

interface BankPartner {
  id: string;
  name: string;
  specialty: string;
  logoUrl: string;
}

const BANK_PARTNERS: BankPartner[] = [
  {
    id: 'caixa',
    name: 'CAIXA',
    specialty: 'Líder Habitacional',
    logoUrl: '/images/banks/caixa.png',
  },
  {
    id: 'itau',
    name: 'ITAÚ',
    specialty: 'Agilidade & Digital',
    logoUrl: '/images/banks/itau.png',
  },
  {
    id: 'santander',
    name: 'SANTANDER',
    specialty: 'Taxas Competitivas',
    logoUrl: '/images/banks/santander.png',
  },
  {
    id: 'bradesco',
    name: 'BRADESCO',
    specialty: 'Crédito Flexível',
    logoUrl: '/images/banks/bradesco.png',
  },
  {
    id: 'bb',
    name: 'BANCO DO BRASIL',
    specialty: 'Tradição & SFH',
    logoUrl: '/images/banks/bb.png',
  },
  {
    id: 'btg',
    name: 'BTG PACTUAL',
    specialty: 'Wealth & Real Estate',
    logoUrl: '/images/banks/btg.png',
  },
];

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onOpenFaq,
  onOpenHelp,
  onOpenSimulator,
}) => {
  return (
    <footer className="w-full mt-8 sm:mt-12 border-t border-white/10 bg-black/95 relative font-sans text-neutral-300 select-none overflow-hidden">
      {/* Brilho Superior Sutil Dourado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#c2a25b]/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-8 bg-gradient-to-b from-[#c2a25b]/10 to-transparent pointer-events-none blur-sm" />

      <div className="max-w-[1078px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* BLOCO PRINCIPAL UNIFICADO: CONFORMIDADE BACEN (ESQ) X BANCOS (DIR)        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          
          {/* LADO ESQUERDO: Atuação em Conformidade com o Bacen (5 cols no Desktop) */}
          <div className="lg:col-span-5 relative p-4 sm:p-4.5 bg-gradient-to-br from-white/[0.03] via-[#c2a25b]/10 to-transparent border border-gold-400/30 flex flex-col justify-center space-y-2 rounded-none shadow-[0_0_15px_rgba(194,162,91,0.06)]">
            {/* Moldura refinada dos cantos */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-400" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold-400" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold-400" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-400" />

            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-gold-400/15 border border-gold-400/50 text-gold-400 shrink-0">
                <ShieldCheck className="w-4 h-4 text-gold-300" />
              </div>
              <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide leading-snug">
                Atuação em conformidade com as diretrizes do Banco Central do Brasil
              </h3>
            </div>

            <p className="text-[11px] text-neutral-300 font-light leading-relaxed">
              Ferramentas de cálculo e inteligência financeira com total transparência e segurança de dados, em observância à <strong className="text-neutral-200 font-medium">Resolução CMN nº 3.954/11</strong>.
            </p>
          </div>

          {/* LADO DIREITO: Bancos Parceiros Homologados (7 cols no Desktop, Logos -40% + Especialidade no Hover) */}
          <div className="lg:col-span-7 p-4 bg-white/[0.015] border border-white/10 flex flex-col justify-between space-y-2.5 rounded-none">
            <div className="flex items-center space-x-2 pb-1.5 border-b border-white/10">
              <Building className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide">
                Instituições Homologadas &amp; Simulação Direta
              </h3>
            </div>

            {/* Grid 6 Logos (Logos -40% + Especialidade revelada no Hover) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BANK_PARTNERS.map((bank) => (
                <motion.div
                  key={bank.id}
                  whileHover={{ y: -1, scale: 1.03 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className="group relative p-1.5 rounded-none border border-white/10 bg-black/60 hover:bg-gradient-to-b hover:from-[#c2a25b]/15 hover:via-[#c2a25b]/5 hover:to-transparent hover:border-[#c2a25b]/60 transition-all duration-200 flex flex-col items-center justify-center h-13 sm:h-14 shadow-sm hover:shadow-[0_0_12px_rgba(194,162,91,0.2)] cursor-default overflow-hidden"
                >
                  {/* Linha superior dourada no hover */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-gold-400 group-hover:to-transparent transition-all duration-200" />

                  {/* Logo do Banco (-40% compacta) */}
                  <div className="w-full flex items-center justify-center p-0.5 transition-transform duration-200 group-hover:scale-95">
                    <img
                      src={bank.logoUrl}
                      alt={`Logo oficial ${bank.name}`}
                      className="max-h-4.5 sm:max-h-5 w-auto max-w-[85%] object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
                    />
                  </div>

                  {/* Especialidade do Banco (Surge no Hover) */}
                  <span className="text-[8.5px] sm:text-[9px] font-medium text-amber-300 tracking-tight opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-5 overflow-hidden transition-all duration-200 text-center leading-tight mt-0 group-hover:mt-0.5 truncate w-full px-0.5">
                    {bank.specialty}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BARRA INFERIOR: MARCA, COPYRIGHT & LINKS RÁPIDOS COM CURSOR MÃOZINHA       */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
          {/* Marca e Copyright */}
          <div className="flex items-center space-x-2.5">
            <img
              src="/brand/logo-source.png"
              alt="Brasil Finance"
              className="w-5 h-5 shrink-0 object-contain drop-shadow-md"
            />
            <div className="flex items-baseline">
              <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] tracking-tight">
                brasil
              </span>
              <span className="font-light text-sm text-neutral-200 tracking-normal">
                finance
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono pl-2 border-l border-white/10">
              © {new Date().getFullYear()} Todos os direitos reservados.
            </span>
          </div>

          {/* Links de Apoio com Cursor Mãozinha (Native Pointer) */}
          <div className="flex items-center space-x-4 text-[11px] text-neutral-400 flex-wrap justify-center">
            {onOpenSimulator && (
              <button
                type="button"
                onClick={() => {
                  vibrateShort();
                  playClickSound();
                  onOpenSimulator();
                }}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="hover:text-gold-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3 text-gold-400" />
                <span>Simulador</span>
              </button>
            )}
            {onOpenFaq && (
              <button
                type="button"
                onClick={() => {
                  vibrateShort();
                  playClickSound();
                  onOpenFaq();
                }}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="hover:text-gold-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3 h-3 text-gold-400" />
                <span>FAQ</span>
              </button>
            )}
            {onOpenHelp && (
              <button
                type="button"
                onClick={() => {
                  vibrateShort();
                  playClickSound();
                  onOpenHelp();
                }}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="hover:text-gold-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3 text-gold-400" />
                <span>Suporte</span>
              </button>
            )}
            {onOpenTerms && (
              <button
                type="button"
                onClick={() => {
                  vibrateShort();
                  playClickSound();
                  onOpenTerms();
                }}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="hover:text-gold-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3 h-3 text-gold-400" />
                <span>Termos &amp; Privacidade</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};

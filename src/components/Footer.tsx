'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Building,
  Lock,
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
  logoUrl: string;
}

const BANK_PARTNERS: BankPartner[] = [
  {
    id: 'caixa',
    name: 'CAIXA',
    logoUrl: '/images/banks/caixa.png',
  },
  {
    id: 'itau',
    name: 'ITAÚ',
    logoUrl: '/images/banks/itau.png',
  },
  {
    id: 'santander',
    name: 'SANTANDER',
    logoUrl: '/images/banks/santander.png',
  },
  {
    id: 'bradesco',
    name: 'BRADESCO',
    logoUrl: '/images/banks/bradesco.png',
  },
  {
    id: 'bb',
    name: 'BANCO DO BRASIL',
    logoUrl: '/images/banks/bb.png',
  },
  {
    id: 'btg',
    name: 'BTG PACTUAL',
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LADO ESQUERDO: Atuação em Conformidade com o Bacen (5 cols no Desktop) */}
          <div className="lg:col-span-5 relative p-4 bg-gradient-to-br from-white/[0.03] via-[#c2a25b]/10 to-transparent border border-[#c2a25b]/35 flex flex-col justify-between space-y-3">
            {/* Decoração nos cantos */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-gold-400" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-gold-400" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-gold-400" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-gold-400" />

            <div className="space-y-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-gold-400/15 border border-gold-400/50 text-gold-400 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-gold-300" />
                </div>
                <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide leading-snug">
                  Atuação em conformidade com as diretrizes do Banco Central do Brasil (Resolução CMN nº 3.954/11)
                </h3>
              </div>

              <p className="text-[11px] text-neutral-300 font-light leading-relaxed">
                Ferramentas de cálculo e simulação imobiliária operando em estrita observância às normas do CMN e Bacen, com total transparência de taxas e proteção de dados.
              </p>
            </div>

            {/* Badges de Segurança e Legalidade */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-white/10 text-[10px] font-mono text-neutral-400">
              <span className="flex items-center space-x-1 text-neutral-300">
                <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span>SSL 256-bit</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center space-x-1 text-neutral-300">
                <ShieldCheck className="w-2.5 h-2.5 text-gold-400 shrink-0" />
                <span>LGPD</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center space-x-1 text-neutral-300">
                <Building className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span>SFN</span>
              </span>
            </div>
          </div>

          {/* LADO DIREITO: Bancos Parceiros Homologados (7 cols no Desktop, Logos -40%) */}
          <div className="lg:col-span-7 p-4 bg-white/[0.015] border border-white/10 flex flex-col justify-between space-y-3">
            <div className="flex items-center space-x-2 pb-1.5 border-b border-white/10">
              <Building className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <h3 className="text-xs sm:text-[13px] font-bold text-white tracking-wide">
                Instituições Homologadas &amp; Simulação Direta
              </h3>
            </div>

            {/* Grid 6 Logos (Tamanho reduzido em 40% com micro-cards) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BANK_PARTNERS.map((bank) => (
                <motion.div
                  key={bank.id}
                  whileHover={{ y: -1, scale: 1.03 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className="group relative p-1.5 rounded-none border border-white/10 bg-black/60 hover:bg-gradient-to-b hover:from-[#c2a25b]/15 hover:via-[#c2a25b]/5 hover:to-transparent hover:border-[#c2a25b]/60 transition-all duration-200 flex flex-col items-center justify-center h-12 sm:h-13 shadow-sm hover:shadow-[0_0_12px_rgba(194,162,91,0.2)] cursor-default"
                >
                  {/* Linha superior dourada no hover */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-gold-400 group-hover:to-transparent transition-all duration-200" />

                  {/* Logo Reduzida em 40% */}
                  <div className="w-full h-full flex items-center justify-center p-0.5">
                    <img
                      src={bank.logoUrl}
                      alt={`Logo oficial ${bank.name}`}
                      className="max-h-5 sm:max-h-6 w-auto max-w-[85%] object-contain drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-[10px] text-neutral-500 font-mono text-right">
              * Taxas e parâmetros atualizados conforme regras de cada instituição.
            </p>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* BARRA INFERIOR: MARCA, COPYRIGHT & LINKS RÁPIDOS                         */}
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

          {/* Links de Apoio */}
          <div className="flex items-center space-x-4 text-[11px] text-neutral-400 flex-wrap justify-center">
            {onOpenSimulator && (
              <button
                type="button"
                onClick={() => {
                  vibrateShort();
                  playClickSound();
                  onOpenSimulator();
                }}
                onMouseEnter={() => setCursorVariant('button')}
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
                onMouseEnter={() => setCursorVariant('button')}
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
                onMouseEnter={() => setCursorVariant('button')}
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
                onMouseEnter={() => setCursorVariant('button')}
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

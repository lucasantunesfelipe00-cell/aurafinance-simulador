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
  segment: string;
  logoUrl: string;
}

const BANK_PARTNERS: BankPartner[] = [
  {
    id: 'caixa',
    name: 'CAIXA',
    segment: 'Habitação & SFH / SFI',
    logoUrl: '/images/banks/caixa.png',
  },
  {
    id: 'itau',
    name: 'ITAÚ',
    segment: 'Personnalité & Private',
    logoUrl: '/images/banks/itau.png',
  },
  {
    id: 'santander',
    name: 'SANTANDER',
    segment: 'Select & Private Banking',
    logoUrl: '/images/banks/santander.png',
  },
  {
    id: 'bradesco',
    name: 'BRADESCO',
    segment: 'Prime & Private',
    logoUrl: '/images/banks/bradesco.png',
  },
  {
    id: 'bb',
    name: 'BANCO DO BRASIL',
    segment: 'Estilo & Private',
    logoUrl: '/images/banks/bb.png',
  },
  {
    id: 'btg',
    name: 'BTG PACTUAL',
    segment: 'Wealth & Real Estate',
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
    <footer className="w-full mt-10 sm:mt-14 border-t border-white/10 bg-black/95 relative font-sans text-neutral-300 select-none overflow-hidden">
      {/* Brilho Superior Sutil Dourado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[1px] bg-gradient-to-r from-transparent via-[#c2a25b]/60 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-10 bg-gradient-to-b from-[#c2a25b]/10 to-transparent pointer-events-none blur-sm" />

      <div className="max-w-[1078px] mx-auto px-4 sm:px-6 py-7 sm:py-10 space-y-7 sm:space-y-9">
        
        {/* ========================================================================= */}
        {/* SEÇÃO 1: GRID DE BANCOS PARCEIROS HOMOLOGADOS (COMPACTO)                  */}
        {/* ========================================================================= */}
        <div className="space-y-3.5">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-white/10">
            <Building className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Instituições Homologadas &amp; Simulação Direta
            </h3>
          </div>

          {/* Grid de Cards Compactos dos Bancos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {BANK_PARTNERS.map((bank) => (
              <motion.div
                key={bank.id}
                whileHover={{ y: -2, scale: 1.02 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="group relative p-2.5 sm:p-3 rounded-none border border-white/10 bg-white/[0.02] hover:bg-gradient-to-b hover:from-[#c2a25b]/15 hover:via-[#c2a25b]/5 hover:to-transparent hover:border-[#c2a25b]/60 transition-all duration-300 flex flex-col items-center text-center justify-center min-h-[76px] sm:min-h-[84px] shadow-[0_3px_15px_rgba(0,0,0,0.35)] hover:shadow-[0_0_20px_rgba(194,162,91,0.2)] cursor-default"
              >
                {/* Linha superior dourada no hover */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-gold-400 group-hover:to-transparent transition-all duration-300" />

                {/* Logo Original do Banco em PNG Transparente */}
                <div className="w-full h-9 sm:h-11 flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105">
                  <img
                    src={bank.logoUrl}
                    alt={`Logo oficial ${bank.name}`}
                    className="h-full max-h-7 sm:max-h-9 w-auto max-w-[92%] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* Segmento sutil */}
                <p className="text-[10px] text-neutral-400 font-normal group-hover:text-neutral-200 transition-colors truncate w-full mt-1">
                  {bank.segment}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEÇÃO 2: SELO DE CONFORMIDADE BACEN (RESOLUÇÃO CMN Nº 3.954/11 - COMPACTO) */}
        {/* ========================================================================= */}
        <div className="relative p-4 sm:p-5 bg-gradient-to-r from-white/[0.03] via-[#c2a25b]/10 to-white/[0.03] border border-[#c2a25b]/40 rounded-none shadow-[0_0_25px_rgba(194,162,91,0.1)]">
          {/* Decoração nos cantos */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gold-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gold-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gold-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gold-400" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-5">
            
            {/* Lado Esquerdo: Selo Oficial e Texto Resumido em 2 linhas */}
            <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 flex-1">
              <div className="p-2 sm:p-2.5 bg-gold-400/15 border border-gold-400/50 text-gold-400 rounded-none shrink-0 shadow-[0_0_15px_rgba(194,162,91,0.25)]">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-gold-300" />
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide leading-snug">
                  Atuação em conformidade com as diretrizes do Banco Central do Brasil (Resolução CMN nº 3.954/11)
                </h3>

                <p className="text-[11px] sm:text-xs text-neutral-300 font-light leading-relaxed line-clamp-2">
                  Ferramentas de cálculo e simulação imobiliária operando em estrita observância às normas do CMN e Bacen, com total transparência de taxas e proteção aos dados.
                </p>
              </div>
            </div>

            {/* Lado Direito: Badges Técnicas Compactas */}
            <div className="flex flex-wrap md:flex-col gap-1.5 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-5">
              <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono text-neutral-300">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Criptografia SSL 256-bit</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono text-neutral-300">
                <ShieldCheck className="w-3 h-3 text-gold-400 shrink-0" />
                <span>LGPD (Lei 13.709/18)</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono text-neutral-300">
                <Building className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Sistema Financeiro Nacional (SFN)</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEÇÃO 3: NAVEGAÇÃO INSTITUCIONAL & INFORMAÇÕES CORPORATIVAS                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-5 border-t border-white/10">
          
          {/* Coluna 1: Marca & Descrição */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center space-x-2.5">
              <img
                src="/brand/logo-source.png"
                alt="Brasil Finance"
                className="w-6 h-6 shrink-0 object-contain drop-shadow-md"
              />
              <div className="flex items-baseline">
                <span className="font-extrabold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] tracking-tight">
                  brasil
                </span>
                <span className="font-light text-base sm:text-lg text-neutral-200 tracking-normal">
                  finance
                </span>
              </div>
            </div>

            <p className="text-[11px] sm:text-xs text-neutral-400 font-light leading-relaxed max-w-md">
              Inteligência e planejamento financeiro imobiliário com alta precisão. Amortização SAC e PRICE, quitação acelerada e análise de crédito.
            </p>

            <div className="text-[10px] text-neutral-500 font-mono pt-0.5">
              <span>© {new Date().getFullYear()} Brasil Finance. Todos os direitos reservados.</span>
            </div>
          </div>

          {/* Coluna 2: Acesso Rápido */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-gold-400">
              Simulador
            </h4>
            <ul className="space-y-1.5 text-[11px] sm:text-xs">
              {onOpenSimulator && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      playClickSound();
                      onOpenSimulator();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3 h-3 text-gold-400" />
                    <span>Configurar Simulação</span>
                  </button>
                </li>
              )}
              {onOpenFaq && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      playClickSound();
                      onOpenFaq();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3 text-gold-400" />
                    <span>Perguntas Frequentes (FAQ)</span>
                  </button>
                </li>
              )}
              {onOpenHelp && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      playClickSound();
                      onOpenHelp();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3 text-gold-400" />
                    <span>Central de Suporte</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Coluna 3: Conformidade & Legal */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-gold-400">
              Segurança &amp; Legal
            </h4>
            <ul className="space-y-1.5 text-[11px] sm:text-xs">
              {onOpenTerms && (
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      playClickSound();
                      onOpenTerms();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-gold-400" />
                    <span>Termos de Uso &amp; Privacidade</span>
                  </button>
                </li>
              )}
              <li className="text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Resolução Bacen 3.954/11</span>
              </li>
              <li className="text-neutral-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-gold-400" />
                <span>Criptografia TLS 256-bit</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
};

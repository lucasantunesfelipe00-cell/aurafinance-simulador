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
  badge: string;
  logoUrl: string;
}

const BANK_PARTNERS: BankPartner[] = [
  {
    id: 'caixa',
    name: 'CAIXA',
    segment: 'Habitação & SFH / SFI',
    badge: 'Líder Habitacional',
    logoUrl: '/images/banks/caixa.svg',
  },
  {
    id: 'itau',
    name: 'ITAÚ',
    segment: 'Personnalité & Private',
    badge: 'Taxas Competitivas',
    logoUrl: '/images/banks/itau.svg',
  },
  {
    id: 'santander',
    name: 'SANTANDER',
    segment: 'Select & Private Banking',
    badge: 'Agilidade Digital',
    logoUrl: '/images/banks/santander.svg',
  },
  {
    id: 'bradesco',
    name: 'BRADESCO',
    segment: 'Prime & Private',
    badge: 'Relacionamento',
    logoUrl: '/images/banks/bradesco.svg',
  },
  {
    id: 'bb',
    name: 'BANCO DO BRASIL',
    segment: 'Estilo & Private',
    badge: 'Solidez Pública',
    logoUrl: '/images/banks/bb.svg',
  },
  {
    id: 'btg',
    name: 'BTG PACTUAL',
    segment: 'Wealth & Real Estate',
    badge: 'Investidores',
    logoUrl: '/images/banks/btg.svg',
  },
];

export const Footer: React.FC<FooterProps> = ({
  onOpenTerms,
  onOpenFaq,
  onOpenHelp,
  onOpenSimulator,
}) => {
  return (
    <footer className="w-full mt-16 sm:mt-24 border-t border-white/10 bg-black/95 relative font-sans text-neutral-300 select-none overflow-hidden">
      {/* Brilho Superior Sutil Dourado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[1px] bg-gradient-to-r from-transparent via-[#c2a25b]/60 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-12 bg-gradient-to-b from-[#c2a25b]/10 to-transparent pointer-events-none blur-sm" />

      <div className="max-w-[1078px] mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* ========================================================================= */}
        {/* SEÇÃO 1: GRID DE BANCOS PARCEIROS HOMOLOGADOS                             */}
        {/* ========================================================================= */}
        <div className="space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 pb-2 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gold-400" />
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-gold-400 font-semibold">
                  Instituições Homologadas &amp; Simulação Direta
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide mt-1">
                Principais Bancos do Sistema Financeiro Imobiliário
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-400 font-light max-w-sm">
              Modelos de amortização, taxas de mercado e prazos comparáveis às diretrizes dos maiores bancos do país.
            </p>
          </div>

          {/* Grid de Cards dos Bancos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {BANK_PARTNERS.map((bank) => (
              <motion.div
                key={bank.id}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="group relative p-3 sm:p-3.5 rounded-none border border-white/10 bg-white/[0.02] hover:bg-gradient-to-b hover:from-[#c2a25b]/15 hover:via-[#c2a25b]/5 hover:to-transparent hover:border-[#c2a25b]/60 transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[145px] sm:min-h-[155px] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(194,162,91,0.2)] cursor-default"
              >
                {/* Linha superior dourada no hover */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-transparent group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-gold-400 group-hover:to-transparent transition-all duration-300" />

                {/* Logo Original do Banco em Container Branco de Alto Contraste & Fidelidade de Marca */}
                <div className="w-full h-11 sm:h-12 bg-white rounded-none flex items-center justify-center p-2 shadow-sm border border-white/20 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]">
                  <img
                    src={bank.logoUrl}
                    alt={`Logo oficial ${bank.name}`}
                    className="h-full max-h-7 sm:max-h-8 w-auto max-w-[92%] object-contain"
                  />
                </div>

                {/* Nome e Segmento */}
                <div className="space-y-0.5 my-1.5 w-full">
                  <h4 className="text-xs sm:text-[13px] font-bold tracking-wider text-white group-hover:text-gold-200 transition-colors truncate">
                    {bank.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 group-hover:text-neutral-300 transition-colors truncate">
                    {bank.segment}
                  </p>
                </div>

                {/* Tag / Badge de Confiança */}
                <span className="px-2 py-0.5 bg-black/70 border border-white/10 group-hover:border-gold-400/50 text-[9px] font-mono uppercase tracking-wider text-neutral-400 group-hover:text-gold-300 rounded-none transition-colors">
                  {bank.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEÇÃO 2: SELO DE CONFORMIDADE BACEN (RESOLUÇÃO CMN Nº 3.954/11)           */}
        {/* ========================================================================= */}
        <div className="relative p-5 sm:p-7 bg-gradient-to-r from-white/[0.03] via-[#c2a25b]/10 to-white/[0.03] border border-[#c2a25b]/40 rounded-none shadow-[0_0_30px_rgba(194,162,91,0.12)]">
          {/* Decoração nos cantos */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gold-400" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gold-400" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gold-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gold-400" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
            
            {/* Lado Esquerdo: Selo Oficial e Ícone de Segurança */}
            <div className="flex items-start sm:items-center space-x-3.5 sm:space-x-4 min-w-0 flex-1">
              <div className="p-3 sm:p-3.5 bg-gold-400/15 border border-gold-400/50 text-gold-400 rounded-none shrink-0 shadow-[0_0_20px_rgba(194,162,91,0.3)]">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-gold-300" />
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-gold-400/20 border border-gold-400/60 text-gold-300 text-[10px] font-mono font-bold tracking-widest uppercase">
                    Conformidade Regulatória
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    Banco Central do Brasil
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide leading-snug">
                  Atuação em conformidade com as diretrizes do Banco Central do Brasil (Resolução CMN nº 3.954/11)
                </h3>

                <p className="text-[11px] sm:text-xs text-neutral-300 font-light leading-relaxed">
                  As ferramentas de cálculo, simulação e intermediação imobiliária operam em estrita observância às normas do Conselho Monetário Nacional (CMN) e do Banco Central do Brasil (Bacen), assegurando total transparência de taxas (CET), segurança jurídica e proteção integral aos dados do usuário.
                </p>
              </div>
            </div>

            {/* Lado Direito: Badges Técnicas de Segurança */}
            <div className="flex flex-wrap md:flex-col gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
              <div className="flex items-center space-x-2 text-[11px] font-mono text-neutral-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Criptografia SSL 256-bit</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>LGPD (Lei 13.709/18)</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-neutral-300">
                <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Sistema Financeiro Nacional (SFN)</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEÇÃO 3: NAVEGAÇÃO INSTITUCIONAL & INFORMAÇÕES CORPORATIVAS                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
          
          {/* Coluna 1: Marca & Descrição */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <img
                src="/brand/logo-source.png"
                alt="Brasil Finance"
                className="w-7 h-7 shrink-0 object-contain drop-shadow-md"
              />
              <div className="flex items-baseline">
                <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] tracking-tight">
                  brasil
                </span>
                <span className="font-light text-lg text-neutral-200 tracking-normal">
                  finance
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-md">
              Plataforma de alta precisão para planejamento e inteligência financeira de crédito imobiliário. Comparativos avançados entre sistemas de amortização SAC e PRICE, quitação acelerada e termômetro de elegibilidade bancária.
            </p>

            <div className="flex items-center space-x-2 pt-1 text-[11px] text-neutral-500 font-mono">
              <span>© {new Date().getFullYear()} Brasil Finance. Todos os direitos reservados.</span>
            </div>
          </div>

          {/* Coluna 2: Acesso Rápido */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
              Simulador
            </h4>
            <ul className="space-y-2 text-xs">
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
                    <Sliders className="w-3.5 h-3.5 text-gold-400" />
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
                    <BookOpen className="w-3.5 h-3.5 text-gold-400" />
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
                    <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
                    <span>Central de Suporte</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Coluna 3: Conformidade & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400">
              Segurança &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs">
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
                    <FileText className="w-3.5 h-3.5 text-gold-400" />
                    <span>Termos de Uso &amp; Privacidade</span>
                  </button>
                </li>
              )}
              <li className="text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resolução Bacen 3.954/11</span>
              </li>
              <li className="text-neutral-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold-400" />
                <span>Protocolos de Criptografia TLS</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
};

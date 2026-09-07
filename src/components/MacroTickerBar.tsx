'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';

export interface MacroIndicator {
  label: string;
  value: string;
  sub?: string;
  source?: string;
}

const INDICATORS: MacroIndicator[] = [
  {
    label: 'SELIC',
    value: '10,50%',
    sub: 'a.a.',
    source: 'Banco Central do Brasil',
  },
  {
    label: 'IPCA',
    value: '4,18%',
    sub: '12m',
    source: 'IBGE / Inflação Oficial',
  },
  {
    label: 'TR',
    value: '0,08%',
    sub: 'a.m.',
    source: 'Taxa Referencial BCB',
  },
  {
    label: 'TAXA MÉDIA SFH',
    value: '10,2%',
    sub: 'a.a.',
    source: 'Média de Mercado Habitacional',
  },
];

export const MacroTickerBar: React.FC = () => {
  return (
    <div className="w-full bg-neutral-950/95 border-b border-amber-500/20 backdrop-blur-md font-mono select-none relative z-40 overflow-hidden">
      {/* Linha superior de iluminação dourada sutil estilo terminal */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

      <div className="max-w-[1078px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between text-[11px] sm:text-xs">
        
        {/* Lado Esquerdo: Tag de Status de Mercado Live */}
        <div className="flex items-center space-x-2 shrink-0 pr-3 border-r border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-neutral-400 font-bold uppercase tracking-widest text-[10px] sm:text-[11px] hidden min-[400px]:inline">
            BLOOMBERG MACRO
          </span>
        </div>

        {/* Centro: Ticker de Indicadores */}
        <div className="flex-1 overflow-x-auto no-scrollbar mx-2 sm:mx-4 flex items-center justify-start sm:justify-center space-x-3 sm:space-x-5 py-1">
          {INDICATORS.map((ind, i) => (
            <div
              key={ind.label}
              onMouseEnter={() => setCursorVariant('button')}
              onMouseLeave={() => setCursorVariant('default')}
              className="flex items-center space-x-1.5 shrink-0 group cursor-default transition-opacity hover:opacity-100"
              title={`${ind.label}: ${ind.source}`}
            >
              <span className="text-neutral-400 font-medium uppercase tracking-wider text-[10px] sm:text-[11px]">
                {ind.label}:
              </span>
              <span className="text-amber-400 font-extrabold tracking-tight drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                {ind.value}
              </span>
              {ind.sub && (
                <span className="text-[9px] text-neutral-400 font-light">
                  {ind.sub}
                </span>
              )}
              {i < INDICATORS.length - 1 && (
                <span className="text-neutral-700 ml-2.5 sm:ml-4 hidden sm:inline">|</span>
              )}
            </div>
          ))}
        </div>

        {/* Lado Direito: Badge do BCB */}
        <div className="hidden lg:flex items-center space-x-1.5 shrink-0 pl-3 border-l border-white/10 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
          <span className="tracking-wider uppercase text-neutral-400 font-medium">ÍNDICES OFICIAIS</span>
        </div>

      </div>

      {/* Linha de borda inferior sutil */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 pointer-events-none" />
    </div>
  );
};

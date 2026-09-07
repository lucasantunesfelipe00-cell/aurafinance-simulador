'use client';

import React from 'react';
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
    <div className="w-full bg-black/90 border-b border-white/10 backdrop-blur-md font-mono select-none relative z-40 overflow-hidden">
      <div className="max-w-[1078px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-center text-[11px] sm:text-xs">
        
        {/* Ticker de Indicadores Centralizados */}
        <div className="overflow-x-auto no-scrollbar w-full flex items-center justify-start min-[500px]:justify-center space-x-3 sm:space-x-6 py-1">
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
              <span className="text-gold-400 font-bold tracking-tight">
                {ind.value}
              </span>
              {ind.sub && (
                <span className="text-[9px] text-neutral-400 font-light">
                  {ind.sub}
                </span>
              )}
              {i < INDICATORS.length - 1 && (
                <span className="text-neutral-700 ml-3 sm:ml-6 shrink-0">|</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

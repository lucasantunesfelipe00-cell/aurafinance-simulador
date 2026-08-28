'use client';

import React from 'react';
import { BrandMark } from '@/components/BrandMark';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b-2 border-ink-950 bg-paper sticky top-0 z-50 h-[66px]">
      <div className="max-w-[1078px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">

        {/* Brand Identity */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <BrandMark size={32} />
          <div className="text-sm sm:text-base font-extrabold tracking-tight text-ink-950 uppercase">
            BRASIL <span className="text-accent">FINANCE</span>
          </div>
        </div>

        {/* Micro Navigation (oculta em telas pequenas para evitar quebra do header) */}
        <div className="hidden sm:flex items-center space-x-6 text-[11px] font-semibold tracking-widest text-ink-600 uppercase">
          <span className="hover:text-accent transition-colors cursor-pointer">CRÉDITO</span>
          <span>·</span>
          <span className="hover:text-accent transition-colors cursor-pointer">AMORTIZAÇÃO</span>
          <span>·</span>
          <span className="text-ink-950">Financiamentos</span>
        </div>

        {/* Versão mobile: apenas o selo editorial */}
        <div className="sm:hidden text-[10px] font-semibold tracking-widest text-ink-950 uppercase">
          Financiamentos
        </div>

      </div>
    </header>
  );
};

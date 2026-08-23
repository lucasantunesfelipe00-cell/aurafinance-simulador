'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-white/10 bg-black/90 backdrop-blur-md sticky top-0 z-50 h-[66px]">
      <div className="max-w-[1078px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Brand Identity */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="text-sm sm:text-base font-normal tracking-widest text-white uppercase">
            AURA <span className="text-neutral-400 font-light">FINANCE</span>
          </div>
        </div>

        {/* Micro Navigation (oculta em telas pequenas para evitar quebra do header) */}
        <div className="hidden sm:flex items-center space-x-6 text-[11px] font-normal tracking-widest text-neutral-400 uppercase">
          <span className="hover:text-white transition-colors cursor-pointer">CRÉDITO</span>
          <span>·</span>
          <span className="hover:text-white transition-colors cursor-pointer">AMORTIZAÇÃO</span>
          <span>·</span>
          <span className="text-white">SAIGON EDITORIAL</span>
        </div>

        {/* Versão mobile: apenas o selo editorial */}
        <div className="sm:hidden text-[10px] font-normal tracking-widest text-white uppercase">
          SAIGON EDITORIAL
        </div>

      </div>
    </header>
  );
};

'use client';

import React, { useState } from 'react';
import { Menu, RefreshCw } from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { HelpModal } from '@/components/HelpModal';
import { SideDrawer } from '@/components/SideDrawer';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/10 bg-black/90 backdrop-blur-md sticky top-0 z-50 h-[66px] relative">
      <div className="max-w-[1078px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Canto Superior Esquerdo: Botão de 3 Linhas (Menu Hamburger) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              vibrateShort();
              setIsDrawerOpen(true);
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="btn-lift flex items-center justify-center p-2.5 rounded-xl border border-white/15 hover:border-[#c2a25b] transition-all cursor-pointer bg-white/5 hover:bg-[#c2a25b]/10 text-gold-400 hover:text-gold-300"
            title="Abrir Menu Principal"
            aria-label="Abrir Menu"
          >
            <Menu className="w-5 h-5 text-gold-400" />
          </button>
        </div>

        {/* Canto Superior Direito: Apenas Bandeira do Brasil + Botão de Resetar */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="flex items-center justify-center shrink-0 cursor-pointer group" title="Brasil">
            <img
              src="/brand/brazil-flag-circle.svg"
              alt="Brasil"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-gold-400/50 object-cover"
            />
          </div>

          {onReset && (
            <button
              type="button"
              onClick={() => {
                vibrateShort();
                onReset();
              }}
              onMouseEnter={() => setCursorVariant('button')}
              onMouseLeave={() => setCursorVariant('default')}
              className="btn-lift flex items-center justify-center p-2 rounded-full border border-white/20 hover:border-white transition-all cursor-pointer bg-white/5 hover:bg-white/10 shrink-0"
              title="Redefinir simulação"
            >
              <RefreshCw className="w-4 h-4 text-gold-400" />
            </button>
          )}
        </div>

      </div>

      {/* Drawer Lateral Esquerdo */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Modal do Manual & Glossário */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Linha de brilho sutil com gradiente da paleta dourada */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c2a25b]/45 to-transparent pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#c2a25b]/12 via-[#a47e35]/5 to-transparent pointer-events-none" />
      </div>
    </header>
  );
};

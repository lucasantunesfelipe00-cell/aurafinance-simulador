'use client';

import React, { useState } from 'react';
import { SettingsPopover } from '@/components/SettingsPopover';
import { RefreshCw, HelpCircle } from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { HelpModal } from '@/components/HelpModal';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/10 bg-black/90 backdrop-blur-md sticky top-0 z-50 h-[66px] relative">
      <div className="max-w-[1078px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Brand Identity: Logo + brasilfinance */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="flex items-center space-x-2 sm:space-x-2.5 group cursor-pointer">
            <img src="/brand/logo-source.png" alt="Brasil Finance" className="h-8 sm:h-9 w-auto shrink-0" />
            <div className="flex items-baseline">
              <span className="font-extrabold text-base sm:text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] tracking-tight">
                brasil
              </span>
              <span className="font-light text-base sm:text-lg lg:text-xl text-neutral-300 tracking-normal">
                finance
              </span>
            </div>
          </div>
        </div>

        {/* Canto Superior Direito: Logo do Brasil + Manual/Ajuda (?) + Botão Redefinir (Ícone) + Botão de Configuração */}
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          <div className="flex items-center justify-center shrink-0 cursor-pointer group" title="Brasil">
            <img
              src="/brand/brazil-flag-circle.svg"
              alt="Brasil"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:border-gold-400/50 object-cover"
            />
          </div>

          {/* Botão de Ajuda / Manual (?) entre a bandeira e o reset */}
          <button
            type="button"
            onClick={() => {
              vibrateShort();
              setIsHelpOpen(true);
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="btn-lift flex items-center justify-center p-2 rounded-full border border-white/20 hover:border-[#c2a25b] transition-all cursor-pointer bg-white/5 hover:bg-white/10 shrink-0 text-gold-400 hover:text-gold-300"
            title="Manual do Aplicativo & Glossário (?)"
          >
            <HelpCircle className="w-4 h-4 text-gold-400" />
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="btn-lift flex items-center justify-center p-2 rounded-full border border-white/20 hover:border-white transition-all cursor-pointer bg-white/5 hover:bg-white/10 shrink-0"
              title="Redefinir simulação"
            >
              <RefreshCw className="w-4 h-4 text-gold-400" />
            </button>
          )}

          <SettingsPopover />
        </div>

      </div>

      {/* Modal do Manual & Glossário */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Linha de brilho sutil com gradiente da paleta dourada (brilho suavizado) */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c2a25b]/45 to-transparent pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#c2a25b]/12 via-[#a47e35]/5 to-transparent pointer-events-none" />
      </div>
    </header>
  );
};


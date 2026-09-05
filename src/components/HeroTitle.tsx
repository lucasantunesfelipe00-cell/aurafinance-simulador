'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeroTitleProps {
  showShine?: boolean;
  onShineEnd?: () => void;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({ showShine = false, onShineEnd }) => {
  return (
    <div className="flex items-center justify-center select-none py-0 w-full">
      <div className="relative inline-flex items-center space-x-2.5 sm:space-x-3 p-2 overflow-hidden">
        {/* Logo Mark + Texto Brasil Finance */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <img
            src="/brand/logo-source.png"
            alt="Logo Icon"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0 drop-shadow-xl object-contain"
          />
          <div className="flex items-baseline">
            <span className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] tracking-tight">
              brasil
            </span>
            <span className="font-light text-3xl sm:text-4xl md:text-5xl text-neutral-300 tracking-normal">
              finance
            </span>
          </div>
        </div>

        {/* Feixe de Luz Contínuo: Começa na logo 'bf' e desliza suavemente sobre o texto sem vazar no fundo */}
        {showShine && (
          <motion.div
            initial={{ x: '-130%', opacity: 0 }}
            animate={{ x: '230%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={onShineEnd}
            style={{ mixBlendMode: 'color-dodge' }}
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/80 via-50% to-transparent -skew-x-12"
          />
        )}
      </div>
    </div>
  );
};


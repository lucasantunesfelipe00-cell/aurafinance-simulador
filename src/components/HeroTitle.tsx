import React from 'react';
import { BrandMark } from '@/components/BrandMark';

/**
 * Wordmark do hero — símbolo (losango) + "BRASIL FINANCE" em Archivo 800,
 * texto real (não imagem), conforme o sistema de marca Modernist.
 */
export const HeroTitle: React.FC = () => {
  return (
    <div className="flex items-center gap-4 sm:gap-6 select-none">
      <BrandMark size={64} />
      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.94] text-ink-950 uppercase">
        BRASIL<br /><span className="text-accent">FINANCE</span>
      </h1>
    </div>
  );
};

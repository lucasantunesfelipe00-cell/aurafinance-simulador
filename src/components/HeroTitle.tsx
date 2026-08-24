'use client';

import React, { useRef } from 'react';

/**
 * Wordmark do hero — branco sólido, mesma linguagem tipográfica do resto do
 * site. O único momento de assinatura: um spotlight dourado preciso que
 * segue o cursor sobre as letras, como luz passando sobre uma placa
 * gravada. Sem gradiente, sem itálico, sem inclinação — sóbrio e corporativo.
 */
export const HeroTitle: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    ref.current?.style.setProperty('--mx', `${x}%`);
    ref.current?.style.setProperty('--my', `${y}%`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className="group relative inline-flex flex-col items-center select-none"
    >
      <h1 className="relative text-5xl sm:text-7xl lg:text-8xl font-light tracking-tighter text-white leading-[0.88]">
        <span>
          BRASIL <span className="font-extralight text-neutral-300">FINANCE</span>
        </span>
        <span aria-hidden className="wordmark-gold-reveal absolute inset-0">
          BRASIL <span className="font-extralight">FINANCE</span>
        </span>
      </h1>

      <span className="mt-4 h-px w-16 bg-gold-500 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:w-40" />
    </div>
  );
};

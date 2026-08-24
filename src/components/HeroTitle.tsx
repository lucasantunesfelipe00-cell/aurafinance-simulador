'use client';

import React, { useRef } from 'react';

const TEXT = 'BRASIL FINANCE';

/**
 * Wordmark do hero — branco sólido, mesma linguagem tipográfica do resto do
 * site. Cada letra é independente e levanta levemente no hover. Por cima,
 * um spotlight dourado (mix-blend-mode) segue o cursor sobre as letras,
 * como luz passando sobre uma placa gravada.
 */
export const HeroTitle: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    ref.current?.style.setProperty('--mx', `${e.clientX - bounds.left}px`);
    ref.current?.style.setProperty('--my', `${e.clientY - bounds.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className="group relative inline-flex flex-col items-center select-none"
    >
      <h1 className="relative text-5xl sm:text-7xl lg:text-8xl font-light tracking-tighter text-white leading-[0.88]">
        {TEXT.split('').map((char, i) => {
          if (char === ' ') {
            return (
              <span key={i} aria-hidden="true" className="inline-block w-[0.28em]">
                {' '}
              </span>
            );
          }
          const isFinance = i > TEXT.indexOf(' ');
          return (
            <span
              key={i}
              className={`hero-letter ${isFinance ? 'font-extralight text-neutral-300' : ''}`}
            >
              {char}
            </span>
          );
        })}

        <span aria-hidden className="hero-spotlight pointer-events-none absolute" />
      </h1>

      <span className="mt-4 h-px w-16 bg-gold-500 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:w-40" />
    </div>
  );
};

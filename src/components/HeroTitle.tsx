import React from 'react';

/**
 * Wordmark do hero — logo oficial (BRASIL FINANCE) fornecida pelo usuário.
 */
export const HeroTitle: React.FC = () => {
  return (
    <img
      src="/brand/hero-logo.png"
      alt="Brasil Finance"
      className="w-[280px] sm:w-[420px] lg:w-[520px] h-auto select-none"
    />
  );
};

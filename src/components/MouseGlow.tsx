'use client';

import React from 'react';

interface MouseGlowProps {
  children: React.ReactNode;
  className?: string;
  /** Mantidos apenas por compatibilidade de assinatura — sem efeito no sistema Modernist (sem glow). */
  size?: number;
  color?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Wrapper de card/painel clicável. O sistema de marca Modernist não usa
 * efeitos de brilho/spotlight — mantido como componente simples para não
 * precisar tocar todos os pontos de uso.
 */
export const MouseGlow: React.FC<MouseGlowProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

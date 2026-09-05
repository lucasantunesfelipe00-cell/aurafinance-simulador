'use client';

import React from 'react';
import { motion, useSpring } from 'framer-motion';

const SPRING = {
  mass: 0.1,
  damping: 20,
  stiffness: 150,
};

interface MouseGlowProps {
  children: React.ReactNode;
  className?: string;
  /** Diâmetro do glow em px */
  size?: number;
  /** Cor do glow (rgba) */
  color?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Envolve um card/painel com um spotlight dourado que segue o cursor via spring physics
 * (estilo Monopo). Usa mix-blend-mode "screen" para funcionar tanto sobre fundo preto
 * quanto sobre fotos (o glow ilumina em vez de esconder o conteúdo). Não intercepta cliques.
 */
export const MouseGlow: React.FC<MouseGlowProps> = ({
  children,
  className = '',
  size = 130,
  color = 'rgba(212, 175, 55, 0.31)',
  onClick,
}) => {
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const opacity = useSpring(0, { ...SPRING, damping: 30 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - bounds.left - size / 2);
    y.set(e.clientY - bounds.top - size / 2);
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative overflow-hidden ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => opacity.set(1)}
      onPointerLeave={() => opacity.set(0)}
      onClick={onClick}
    >
      <div className="relative z-0">{children}</div>
      <motion.div
        aria-hidden
        style={{
          x,
          y,
          opacity,
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, rgba(212, 175, 55, 0) 70%)`,
          mixBlendMode: 'screen',
        }}
        className="pointer-events-none absolute left-0 top-0 z-10 rounded-full blur-2xl"
      />
    </div>
  );
};

import React from 'react';

interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Símbolo da marca: quadrado preto com um losango vermelho vazado ao centro
 * (conceito "1B — Losango" do design system Modernist).
 */
export const BrandMark: React.FC<BrandMarkProps> = ({ size = 40, className = '' }) => {
  const outer = size;
  const diamond = size * (50 / 96);
  const cutout = size * (18 / 96);

  return (
    <div
      className={className}
      style={{ width: outer, height: outer, background: '#201e1d', display: 'grid', placeItems: 'center', flexShrink: 0 }}
    >
      <div
        style={{
          width: diamond,
          height: diamond,
          background: '#ec3013',
          transform: 'rotate(45deg)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div style={{ width: cutout, height: cutout, background: '#f3f2f2', transform: 'rotate(-45deg)' }} />
      </div>
    </div>
  );
};

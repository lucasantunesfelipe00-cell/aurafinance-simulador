'use client';

import { useEffect } from 'react';
import { playClickSound } from '@/lib/sound';

/**
 * Toca um clique curto sempre que o usuário clica em qualquer botão/controle
 * clicável do site (delegação de evento, cobre botões futuros automaticamente).
 */
export const SoundEffects: React.FC = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, [role="button"], input[type="checkbox"]')) {
        playClickSound();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
};

'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { subscribeCursorHidden } from '@/lib/cursor-store';

const SPRING = {
  mass: 0.15,
  damping: 22,
  stiffness: 300,
};

const SIZE = 20;

/**
 * Cursor customizado global: um círculo amarelo que segue o mouse via spring.
 * Some (e devolve o cursor nativo) sobre qualquer área envolvida por
 * MouseGlow — ali o usuário precisa do cursor de verdade para clicar em
 * botões, arrastar sliders e digitar. Desativado em telas sem mouse fino
 * (touch), onde o conceito de cursor não existe.
 */
export const CustomCursor: React.FC = () => {
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const [visible, setVisible] = useState(false);
  const [hiddenByArea, setHiddenByArea] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX - SIZE / 2);
      y.set(e.clientY - SIZE / 2);
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener('pointermove', handleMove);
    document.documentElement.addEventListener('mouseleave', handleLeave);
    const unsubscribe = subscribeCursorHidden(setHiddenByArea);

    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      unsubscribe();
      document.body.style.cursor = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      aria-hidden
      style={{
        x,
        y,
        opacity: visible && !hiddenByArea ? 1 : 0,
        width: SIZE,
        height: SIZE,
      }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-gold-400"
    />
  );
};

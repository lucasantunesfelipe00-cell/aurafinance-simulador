'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const SPRING = {
  mass: 0.15,
  damping: 22,
  stiffness: 300,
};

const SIZE = 20;

/**
 * Cursor customizado global: um círculo amarelo que segue o mouse via spring
 * em todo o site, inclusive por cima dos cards/botões (o cursor nativo fica
 * oculto via a classe .cursor-hidden em globals.css). Desativado em telas
 * sem mouse fino (touch), onde o conceito de cursor não existe.
 */
export const CustomCursor: React.FC = () => {
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const [visible, setVisible] = useState(false);

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

    document.documentElement.classList.add('cursor-hidden');

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      document.documentElement.classList.remove('cursor-hidden');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      aria-hidden
      style={{
        x,
        y,
        opacity: visible ? 1 : 0,
        width: SIZE,
        height: SIZE,
      }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-gold-400"
    />
  );
};

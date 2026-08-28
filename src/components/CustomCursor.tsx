'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { CursorVariant, subscribeCursorVariant } from '@/lib/cursor-store';

const SPRING = {
  mass: 0.15,
  damping: 22,
  stiffness: 300,
};

const SIZE_DEFAULT = 20;
const SIZE_INPUT = 10;

/**
 * Cursor customizado global: um quadrado vermelho que segue o mouse via spring
 * em todo o site (zero raio, como o resto da marca). Reage a variantes
 * sinalizadas por outros componentes via cursor-store:
 * - 'input' (caixas de R$): quadrado escuro, metade do tamanho
 * - 'button': quadrado claro (contraste sobre botões sólidos)
 * - 'native' (sliders/réguas): esconde o quadrado e devolve o cursor nativo
 * Desativado em telas sem mouse fino (touch), onde não existe cursor.
 */
export const CustomCursor: React.FC = () => {
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const size = useSpring(SIZE_DEFAULT, SPRING);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const variantRef = useRef<CursorVariant>('default');
  const isFinePointerRef = useRef(false);

  useEffect(() => {
    isFinePointerRef.current = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointerRef.current) return;

    const handleMove = (e: PointerEvent) => {
      const s = variantRef.current === 'input' ? SIZE_INPUT : SIZE_DEFAULT;
      x.set(e.clientX - s / 2);
      y.set(e.clientY - s / 2);
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener('pointermove', handleMove);
    document.documentElement.addEventListener('mouseleave', handleLeave);
    const unsubscribe = subscribeCursorVariant((next) => {
      variantRef.current = next;
      setVariant(next);
    });

    document.documentElement.classList.add('cursor-hidden');

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
      unsubscribe();
      document.documentElement.classList.remove('cursor-hidden');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFinePointerRef.current) return;
    size.set(variant === 'input' ? SIZE_INPUT : SIZE_DEFAULT);
    document.documentElement.classList.toggle('cursor-hidden', variant !== 'native');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const isNative = variant === 'native';

  return (
    <motion.div
      aria-hidden
      style={{
        x,
        y,
        width: size,
        height: size,
        opacity: visible && !isNative ? 1 : 0,
      }}
      className={`pointer-events-none fixed left-0 top-0 z-[9999] transition-colors duration-150 ${
        variant === 'input' ? 'bg-ink-950' : variant === 'button' ? 'bg-paper' : 'bg-accent'
      }`}
    />
  );
};

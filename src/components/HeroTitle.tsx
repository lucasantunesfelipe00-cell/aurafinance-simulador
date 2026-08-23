'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate, AnimationPlaybackControls } from 'framer-motion';

const TILT_SPRING = { mass: 0.4, damping: 16, stiffness: 140 };
const SHEEN_SPRING = { mass: 0.2, damping: 22, stiffness: 200 };

/**
 * Wordmark "hero" — masthead editorial em ouro líquido (Fraunces), com brilho
 * especular que segue o cursor e uma leve inclinação 3D, como se fosse uma
 * barra de ouro gravada girando sob luz. Em repouso, o brilho deriva sozinho
 * em loop lento (respeitando prefers-reduced-motion).
 */
export const HeroTitle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);
  const sheen = useMotionValue(30);
  const sheenSpring = useSpring(sheen, SHEEN_SPRING);
  const sheenPercent = useTransform(sheenSpring, (v) => `${v}%`);
  const loopRef = useRef<AnimationPlaybackControls | null>(null);
  const reducedMotionRef = useRef(false);

  const startLoop = () => {
    if (reducedMotionRef.current) return;
    loopRef.current?.stop();
    loopRef.current = animate(sheen, [20, 80, 20], {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut',
    });
  };

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotionRef.current) {
      sheen.set(50);
      return;
    }
    startLoop();
    return () => loopRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const px = (e.clientX - bounds.left) / bounds.width;
    const py = (e.clientY - bounds.top) / bounds.height;

    loopRef.current?.stop();
    sheen.set(Math.max(0, Math.min(100, px * 100)));

    if (!reducedMotionRef.current) {
      rotateY.set((px - 0.5) * 10);
      rotateX.set((0.5 - py) * 8);
    }
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    startLoop();
  };

  return (
    <div style={{ perspective: 1000 }} className="inline-block">
      <motion.div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative inline-block cursor-default select-none"
      >
        <h1 className="hero-wordmark leading-[0.82]">
          <motion.span
            className="aura-word block"
            style={{ backgroundPositionX: sheenPercent }}
          >
            AURA
          </motion.span>
          <span className="finance-word block" data-text="FINANCE">
            FINANCE
          </span>
        </h1>

        <svg
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
          className="hero-underline mt-3 sm:mt-4 h-[2px] w-full overflow-visible"
        >
          <line
            x1="0"
            y1="2"
            x2="100"
            y2="2"
            stroke="#D4AF37"
            strokeWidth="2"
            pathLength={100}
            className="animate-drawLine"
          />
        </svg>
      </motion.div>
    </div>
  );
};

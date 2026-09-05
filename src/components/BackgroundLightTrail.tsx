'use client';

import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  size: number;
  intensity: number;
}

/**
 * Rastro de Luz Dourada Interativo na Imagem de Fundo
 * Reage ao movimento do cursor gerando um feixe luminoso dourado que segue o caminho
 * do mouse com física de difusão e fade out suave, na mesma cor e blend mode do feixe ambiente.
 */
export const BackgroundLightTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Apenas em dispositivos com mouse fino
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const points = pointsRef.current;
      if (points.length === 0) {
        animFrameRef.current = null;
        return;
      }

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.age++;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.age / p.maxAge;
        if (progress >= 1) {
          points.splice(i, 1);
          continue;
        }

        // Curva suave de dissipação idêntica ao feixe original
        const alpha = (1 - progress) * (1 - progress) * p.intensity;
        const radius = p.size * (1 + progress * 0.35);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        // Exatas cores do feixe dourado original (paleta institucional refinada)
        grad.addColorStop(0, `rgba(223, 192, 123, ${alpha * 0.85})`);
        grad.addColorStop(0.35, `rgba(194, 162, 91, ${alpha * 0.55})`);
        grad.addColorStop(0.7, `rgba(164, 126, 53, ${alpha * 0.22})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (points.length > 0) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        animFrameRef.current = null;
      }
    };

    const addPoint = (x: number, y: number) => {
      const last = lastPosRef.current;
      let dist = 0;
      let speed = 0;
      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        dist = Math.sqrt(dx * dx + dy * dy);
        speed = Math.min(dist / 8, 5);
      }
      lastPosRef.current = { x, y };

      // Interpola pontos suaves ao longo do caminho
      const steps = Math.max(1, Math.min(Math.floor(dist / 10), 8));
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const px = last ? last.x + (x - last.x) * t : x;
        const py = last ? last.y + (y - last.y) * t : y;

        pointsRef.current.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          age: 0,
          maxAge: 42 + Math.random() * 16,
          size: 90 + speed * 14,
          intensity: Math.min(1.1, 0.75 + speed * 0.1),
        });
      }

      if (pointsRef.current.length > 95) {
        pointsRef.current = pointsRef.current.slice(-95);
      }

      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      addPoint(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      style={{ mixBlendMode: 'color-dodge' }}
    />
  );
};

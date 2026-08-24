'use client';

/** Vibração bem curta — usada ao arrastar réguas/sliders. Sem efeito em navegadores/telas sem suporte à Vibration API (ex: iOS Safari). */
export function vibrateShort() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(8);
  }
}

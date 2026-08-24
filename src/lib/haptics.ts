'use client';

/** Vibração bem curta — usada ao arrastar réguas/sliders. Sem efeito no iOS Safari (a Vibration API não existe lá) ou em navegadores sem suporte. */
export function vibrateShort() {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(20);
  } catch {
    // Alguns navegadores lançam se chamado fora de um gesto do usuário — ignora silenciosamente.
  }
}

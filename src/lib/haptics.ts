'use client';

export function isHapticEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const val = localStorage.getItem('bf_haptic_enabled');
  return val !== 'false'; // padrão é true
}

export function setHapticEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('bf_haptic_enabled', enabled ? 'true' : 'false');
}

/** Vibração bem curta — usada ao arrastar réguas/sliders. Sem efeito no iOS Safari (a Vibration API não existe lá) ou em navegadores sem suporte. */
export function vibrateShort() {
  if (!isHapticEnabled()) return;
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(20);
  } catch {
    // Alguns navegadores lançam se chamado fora de um gesto do usuário — ignora silenciosamente.
  }
}

'use client';

/**
 * Store mínimo (pub/sub) para o CustomCursor reagir a elementos específicos:
 * - 'default': bolinha amarela normal
 * - 'input': bolinha branca, metade do tamanho (sobre as caixas de R$)
 * - 'native': esconde a bolinha e devolve o cursor nativo do elemento (sobre sliders)
 * - 'button': bolinha preta (sobre os CTAs "Iniciar Simulação Agora" e "Simular")
 */
export type CursorVariant = 'default' | 'input' | 'native' | 'button';

type Listener = (variant: CursorVariant) => void;

let variant: CursorVariant = 'default';
const listeners = new Set<Listener>();

export function setCursorVariant(next: CursorVariant) {
  variant = next;
  listeners.forEach((listener) => listener(next));
}

export function subscribeCursorVariant(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

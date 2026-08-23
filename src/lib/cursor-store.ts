'use client';

/**
 * Store mínimo (pub/sub) para sinalizar quando o cursor customizado deve
 * ficar oculto — usado pelo MouseGlow para "devolver" o cursor nativo
 * enquanto o usuário está sobre um card com o spotlight dourado.
 */
type Listener = (hidden: boolean) => void;

let hiddenByArea = false;
const listeners = new Set<Listener>();

export function setCursorHiddenByArea(value: boolean) {
  hiddenByArea = value;
  listeners.forEach((listener) => listener(value));
}

export function subscribeCursorHidden(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

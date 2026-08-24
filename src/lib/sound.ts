'use client';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function playTone(freqStart: number, freqEnd: number, duration: number, volume: number, type: OscillatorType) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

/** Tique curto e suave — para cada tecla digitada nos campos. */
export function playTypeSound() {
  playTone(420, 320, 0.035, 0.05, 'triangle');
}

/** Clique curto e mais grave — para botões e controles clicáveis. */
export function playClickSound() {
  playTone(320, 150, 0.09, 0.12, 'sine');
}

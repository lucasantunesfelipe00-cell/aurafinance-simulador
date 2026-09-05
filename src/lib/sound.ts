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

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const val = localStorage.getItem('bf_sound_enabled');
  return val !== 'false'; // padrão é true
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('bf_sound_enabled', enabled ? 'true' : 'false');
}

function playTone(freqStart: number, freqEnd: number, duration: number, volume: number, type: OscillatorType) {
  if (!isSoundEnabled()) return;
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

/** Som de brilho cristalino ascendente e luxuoso perfeitamente alinhado com a animação de 5.0s do feixe de luz */
export function playGoldBeamSweepSound() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Acorde maior ascendente (otimista, nobre e brilhante) acompanhando a varredura do feixe da direita para a esquerda

  const chimeEvents = [
    { delay: 0.20, freq: 1318.5, vol: 0.015 }, // Início brilhante e suave ao surgir o feixe (E6)
    { delay: 1.00, freq: 1661.2, vol: 0.020 }, // Elevação harmônica elegante (G#6)
    { delay: 1.80, freq: 1975.5, vol: 0.024 }, // Tom alto e reluzente (B6)
    { delay: 2.60, freq: 2637.0, vol: 0.028 }, // PONTO MAIS AGUDO e radiante no ápice do feixe (E7)
  ];

  chimeEvents.forEach((item) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const start = now + item.delay;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(item.freq, start);
    osc.frequency.exponentialRampToValueAtTime(item.freq * 1.025, start + 1.4);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(item.vol, start + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.4);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 1.45);
  });
}

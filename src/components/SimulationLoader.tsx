'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Cpu, Sparkles } from 'lucide-react';

interface SimulationLoaderProps {
  durationSeconds?: number;
  onComplete?: () => void;
}

export const SimulationLoader: React.FC<SimulationLoaderProps> = ({
  durationSeconds = 3,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Processando parâmetros do financiamento...');

  useEffect(() => {
    const startTime = Date.now();
    const totalMs = durationSeconds * 1000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / totalMs) * 100));
      setProgress(pct);

      if (pct < 35) {
        setStatusText('Processando parâmetros do financiamento...');
      } else if (pct < 70) {
        setStatusText('Calculando projeção comparativa SAC x PRICE...');
      } else {
        setStatusText('Concluindo diagnóstico e gráficos de amortização...');
      }

      if (elapsed >= totalMs) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [durationSeconds, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto my-8 p-8 sm:p-10 rounded-none bg-neutral-950/90 border border-gold-400/40 shadow-2xl backdrop-blur-md relative overflow-hidden text-center font-sans space-y-6"
    >
      {/* Feixe Decorativo de Luz Dourada Superior */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c2a25b] to-transparent animate-pulse" />

      {/* Ícone Central Pulsante com Glow */}
      <div className="relative flex items-center justify-center mx-auto w-20 h-20">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-none bg-gold-400/20 blur-xl"
        />
        
        <div className="relative w-16 h-16 rounded-none bg-gradient-to-br from-[#c2a25b]/20 to-black border border-[#c2a25b]/50 flex items-center justify-center shadow-gold-glow">
          <motion.img
            src="/brand/logo-source.png"
            alt="Loading Logo"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="w-9 h-9 object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Textos de Status */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 text-gold-400 animate-spin" />
          <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35]">
            Gerando Simulação
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 font-mono h-6 flex items-center justify-center">
          {statusText}
        </p>
      </div>

      {/* Barra de Progresso e Percentual */}
      <div className="space-y-2 max-w-md mx-auto pt-2">
        <div className="w-full h-2 bg-white/10 rounded-none overflow-hidden p-0.5 border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#e8d5a7] rounded-none shadow-gold-glow"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        <div className="flex items-center justify-center text-[11px] font-mono text-neutral-400 px-1">
          <span className="font-bold text-gold-400">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Volume2,
  VolumeX,
  Smartphone,
  Sliders,
  Zap,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '@/lib/sound';
import { isHapticEnabled, setHapticEnabled, vibrateShort } from '@/lib/haptics';
import { setCursorVariant } from '@/lib/cursor-store';

export interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
  onOpenFaq?: () => void;
  onOpenTerms?: () => void;
  onOpenSimulator?: () => void;
  onOpenAmortization?: () => void;
  onOpenSavedScenarios?: () => void;
  savedScenariosCount?: number;
  isConfigActive?: boolean;
  isAmortizationActive?: boolean;
  isSavedScenariosActive?: boolean;
  showSaveNotice?: boolean;
  isHelpActive?: boolean;
  isFaqActive?: boolean;
  isTermsActive?: boolean;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onOpenHelp,
  onOpenFaq,
  onOpenTerms,
  onOpenSimulator,
  onOpenAmortization,
  onOpenSavedScenarios,
  savedScenariosCount = 0,
  isConfigActive = false,
  isAmortizationActive = false,
  isSavedScenariosActive = false,
  showSaveNotice = false,
  isHelpActive = false,
  isFaqActive = false,
  isTermsActive = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);

  useEffect(() => {
    setMounted(true);
    setSound(isSoundEnabled());
    setHaptics(isHapticEnabled());
  }, []);

  // Previne rolagem do body quando o drawer estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCursorVariant('default');
    }
    return () => {
      document.body.style.overflow = '';
      setCursorVariant('default');
    };
  }, [isOpen]);

  const toggleSound = () => {
    const nextVal = !sound;
    setSound(nextVal);
    setSoundEnabled(nextVal);
    if (nextVal) {
      setTimeout(() => playClickSound(), 50);
    }
  };

  const toggleHaptics = () => {
    const nextVal = !haptics;
    setHaptics(nextVal);
    setHapticEnabled(nextVal);
    if (nextVal) {
      setTimeout(() => vibrateShort(), 50);
    }
  };

  if (!mounted) return null;

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-[66px] left-0 w-full h-[calc(100vh-66px)] z-[99999] flex font-sans select-none pointer-events-none">
          {/* Overlay de Fundo com Blur que começa abaixo do cabeçalho */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              vibrateShort();
              onClose();
            }}
            className="fixed top-[66px] left-0 w-full h-[calc(100vh-66px)] bg-black/80 backdrop-blur-sm cursor-pointer pointer-events-auto"
          />

          {/* Drawer Lateral Deslizando da Esquerda abaixo do cabeçalho */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-[260px] sm:w-[280px] max-w-[85vw] h-full bg-neutral-950 border-r border-white/10 shadow-2xl flex flex-col z-[100000] overflow-hidden pointer-events-auto"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#c2a25b]/10 to-transparent pointer-events-none" />

            {/* Topo: Logo 'bf' + escrita 'brasilfinance' + Botão de Fechar */}
            <div className="px-4 h-[66px] border-b border-white/10 flex items-center justify-between relative z-10 bg-black shrink-0">
              <div className="flex items-center space-x-2.5">
                <img
                  src="/brand/logo-source.png"
                  alt="Logo Icon"
                  className="w-8 h-8 shrink-0 object-contain drop-shadow-md"
                />
                <div className="flex items-baseline">
                  <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] tracking-tight">
                    brasil
                  </span>
                  <span className="font-light text-xl text-neutral-300 tracking-normal">
                    finance
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  vibrateShort();
                  onClose();
                }}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="p-1.5 rounded-none text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c2a25b]/40 transition-all cursor-pointer focus:outline-none focus-visible:outline-none outline-none"
                title="Fechar menu"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4 text-neutral-300 hover:text-white" />
              </button>
            </div>

            {/* Conteúdo Principal de Opções (Idêntico ao DesktopSidebar) */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 relative z-10 custom-scrollbar">
              
              {/* Seção: Simulação */}
              <div className="space-y-1">
                <div className="px-2 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2a25b]">
                    Simulação
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    onClose();
                    if (onOpenSimulator) onOpenSimulator();
                  }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-xs transition-all text-left group cursor-pointer rounded-none border focus:outline-none focus-visible:outline-none outline-none ${
                    isConfigActive
                      ? 'bg-[#c2a25b]/20 border-[#c2a25b]/70 text-white font-bold shadow-gold-glow-sm'
                      : 'border-transparent text-neutral-300 hover:text-white hover:translate-x-0.5'
                  }`}
                >
                  <Sliders className={`w-4 h-4 shrink-0 ${isConfigActive ? 'text-gold-300' : 'text-gold-400 group-hover:text-gold-300'}`} />
                  <span>Configurar</span>
                </button>
              </div>

              {/* Seção: Ferramentas */}
              <div className="space-y-1 border-t border-white/5 pt-4">
                <div className="px-2 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2a25b]">
                    Ferramentas
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    onClose();
                    if (onOpenAmortization) onOpenAmortization();
                  }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-xs transition-all text-left group cursor-pointer rounded-none border focus:outline-none focus-visible:outline-none outline-none ${
                    isAmortizationActive
                      ? 'bg-[#c2a25b]/20 border-[#c2a25b]/70 text-amber-300 font-bold shadow-gold-glow-sm'
                      : 'border-transparent text-amber-400 hover:text-amber-300 hover:translate-x-0.5'
                  }`}
                >
                  <Zap className={`w-4 h-4 shrink-0 ${isAmortizationActive ? 'text-amber-300' : 'text-amber-400'}`} />
                  <span>Amortização</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    data-scenarios-button="true"
                    onClick={() => {
                      vibrateShort();
                      onClose();
                      if (onOpenSavedScenarios) onOpenSavedScenarios();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all text-left group cursor-pointer rounded-none border focus:outline-none focus-visible:outline-none outline-none ${
                      isSavedScenariosActive
                        ? 'bg-[#c2a25b]/20 border-[#c2a25b]/70 text-white font-bold shadow-gold-glow-sm'
                        : 'border-transparent text-neutral-300 hover:text-white hover:translate-x-0.5'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Bookmark className={`w-4 h-4 shrink-0 ${isSavedScenariosActive ? 'text-gold-300' : 'text-gold-400 group-hover:text-gold-300'}`} />
                      <span className="truncate">Cenários</span>
                    </div>

                    {showSaveNotice ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gradient-to-r from-[#c2a25b]/25 to-[#c2a25b]/10 border border-[#c2a25b]/70 text-gold-300 text-[9px] font-extrabold tracking-wider uppercase rounded-none shrink-0 shadow-gold-glow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c2a25b] animate-ping" />
                        Salvar
                      </span>
                    ) : (
                      savedScenariosCount > 0 && (
                        <span className="px-1.5 py-0.2 bg-gold-400 text-black text-[10px] font-bold rounded-none">
                          {savedScenariosCount}
                        </span>
                      )
                    )}
                  </button>

                  {/* Cartão de Chamada com Design Premium */}
                  {showSaveNotice && (
                    <motion.div
                      data-save-notice="true"
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      onClick={() => {
                        vibrateShort();
                        onClose();
                        if (onOpenSavedScenarios) onOpenSavedScenarios();
                      }}
                      onMouseEnter={() => setCursorVariant('button')}
                      onMouseLeave={() => setCursorVariant('default')}
                      className="mt-1.5 p-2.5 bg-gradient-to-br from-[#1c180e] via-[#12100a] to-black border border-[#c2a25b]/70 rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(194,162,91,0.2)] cursor-pointer group/card hover:border-[#c2a25b] transition-all select-none"
                    >
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-[#c2a25b]/20 border border-[#c2a25b]/50 text-gold-300 shrink-0 mt-0.5">
                          <Sparkles className="w-3 h-3 animate-pulse text-gold-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f3e3ba] via-[#c2a25b] to-[#dfc07b]">
                              Salve o Cenário aqui
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c2a25b] animate-ping shrink-0" />
                          </div>
                          <p className="text-[9px] text-neutral-300 group-hover/card:text-white transition-colors mt-0.5 leading-snug">
                            Sua simulação está pronta. Toque para salvar e comparar no histórico.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Seção: Suporte */}
              <div className="space-y-1 border-t border-white/5 pt-4">
                <div className="px-2 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2a25b]">
                    Suporte
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    onClose();
                    onOpenHelp();
                  }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-xs transition-all text-left group cursor-pointer rounded-none border focus:outline-none focus-visible:outline-none outline-none ${
                    isHelpActive
                      ? 'bg-[#c2a25b]/20 border-[#c2a25b]/70 text-white font-bold shadow-gold-glow-sm'
                      : 'border-transparent text-neutral-300 hover:text-white hover:translate-x-0.5'
                  }`}
                >
                  <HelpCircle className={`w-4 h-4 shrink-0 ${isHelpActive ? 'text-gold-300' : 'text-gold-400 group-hover:text-gold-300'}`} />
                  <span>Suporte</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    onClose();
                    if (onOpenFaq) onOpenFaq();
                    else onOpenHelp();
                  }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-xs transition-all text-left group cursor-pointer rounded-none border focus:outline-none focus-visible:outline-none outline-none ${
                    isFaqActive
                      ? 'bg-[#c2a25b]/20 border-[#c2a25b]/70 text-white font-bold shadow-gold-glow-sm'
                      : 'border-transparent text-neutral-300 hover:text-white hover:translate-x-0.5'
                  }`}
                >
                  <BookOpen className={`w-4 h-4 shrink-0 ${isFaqActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`} />
                  <span>FAQ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    onClose();
                    if (onOpenTerms) onOpenTerms();
                  }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-xs transition-all text-left group cursor-pointer rounded-none border focus:outline-none focus-visible:outline-none outline-none ${
                    isTermsActive
                      ? 'bg-[#c2a25b]/20 border-[#c2a25b]/70 text-white font-bold shadow-gold-glow-sm'
                      : 'border-transparent text-neutral-300 hover:text-white hover:translate-x-0.5'
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 shrink-0 ${isTermsActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`} />
                  <span>Termos</span>
                </button>
              </div>
            </div>

            {/* Rodapé: Ajustes Sensoriais (Idêntico ao DesktopSidebar) */}
            <div className="p-4 border-t border-white/10 bg-neutral-900/95 relative z-10 space-y-3 shrink-0">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#c2a25b]">
                  Ajustes Sensoriais
                </h4>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/5">
                {/* Toggle Efeitos Sonoros */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 text-xs text-neutral-200">
                    {sound ? (
                      <Volume2 className="w-4 h-4 text-[#c2a25b]" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-neutral-500" />
                    )}
                    <span className="font-medium">Efeitos Sonoros</span>
                  </div>
                  <label
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="relative inline-flex items-center cursor-pointer shrink-0"
                  >
                    <input
                      type="checkbox"
                      checked={sound}
                      onChange={toggleSound}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gold-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:h-4 after:w-4 after:rounded-full after:transition-all after:duration-300 peer-checked:bg-gradient-to-r peer-checked:from-[#a47e35] peer-checked:to-[#c2a25b] peer-checked:after:bg-white peer-checked:after:border-white" />
                  </label>
                </div>

                {/* Toggle Vibração Tátil */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 text-xs text-neutral-200">
                    <Smartphone className={`w-4 h-4 ${haptics ? 'text-[#c2a25b]' : 'text-neutral-500'}`} />
                    <span className="font-medium">Vibração Tátil</span>
                  </div>
                  <label
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="relative inline-flex items-center cursor-pointer shrink-0"
                  >
                    <input
                      type="checkbox"
                      checked={haptics}
                      onChange={toggleHaptics}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gold-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:h-4 after:w-4 after:rounded-full after:transition-all after:duration-300 peer-checked:bg-gradient-to-r peer-checked:from-[#a47e35] peer-checked:to-[#c2a25b] peer-checked:after:bg-white peer-checked:after:border-white" />
                  </label>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
};

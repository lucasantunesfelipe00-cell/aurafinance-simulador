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
  ChevronRight,
  Sparkles,
  Sliders,
  Layers,
  LineChart,
  Table,
  Scale,
  Zap,
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
  onSelectTab?: (tab: 'summary' | 'chart' | 'table') => void;
  onOpenSimulator?: () => void;
  onOpenAmortization?: () => void;
  onOpenComparator?: () => void;
  activeTab?: 'summary' | 'chart' | 'table';
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onOpenHelp,
  onOpenFaq,
  onOpenTerms,
  onSelectTab,
  onOpenSimulator,
  onOpenAmortization,
  onOpenComparator,
  activeTab = 'summary',
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
    }
    return () => {
      document.body.style.overflow = '';
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
        <div className="fixed inset-0 z-[99999] flex font-sans select-none">
          {/* Overlay de Fundo com Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              e.stopPropagation();
              vibrateShort();
              onClose();
            }}
            className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Lateral Deslizando da Esquerda */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-[310px] sm:w-[360px] max-w-[85vw] h-full h-screen bg-neutral-950 border-r border-[#c2a25b]/30 shadow-2xl flex flex-col z-[100000] overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#c2a25b]/12 to-transparent pointer-events-none" />

            {/* Cabeçalho do Drawer */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between relative z-10 bg-black/40">
              <div className="flex items-center space-x-2.5">
                <img src="/brand/logo-source.png" alt="Brasil Finance" className="h-7 w-auto shrink-0" />
                <div className="flex items-baseline">
                  <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] tracking-tight">
                    brasil
                  </span>
                  <span className="font-light text-lg text-neutral-300 tracking-normal">
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
                className="p-2 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c2a25b]/40 transition-all cursor-pointer"
                title="Fechar menu"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo Principal do Menu */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 custom-scrollbar">
              
              {/* SEÇÃO 1: ABAS DO APLICATIVO */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2a25b] px-2">
                  Abas do Aplicativo
                </span>
                
                <div className="mt-2 space-y-1.5">
                  {/* Aba: Simulador / Parâmetros */}
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      onClose();
                      if (onOpenSimulator) onOpenSimulator();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-[#c2a25b]/10 border border-white/5 hover:border-[#c2a25b]/30 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white/10 text-gold-400 group-hover:bg-[#c2a25b] group-hover:text-black transition-colors shrink-0">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#c2a25b] transition-colors">
                          Configurar Financiamento
                        </h4>
                        <p className="text-[10px] text-neutral-400">Valores, entrada, juros e prazos</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#c2a25b] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Aba: Resumo & KPIs */}
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      onClose();
                      if (onSelectTab) onSelectTab('summary');
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group cursor-pointer ${
                      activeTab === 'summary'
                        ? 'bg-[#c2a25b]/15 border-[#c2a25b]/50 text-white'
                        : 'bg-white/5 hover:bg-[#c2a25b]/10 border-white/5 hover:border-[#c2a25b]/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg transition-colors shrink-0 ${
                        activeTab === 'summary' ? 'bg-[#c2a25b] text-black' : 'bg-white/10 text-gold-400 group-hover:bg-[#c2a25b] group-hover:text-black'
                      }`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#c2a25b] transition-colors">
                          Aba Resumo &amp; KPIs
                        </h4>
                        <p className="text-[10px] text-neutral-400">Economia estimada e parcelas</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#c2a25b] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Aba: Gráfico Comparativo */}
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      onClose();
                      if (onSelectTab) onSelectTab('chart');
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group cursor-pointer ${
                      activeTab === 'chart'
                        ? 'bg-[#c2a25b]/15 border-[#c2a25b]/50 text-white'
                        : 'bg-white/5 hover:bg-[#c2a25b]/10 border-white/5 hover:border-[#c2a25b]/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg transition-colors shrink-0 ${
                        activeTab === 'chart' ? 'bg-[#c2a25b] text-black' : 'bg-white/10 text-gold-400 group-hover:bg-[#c2a25b] group-hover:text-black'
                      }`}>
                        <LineChart className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#c2a25b] transition-colors">
                          Aba Gráfico Visual
                        </h4>
                        <p className="text-[10px] text-neutral-400">Curvas de amortização no tempo</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#c2a25b] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Aba: Tabela Mês a Mês */}
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      onClose();
                      if (onSelectTab) onSelectTab('table');
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group cursor-pointer ${
                      activeTab === 'table'
                        ? 'bg-[#c2a25b]/15 border-[#c2a25b]/50 text-white'
                        : 'bg-white/5 hover:bg-[#c2a25b]/10 border-white/5 hover:border-[#c2a25b]/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg transition-colors shrink-0 ${
                        activeTab === 'table' ? 'bg-[#c2a25b] text-black' : 'bg-white/10 text-gold-400 group-hover:bg-[#c2a25b] group-hover:text-black'
                      }`}>
                        <Table className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#c2a25b] transition-colors">
                          Aba Tabela Mês a Mês
                        </h4>
                        <p className="text-[10px] text-neutral-400">Detalhamento de cada prestação</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#c2a25b] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Item Especial: Amortização Acelerada */}
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      onClose();
                      if (onOpenAmortization) onOpenAmortization();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-white/5 to-white/5 hover:from-amber-500/20 border border-amber-500/30 hover:border-amber-400/60 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-colors shrink-0">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                          Amortização Acelerada
                        </h4>
                        <p className="text-[10px] text-neutral-400">Aportes extras mensais &amp; anuais</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Item Especial: Comparador SAC vs PRICE */}
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      onClose();
                      if (onOpenComparator) onOpenComparator();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-[#c2a25b]/10 border border-white/5 hover:border-[#c2a25b]/30 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white/10 text-gold-400 group-hover:bg-[#c2a25b] group-hover:text-black transition-colors shrink-0">
                        <Scale className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#c2a25b] transition-colors">
                          Comparar SAC x PRICE
                        </h4>
                        <p className="text-[10px] text-neutral-400">Comparativo lado a lado</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#c2a25b] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                </div>
              </div>

              {/* SEÇÃO 2: CENTRAL DE AJUDA & CONHECIMENTO */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2a25b] px-2">
                  Ajuda &amp; Suporte
                </span>
                
                <div className="mt-2 space-y-2">
                  {/* BOTÃO COM ÍCONE DE INTERROGAÇÃO (?) */}
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      onClose();
                      onOpenHelp();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#c2a25b]/20 via-[#c2a25b]/10 to-white/5 hover:from-[#c2a25b]/30 hover:to-[#c2a25b]/15 border border-[#c2a25b]/50 hover:border-[#c2a25b] text-left transition-all group cursor-pointer shadow-lg shadow-[#c2a25b]/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-[#c2a25b] text-black font-extrabold shadow-md group-hover:scale-105 transition-transform shrink-0">
                        <HelpCircle className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#c2a25b] transition-colors">
                            Central de Ajuda &amp; Manual
                          </h4>
                          <span className="bg-[#c2a25b]/30 text-[#c2a25b] text-[10px] font-mono font-black px-1.5 py-0.5 rounded border border-[#c2a25b]/40">
                            ?
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-300 mt-0.5">Manual do app e glossário financeiro</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#c2a25b] group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  {/* FAQ */}
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
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-[#c2a25b]/10 border border-white/5 hover:border-[#c2a25b]/30 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white/10 text-neutral-300 group-hover:bg-[#c2a25b] group-hover:text-black transition-colors shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#c2a25b] transition-colors">
                          Perguntas Frequentes (FAQ)
                        </h4>
                        <p className="text-[10px] text-neutral-400">Principais dúvidas respondidas</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#c2a25b] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Termos & Privacidade */}
                  <button
                    type="button"
                    onClick={() => {
                      vibrateShort();
                      onClose();
                      if (onOpenTerms) onOpenTerms();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-[#c2a25b]/10 border border-white/5 hover:border-[#c2a25b]/30 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white/10 text-neutral-300 group-hover:bg-[#c2a25b] group-hover:text-black transition-colors shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#c2a25b] transition-colors">
                          Termos &amp; Privacidade
                        </h4>
                        <p className="text-[10px] text-neutral-400">Conformidade e segurança LGPD</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-[#c2a25b] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                </div>
              </div>

              {/* Destaque Amortização */}
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#c2a25b]/10 via-neutral-900 to-black border border-[#c2a25b]/20 space-y-1.5">
                <div className="flex items-center space-x-2 text-[#c2a25b] font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Amortização Inteligente</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Reduza o prazo contratual abatendo diretamente o saldo devedor principal para máxima economia em juros.
                </p>
              </div>

            </div>

            {/* PARTE DE BAIXO: AJUSTES SENSORIAIS (CONFIGURAÇÕES DO APP) */}
            <div className="p-4 border-t border-white/10 bg-neutral-900/95 relative z-10 space-y-3">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#c2a25b]">
                  Ajustes Sensoriais
                </h4>
                <p className="text-[10px] text-neutral-400">Configure o áudio e respostas táteis da interface</p>
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
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={sound}
                      onChange={toggleSound}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gold-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-500 after:border-neutral-500 after:border after:h-4 after:w-4 after:rounded-full after:transition-all after:duration-300 peer-checked:bg-gradient-to-r peer-checked:from-[#a47e35] peer-checked:to-[#c2a25b] peer-checked:after:bg-white peer-checked:after:border-white" />
                  </label>
                </div>

                {/* Toggle Vibração Tátil (Haptics) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 text-xs text-neutral-200">
                    <Smartphone className={`w-4 h-4 ${haptics ? 'text-[#c2a25b]' : 'text-neutral-500'}`} />
                    <span className="font-medium">Vibração Tátil (Haptics)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
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

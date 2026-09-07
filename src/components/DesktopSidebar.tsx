'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Volume2,
  VolumeX,
  Smartphone,
  Sliders,
  Layers,
  LineChart,
  Table,
  Scale,
  Zap,
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '@/lib/sound';
import { isHapticEnabled, setHapticEnabled, vibrateShort } from '@/lib/haptics';
import { setCursorVariant } from '@/lib/cursor-store';

export interface DesktopSidebarProps {
  onOpenHelp: () => void;
  onOpenFaq?: () => void;
  onOpenTerms?: () => void;
  onSelectTab?: (tab: 'summary' | 'chart' | 'table') => void;
  onOpenSimulator?: () => void;
  onOpenAmortization?: () => void;
  onOpenComparator?: () => void;
  activeTab?: 'summary' | 'chart' | 'table';
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  onOpenHelp,
  onOpenFaq,
  onOpenTerms,
  onSelectTab,
  onOpenSimulator,
  onOpenAmortization,
  onOpenComparator,
  activeTab = 'summary',
}) => {
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);

  useEffect(() => {
    setSound(isSoundEnabled());
    setHaptics(isHapticEnabled());
  }, []);

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

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[260px] h-screen bg-black border-r border-white/10 z-[100] select-none font-sans overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#c2a25b]/10 to-transparent pointer-events-none" />

      {/* Topo: Logo 'bf' + escrita 'brasilfinance' */}
      <div className="flex items-center space-x-2.5 px-5 h-[66px] border-b border-white/10 relative z-10 bg-black shrink-0">
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

      {/* Opções do Menu Soltas (Fora de Retângulos) */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 relative z-10 custom-scrollbar">
        
        {/* Seção: Simulação & Vistas */}
        <div className="space-y-1">
          <div className="px-2 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2a25b]">
              Simulação &amp; Vistas
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onOpenSimulator) onOpenSimulator();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="w-full flex items-center space-x-3 px-2 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:translate-x-0.5 transition-all text-left group cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-gold-400 group-hover:text-gold-300 shrink-0" />
            <span>Configurar Financiamento</span>
          </button>

          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onSelectTab) onSelectTab('summary');
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`w-full flex items-center space-x-3 px-2 py-2 text-xs transition-all text-left group cursor-pointer ${
              activeTab === 'summary'
                ? 'text-[#c2a25b] font-bold'
                : 'text-neutral-300 hover:text-white hover:translate-x-0.5'
            }`}
          >
            <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'summary' ? 'text-[#c2a25b]' : 'text-gold-400'}`} />
            <span>Aba Resumo &amp; KPIs</span>
          </button>

          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onSelectTab) onSelectTab('chart');
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`w-full flex items-center space-x-3 px-2 py-2 text-xs transition-all text-left group cursor-pointer ${
              activeTab === 'chart'
                ? 'text-[#c2a25b] font-bold'
                : 'text-neutral-300 hover:text-white hover:translate-x-0.5'
            }`}
          >
            <LineChart className={`w-4 h-4 shrink-0 ${activeTab === 'chart' ? 'text-[#c2a25b]' : 'text-gold-400'}`} />
            <span>Aba Gráfico Visual</span>
          </button>

          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onSelectTab) onSelectTab('table');
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`w-full flex items-center space-x-3 px-2 py-2 text-xs transition-all text-left group cursor-pointer ${
              activeTab === 'table'
                ? 'text-[#c2a25b] font-bold'
                : 'text-neutral-300 hover:text-white hover:translate-x-0.5'
            }`}
          >
            <Table className={`w-4 h-4 shrink-0 ${activeTab === 'table' ? 'text-[#c2a25b]' : 'text-gold-400'}`} />
            <span>Aba Tabela Mês a Mês</span>
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
              if (onOpenAmortization) onOpenAmortization();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="w-full flex items-center space-x-3 px-2 py-2 text-xs font-medium text-amber-400 hover:text-amber-300 hover:translate-x-0.5 transition-all text-left group cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Amortização Acelerada</span>
          </button>

          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onOpenComparator) onOpenComparator();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="w-full flex items-center space-x-3 px-2 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:translate-x-0.5 transition-all text-left group cursor-pointer"
          >
            <Scale className="w-4 h-4 text-gold-400 group-hover:text-gold-300 shrink-0" />
            <span>Comparar SAC x PRICE</span>
          </button>
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
              onOpenHelp();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="w-full flex items-center space-x-3 px-2 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:translate-x-0.5 transition-all text-left group cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-gold-400 group-hover:text-gold-300 shrink-0" />
            <span>Central de Ajuda &amp; Manual</span>
          </button>

          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onOpenFaq) onOpenFaq();
              else onOpenHelp();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="w-full flex items-center space-x-3 px-2 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:translate-x-0.5 transition-all text-left group cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-neutral-400 group-hover:text-white shrink-0" />
            <span>Perguntas Frequentes (FAQ)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onOpenTerms) onOpenTerms();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="w-full flex items-center space-x-3 px-2 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:translate-x-0.5 transition-all text-left group cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-neutral-400 group-hover:text-white shrink-0" />
            <span>Termos &amp; Privacidade</span>
          </button>
        </div>
      </div>

      {/* Rodapé: Ajustes Sensoriais */}
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
    </aside>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
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
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '@/lib/sound';
import { isHapticEnabled, setHapticEnabled, vibrateShort } from '@/lib/haptics';
import { setCursorVariant } from '@/lib/cursor-store';

export interface DesktopSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenHelp: () => void;
  onOpenFaq?: () => void;
  onOpenTerms?: () => void;
  onSelectTab?: (tab: 'summary' | 'chart' | 'table') => void;
  onOpenSimulator?: () => void;
  onOpenAmortization?: () => void;
  onOpenComparator?: () => void;
  activeTab?: 'summary' | 'chart' | 'table';
  isAmortizationActive?: boolean;
  isComparatorActive?: boolean;
  isHelpActive?: boolean;
  isFaqActive?: boolean;
  isTermsActive?: boolean;
  isConfigActive?: boolean;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  onOpenHelp,
  onOpenFaq,
  onOpenTerms,
  onSelectTab,
  onOpenSimulator,
  onOpenAmortization,
  onOpenComparator,
  activeTab = 'summary',
  isAmortizationActive = false,
  isComparatorActive = false,
  isHelpActive = false,
  isFaqActive = false,
  isTermsActive = false,
  isConfigActive = false,
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

  // Identidade cromática e animação personalizada para cada ícone (Inspirado no visual premium)
  const navItems = [
    {
      id: 'config',
      label: 'Configurar Financiamento',
      shortLabel: 'Config',
      icon: Sliders,
      action: () => onOpenSimulator && onOpenSimulator(),
      isActive: Boolean(isConfigActive),
      inactiveColor: 'text-slate-400 group-hover:text-slate-200',
      activeColor: 'text-slate-200',
      activeFill: 'fill-slate-300/20',
      activeAura: 'bg-slate-300/30',
      activeGlow: 'drop-shadow-[0_0_10px_rgba(226,232,240,0.7)]',
      labelActiveColor: 'text-slate-200 drop-shadow-[0_0_6px_rgba(226,232,240,0.4)]',
    },
    {
      id: 'summary',
      label: 'Aba Resumo & KPIs',
      shortLabel: 'Resumo',
      icon: Layers,
      action: () => onSelectTab && onSelectTab('summary'),
      isActive: activeTab === 'summary' && !isComparatorActive && !isHelpActive && !isFaqActive && !isTermsActive && !isAmortizationActive,
      inactiveColor: 'text-emerald-500/70 group-hover:text-emerald-400',
      activeColor: 'text-emerald-400',
      activeFill: 'fill-emerald-500/25',
      activeAura: 'bg-emerald-500/35',
      activeGlow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.85)]',
      labelActiveColor: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]',
    },
    {
      id: 'chart',
      label: 'Aba Gráfico Visual',
      shortLabel: 'Gráfico',
      icon: LineChart,
      action: () => onSelectTab && onSelectTab('chart'),
      isActive: activeTab === 'chart' && !isComparatorActive && !isHelpActive && !isFaqActive && !isTermsActive && !isAmortizationActive,
      inactiveColor: 'text-sky-500/70 group-hover:text-sky-400',
      activeColor: 'text-sky-400',
      activeFill: 'fill-sky-400/20',
      activeAura: 'bg-sky-500/35',
      activeGlow: 'drop-shadow-[0_0_12px_rgba(56,189,248,0.85)]',
      labelActiveColor: 'text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]',
    },
    {
      id: 'table',
      label: 'Aba Tabela Mês a Mês',
      shortLabel: 'Tabela',
      icon: Table,
      action: () => onSelectTab && onSelectTab('table'),
      isActive: activeTab === 'table' && !isComparatorActive && !isHelpActive && !isFaqActive && !isTermsActive && !isAmortizationActive,
      inactiveColor: 'text-amber-300/70 group-hover:text-amber-200',
      activeColor: 'text-amber-200',
      activeFill: 'fill-amber-400/20',
      activeAura: 'bg-amber-400/35',
      activeGlow: 'drop-shadow-[0_0_12px_rgba(253,230,138,0.85)]',
      labelActiveColor: 'text-amber-200 drop-shadow-[0_0_6px_rgba(253,230,138,0.4)]',
    },
    {
      id: 'amortization',
      label: 'Amortização Acelerada',
      shortLabel: 'Acelerar',
      icon: Zap,
      action: () => onOpenAmortization && onOpenAmortization(),
      isActive: Boolean(isAmortizationActive),
      inactiveColor: 'text-amber-500/80 group-hover:text-amber-400',
      activeColor: 'text-amber-400',
      activeFill: 'fill-amber-400/30',
      activeAura: 'bg-gradient-to-r from-amber-500/40 to-orange-500/40',
      activeGlow: 'drop-shadow-[0_0_14px_rgba(245,158,11,0.95)]',
      labelActiveColor: 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]',
    },
    {
      id: 'comparator',
      label: 'Comparar SAC x PRICE',
      shortLabel: 'Comparar',
      icon: Scale,
      action: () => onOpenComparator && onOpenComparator(),
      isActive: Boolean(isComparatorActive),
      inactiveColor: 'text-purple-400/70 group-hover:text-purple-300',
      activeColor: 'text-purple-400',
      activeFill: 'fill-purple-500/25',
      activeAura: 'bg-purple-600/35',
      activeGlow: 'drop-shadow-[0_0_12px_rgba(192,132,252,0.85)]',
      labelActiveColor: 'text-purple-300 drop-shadow-[0_0_6px_rgba(192,132,252,0.4)]',
    },
    {
      id: 'help',
      label: 'Central de Ajuda & Manual',
      shortLabel: 'Manual',
      icon: HelpCircle,
      action: () => onOpenHelp(),
      isActive: Boolean(isHelpActive),
      inactiveColor: 'text-indigo-400/70 group-hover:text-indigo-300',
      activeColor: 'text-indigo-400',
      activeFill: 'fill-indigo-500/25',
      activeAura: 'bg-indigo-500/35',
      activeGlow: 'drop-shadow-[0_0_12px_rgba(129,140,248,0.85)]',
      labelActiveColor: 'text-indigo-300 drop-shadow-[0_0_6px_rgba(129,140,248,0.4)]',
    },
    {
      id: 'faq',
      label: 'Perguntas Frequentes (FAQ)',
      shortLabel: 'FAQ',
      icon: BookOpen,
      action: () => (onOpenFaq ? onOpenFaq() : onOpenHelp()),
      isActive: Boolean(isFaqActive),
      inactiveColor: 'text-teal-400/70 group-hover:text-teal-300',
      activeColor: 'text-teal-400',
      activeFill: 'fill-teal-500/25',
      activeAura: 'bg-teal-500/35',
      activeGlow: 'drop-shadow-[0_0_12px_rgba(45,212,191,0.85)]',
      labelActiveColor: 'text-teal-300 drop-shadow-[0_0_6px_rgba(45,212,191,0.4)]',
    },
    {
      id: 'terms',
      label: 'Termos & Privacidade',
      shortLabel: 'Termos',
      icon: ShieldCheck,
      action: () => onOpenTerms && onOpenTerms(),
      isActive: Boolean(isTermsActive),
      inactiveColor: 'text-emerald-600/70 group-hover:text-emerald-500',
      activeColor: 'text-emerald-500',
      activeFill: 'fill-emerald-500/25',
      activeAura: 'bg-emerald-600/35',
      activeGlow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.85)]',
      labelActiveColor: 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]',
    },
  ];

  if (isCollapsed) {
    return (
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[78px] h-screen bg-black border-r border-white/10 z-[100] select-none font-sans overflow-hidden transition-all duration-300">
        {/* Topo: Logo 'bf' no canto superior esquerdo (clicável para expandir o menu) */}
        <div className="flex items-center justify-center h-[66px] border-b border-white/10 relative z-10 bg-black shrink-0">
          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onToggleCollapse) onToggleCollapse();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer group flex items-center justify-center"
            title="Expandir Menu"
            aria-label="Expandir Menu"
          >
            <img
              src="/brand/logo-source.png"
              alt="Logo Icon"
              className="w-8 h-8 shrink-0 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
            />
          </button>
        </div>

        {/* Lista Vertical de Ícones Animados Sofisticados (Sem caixas/quadrados em volta) */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col items-center space-y-3.5 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  vibrateShort();
                  item.action();
                }}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="group flex flex-col items-center justify-center w-full px-1 py-1 cursor-pointer transition-all focus:outline-none"
                title={item.label}
                aria-label={item.label}
              >
                {/* Ícone Solto Sem Borda/Caixa — Design Sofisticado, Iluminação Colorida e Micro-elevação */}
                <div className="relative flex items-center justify-center w-8 h-8">
                  {item.isActive ? (
                    <motion.div
                      key={`active-icon-${item.id}`}
                      initial={{ y: 0, scale: 0.96 }}
                      animate={{ y: -2, scale: 1.08 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="relative flex items-center justify-center"
                    >
                      {/* Halo Suave de Luz Ambiente Colorida Vibrante */}
                      <div className={`absolute inset-0 rounded-full blur-md ${item.activeAura} opacity-70 animate-pulse`} />
                      <Icon
                        className={`w-6 h-6 z-10 ${item.activeColor} ${item.activeFill} ${item.activeGlow} stroke-[2.2] transition-all`}
                      />
                    </motion.div>
                  ) : (
                    <div className="relative flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5">
                      {/* Glow sutil ao passar o mouse */}
                      <div className={`absolute inset-0 rounded-full blur-sm ${item.activeAura} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
                      <Icon
                        className={`w-5 h-5 z-10 transition-all duration-300 ${item.inactiveColor} group-hover:scale-110 stroke-[1.8]`}
                      />
                    </div>
                  )}
                </div>

                {/* Nome Curto Embaixo do Ícone */}
                <span
                  className={`text-[9.5px] tracking-tight font-medium mt-1 transition-colors text-center line-clamp-1 select-none ${
                    item.isActive
                      ? `${item.labelActiveColor} font-bold`
                      : 'text-neutral-400 group-hover:text-neutral-200'
                  }`}
                >
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Botão Inferior de Expandir */}
        <div className="p-2 border-t border-white/10 bg-black flex justify-center shrink-0">
          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onToggleCollapse) onToggleCollapse();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            title="Expandir Menu"
            aria-label="Expandir Menu"
          >
            <ChevronRight className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[260px] h-screen bg-black border-r border-white/10 z-[100] select-none font-sans overflow-hidden transition-all duration-300">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#c2a25b]/10 to-transparent pointer-events-none" />

      {/* Topo: Logo 'bf' + escrita 'brasilfinance' + Botão 'X' para fechar */}
      <div className="flex items-center justify-between px-4 h-[66px] border-b border-white/10 relative z-10 bg-black shrink-0">
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

        {/* Botão de Fechar X no Menu Desktop */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={() => {
              vibrateShort();
              onToggleCollapse();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="p-1.5 rounded-none text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c2a25b]/40 transition-all cursor-pointer shrink-0"
            title="Fechar menu"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4 text-neutral-300 hover:text-white" />
          </button>
        )}
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
            className={`w-full flex items-center space-x-3 px-3 py-2 text-xs transition-all text-left group cursor-pointer rounded-none border ${
              activeTab === 'summary'
                ? 'bg-[#c2a25b]/20 border-[#c2a25b]/70 text-white font-bold shadow-gold-glow-sm'
                : 'border-transparent text-neutral-300 hover:text-white hover:translate-x-0.5'
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
            className={`w-full flex items-center space-x-3 px-3 py-2 text-xs transition-all text-left group cursor-pointer rounded-none border ${
              activeTab === 'chart'
                ? 'bg-[#c2a25b]/20 border-[#c2a25b]/70 text-white font-bold shadow-gold-glow-sm'
                : 'border-transparent text-neutral-300 hover:text-white hover:translate-x-0.5'
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
            className={`w-full flex items-center space-x-3 px-3 py-2 text-xs transition-all text-left group cursor-pointer rounded-none border ${
              activeTab === 'table'
                ? 'bg-[#c2a25b]/20 border-[#c2a25b]/70 text-white font-bold shadow-gold-glow-sm'
                : 'border-transparent text-neutral-300 hover:text-white hover:translate-x-0.5'
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

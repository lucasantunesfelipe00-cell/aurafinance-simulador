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
  Zap,
  ChevronRight,
  Bookmark,
  Sparkles,
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
  activeTab?: 'summary' | 'chart' | 'table';
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
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

  const navItems = [
    {
      id: 'config',
      label: 'Configurar',
      icon: Sliders,
      action: () => onOpenSimulator && onOpenSimulator(),
      isActive: Boolean(isConfigActive),
      iconColor: 'text-gold-400',
    },
    {
      id: 'amortization',
      label: 'Amortização',
      icon: Zap,
      action: () => onOpenAmortization && onOpenAmortization(),
      isActive: Boolean(isAmortizationActive),
      iconColor: 'text-[#c2a25b]',
    },
    {
      id: 'savedScenarios',
      label: `Cenários ${savedScenariosCount > 0 ? `(${savedScenariosCount})` : ''}`,
      icon: Bookmark,
      action: () => onOpenSavedScenarios && onOpenSavedScenarios(),
      isActive: Boolean(isSavedScenariosActive),
      iconColor: 'text-gold-400',
    },
    {
      id: 'help',
      label: 'Suporte',
      icon: HelpCircle,
      action: () => onOpenHelp(),
      isActive: Boolean(isHelpActive),
      iconColor: 'text-gold-400',
    },
    {
      id: 'faq',
      label: 'FAQ',
      icon: BookOpen,
      action: () => (onOpenFaq ? onOpenFaq() : onOpenHelp()),
      isActive: Boolean(isFaqActive),
      iconColor: 'text-neutral-400',
    },
    {
      id: 'terms',
      label: 'Termos',
      icon: ShieldCheck,
      action: () => onOpenTerms && onOpenTerms(),
      isActive: Boolean(isTermsActive),
      iconColor: 'text-neutral-400',
    },
  ];

  if (isCollapsed) {
    return (
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-[78px] h-screen bg-black border-r border-white/10 z-[100] select-none font-sans overflow-visible transition-all duration-300">
        {/* Topo: Logo 'bf' no canto superior esquerdo (clicável para reabrir o menu) */}
        <div className="flex items-center justify-center h-[66px] border-b border-white/5 relative z-10 bg-black shrink-0">
          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onToggleCollapse) onToggleCollapse();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="p-1.5 rounded-none hover:bg-white/10 transition-all cursor-pointer group flex items-center justify-center focus:outline-none focus-visible:outline-none outline-none"
            title="Expandir Menu de Navegação"
            aria-label="Expandir Menu"
          >
            <img
              src="/brand/logo-source.png"
              alt="Logo Icon"
              className="w-8 h-8 shrink-0 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
          </button>
        </div>

        {/* Lista Vertical de Ícones no Menu Fechado */}
        <div className="flex-1 py-3.5 flex flex-col items-center space-y-2.5 custom-scrollbar overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isScenarios = item.id === 'savedScenarios';

            return (
              <div key={item.id} className="relative w-full px-1 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    item.action();
                  }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className={`relative flex flex-col items-center justify-center w-full py-1.5 px-1 group cursor-pointer transition-all focus:outline-none focus-visible:outline-none outline-none select-none rounded-none ${
                    item.isActive ? '' : 'hover:bg-white/[0.04]'
                  }`}
                  title={item.label}
                  aria-label={item.label}
                >
                  {/* Destaque Visual: Cápsula Dourada Animada que indica claramente a aba ativa */}
                  {item.isActive && (
                    <motion.div
                      layoutId="activeCollapsedTabCard"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-x-1 inset-y-0.5 bg-gradient-to-b from-[#c2a25b]/25 via-[#c2a25b]/15 to-[#c2a25b]/5 border border-[#c2a25b]/60 rounded-none shadow-[0_0_16px_rgba(194,162,91,0.25)] pointer-events-none -z-10"
                    />
                  )}

                  {/* Área do Ícone com Altura Fixa */}
                  <div className="relative w-full h-7 flex items-center justify-center">
                    {/* Barra Indicadora Dourada na Borda Esquerda */}
                    {item.isActive && (
                      <motion.div
                        layoutId="activeCollapsedTabIndicator"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-gradient-to-b from-[#f3e3ba] via-[#c2a25b] to-[#a47e35] rounded-none shadow-[0_0_12px_rgba(194,162,91,0.95)]"
                      />
                    )}

                    {/* Halo de luz suave atrás do ícone selecionado */}
                    {item.isActive && (
                      <div className="absolute w-7 h-7 bg-[#c2a25b]/30 blur-sm pointer-events-none -z-10" />
                    )}

                    {/* Beacon pulsante no ícone de Cenários quando aviso ativo */}
                    {isScenarios && showSaveNotice && (
                      <span className="absolute -top-1 right-2 flex h-3 w-3 pointer-events-none z-20">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c2a25b] opacity-80" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-tr from-[#a47e35] via-[#f3e3ba] to-[#c2a25b] shadow-[0_0_10px_#c2a25b]" />
                      </span>
                    )}

                    {/* Ícone */}
                    <Icon
                      className={`w-5 h-5 z-10 transition-all duration-300 ${
                        item.isActive
                          ? 'text-[#f5deb3] fill-[#c2a25b]/30 scale-110 drop-shadow-[0_0_12px_rgba(194,162,91,0.95)] stroke-[2.2]'
                          : isScenarios && showSaveNotice
                          ? 'text-[#f3e3ba] scale-110 drop-shadow-[0_0_10px_rgba(194,162,91,0.9)] stroke-[2.1]'
                          : `${item.iconColor} group-hover:text-white group-hover:scale-105 stroke-[1.8]`
                      }`}
                    />
                  </div>

                  {/* Nome da aba */}
                  <span
                    className={`text-[10px] tracking-tight font-medium mt-1 transition-colors text-center line-clamp-1 select-none z-10 ${
                      item.isActive
                        ? 'text-[#f5deb3] font-bold drop-shadow-[0_0_8px_rgba(194,162,91,0.7)]'
                        : isScenarios && showSaveNotice
                        ? 'text-[#f3e3ba] font-bold drop-shadow-[0_0_6px_rgba(194,162,91,0.6)]'
                        : 'text-neutral-400 group-hover:text-neutral-200'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>

                {/* Aviso Flutuante Ultra-Refinado (Aparece com a aba lateral esquerda fechada!) */}
                {isScenarios && showSaveNotice && (
                  <motion.div
                    initial={{ opacity: 0, x: -14, scale: 0.94 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      y: [0, -3, 0],
                    }}
                    transition={{
                      opacity: { duration: 0.25 },
                      x: { duration: 0.3, ease: 'easeOut' },
                      y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      vibrateShort();
                      item.action();
                    }}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 z-[150] cursor-pointer select-none group/callout"
                  >
                    <div className="relative flex items-center gap-3.5 px-4 py-3 bg-gradient-to-r from-neutral-950 via-[#14120a] to-neutral-950 border border-[#c2a25b]/80 rounded-none shadow-[0_12px_45px_rgba(0,0,0,0.95),0_0_30px_rgba(194,162,91,0.4)] backdrop-blur-xl whitespace-nowrap hover:border-[#c2a25b] hover:shadow-[0_12px_50px_rgba(0,0,0,0.98),0_0_35px_rgba(194,162,91,0.6)] transition-all">
                      {/* Seta indicadora apontando exatamente para o ícone na sidebar */}
                      <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-neutral-950 border-l border-b border-[#c2a25b]/80 rotate-45 pointer-events-none" />

                      {/* Ícone com moldura dourada */}
                      <div className="relative flex items-center justify-center w-7 h-7 rounded-none bg-[#c2a25b]/20 border border-[#c2a25b]/60 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-pulse" />
                      </div>

                      {/* Textos */}
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#f3e3ba] via-[#c2a25b] to-[#dfc07b]">
                            Salve o Cenário aqui
                          </span>
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c2a25b] animate-ping" />
                        </div>
                        <span className="text-[9.5px] font-normal text-neutral-300 group-hover/callout:text-white transition-colors">
                          Clique para guardar e comparar esta simulação
                        </span>
                      </div>

                      {/* Seta de ação */}
                      <ChevronRight className="w-4 h-4 text-gold-400 group-hover/callout:translate-x-1 transition-transform shrink-0 ml-1" />
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botão Inferior para Reabrir / Expandir Menu */}
        <div className="p-2 border-t border-white/5 bg-black flex justify-center shrink-0">
          <button
            type="button"
            onClick={() => {
              vibrateShort();
              if (onToggleCollapse) onToggleCollapse();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="p-2 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer focus:outline-none focus-visible:outline-none outline-none"
            title="Expandir Menu"
            aria-label="Expandir Menu"
          >
            <ChevronRight className="w-5 h-5 text-gold-400" />
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
            className="p-1.5 rounded-none text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c2a25b]/40 transition-all cursor-pointer shrink-0 focus:outline-none focus-visible:outline-none outline-none"
            title="Fechar menu"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4 text-neutral-300 hover:text-white" />
          </button>
        )}
      </div>

      {/* Opções do Menu Soltas (Fora de Retângulos) */}
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
              onClick={() => {
                vibrateShort();
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

            {/* Cartão de Chamada com Design Premium na Barra Aberta */}
            {showSaveNotice && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={() => {
                  vibrateShort();
                  if (onOpenSavedScenarios) onOpenSavedScenarios();
                }}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="mt-2 p-3 bg-gradient-to-br from-[#1c180e] via-[#12100a] to-black border border-[#c2a25b]/70 rounded-none shadow-[0_6px_25px_rgba(0,0,0,0.85),0_0_20px_rgba(194,162,91,0.25)] cursor-pointer group/card hover:border-[#c2a25b] transition-all select-none"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-[#c2a25b]/20 border border-[#c2a25b]/50 text-gold-300 shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-gold-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f3e3ba] via-[#c2a25b] to-[#dfc07b]">
                        Salve o Cenário aqui
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c2a25b] animate-ping shrink-0" />
                    </div>
                    <p className="text-[9.5px] text-neutral-300 group-hover/card:text-white transition-colors mt-1 leading-snug">
                      Sua simulação está calculada. Guarde-a aqui para alternar e comparar lado a lado.
                    </p>
                    <div className="mt-2 flex items-center text-[9px] font-bold text-gold-400 group-hover/card:text-gold-300 tracking-wider uppercase">
                      <span>Acessar Cenários</span>
                      <ChevronRight className="w-3 h-3 ml-0.5 group-hover/card:translate-x-1 transition-transform" />
                    </div>
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

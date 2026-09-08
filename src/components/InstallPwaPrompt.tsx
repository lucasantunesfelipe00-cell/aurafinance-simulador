'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Share, PlusSquare, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { vibrateShort } from '@/lib/haptics';
import { setCursorVariant } from '@/lib/cursor-store';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detecta se já está rodando como app instalado (standalone)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(Boolean(isStandaloneMode));
    if (isStandaloneMode) return;

    // Detecta se é iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Escuta o evento nativo de instalação do Android / Chrome
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Escuta evento customizado disparado manualmente pelo menu lateral
    const handleManualOpen = () => {
      setIsVisible(true);
    };
    window.addEventListener('open-pwa-install', handleManualOpen);

    // Verifica se o usuário já dispensou recentemente (últimos 7 dias)
    const dismissedAt = localStorage.getItem('pwa_install_dismissed_at');
    const isDismissedRecently =
      dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 7 * 24 * 60 * 60 * 1000;

    // Se não foi dispensado e é dispositivo mobile/tablet, exibe discretamente após 4 segundos
    const isMobileDevice = isIosDevice || /android|mobile/.test(userAgent) || window.innerWidth < 1024;
    if (!isDismissedRecently && isMobileDevice) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 4000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('open-pwa-install', handleManualOpen);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('open-pwa-install', handleManualOpen);
    };
  }, []);

  const handleInstallClick = async () => {
    vibrateShort();
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Caso o navegador não tenha deferredPrompt disponível no momento (ex: Safari ou Chrome já instalado)
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    vibrateShort();
    setIsVisible(false);
    setShowIosGuide(false);
    try {
      localStorage.setItem('pwa_install_dismissed_at', Date.now().toString());
    } catch {
      // Ignora erro de localStorage caso bloqueado
    }
  };

  if (isStandalone || !isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-[99999] max-w-md pointer-events-auto select-none font-sans">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-neutral-950/95 border border-[#c2a25b]/80 rounded-none shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(194,162,91,0.3)] backdrop-blur-xl p-4 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#c2a25b]/15 to-transparent pointer-events-none" />

          {/* Cabeçalho do Card */}
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              {/* Ícone dourado do app */}
              <div className="relative w-11 h-11 bg-black border border-[#c2a25b]/70 p-1 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(194,162,91,0.25)]">
                <img
                  src="/brand/logo-source.png"
                  alt="Ícone Brasil Finance"
                  className="w-full h-full object-contain drop-shadow"
                />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c2a25b] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c2a25b]" />
                </span>
              </div>

              {/* Textos */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#c2a25b]">
                    Aplicativo Nativo
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#c2a25b]/20 border border-[#c2a25b]/50 text-[#f3e3ba] text-[8px] font-extrabold uppercase">
                    PWA
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight mt-0.5">
                  Instalar o simulador como app no seu celular
                </h4>
              </div>
            </div>

            {/* Botão de Fechar */}
            <button
              type="button"
              onClick={handleDismiss}
              onMouseEnter={() => setCursorVariant('button')}
              onMouseLeave={() => setCursorVariant('default')}
              className="p-1 text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors shrink-0 cursor-pointer"
              title="Fechar aviso"
              aria-label="Fechar aviso"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Subtítulo / Descrição de benefícios */}
          <p className="text-[11px] text-neutral-300 mt-2.5 leading-relaxed relative z-10 text-left">
            Ganhe o ícone dourado na sua tela inicial e abra o simulador instantaneamente em{' '}
            <strong className="text-[#f3e3ba] font-semibold">tela cheia</strong>, sem a barra de endereços do navegador.
          </p>

          {/* Guia Visual Passo a Passo para iOS (quando expandido ou no iPhone) */}
          <AnimatePresence>
            {showIosGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 pt-3 border-t border-white/10 space-y-2 text-left relative z-10"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#c2a25b]">
                  <Sparkles className="w-3 h-3 text-gold-300" />
                  <span>Como instalar no iPhone / iPad:</span>
                </div>

                <div className="space-y-1.5 text-[10px] text-neutral-300 bg-black/60 p-2.5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#c2a25b]/20 border border-[#c2a25b]/60 flex items-center justify-center shrink-0 text-gold-300 text-[9px] font-black">
                      1
                    </div>
                    <span>
                      No Safari, toque no botão de{' '}
                      <strong className="text-white inline-flex items-center gap-1">
                        Compartilhar <Share className="w-3 h-3 text-sky-400 inline" />
                      </strong>{' '}
                      (barra inferior).
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#c2a25b]/20 border border-[#c2a25b]/60 flex items-center justify-center shrink-0 text-gold-300 text-[9px] font-black">
                      2
                    </div>
                    <span>
                      Role a lista e toque em{' '}
                      <strong className="text-white inline-flex items-center gap-1">
                        Adicionar à Tela de Início <PlusSquare className="w-3 h-3 text-[#c2a25b] inline" />
                      </strong>
                      .
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#c2a25b]/20 border border-[#c2a25b]/60 flex items-center justify-center shrink-0 text-gold-300 text-[9px] font-black">
                      3
                    </div>
                    <span>
                      Toque em <strong className="text-white">Adicionar</strong> no canto superior direito.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-2 mt-3 relative z-10">
            <button
              type="button"
              onClick={handleDismiss}
              onMouseEnter={() => setCursorVariant('button')}
              onMouseLeave={() => setCursorVariant('default')}
              className="px-3 py-1.5 text-[11px] font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Agora não
            </button>

            <button
              type="button"
              onClick={handleInstallClick}
              onMouseEnter={() => setCursorVariant('button')}
              onMouseLeave={() => setCursorVariant('default')}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#c2a25b] to-[#a47e35] text-black text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(194,162,91,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-black" />
              <span>{isIos && !showIosGuide ? 'Ver Como Instalar' : deferredPrompt ? 'Instalar Agora' : 'Instalar no Celular'}</span>
              <ArrowRight className="w-3 h-3 text-black" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

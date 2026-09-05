'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroTitle } from '@/components/HeroTitle';
import { Header } from '@/components/Header';
import { BackgroundLightTrail } from '@/components/BackgroundLightTrail';
import { playTypeSound, playGoldBeamSweepSound } from '@/lib/sound';
import { vibrateShort } from '@/lib/haptics';
import { setCursorVariant } from '@/lib/cursor-store';

interface BankSplashFlowProps {
  onStartSimulator: () => void;
}

export const BankSplashFlow: React.FC<BankSplashFlowProps> = ({ onStartSimulator }) => {
  // 'splash' -> Tela 1 (1.5s com dissolução profunda da logo)
  // 'welcome' -> Tela 2 (Estilo banco com cabeçalho idêntico à tela 3, frase toda branca e botão 'Acessar')
  const [stage, setStage] = useState<'splash' | 'welcome'>('splash');
  const [isBeamLooping, setIsBeamLooping] = useState(false);

  useEffect(() => {
    // Fallback de segurança para avançar para a Tela 2 se a animação não disparar
    const timer = setTimeout(() => {
      setStage('welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage === 'welcome') {
      playGoldBeamSweepSound();
    }
  }, [stage]);

  const handleAccess = () => {
    playTypeSound();
    vibrateShort();
    onStartSimulator();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {stage === 'splash' ? (
          /* ========================================================= */
          /* TELA 1: Splash Screen com Brilho Suave Passando na Logo   */
          /* ========================================================= */
          <motion.div
            key="splash-stage"
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.15,
              filter: 'blur(24px)',
              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-black"
          >
            <div className="flex items-center justify-center w-full">
              <HeroTitle showShine onShineEnd={() => setStage('welcome')} />
            </div>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* TELA 2: Landing Estilo Banco com Cabeçalho Padrão e Fundo */
          /* ========================================================= */
          <motion.div
            key="welcome-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="relative flex-1 flex flex-col justify-between w-full h-full overflow-hidden"
          >
            {/* Fundo Anexado com Tom Dourado Puro (Zero Laranja) e Varredura Ampla da Direita para a Esquerda */}
            <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden bg-black">
              {/* Imagem de Fundo Vertical no Mobile (100% Intacto no Celular) */}
              <motion.img
                src="/images/bank-welcome-bg.jpg"
                alt="Fundo Institucional Mobile"
                animate={{
                  scale: [1.02, 1.05, 1.02],
                  x: ['0%', '-1.2%', '0%'],
                  y: ['0%', '0.8%', '0%'],
                  filter: [
                    'sepia(0.3) saturate(1.4) brightness(0.9) hue-rotate(0deg)',
                    'sepia(0.38) saturate(1.6) brightness(0.95) hue-rotate(4deg)',
                    'sepia(0.3) saturate(1.4) brightness(0.9) hue-rotate(0deg)',
                  ],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="sm:hidden w-full h-full object-cover object-center opacity-60 pointer-events-none"
              />

              {/* A Mesma Imagem do Usuário Rotacionada na Horizontal no Desktop */}
              <motion.img
                src="/images/bank-welcome-bg-horizontal.jpg"
                alt="Fundo Institucional Desktop Horizontal"
                animate={{
                  scale: [1.02, 1.05, 1.02],
                  x: ['0%', '-1.2%', '0%'],
                  y: ['0%', '0.8%', '0%'],
                  filter: [
                    'sepia(0.3) saturate(1.4) brightness(0.9) hue-rotate(0deg)',
                    'sepia(0.38) saturate(1.6) brightness(0.95) hue-rotate(4deg)',
                    'sepia(0.3) saturate(1.4) brightness(0.9) hue-rotate(0deg)',
                  ],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="hidden sm:block w-full h-full object-cover object-center sm:object-[center_35%] opacity-35 pointer-events-none"
              />

              {/* Brilho de Luz Ambiente Suave que Acompanha a Movimentação das Ondas (Sem excesso de brilho) */}
              <motion.div
                animate={{
                  opacity: [0.15, 0.38, 0.15],
                  scale: [1.0, 1.06, 1.0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background:
                    'radial-gradient(ellipse at 60% 40%, rgba(194, 162, 91, 0.3) 0%, rgba(164, 126, 53, 0.12) 50%, transparent 80%)',
                  mixBlendMode: 'color-dodge',
                }}
                className="absolute inset-0 pointer-events-none"
              />

              {/* Feixe de Luz Dourado: 1ª Varredura Inicial Rápida (3.2s) -> Seguidas por Varreduras 4x Mais Lentas (12.8s) Sem Espera entre Elas */}
              {!isBeamLooping ? (
                <motion.div
                  key="initial-beam"
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{
                    x: ['100%', '-100%'],
                    opacity: [0, 0.95, 0.95, 0],
                  }}
                  transition={{
                    duration: 3.2, // 1ª varredura rápida de abertura
                    ease: 'linear',
                  }}
                  onAnimationComplete={() => setIsBeamLooping(true)}
                  style={{
                    background:
                      'linear-gradient(115deg, transparent 10%, rgba(164, 126, 53, 0.45) 35%, rgba(194, 162, 91, 0.8) 45%, rgba(223, 192, 123, 0.98) 50%, rgba(194, 162, 91, 0.8) 55%, rgba(164, 126, 53, 0.45) 65%, transparent 90%)',
                    mixBlendMode: 'color-dodge',
                  }}
                  className="absolute inset-[-50%] pointer-events-none z-10"
                />
              ) : (
                <motion.div
                  key="looping-beam"
                  initial={{ x: '100%', opacity: 0 }}
                  animate={{
                    x: ['100%', '-100%'],
                    opacity: [0, 0.9, 0.9, 0],
                  }}
                  transition={{
                    duration: 12.8, // 4x mais devagar que a 1ª varredura (3.2s * 4 = 12.8s)
                    repeat: Infinity,
                    repeatDelay: 0, // Mesmo intervalo zero: assim que um termina no canto esquerdo, o próximo começa na hora no canto direito
                    ease: 'linear',
                  }}
                  style={{
                    background:
                      'linear-gradient(115deg, transparent 10%, rgba(164, 126, 53, 0.45) 35%, rgba(194, 162, 91, 0.8) 45%, rgba(223, 192, 123, 0.98) 50%, rgba(194, 162, 91, 0.8) 55%, rgba(164, 126, 53, 0.45) 65%, transparent 90%)',
                    mixBlendMode: 'color-dodge',
                  }}
                  className="absolute inset-[-50%] pointer-events-none z-10"
                />
              )}

              {/* Feixe de Luz Dourado Interativo que Segue o Rastro do Mouse */}
              <BackgroundLightTrail />

              {/* Sombreamento sutil de vinheta */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* CONTEÚDO PRINCIPAL (MOBILE E DESKTOP): Cartão de Boas-Vindas Responsivo */}
            <motion.main
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex-1 flex flex-col items-center justify-center w-full max-w-[1200px] mx-auto px-4 sm:px-6 z-20 my-auto py-6"
            >
              {/* Cartão Escuro Ultra-Transparente Responsivo (Mobile & Desktop) */}
              <div className="w-full max-w-[92vw] sm:w-[500px] lg:w-[540px] min-h-[440px] sm:min-h-[540px] lg:min-h-[580px] bg-black/05 backdrop-blur-[2px] border border-black/50 rounded-2xl py-8 sm:py-12 lg:py-14 px-5 sm:px-8 lg:px-10 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                {/* Logo "bf" no topo do quadrado (Aproximada do texto) */}
                <div className="relative inline-block overflow-hidden -mb-4 sm:-mb-5 lg:-mb-6">
                  <img
                    src="/brand/logo-source.png"
                    alt="Brasil Finance"
                    className="h-36 min-[380px]:h-44 sm:h-52 lg:h-56 w-auto object-contain drop-shadow-2xl"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    style={{
                      WebkitMaskImage: 'url(/brand/logo-source.png)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskImage: 'url(/brand/logo-source.png)',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                    }}
                  >
                    <motion.div
                      initial={{ x: '-130%' }}
                      animate={{ x: '230%' }}
                      transition={{
                        duration: 14.0,
                        repeat: Infinity,
                        repeatDelay: 0.05,
                        ease: 'linear',
                      }}
                      className="w-full h-full bg-gradient-to-r from-transparent via-white/35 via-50% to-transparent -skew-x-12"
                    />
                  </div>
                </div>

                {/* Texto de Boas-Vindas */}
                <div className="space-y-1.5 flex flex-col items-center w-full">
                  <h2 className="text-xl min-[380px]:text-2xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white whitespace-nowrap">
                    Bem Vindo a Brasil Finance
                  </h2>
                  <p className="text-xs min-[380px]:text-sm sm:text-sm lg:text-base text-neutral-300 font-medium tracking-wide">
                    A inteligência financeira dos seus imóveis.
                  </p>
                </div>

                {/* Botão "Acessar" */}
                <div className="w-full flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleAccess}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="btn-lift relative w-full sm:w-[370px] max-w-full py-3.5 sm:py-3 bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] text-black font-bold text-xs uppercase tracking-widest rounded-2xl shadow-gold-glow hover:brightness-110 transition-all duration-300 active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10">Acessar</span>
                    <motion.div
                      initial={{ x: '-130%' }}
                      animate={{ x: '230%' }}
                      transition={{
                        duration: 14.0,
                        repeat: Infinity,
                        repeatDelay: 0.05,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/35 via-50% to-transparent -skew-x-12"
                    />
                  </button>
                </div>
              </div>

              {/* Texto de aviso reduzido embaixo do quadrado */}
              <div className="mt-4 flex items-center justify-center space-x-1.5 text-neutral-400/70 text-[10px] font-medium tracking-widest uppercase">
                <svg className="w-3 h-3 text-[#c2a25b]/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Acesso restrito e monitorado</span>
              </div>
            </motion.main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

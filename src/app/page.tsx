'use client';

import React, { useState, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FinancingInputs } from '@/types/financing';
import {
  calculateFinancing,
  compareFinancing,
  DEFAULT_FINANCING_INPUTS,
  formatBRL,
} from '@/lib/financing-calculator';
import { Header } from '@/components/Header';
import { SimulatorCarousel } from '@/components/SimulatorCarousel';
import { ResultsSummary } from '@/components/ResultsSummary';
import { AmortizationChart } from '@/components/AmortizationChart';
import { AmortizationTable } from '@/components/AmortizationTable';
import { ComparatorModal } from '@/components/ComparatorModal';
import { SpecsViewerModal } from '@/components/SpecsViewerModal';
import { HeroTitle } from '@/components/HeroTitle';
import { BankSplashFlow } from '@/components/BankSplashFlow';
import { BackgroundLightTrail } from '@/components/BackgroundLightTrail';
import { vibrateShort } from '@/lib/haptics';
import { setCursorVariant } from '@/lib/cursor-store';
import { playTypeSound } from '@/lib/sound';
import {
  LineChart,
  Table,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function formatCurrencyMask(val: number): string {
  if (isNaN(val)) return '0,00';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export default function Home() {
  const [viewMode, setViewMode] = useState<'onboarding' | 'simulator'>('onboarding');
  const [inputs, setInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [calculatedInputs, setCalculatedInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isConfigVisible, setIsConfigVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'chart' | 'table'>('summary');
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const resultsRef = useRef<HTMLDivElement>(null);

  const [isExtraAmortizationOpen, setIsExtraAmortizationOpen] = useState(false);
  const [maskedMonthly, setMaskedMonthly] = useState(formatCurrencyMask(inputs.extraMonthlyAmortization || 0));
  const [maskedAnnual, setMaskedAnnual] = useState(formatCurrencyMask(inputs.extraAnnualAmortization || 0));

  // Sync masks when inputs change externally (e.g. on Reset)
  React.useEffect(() => {
    setMaskedMonthly(formatCurrencyMask(inputs.extraMonthlyAmortization || 0));
  }, [inputs.extraMonthlyAmortization]);

  React.useEffect(() => {
    setMaskedAnnual(formatCurrencyMask(inputs.extraAnnualAmortization || 0));
  }, [inputs.extraAnnualAmortization]);

  // Recálculo realizado apenas ao confirmar a simulação
  const result = useMemo(() => calculateFinancing(calculatedInputs), [calculatedInputs]);
  const comparison = useMemo(() => compareFinancing(calculatedInputs), [calculatedInputs]);

  // Resultado de base sem aportes adicionais, para cálculo da economia
  const baselineResult = useMemo(() => {
    return calculateFinancing({
      ...calculatedInputs,
      extraMonthlyAmortization: 0,
      extraAnnualAmortization: 0,
    });
  }, [calculatedInputs]);

  // Função disparada ao clicar em SIMULAR
  const handleSimulate = () => {
    setCalculatedInputs(inputs);
    setHasCalculated(true);
    setIsConfigVisible(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleReset = () => {
    setInputs(DEFAULT_FINANCING_INPUTS);
    setCalculatedInputs(DEFAULT_FINANCING_INPUTS);
    setCurrentStep(1);
    setHasCalculated(false);
    setIsConfigVisible(true);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
      {/* Background ambiente 100% estático sem efeitos de surgir/movimento */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] iridescent-hero-bg pointer-events-none -z-10 opacity-30" />

      <AnimatePresence mode="wait">
        {viewMode === 'onboarding' ? (
          <motion.div
            key="onboarding-view"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
            className="w-full h-full min-h-screen bg-black"
          >
            <BankSplashFlow onStartSimulator={() => setViewMode('simulator')} />
          </motion.div>
        ) : (
          <motion.div
            key="simulator-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex-1 flex flex-col w-full min-h-screen relative"
          >
            {/* Imagem de Fundo das Ondas Douradas (Escurecida 15%) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
              {/* Versão Mobile (Vertical) — Escurecida 15% */}
              <img
                src="/images/bank-welcome-bg.jpg"
                alt="Fundo Institucional Mobile"
                className="sm:hidden w-full h-full object-cover object-center opacity-45 pointer-events-none"
              />

              {/* Versão Desktop (Horizontal) — Escurecida 15% */}
              <img
                src="/images/bank-welcome-bg-horizontal.jpg"
                alt="Fundo Institucional Desktop"
                className="hidden sm:block w-full h-full object-cover object-center sm:object-[center_35%] opacity-30 pointer-events-none"
              />

              {/* Camada de Escurecimento Geral 15% */}
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />

              {/* Brilho de Luz Ambiente Suave */}
              <div
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 30%, rgba(194, 162, 91, 0.22) 0%, rgba(164, 126, 53, 0.08) 50%, transparent 80%)',
                  mixBlendMode: 'color-dodge',
                }}
                className="absolute inset-0 pointer-events-none"
              />

              {/* Feixe de Luz Dourado: Suave e Bem Mais Devagar (22s) */}
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{
                  x: ['100%', '-100%'],
                  opacity: [0, 0.45, 0.45, 0],
                }}
                transition={{
                  duration: 22.0,
                  repeat: Infinity,
                  repeatDelay: 0,
                  ease: 'linear',
                }}
                style={{
                  background:
                    'linear-gradient(115deg, transparent 15%, rgba(164, 126, 53, 0.22) 38%, rgba(194, 162, 91, 0.48) 48%, rgba(223, 192, 123, 0.6) 50%, rgba(194, 162, 91, 0.48) 52%, rgba(164, 126, 53, 0.22) 62%, transparent 85%)',
                  mixBlendMode: 'color-dodge',
                }}
                className="absolute inset-[-50%] pointer-events-none z-10"
              />

              {/* Feixe de Luz Dourado Interativo que Segue o Rastro do Mouse */}
              <BackgroundLightTrail />

              {/* Sombreamento de vinheta equilibrado */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />
            </div>

            {/* Conteúdo da Aplicação em Camada Superior z-10 */}
            <div className="relative z-10 flex-1 flex flex-col w-full min-h-screen">
              {/* Header Superior (66px Height, 1078px max-width) */}
              <Header onReset={handleReset} />

      {/* Conteúdo Principal (Max-width 1078px contained per design.md) */}
      <main className="flex-1 max-w-[1078px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">

        {/* HERO SECTION — Carrossel de Configuração da Simulação */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center w-full">
          <AnimatePresence initial={false}>
            {isConfigVisible && (
              <motion.div
                key="simulator-carousel-wrapper"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                className="w-full overflow-hidden"
              >
                <SimulatorCarousel
                  inputs={inputs}
                  onChange={setInputs}
                  onReset={handleReset}
                  onSimulate={handleSimulate}
                  onStepChange={setCurrentStep}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Painel de Resultados Exibido Abaixo ao Clicar em SIMULAR */}
        {hasCalculated && (
          <div ref={resultsRef} className="space-y-8 animate-fadeIn max-w-3xl mx-auto scroll-mt-24">

            {/* Simulação de Aportes Extraordinários (Amortização Acelerada) - Colapsável no topo das configs de resultados */}
            <div className="editorial-card border border-white/20 bg-black rounded-none overflow-hidden transition-all duration-300">
              <button
                type="button"
                onClick={() => {
                  setIsExtraAmortizationOpen(!isExtraAmortizationOpen);
                  playTypeSound();
                }}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/[0.02] transition-colors gap-3"
              >
                <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 flex-1">
                  <Layers className="w-4.5 h-4.5 sm:w-6 sm:h-6 text-gold-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs min-[380px]:text-sm sm:text-base lg:text-lg font-bold uppercase tracking-wider text-gold-400 whitespace-nowrap truncate">
                      Simulador de Amortização Acelerada
                    </h3>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-400 font-light mt-0.5 truncate">
                      Acelere a quitação amortizando valores adicionais
                    </p>
                  </div>
                </div>
                {isExtraAmortizationOpen ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400 shrink-0" />
                )}
              </button>

              {isExtraAmortizationOpen && (
                <div className="p-6 border-t border-white/10 space-y-5 animate-fadeIn">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-left">
                    {/* Aporte Mensal Extra */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                        <label className="text-xs sm:text-sm font-medium uppercase tracking-wider text-neutral-300">
                          Aporte Mensal Extra
                        </label>
                        <div className="flex items-center bg-black border border-white/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-white">
                          <span className="text-white text-xs sm:text-sm font-medium mr-1.5">R$</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={maskedMonthly}
                            onChange={(e) => {
                              const valStr = e.target.value;
                              const digitsOnly = valStr.replace(/\D/g, '');
                              const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
                              setMaskedMonthly(formatCurrencyMask(numericVal));

                              const val = Math.max(0, numericVal);
                              const updated = { ...inputs, extraMonthlyAmortization: val };
                              setInputs(updated);
                              setCalculatedInputs(updated);
                            }}
                            onKeyDown={() => playTypeSound()}
                            onMouseEnter={() => setCursorVariant('input')}
                            onMouseLeave={() => setCursorVariant('default')}
                            className="w-24 sm:w-28 bg-transparent text-right font-mono text-white text-sm sm:text-base focus:outline-none"
                          />
                        </div>
                      </div>

                      <div
                        className="relative py-5 -my-2 cursor-pointer group"
                        onMouseEnter={() => setCursorVariant('native')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          step="100"
                          value={inputs.extraMonthlyAmortization || 0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            const updated = { ...inputs, extraMonthlyAmortization: val };
                            setInputs(updated);
                            setCalculatedInputs(updated);
                            vibrateShort();
                          }}
                          className="w-full cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm lg:text-base text-neutral-300 font-mono font-medium mt-1">
                        <span>R$ 0</span>
                        <span>R$ 10.000 / mês</span>
                      </div>
                    </div>

                    {/* Aporte Anual Extra */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                        <label className="text-xs sm:text-sm font-medium uppercase tracking-wider text-neutral-300">
                          Aporte Anual Extra
                        </label>
                        <div className="flex items-center bg-black border border-white/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-white">
                          <span className="text-white text-xs sm:text-sm font-medium mr-1.5">R$</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={maskedAnnual}
                            onChange={(e) => {
                              const valStr = e.target.value;
                              const digitsOnly = valStr.replace(/\D/g, '');
                              const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
                              setMaskedAnnual(formatCurrencyMask(numericVal));

                              const val = Math.max(0, numericVal);
                              const updated = { ...inputs, extraAnnualAmortization: val };
                              setInputs(updated);
                              setCalculatedInputs(updated);
                            }}
                            onKeyDown={() => playTypeSound()}
                            onMouseEnter={() => setCursorVariant('input')}
                            onMouseLeave={() => setCursorVariant('default')}
                            className="w-24 sm:w-28 bg-transparent text-right font-mono text-white text-sm sm:text-base focus:outline-none"
                          />
                        </div>
                      </div>

                      <div
                        className="relative py-5 -my-2 cursor-pointer group"
                        onMouseEnter={() => setCursorVariant('native')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <input
                          type="range"
                          min="0"
                          max="50000"
                          step="500"
                          value={inputs.extraAnnualAmortization || 0}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            const updated = { ...inputs, extraAnnualAmortization: val };
                            setInputs(updated);
                            setCalculatedInputs(updated);
                            vibrateShort();
                          }}
                          className="w-full cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm lg:text-base text-neutral-300 font-mono font-medium mt-1">
                        <span>R$ 0</span>
                        <span>R$ 50.000 / ano</span>
                      </div>
                    </div>
                  </div>

                  {/* Banner de Economia e Impacto */}
                  {((inputs.extraMonthlyAmortization || 0) > 0 || (inputs.extraAnnualAmortization || 0) > 0) && (
                    <div className="mt-4 p-4 sm:p-5 border border-gold-500/35 bg-neutral-900/50 text-sm sm:text-base text-neutral-200 animate-fadeIn space-y-2 leading-relaxed">
                      <div className="flex items-start sm:items-center space-x-2.5">
                        <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-1 sm:mt-0"></span>
                        <span>Tempo de quitação reduzido de <strong className="text-white font-semibold">{Math.ceil(baselineResult.installments.length / 12)} anos</strong> para <strong className="text-white font-semibold">{Math.ceil(result.installments.length / 12)} anos</strong> ({baselineResult.installments.length - result.installments.length} meses economizados).</span>
                      </div>
                      <div className="flex items-start sm:items-center space-x-2.5">
                        <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-1 sm:mt-0"></span>
                        <span>Economia estimada em juros pagos de <strong className="text-gold-400 font-bold">{formatBRL(baselineResult.totalInterest - result.totalInterest)}</strong> ao longo do contrato!</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Seletor de Abas da Análise (Controle Segmentado com Indicador Deslizante Líquido) */}
            <div className="relative flex items-center justify-between p-1 bg-black border border-white/20 rounded-[75px]">
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`relative z-10 flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-[75px] text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 select-none ${
                  activeTab === 'summary' ? 'text-black font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {activeTab === 'summary' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gold-gradient-btn shadow-gold-glow-sm rounded-[75px] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Resumo</span>
                  <span className="hidden sm:inline">Resumo &amp; KPIs</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('chart')}
                className={`relative z-10 flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-[75px] text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 select-none ${
                  activeTab === 'chart' ? 'text-black font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {activeTab === 'chart' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gold-gradient-btn shadow-gold-glow-sm rounded-[75px] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <LineChart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Gráfico</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`relative z-10 flex-1 py-2.5 sm:py-3 px-2 sm:px-4 rounded-[75px] text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 select-none ${
                  activeTab === 'table' ? 'text-black font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {activeTab === 'table' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gold-gradient-btn shadow-gold-glow-sm rounded-[75px] -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <Table className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Tabela</span>
                  <span className="hidden sm:inline">Tabela Mês a Mês</span>
                </span>
              </button>
            </div>

            {/* Conteúdo Exclusivo da Aba Selecionada (Fade & Micro-Elevação) */}
            <AnimatePresence mode="wait">
              {activeTab === 'summary' && (
                <motion.div
                  key="tab-summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ResultsSummary
                    result={result}
                    comparison={comparison}
                    onOpenComparison={() => setIsComparatorOpen(true)}
                  />
                </motion.div>
              )}

              {activeTab === 'chart' && (
                <motion.div
                  key="tab-chart"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AmortizationChart result={result} />
                </motion.div>
              )}

              {activeTab === 'table' && (
                <motion.div
                  key="tab-table"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <AmortizationTable result={result} />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

      </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modais Integrados */}
      <ComparatorModal
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        comparison={comparison}
      />

      <SpecsViewerModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

    </div>
  );
}

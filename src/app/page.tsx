'use client';

import React, { useState, useMemo, useRef } from 'react';
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
import { SettingsPopover } from '@/components/SettingsPopover';
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
  const [inputs, setInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [calculatedInputs, setCalculatedInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'chart' | 'table'>('summary');
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

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
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setInputs(DEFAULT_FINANCING_INPUTS);
    setCalculatedInputs(DEFAULT_FINANCING_INPUTS);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col relative overflow-hidden">

      {/* Atmospheric Iridescent Backdrop Wash (Sage Green -> Amber -> Oxblood) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] iridescent-hero-bg animate-heroDrift pointer-events-none -z-10 opacity-60" />

      {/* Header Superior (66px Height, 1078px max-width) */}
      <Header />

      {/* Conteúdo Principal (Max-width 1078px contained per design.md) */}
      <main className="flex-1 max-w-[1078px] w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16">

        {/* HERO SECTION — Monopo Saigon Editorial Atmosphere */}
        <div className="text-center max-w-3xl mx-auto space-y-8">

          {/* Masthead Editorial — Ouro Líquido Gravado (Fraunces + Interação de Cursor) */}
          <div className="space-y-2 flex justify-center">
            <HeroTitle />
          </div>

          {/* Carrossel de Categoria + Configuração da Simulação */}
          <div className="pt-6 pb-2">
            <SimulatorCarousel
              inputs={inputs}
              onChange={setInputs}
              onReset={handleReset}
              onSimulate={handleSimulate}
            />
          </div>

        </div>

        {/* Painel de Resultados Exibido Abaixo ao Clicar em SIMULAR */}
        {hasCalculated && (
          <div ref={resultsRef} className="space-y-8 pt-8 border-t border-white/15 animate-fadeIn max-w-3xl mx-auto scroll-mt-24">

            {/* Seletor de Abas da Análise (Controle Segmentado com Indicador Deslizante) */}
            <div className="relative flex items-center justify-between p-1 bg-black border border-white/20 rounded-[75px]">
              <div
                className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] bg-gold-gradient-btn shadow-gold-glow-sm rounded-[75px] transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
                style={{
                  transform: `translateX(${
                    activeTab === 'summary' ? 0 : activeTab === 'chart' ? 100 : 200
                  }%)`,
                }}
              />

              <button
                onClick={() => setActiveTab('summary')}
                className={`relative z-10 flex-1 py-2.5 px-2 sm:px-4 rounded-[75px] text-[11px] sm:text-xs font-normal uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 ${
                  activeTab === 'summary'
                    ? 'text-black font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Resumo</span>
                  <span className="hidden sm:inline">Resumo &amp; KPIs</span>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('chart')}
                className={`relative z-10 flex-1 py-2.5 px-2 sm:px-4 rounded-[75px] text-[11px] sm:text-xs font-normal uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 ${
                  activeTab === 'chart'
                    ? 'text-black font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <LineChart className="w-3.5 h-3.5 shrink-0" />
                <span>Gráfico</span>
              </button>

              <button
                onClick={() => setActiveTab('table')}
                className={`relative z-10 flex-1 py-2.5 px-2 sm:px-4 rounded-[75px] text-[11px] sm:text-xs font-normal uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 ${
                  activeTab === 'table'
                    ? 'text-black font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">Tabela</span>
                  <span className="hidden sm:inline">Tabela Mês a Mês</span>
                </span>
              </button>
            </div>

            {/* Conteúdo Exclusivo da Aba Selecionada */}
            {activeTab === 'summary' && (
              <div className="animate-fadeIn">
                <ResultsSummary
                  result={result}
                  comparison={comparison}
                  onOpenComparison={() => setIsComparatorOpen(true)}
                />
              </div>
            )}

            {activeTab === 'chart' && (
              <div className="animate-fadeIn">
                <AmortizationChart result={result} />
              </div>
            )}

            {activeTab === 'table' && (
              <div className="animate-fadeIn">
                <AmortizationTable result={result} />
              </div>
            )}

            {/* Simulação de Aportes Extraordinários (Amortização Acelerada) - Colapsável no final */}
            <div className="editorial-card border border-white/20 bg-black rounded-none overflow-hidden transition-all duration-300 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsExtraAmortizationOpen(!isExtraAmortizationOpen);
                  playTypeSound();
                }}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full p-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Layers className="w-4 h-4 text-gold-400" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gold-400">Simulador de Amortização Acelerada</h3>
                    <p className="text-[10px] text-neutral-400 font-light mt-0.5">Acelere a quitação amortizando valores adicionais</p>
                  </div>
                </div>
                {isExtraAmortizationOpen ? (
                  <ChevronUp className="w-4.5 h-4.5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-4.5 h-4.5 text-neutral-400" />
                )}
              </button>

              {isExtraAmortizationOpen && (
                <div className="p-6 border-t border-white/10 space-y-5 animate-fadeIn">
                  <p className="text-[11px] text-neutral-400 font-light mt-0">
                    Acelere a quitação do saldo devedor amortizando valores adicionais de forma recorrente (mensal) ou em parcelas sazonais (anual, ex: 13º salário ou FGTS).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-left">
                    {/* Aporte Mensal Extra */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                        <label className="text-xs font-normal uppercase tracking-wider text-neutral-300">
                          Aporte Mensal Extra
                        </label>
                        <div className="flex items-center bg-black border border-white/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-white">
                          <span className="text-white text-xs font-medium mr-1.5">R$</span>
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
                            className="w-24 bg-transparent text-right font-mono text-white text-sm focus:outline-none"
                          />
                        </div>
                      </div>
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
                        onMouseEnter={() => setCursorVariant('native')}
                        onMouseLeave={() => setCursorVariant('default')}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                        <span>R$ 0</span>
                        <span>R$ 10.000 / mês</span>
                      </div>
                    </div>

                    {/* Aporte Anual Extra */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                        <label className="text-xs font-normal uppercase tracking-wider text-neutral-300">
                          Aporte Anual Extra (ex: FGTS/13º)
                        </label>
                        <div className="flex items-center bg-black border border-white/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-white">
                          <span className="text-white text-xs font-medium mr-1.5">R$</span>
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
                            className="w-24 bg-transparent text-right font-mono text-white text-sm focus:outline-none"
                          />
                        </div>
                      </div>
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
                        onMouseEnter={() => setCursorVariant('native')}
                        onMouseLeave={() => setCursorVariant('default')}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
                        <span>R$ 0</span>
                        <span>R$ 50.000 / ano</span>
                      </div>
                    </div>
                  </div>

                  {/* Banner de Economia e Impacto */}
                  {((inputs.extraMonthlyAmortization || 0) > 0 || (inputs.extraAnnualAmortization || 0) > 0) && (
                    <div className="mt-3 p-3.5 border border-gold-500/30 bg-neutral-900/40 text-xs text-neutral-300 animate-fadeIn space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                        <span>Tempo de quitação reduzido de <strong>{Math.ceil(baselineResult.installments.length / 12)} anos</strong> para <strong>{Math.ceil(result.installments.length / 12)} anos</strong> ({baselineResult.installments.length - result.installments.length} meses economizados).</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                        <span>Economia estimada em juros pagos de <strong className="text-gold-400">{formatBRL(baselineResult.totalInterest - result.totalInterest)}</strong> ao longo do contrato!</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

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

      {/* Rodapé Editorial Monopo Saigon (11px Felt Gray Copy, Contained 1078px) */}
      <footer className="w-full border-t border-white/10 bg-black py-10 text-xs text-neutral-400 mt-20">
        <div className="max-w-[1078px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-light text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="font-normal text-white uppercase tracking-wider">Brasil Finance</span>
            <span>—</span>
            <span className="text-neutral-500">Liquid iridescence behind editorial silence</span>
          </div>

          <div className="flex items-center space-x-4 text-neutral-500 uppercase tracking-widest text-[10px]">
            <span>2026 © All rights reserved</span>
          </div>
        </div>
      </footer>

      {/* Floating Sensor Controls Popover */}
      <SettingsPopover />

    </div>
  );
}

'use client';

import React, { useState, useMemo, useRef } from 'react';
import { FinancingInputs } from '@/types/financing';
import {
  calculateFinancing,
  compareFinancing,
  DEFAULT_FINANCING_INPUTS,
} from '@/lib/financing-calculator';
import { Header } from '@/components/Header';
import { SimulatorCarousel } from '@/components/SimulatorCarousel';
import { ResultsSummary } from '@/components/ResultsSummary';
import { AmortizationChart } from '@/components/AmortizationChart';
import { AmortizationTable } from '@/components/AmortizationTable';
import { ComparatorModal } from '@/components/ComparatorModal';
import { HeroTitle } from '@/components/HeroTitle';
import {
  LineChart,
  Table,
  Layers,
} from 'lucide-react';

export default function Home() {
  const [inputs, setInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [calculatedInputs, setCalculatedInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'chart' | 'table'>('summary');
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Recálculo realizado apenas ao confirmar a simulação
  const result = useMemo(() => calculateFinancing(calculatedInputs), [calculatedInputs]);
  const comparison = useMemo(() => compareFinancing(calculatedInputs), [calculatedInputs]);

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
    <div className="min-h-screen bg-paper text-ink-950 selection:bg-accent-200 selection:text-accent-900 flex flex-col">

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
          <div ref={resultsRef} className="space-y-8 pt-8 border-t-2 border-ink-950 animate-fadeIn max-w-3xl mx-auto scroll-mt-24">

            {/* Seletor de Abas da Análise (Controle Segmentado com Indicador Deslizante) */}
            <div className="relative flex items-center justify-between p-1 bg-paper border-2 border-ink-950">
              <div
                className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] bg-accent transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
                style={{
                  transform: `translateX(${
                    activeTab === 'summary' ? 0 : activeTab === 'chart' ? 100 : 200
                  }%)`,
                }}
              />

              <button
                onClick={() => setActiveTab('summary')}
                className={`relative z-10 flex-1 py-2.5 px-2 sm:px-4 text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 ${
                  activeTab === 'summary'
                    ? 'text-paper'
                    : 'text-ink-600 hover:text-ink-950'
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
                className={`relative z-10 flex-1 py-2.5 px-2 sm:px-4 text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 ${
                  activeTab === 'chart'
                    ? 'text-paper'
                    : 'text-ink-600 hover:text-ink-950'
                }`}
              >
                <LineChart className="w-3.5 h-3.5 shrink-0" />
                <span>Gráfico</span>
              </button>

              <button
                onClick={() => setActiveTab('table')}
                className={`relative z-10 flex-1 py-2.5 px-2 sm:px-4 text-[11px] sm:text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 sm:space-x-2 transition-colors duration-300 ${
                  activeTab === 'table'
                    ? 'text-paper'
                    : 'text-ink-600 hover:text-ink-950'
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

          </div>
        )}

      </main>

      {/* Modais Integrados */}
      <ComparatorModal
        isOpen={isComparatorOpen}
        onClose={() => setIsComparatorOpen(false)}
        comparison={comparison}
      />

      {/* Rodapé Editorial Monopo Saigon (11px Felt Gray Copy, Contained 1078px) */}
      <footer className="w-full border-t-2 border-ink-950 bg-paper py-10 text-xs text-ink-600 mt-20">
        <div className="max-w-[1078px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-ink-950 uppercase tracking-wider">Brasil Finance</span>
            <span>—</span>
            <span className="text-ink-600">O juro não se esconde. Ele se mede, linha por linha.</span>
          </div>

          <div className="flex items-center space-x-4 text-ink-600 uppercase tracking-widest text-[10px]">
            <span>2026 © All rights reserved</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

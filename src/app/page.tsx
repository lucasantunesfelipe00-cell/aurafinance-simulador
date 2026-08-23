'use client';

import React, { useState, useMemo, useRef } from 'react';
import { FinancingInputs, CategoryType } from '@/types/financing';
import {
  calculateFinancing,
  compareFinancing,
  DEFAULT_FINANCING_INPUTS,
} from '@/lib/financing-calculator';
import { Header } from '@/components/Header';
import { FinancingForm } from '@/components/FinancingForm';
import { ResultsSummary } from '@/components/ResultsSummary';
import { AmortizationChart } from '@/components/AmortizationChart';
import { AmortizationTable } from '@/components/AmortizationTable';
import { ComparatorModal } from '@/components/ComparatorModal';
import { SpecsViewerModal } from '@/components/SpecsViewerModal';
import {
  Calculator,
  Home as HomeIcon,
  Car,
  User,
  LineChart,
  Table,
  Layers,
  ArrowDown,
} from 'lucide-react';

export default function Home() {
  const [inputs, setInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [calculatedInputs, setCalculatedInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'chart' | 'table'>('summary');
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  const simulatorRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Recálculo realizado apenas ao confirmar a simulação
  const result = useMemo(() => calculateFinancing(calculatedInputs), [calculatedInputs]);
  const comparison = useMemo(() => compareFinancing(calculatedInputs), [calculatedInputs]);

  // Função para abrir o formulário do simulador
  const handleOpenSimulator = (presetCategory?: CategoryType) => {
    setIsSimulatorActive(true);
    setHasCalculated(false);
    if (presetCategory) {
      if (presetCategory === 'property') {
        setInputs({ ...DEFAULT_FINANCING_INPUTS, category: 'property', propertyValue: 600000, downPayment: 120000, downPaymentPercent: 20, interestRateYearly: 10.5, termMonths: 360 });
      } else if (presetCategory === 'vehicle') {
        setInputs({ ...DEFAULT_FINANCING_INPUTS, category: 'vehicle', propertyValue: 120000, downPayment: 36000, downPaymentPercent: 30, interestRateYearly: 16.8, termMonths: 48, includeInsurances: false });
      } else if (presetCategory === 'personal') {
        setInputs({ ...DEFAULT_FINANCING_INPUTS, category: 'personal', propertyValue: 40000, downPayment: 0, downPaymentPercent: 0, interestRateYearly: 24.5, termMonths: 24, includeInsurances: false });
      }
    }

    setTimeout(() => {
      simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

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

          {/* Monumental Editorial Headline (Weight 300/400, Tight Leading) */}
          <div className="space-y-2">
            <span className="text-[11px] font-normal uppercase tracking-[0.3em] text-neutral-400 block">
              EDITORIAL CREDIT GALLERY
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tighter text-white leading-[0.88]">
              AURA <span className="font-extralight text-neutral-300">FINANCE</span>
            </h1>
          </div>

          {/* Seleção de Categoria com Imagens Realistas (0px Sharp Radius Cards) */}
          <div className="pt-6 pb-2">
            <label className="block text-[11px] font-normal uppercase tracking-widest text-neutral-400 mb-4 text-center">
              ESCOLHA A MODALIDADE DE SIMULAÇÃO
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left">

              {/* Card 1: Imóvel */}
              <div
                onClick={() => {
                  setInputs({ ...DEFAULT_FINANCING_INPUTS, category: 'property', propertyValue: 600000, downPayment: 120000, downPaymentPercent: 20, interestRateYearly: 10.5, termMonths: 360 });
                }}
                className={`group relative rounded-none overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                  inputs.category === 'property'
                    ? 'border-gold-500 bg-black shadow-gold-glow'
                    : 'border-white/20 hover:border-white/60 bg-black/60'
                }`}
              >
                <div className="h-40 w-full relative overflow-hidden bg-black">
                  <img
                    src="/images/property.jpg"
                    alt="Financiamento Imobiliário"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {inputs.category === 'property' && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-[75px] bg-gold-gradient-btn text-black text-[10px] font-medium uppercase tracking-widest shadow-none">
                      SELECIONADO
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black">
                  <div className="flex items-center space-x-2">
                    <HomeIcon className="w-4 h-4 text-white" />
                    <h3 className="text-xs font-normal uppercase tracking-wider text-white">Imóvel</h3>
                  </div>
                </div>
              </div>

              {/* Card 2: Veículo */}
              <div
                onClick={() => {
                  setInputs({ ...DEFAULT_FINANCING_INPUTS, category: 'vehicle', propertyValue: 120000, downPayment: 36000, downPaymentPercent: 30, interestRateYearly: 16.8, termMonths: 48, includeInsurances: false });
                }}
                className={`group relative rounded-none overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                  inputs.category === 'vehicle'
                    ? 'border-gold-500 bg-black shadow-gold-glow'
                    : 'border-white/20 hover:border-white/60 bg-black/60'
                }`}
              >
                <div className="h-40 w-full relative overflow-hidden bg-black">
                  <img
                    src="/images/vehicle.jpg"
                    alt="Financiamento Veicular"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {inputs.category === 'vehicle' && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-[75px] bg-gold-gradient-btn text-black text-[10px] font-medium uppercase tracking-widest shadow-none">
                      SELECIONADO
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-white" />
                    <h3 className="text-xs font-normal uppercase tracking-wider text-white">Veículo</h3>
                  </div>
                </div>
              </div>

              {/* Card 3: Pessoal */}
              <div
                onClick={() => {
                  setInputs({ ...DEFAULT_FINANCING_INPUTS, category: 'personal', propertyValue: 40000, downPayment: 0, downPaymentPercent: 0, interestRateYearly: 24.5, termMonths: 24, includeInsurances: false });
                }}
                className={`group relative rounded-none overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                  inputs.category === 'personal'
                    ? 'border-gold-500 bg-black shadow-gold-glow'
                    : 'border-white/20 hover:border-white/60 bg-black/60'
                }`}
              >
                <div className="h-40 w-full relative overflow-hidden bg-black">
                  <img
                    src="/images/personal.jpg"
                    alt="Crédito Pessoal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {inputs.category === 'personal' && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-[75px] bg-gold-gradient-btn text-black text-[10px] font-medium uppercase tracking-widest shadow-none">
                      SELECIONADO
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-white" />
                    <h3 className="text-xs font-normal uppercase tracking-wider text-white">Crédito Pessoal</h3>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Botão de Ação Principal (CTA - Ghost Pill 75px Radius) */}
          <div className="pt-4 flex items-center justify-center">
            <button
              onClick={() => handleOpenSimulator()}
              className="btn-gold-fill btn-lift btn-shine btn-shine-gold animate-ctaPulseGold py-4 px-10 rounded-[75px] text-xs font-normal uppercase tracking-widest flex items-center space-x-3 w-full sm:w-auto justify-center cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>INICIAR SIMULAÇÃO AGORA</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* SEÇÃO DO SIMULADOR */}
        <div ref={simulatorRef} className="pt-4 scroll-mt-24">

          {/* Painel do Simulador (Exibido quando ativo) */}
          {isSimulatorActive && (
            <div className="space-y-10 animate-fadeIn max-w-3xl mx-auto">

              {/* Formulário Fixo Centralizado no Meio da Tela */}
              <FinancingForm
                inputs={inputs}
                onChange={setInputs}
                onReset={handleReset}
                onSimulate={handleSimulate}
              />

              {/* Painel de Resultados Exibido Abaixo ao Clicar em SIMULAR */}
              {hasCalculated && (
                <div ref={resultsRef} className="space-y-8 pt-8 border-t border-white/15 animate-fadeIn">

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

                </div>
              )}

            </div>
          )}

        </div>

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
            <span className="font-normal text-white uppercase tracking-wider">Aura Finance</span>
            <span>—</span>
            <span className="text-neutral-500">Liquid iridescence behind editorial silence</span>
          </div>

          <div className="flex items-center space-x-4 text-neutral-500 uppercase tracking-widest text-[10px]">
            <span>Saigon Edition</span>
            <span>·</span>
            <span>2026 © All rights reserved</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

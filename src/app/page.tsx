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
  Sparkles,
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
    <div className="min-h-screen bg-[#07080A] text-gray-100 selection:bg-gold-500 selection:text-obsidian-950 flex flex-col relative overflow-hidden">

      {/* Luzes de Fundo Estilizadas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-obsidian-radial pointer-events-none -z-10 opacity-70" />
      <div className="absolute top-[300px] -left-[200px] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Superior */}
      <Header />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">

        {/* HERO SECTION — Limpa, Sofisticada e com CTA em Destaque */}
        <div className="text-center max-w-3xl mx-auto space-y-6">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Simulador de Crédito &amp;{' '}
            <span className="gold-text-gradient block">Amortização Aura Gold</span>
          </h1>

          {/* Seleção de Categoria com Imagens Realistas */}
          <div className="pt-4 pb-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gold-400 mb-3 text-center">
              Escolha a Modalidade de Simulação
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">

              {/* Card 1: Imóvel */}
              <div
                onClick={() => {
                  setInputs({ ...DEFAULT_FINANCING_INPUTS, category: 'property', propertyValue: 600000, downPayment: 120000, downPaymentPercent: 20, interestRateYearly: 10.5, termMonths: 360 });
                }}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${inputs.category === 'property'
                    ? 'border-gold-400 shadow-gold-glow ring-2 ring-gold-400/40 scale-[1.02]'
                    : 'border-gold-500/20 hover:border-gold-400/60 opacity-80 hover:opacity-100'
                  }`}
              >
                <div className="h-36 w-full relative overflow-hidden bg-obsidian-950">
                  <img
                    src="/images/property.jpg"
                    alt="Financiamento Imobiliário"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />

                  {inputs.category === 'property' && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gold-400 text-obsidian-950 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-md">
                      <Sparkles className="w-3 h-3 text-obsidian-950" />
                      <span>Selecionado</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-obsidian-900/90 backdrop-blur-md">
                  <div className="flex items-center space-x-2">
                    <HomeIcon className="w-4 h-4 text-gold-400" />
                    <h3 className="text-sm font-bold text-white">Imóvel</h3>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Casa, apartamento ou terreno</p>
                </div>
              </div>

              {/* Card 2: Veículo */}
              <div
                onClick={() => {
                  setInputs({ ...DEFAULT_FINANCING_INPUTS, category: 'vehicle', propertyValue: 120000, downPayment: 36000, downPaymentPercent: 30, interestRateYearly: 16.8, termMonths: 48, includeInsurances: false });
                }}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${inputs.category === 'vehicle'
                    ? 'border-gold-400 shadow-gold-glow ring-2 ring-gold-400/40 scale-[1.02]'
                    : 'border-gold-500/20 hover:border-gold-400/60 opacity-80 hover:opacity-100'
                  }`}
              >
                <div className="h-36 w-full relative overflow-hidden bg-obsidian-950">
                  <img
                    src="/images/vehicle.jpg"
                    alt="Financiamento Veicular"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />

                  {inputs.category === 'vehicle' && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gold-400 text-obsidian-950 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-md">
                      <Sparkles className="w-3 h-3 text-obsidian-950" />
                      <span>Selecionado</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-obsidian-900/90 backdrop-blur-md">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-gold-400" />
                    <h3 className="text-sm font-bold text-white">Veículo</h3>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Carro, moto ou utilitário</p>
                </div>
              </div>

              {/* Card 3: Pessoal */}
              <div
                onClick={() => {
                  setInputs({ ...DEFAULT_FINANCING_INPUTS, category: 'personal', propertyValue: 40000, downPayment: 0, downPaymentPercent: 0, interestRateYearly: 24.5, termMonths: 24, includeInsurances: false });
                }}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${inputs.category === 'personal'
                    ? 'border-gold-400 shadow-gold-glow ring-2 ring-gold-400/40 scale-[1.02]'
                    : 'border-gold-500/20 hover:border-gold-400/60 opacity-80 hover:opacity-100'
                  }`}
              >
                <div className="h-36 w-full relative overflow-hidden bg-obsidian-950">
                  <img
                    src="/images/personal.jpg"
                    alt="Crédito Pessoal"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />

                  {inputs.category === 'personal' && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gold-400 text-obsidian-950 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 shadow-md">
                      <Sparkles className="w-3 h-3 text-obsidian-950" />
                      <span>Selecionado</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-obsidian-900/90 backdrop-blur-md">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gold-400" />
                    <h3 className="text-sm font-bold text-white">Crédito Pessoal</h3>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Aperto de mão &amp; acordo</p>
                </div>
              </div>

            </div>
          </div>

          {/* Botão de Ação Principal (CTA) */}
          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={() => handleOpenSimulator()}
              className="btn-gold-metallic py-4 px-8 rounded-2xl text-sm sm:text-base font-black flex items-center space-x-3 w-full sm:w-auto justify-center shadow-gold-glow hover:scale-105 transition-transform"
            >
              <Calculator className="w-5 h-5 text-obsidian-950" />
              <span>INICIAR SIMULAÇÃO AGORA</span>
              <ArrowDown className="w-4 h-4 text-obsidian-950 animate-bounce" />
            </button>
          </div>

        </div>

        {/* SEÇÃO DO SIMULADOR (Abre ao Clicar no Botão ou ao Rolar) */}
        <div ref={simulatorRef} className="pt-4 scroll-mt-24">

          {/* Painel do Simulador (Exibido quando ativo) */}
          {isSimulatorActive && (
            <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">

              {/* Formulário Fixo Centralizado no Meio da Tela */}
              <FinancingForm
                inputs={inputs}
                onChange={setInputs}
                onReset={handleReset}
                onSimulate={handleSimulate}
              />

              {/* Painel de Resultados Exibido Abaixo ao Clicar em SIMULAR */}
              {hasCalculated && (
                <div ref={resultsRef} className="space-y-6 pt-4 border-t border-gold-500/20 animate-fadeIn">

                  {/* Seletor de Abas da Análise */}
                  <div className="flex items-center justify-between p-1.5 bg-obsidian-950 border border-gold-500/20 rounded-2xl">
                    <button
                      onClick={() => setActiveTab('summary')}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${activeTab === 'summary'
                          ? 'btn-gold-metallic shadow-gold-glow-sm'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>Resumo &amp; KPIs</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('chart')}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${activeTab === 'chart'
                          ? 'btn-gold-metallic shadow-gold-glow-sm'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      <LineChart className="w-4 h-4" />
                      <span>Gráfico</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('table')}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${activeTab === 'table'
                          ? 'btn-gold-metallic shadow-gold-glow-sm'
                          : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      <Table className="w-4 h-4" />
                      <span>Tabela Mês a Mês</span>
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

      {/* Rodapé Luxuoso */}
      <footer className="w-full border-t border-gold-500/20 bg-obsidian-950 py-8 text-center text-xs text-gray-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gold-400"></div>
            <span className="font-semibold text-white">AuraFinance</span>
            <span>— Design System Obsidian &amp; Dark Gold</span>
          </div>

          <div className="flex items-center space-x-4 text-gray-400 text-[11px]">
          </div>
        </div>
      </footer>

    </div>
  );
}

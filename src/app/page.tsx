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
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'chart' | 'table'>('summary');
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  const simulatorRef = useRef<HTMLDivElement>(null);

  // Recálculo reativo em tempo real
  const result = useMemo(() => calculateFinancing(inputs), [inputs]);
  const comparison = useMemo(() => compareFinancing(inputs), [inputs]);

  // Função para abrir o simulador e Rolar suavemente até ele
  const handleOpenSimulator = (presetCategory?: CategoryType) => {
    setIsSimulatorActive(true);
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

  const handleReset = () => {
    setInputs(DEFAULT_FINANCING_INPUTS);
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-gray-100 selection:bg-gold-500 selection:text-obsidian-950 flex flex-col relative overflow-hidden">
      
      {/* Luzes de Fundo Estilizadas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-obsidian-radial pointer-events-none -z-10 opacity-70" />
      <div className="absolute top-[300px] -left-[200px] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Superior */}
      <Header onOpenSpecs={() => setIsSpecsOpen(true)} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* HERO SECTION — Limpa, Sofisticada e com CTA em Destaque */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold shadow-gold-glow-sm">
            <Sparkles className="w-4 h-4 animate-pulse text-gold-400" />
            <span>Inteligência Financeira &amp; Amortização Elite</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Simulador de Crédito &amp;{' '}
            <span className="gold-text-gradient block">Amortização Aura Gold</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Calcule o custo exato do seu financiamento imobiliário ou veicular. Compare as tabelas{' '}
            <strong className="text-gold-300 font-semibold">SAC</strong> e{' '}
            <strong className="text-gold-300 font-semibold">PRICE</strong> e economize milhares de reais em juros.
          </p>

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
          
          {/* Banner de Estado quando Inativo */}
          {!isSimulatorActive && (
            <div className="p-8 rounded-3xl glass-card border border-gold-500/30 text-center max-w-xl mx-auto space-y-4 shadow-gold-glow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-400 text-gold-300 flex items-center justify-center mx-auto">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Simulador Pronto para Calcular</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Clique no botão acima ou no atalho rápido para carregar o painel interativo de simulação.
                </p>
              </div>
              <button
                onClick={() => handleOpenSimulator()}
                className="btn-gold-metallic py-2.5 px-6 rounded-xl text-xs font-bold"
              >
                Abrir Painel do Simulador
              </button>
            </div>
          )}

          {/* Painel Completo do Simulador (Exibido quando ativo) */}
          {isSimulatorActive && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Coluna Esquerda: Formulário de Parâmetros (5 Colunas) */}
                <div className="lg:col-span-5">
                  <FinancingForm
                    inputs={inputs}
                    onChange={setInputs}
                    onReset={handleReset}
                  />
                </div>

                {/* Coluna Direita: Resultados Organizadores em Abas (7 Colunas) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Seletor de Abas da Análise */}
                  <div className="flex items-center justify-between p-1.5 bg-obsidian-950 border border-gold-500/20 rounded-2xl">
                    <button
                      onClick={() => setActiveTab('summary')}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        activeTab === 'summary'
                          ? 'btn-gold-metallic shadow-gold-glow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>Resumo &amp; KPIs</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('chart')}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        activeTab === 'chart'
                          ? 'btn-gold-metallic shadow-gold-glow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <LineChart className="w-4 h-4" />
                      <span>Gráfico</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('table')}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        activeTab === 'table'
                          ? 'btn-gold-metallic shadow-gold-glow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Table className="w-4 h-4" />
                      <span>Tabela Mês a Mês</span>
                    </button>
                  </div>

                  {/* Conteúdo da Aba Selecionada */}
                  {activeTab === 'summary' && (
                    <div className="space-y-6 animate-fadeIn">
                      <ResultsSummary
                        result={result}
                        comparison={comparison}
                        onOpenComparison={() => setIsComparatorOpen(true)}
                      />
                      <AmortizationChart result={result} />
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

              </div>

              {/* Tabela de Amortização Mês a Mês no Rodapé */}
              {activeTab === 'summary' && (
                <div className="pt-4 animate-fadeIn">
                  <AmortizationTable result={result} />
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
            <span>Algoritmo SAC &amp; PRICE Válido</span>
            <span>•</span>
            <button onClick={() => setIsSpecsOpen(true)} className="hover:text-gold-400 underline">
              Ver Arquivos PRD / SPEC / Design System
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

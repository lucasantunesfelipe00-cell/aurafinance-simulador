'use client';

import React, { useState, useMemo } from 'react';
import { FinancingInputs } from '@/types/financing';
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
import { ShieldCheck, Sparkles, SlidersHorizontal, Calculator } from 'lucide-react';

export default function Home() {
  const [inputs, setInputs] = useState<FinancingInputs>(DEFAULT_FINANCING_INPUTS);
  const [isComparatorOpen, setIsComparatorOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  // Recálculo reativo em tempo real via useMemo
  const result = useMemo(() => calculateFinancing(inputs), [inputs]);
  const comparison = useMemo(() => compareFinancing(inputs), [inputs]);

  const handleReset = () => {
    setInputs(DEFAULT_FINANCING_INPUTS);
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-gray-100 selection:bg-gold-500 selection:text-obsidian-950 flex flex-col relative overflow-hidden">
      
      {/* Luzes de Fundo Estilizadas */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-obsidian-radial pointer-events-none -z-10 opacity-70" />
      <div className="absolute top-[300px] -left-[200px] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] -right-[200px] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Superior */}
      <Header onOpenSpecs={() => setIsSpecsOpen(true)} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Simulações Financeiras com Alta Precisão Matemática</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Simulador de Financiamentos{' '}
            <span className="gold-text-gradient block sm:inline">Aura Gold</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-400 font-normal leading-relaxed">
            Calcule parcelas mensais, evolução do saldo devedor e juros acumulados nos sistemas{' '}
            <strong className="text-gold-300 font-semibold">SAC</strong> e{' '}
            <strong className="text-gold-300 font-semibold">PRICE</strong> com design inteligente e transparência absoluta.
          </p>
        </div>

        {/* Layout Principal: Formulário + Sumário de KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Painel do Formulário de Entradas (5 Colunas em telas grandes) */}
          <div className="lg:col-span-5">
            <FinancingForm
              inputs={inputs}
              onChange={setInputs}
              onReset={handleReset}
            />
          </div>

          {/* Painel de Resultados & Gráfico (7 Colunas em telas grandes) */}
          <div className="lg:col-span-7 space-y-8">
            <ResultsSummary
              result={result}
              comparison={comparison}
              onOpenComparison={() => setIsComparatorOpen(true)}
            />

            <AmortizationChart result={result} />
          </div>

        </div>

        {/* Seção da Tabela Mês a Mês */}
        <div className="pt-4">
          <AmortizationTable result={result} />
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
            <span>— Design System Obsidian & Dark Gold</span>
          </div>

          <div className="flex items-center space-x-4 text-gray-400 text-[11px]">
            <span>Algoritmo SAC & PRICE Válido</span>
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

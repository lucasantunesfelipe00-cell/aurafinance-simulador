'use client';

import React from 'react';
import { FinancingResult, ComparisonResult } from '@/types/financing';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { DollarSign, Percent, TrendingDown, Layers, ArrowRightLeft, Award } from 'lucide-react';

interface ResultsSummaryProps {
  result: FinancingResult;
  comparison: ComparisonResult;
  onOpenComparison: () => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  result,
  comparison,
  onOpenComparison,
}) => {
  const isSAC = result.method === 'SAC';
  const interestVsLoanPercent = (result.totalInterest / (result.loanAmount || 1)) * 100;

  return (
    <div className="space-y-6">
      
      {/* Grade de Cards Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Primeira Parcela */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-gold-500/20 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">1ª Parcela (Inicial)</span>
            <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-1 font-mono">
            {formatBRL(result.firstInstallment)}
          </div>
          <div className="text-[11px] text-gray-400 flex items-center space-x-1">
            <span className="font-semibold text-gold-300">{result.method}</span>
            <span>• Inclui amortização e taxas</span>
          </div>
        </div>

        {/* Card 2: Última Parcela */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-gold-500/20 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Última Parcela ({result.termMonths}º Mês)</span>
            <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-1 font-mono">
            {formatBRL(result.lastInstallment)}
          </div>
          <div className="text-[11px] text-gray-400 flex items-center space-x-1">
            {isSAC ? (
              <span className="text-emerald-400 font-semibold">↓ Redução de {formatBRL(result.firstInstallment - result.lastInstallment)}</span>
            ) : (
              <span className="text-gray-400">Fixa durante o contrato</span>
            )}
          </div>
        </div>

        {/* Card 3: Total de Juros */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-gold-500/20 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total de Juros</span>
            <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black gold-text-gradient tracking-tight mb-1 font-mono">
            {formatBRL(result.totalInterest)}
          </div>
          <div className="text-[11px] text-gold-300 font-semibold">
            {formatPercent(interestVsLoanPercent, 1)} do valor financiado
          </div>
        </div>

        {/* Card 4: Total Geral Desembolsado */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-obsidian-950 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200">Total Geral Pago</span>
            <div className="p-2 rounded-lg bg-gold-500/20 text-gold-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight mb-1 font-mono">
            {formatBRL(result.totalPaid)}
          </div>
          <div className="text-[11px] text-gray-300">
            Entrada {formatBRL(result.downPayment)} + Financiamento
          </div>
        </div>

      </div>

      {/* Banner de Inteligência de Comparação SAC vs PRICE */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-obsidian-850 via-obsidian-900 to-obsidian-850 border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-gold-glow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gold-500/20 border border-gold-400 text-gold-300 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Inteligência de Amortização:</span>
              <span className="text-gold-400 font-mono">SAC vs PRICE</span>
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              Ao escolher o sistema <strong className="text-white">SAC</strong>, você economiza aproximadamente{' '}
              <strong className="text-gold-300 font-mono">{formatBRL(comparison.interestSavingsSAC)}</strong> em juros em relação à Tabela PRICE.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenComparison}
          className="btn-gold-metallic py-2.5 px-5 rounded-xl text-xs flex items-center space-x-2 shrink-0"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Comparar Lado a Lado</span>
        </button>
      </div>

    </div>
  );
};

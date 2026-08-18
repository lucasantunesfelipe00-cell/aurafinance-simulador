'use client';

import React from 'react';
import { FinancingResult, ComparisonResult } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
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
    <div className="space-y-4 sm:space-y-6">
      
      {/* Grade 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Primeira Parcela */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 border border-gold-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">1ª Parcela (Inicial)</span>
            <div className="p-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          
          <div className="my-1">
            <FormattedBRL
              value={result.firstInstallment}
              className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight"
            />
          </div>

          <div className="text-[10px] text-gray-400 flex items-center space-x-1 mt-1">
            <span className="font-semibold text-gold-300">{result.method}</span>
            <span>• Com amortização</span>
          </div>
        </div>

        {/* Card 2: Última Parcela */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 border border-gold-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Última Parcela ({result.termMonths}º Mês)</span>
            <div className="p-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.lastInstallment}
              className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight"
            />
          </div>

          <div className="text-[10px] text-gray-400 flex items-center space-x-1 mt-1">
            {isSAC ? (
              <span className="text-emerald-400 font-semibold flex items-center">
                ↓ Redução de <FormattedBRL value={result.firstInstallment - result.lastInstallment} className="ml-1 text-[10px]" />
              </span>
            ) : (
              <span className="text-gray-400">Fixa durante o contrato</span>
            )}
          </div>
        </div>

        {/* Card 3: Total de Juros */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 border border-gold-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total de Juros</span>
            <div className="p-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.totalInterest}
              className="text-lg sm:text-xl md:text-2xl font-black gold-text-gradient tracking-tight"
            />
          </div>

          <div className="text-[10px] text-gold-300 font-semibold mt-1">
            {formatPercent(interestVsLoanPercent, 1)} do financiado
          </div>
        </div>

        {/* Card 4: Total Geral Pago */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 border border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-obsidian-950 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">Total Geral Pago</span>
            <div className="p-1.5 rounded-lg bg-gold-500/20 text-gold-300">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.totalPaid}
              className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight"
            />
          </div>

          <div className="text-[10px] text-gray-300 mt-1 truncate">
            Entrada + {result.termMonths} parcelas
          </div>
        </div>

      </div>

      {/* Banner de Inteligência SAC vs PRICE */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-obsidian-850 via-obsidian-900 to-obsidian-850 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-gold-glow-sm">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-gold-500/20 border border-gold-400 text-gold-300 shrink-0 hidden sm:block">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center justify-center sm:justify-start space-x-1.5">
              <span>Inteligência de Amortização:</span>
              <span className="text-gold-400 font-mono">SAC vs PRICE</span>
            </h3>
            <p className="text-[11px] text-gray-300 mt-0.5">
              Optar pelo <strong className="text-white">SAC</strong> gera uma economia estimada em juros de{' '}
              <FormattedBRL value={comparison.interestSavingsSAC} className="text-gold-300 font-bold" /> em relação ao PRICE.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenComparison}
          className="btn-gold-metallic py-2 px-4 rounded-xl text-xs flex items-center space-x-1.5 shrink-0 w-full sm:w-auto justify-center"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Comparar Lado a Lado</span>
        </button>
      </div>

    </div>
  );
};

'use client';

import React from 'react';
import { FinancingResult, ComparisonResult } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { DollarSign, Percent, TrendingDown, Layers, ArrowRightLeft } from 'lucide-react';

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
              className="text-base sm:text-lg font-bold text-white tracking-tight"
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
              className="text-base sm:text-lg font-bold text-white tracking-tight"
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
              className="text-base sm:text-lg font-bold gold-text-gradient tracking-tight"
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
              className="text-base sm:text-lg font-bold text-white tracking-tight"
            />
          </div>

          <div className="text-[10px] text-gray-300 mt-1 truncate">
            Entrada + {result.termMonths} parcelas
          </div>
        </div>

      </div>

      {/* Botão Comparar Lado a Lado */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onOpenComparison}
          className="btn-gold-metallic py-2.5 px-6 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-gold-glow hover:scale-[1.02] transition-transform"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Comparar Lado a Lado</span>
        </button>
      </div>

    </div>
  );
};

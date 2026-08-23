'use client';

import React from 'react';
import { FinancingResult, ComparisonResult } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
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
    <div className="space-y-6">

      {/* Grade 4 KPI Cards (Editorial Sharp 0px Corners) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Primeira Parcela */}
        <MouseGlow size={220} className="editorial-card card-lift p-5 border border-white/20 bg-black rounded-none flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-normal uppercase tracking-widest text-neutral-400">1ª Parcela (Inicial)</span>
            <DollarSign className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.firstInstallment}
              className="text-lg sm:text-xl font-normal text-white tracking-tight"
              animate
            />
          </div>

          <div className="text-[10px] text-neutral-400 font-light flex items-center space-x-1 mt-2">
            <span className="font-normal text-white uppercase tracking-wider">{result.method}</span>
            <span>• Com amortização</span>
          </div>
        </MouseGlow>

        {/* Card 2: Última Parcela */}
        <MouseGlow size={220} className="editorial-card card-lift p-5 border border-white/20 bg-black rounded-none flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-normal uppercase tracking-widest text-neutral-400">Última Parcela ({result.termMonths}º Mês)</span>
            <TrendingDown className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.lastInstallment}
              className="text-lg sm:text-xl font-normal text-white tracking-tight"
              animate
            />
          </div>

          <div className="text-[10px] text-neutral-400 font-light flex items-center space-x-1 mt-2">
            {isSAC ? (
              <span className="text-white font-normal flex items-center">
                ↓ Redução de <FormattedBRL value={result.firstInstallment - result.lastInstallment} className="ml-1 text-[10px]" animate />
              </span>
            ) : (
              <span className="text-neutral-400">Fixa durante o contrato</span>
            )}
          </div>
        </MouseGlow>

        {/* Card 3: Total de Juros */}
        <MouseGlow size={220} className="editorial-card card-lift p-5 border border-white/20 bg-black rounded-none flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-normal uppercase tracking-widest text-neutral-400">Total de Juros</span>
            <Percent className="w-3.5 h-3.5 text-white" />
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.totalInterest}
              className="text-lg sm:text-xl font-normal text-white tracking-tight"
              animate
            />
          </div>

          <div className="text-[10px] text-neutral-300 font-light mt-2">
            {formatPercent(interestVsLoanPercent, 1)} do valor financiado
          </div>
        </MouseGlow>

        {/* Card 4: Total Geral Pago */}
        <MouseGlow size={220} className="editorial-card card-lift p-5 border border-gold-500/50 bg-neutral-900 rounded-none flex flex-col justify-between shadow-gold-glow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-normal uppercase tracking-widest text-white">Total Geral Pago</span>
            <Layers className="w-3.5 h-3.5 text-gold-500" />
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.totalPaid}
              className="text-lg sm:text-xl font-normal text-white tracking-tight"
              animate
            />
          </div>

          <div className="text-[10px] text-neutral-400 font-light mt-2 truncate">
            Entrada + {result.termMonths} parcelas
          </div>
        </MouseGlow>

      </div>

      {/* Botão Comparar Lado a Lado (Ghost Pill 75px Full Radius) */}
      <div className="flex justify-center pt-3">
        <button
          onClick={onOpenComparison}
          className="btn-ghost-pill-dark btn-lift flex items-center space-x-2.5 uppercase tracking-widest text-xs font-normal"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Comparar Lado a Lado</span>
        </button>
      </div>

    </div>
  );
};

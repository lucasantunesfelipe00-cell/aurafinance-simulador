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
        <MouseGlow className="editorial-card-light card-lift p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">1ª Parcela (Inicial)</span>
            <DollarSign className="w-3.5 h-3.5 text-ink-950" />
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.firstInstallment}
              className="text-lg sm:text-xl font-bold text-ink-950 tracking-tight"
              animate
            />
          </div>

          <div className="text-[10px] text-ink-600 flex items-center space-x-1 mt-2">
            <span className="font-semibold text-ink-950 uppercase tracking-wider">{result.method}</span>
            <span>• Com amortização</span>
          </div>
        </MouseGlow>

        {/* Card 2: Última Parcela */}
        <MouseGlow className="editorial-card-light card-lift p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">Última Parcela ({result.termMonths}º Mês)</span>
            <TrendingDown className="w-3.5 h-3.5 text-ink-950" />
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.lastInstallment}
              className="text-lg sm:text-xl font-bold text-ink-950 tracking-tight"
              animate
            />
          </div>

          <div className="text-[10px] text-ink-600 flex items-center space-x-1 mt-2">
            {isSAC ? (
              <span className="text-ink-950 font-semibold flex items-center">
                ↓ Redução de <FormattedBRL value={result.firstInstallment - result.lastInstallment} className="ml-1 text-[10px]" animate />
              </span>
            ) : (
              <span className="text-ink-600">Fixa durante o contrato</span>
            )}
          </div>
        </MouseGlow>

        {/* Card 3: Total de Juros */}
        <MouseGlow className="editorial-card-light card-lift p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">Total de Juros</span>
            <Percent className="w-3.5 h-3.5 text-ink-950" />
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.totalInterest}
              className="text-lg sm:text-xl font-bold text-ink-950 tracking-tight"
              animate
            />
          </div>

          <div className="text-[10px] text-ink-700 mt-2">
            {formatPercent(interestVsLoanPercent, 1)} do valor financiado
          </div>
        </MouseGlow>

        {/* Card 4: Total Geral Pago (destaque em vermelho) */}
        <MouseGlow className="card-lift p-5 border-2 border-accent bg-accent-100 rounded-none flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-800">Total Geral Pago</span>
            <Layers className="w-3.5 h-3.5 text-accent" />
          </div>

          <div className="my-1">
            <FormattedBRL
              value={result.totalPaid}
              className="text-lg sm:text-xl font-bold text-ink-950 tracking-tight"
              animate
            />
          </div>

          <div className="text-[10px] text-accent-800 mt-2 truncate">
            Entrada + {result.termMonths} parcelas
          </div>
        </MouseGlow>

      </div>

      {/* Botão Comparar Lado a Lado */}
      <div className="flex justify-center pt-3">
        <button
          onClick={onOpenComparison}
          className="btn-ghost-pill-light btn-lift flex items-center space-x-2.5 uppercase tracking-widest text-xs font-semibold"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Comparar Lado a Lado</span>
        </button>
      </div>

    </div>
  );
};

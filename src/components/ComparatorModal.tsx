'use client';

import React from 'react';
import { ComparisonResult } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { X, CheckCircle2 } from 'lucide-react';

interface ComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparison: ComparisonResult;
}

export const ComparatorModal: React.FC<ComparatorModalProps> = ({
  isOpen,
  onClose,
  comparison,
}) => {
  if (!isOpen) return null;

  const { sac, price, interestSavingsSAC, percentageSavings } = comparison;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-950/80 animate-fadeIn">

      {/* Modal Container (Editorial Sharp 0px Corners) */}
      <div className="editorial-card-light animate-scaleIn w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none p-6 sm:p-8 relative">

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="btn-lift absolute top-5 right-5 p-2 rounded-none text-ink-600 hover:text-ink-950 border border-ink-950/20 hover:border-ink-950 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Título do Modal */}
        <div className="mb-6 pr-10">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-600 mb-1">
            Matriz de Decisão Financeira
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink-950 uppercase tracking-tight">Comparativo SAC vs PRICE</h2>
          <p className="text-[11px] sm:text-xs text-ink-600 mt-0.5">Análise de custos e economia entre os dois sistemas de amortização</p>
        </div>

        {/* Banner de Economia */}
        <div className="mb-6 p-4 border-2 border-accent bg-accent-100 rounded-none flex items-center space-x-4">
          <div className="p-2.5 bg-accent text-white font-semibold text-sm sm:text-base shrink-0 rounded-none px-4 font-mono">
            {formatPercent(percentageSavings, 1)}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-ink-950 uppercase tracking-wider">Economia com Sistema SAC</h4>
            <p className="text-[11px] text-accent-800 mt-0.5">
              Economia estimada de <FormattedBRL value={interestSavingsSAC} className="text-ink-950 font-semibold text-xs sm:text-sm" animate /> ao longo do contrato.
            </p>
          </div>
        </div>

        {/* Grade Lado a Lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

          {/* Card SAC */}
          <MouseGlow className="p-5 border-2 border-accent bg-accent-100 rounded-none flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-none bg-accent text-white text-[10px] uppercase font-semibold tracking-wider">
                  MAIOR ECONOMIA DE JUROS
                </span>
                <CheckCircle2 className="w-4 h-4 text-accent" />
              </div>

              <h3 className="text-base font-bold text-ink-950 uppercase tracking-wider mb-4">SAC (Amortização Constante)</h3>

              <div className="space-y-3 text-xs border-t-2 border-accent/20 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-ink-600 text-[11px] uppercase tracking-wider">Primeira Parcela:</span>
                  <FormattedBRL value={sac.firstInstallment} className="font-semibold text-ink-950" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-600 text-[11px] uppercase tracking-wider">Última Parcela:</span>
                  <FormattedBRL value={sac.lastInstallment} className="font-semibold text-ink-950" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-600 text-[11px] uppercase tracking-wider">Total de Juros:</span>
                  <FormattedBRL value={sac.totalInterest} className="font-semibold text-ink-950" />
                </div>
                <div className="flex justify-between items-center border-t-2 border-accent/20 pt-3 font-semibold">
                  <span className="text-ink-950 text-[11px] uppercase tracking-wider">Total Geral Pago:</span>
                  <FormattedBRL value={sac.totalPaid} className="text-ink-950 text-sm" animate />
                </div>
              </div>
            </div>
          </MouseGlow>

          {/* Card PRICE */}
          <MouseGlow className="p-5 border border-ink-950/20 bg-white rounded-none flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-none bg-surface text-ink-700 text-[10px] uppercase font-semibold tracking-wider border border-ink-950/10">
                  PARCELA INICIAL MENOR
                </span>
              </div>

              <h3 className="text-base font-bold text-ink-950 uppercase tracking-wider mb-4">PRICE (Prestação Fixa)</h3>

              <div className="space-y-3 text-xs border-t-2 border-ink-950/10 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-ink-600 text-[11px] uppercase tracking-wider">Primeira Parcela:</span>
                  <FormattedBRL value={price.firstInstallment} className="font-semibold text-ink-950" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-600 text-[11px] uppercase tracking-wider">Última Parcela:</span>
                  <FormattedBRL value={price.lastInstallment} className="font-semibold text-ink-950" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-600 text-[11px] uppercase tracking-wider">Total de Juros:</span>
                  <FormattedBRL value={price.totalInterest} className="font-semibold text-ink-700" />
                </div>
                <div className="flex justify-between items-center border-t-2 border-ink-950/10 pt-3 font-semibold">
                  <span className="text-ink-950 text-[11px] uppercase tracking-wider">Total Geral Pago:</span>
                  <FormattedBRL value={price.totalPaid} className="text-ink-950 text-sm" animate />
                </div>
              </div>
            </div>
          </MouseGlow>

        </div>

        {/* Footer do Modal */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="btn-ghost-pill-light btn-lift text-xs uppercase tracking-widest"
          >
            Fechar Comparativo
          </button>
        </div>

      </div>
    </div>
  );
};

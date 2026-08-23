'use client';

import React from 'react';
import { ComparisonResult } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container (Editorial Sharp 0px Corners) */}
      <div className="editorial-card animate-scaleIn w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none border border-white/20 bg-black p-6 sm:p-8 relative">

        {/* Botão Fechar (Full Pill 75px) */}
        <button
          onClick={onClose}
          className="btn-lift absolute top-5 right-5 p-2 rounded-[75px] text-neutral-400 hover:text-white border border-white/20 hover:border-white transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Título do Modal */}
        <div className="mb-6 pr-10">
          <div className="text-[10px] font-normal uppercase tracking-widest text-neutral-400 mb-1">
            Matriz de Decisão Financeira
          </div>
          <h2 className="text-xl sm:text-2xl font-normal text-white uppercase tracking-tight">Comparativo SAC vs PRICE</h2>
          <p className="text-[11px] sm:text-xs text-neutral-400 font-light mt-0.5">Análise de custos e economia entre os dois sistemas de amortização</p>
        </div>

        {/* Banner de Economia */}
        <div className="mb-6 p-4 border border-gold-500/30 bg-neutral-900 rounded-none flex items-center space-x-4">
          <div className="p-2.5 bg-gold-gradient-btn text-black font-medium text-sm sm:text-base shrink-0 rounded-[75px] px-4 font-mono">
            {formatPercent(percentageSavings, 1)}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-normal text-white uppercase tracking-wider">Economia com Sistema SAC</h4>
            <p className="text-[11px] text-neutral-400 font-light mt-0.5">
              Economia estimada de <FormattedBRL value={interestSavingsSAC} className="text-white font-normal text-xs sm:text-sm" animate /> ao longo do contrato.
            </p>
          </div>
        </div>

        {/* Grade Lado a Lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          
          {/* Card SAC */}
          <div className="p-5 border border-gold-500/50 bg-black rounded-none flex flex-col justify-between shadow-winner-glow-gold">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-[75px] bg-gold-gradient-btn text-black text-[10px] uppercase font-medium tracking-wider">
                  MAIOR ECONOMIA DE JUROS
                </span>
                <CheckCircle2 className="w-4 h-4 text-gold-500" />
              </div>

              <h3 className="text-base font-normal text-white uppercase tracking-wider mb-4">SAC (Amortização Constante)</h3>

              <div className="space-y-3 text-xs border-t border-white/15 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-[11px] uppercase tracking-wider">Primeira Parcela:</span>
                  <FormattedBRL value={sac.firstInstallment} className="font-normal text-white" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-[11px] uppercase tracking-wider">Última Parcela:</span>
                  <FormattedBRL value={sac.lastInstallment} className="font-normal text-white" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-[11px] uppercase tracking-wider">Total de Juros:</span>
                  <FormattedBRL value={sac.totalInterest} className="font-normal text-white" />
                </div>
                <div className="flex justify-between items-center border-t border-white/15 pt-3 font-normal">
                  <span className="text-white text-[11px] uppercase tracking-wider">Total Geral Pago:</span>
                  <FormattedBRL value={sac.totalPaid} className="text-white text-sm" animate />
                </div>
              </div>
            </div>
          </div>

          {/* Card PRICE */}
          <div className="p-5 border border-white/15 bg-black rounded-none flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-[75px] bg-neutral-800 text-neutral-300 text-[10px] uppercase font-normal tracking-wider border border-white/10">
                  PARCELA INICIAL MENOR
                </span>
              </div>

              <h3 className="text-base font-normal text-white uppercase tracking-wider mb-4">PRICE (Prestação Fixa)</h3>

              <div className="space-y-3 text-xs border-t border-white/15 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-[11px] uppercase tracking-wider">Primeira Parcela:</span>
                  <FormattedBRL value={price.firstInstallment} className="font-normal text-white" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-[11px] uppercase tracking-wider">Última Parcela:</span>
                  <FormattedBRL value={price.lastInstallment} className="font-normal text-white" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 text-[11px] uppercase tracking-wider">Total de Juros:</span>
                  <FormattedBRL value={price.totalInterest} className="font-normal text-neutral-300" />
                </div>
                <div className="flex justify-between items-center border-t border-white/15 pt-3 font-normal">
                  <span className="text-white text-[11px] uppercase tracking-wider">Total Geral Pago:</span>
                  <FormattedBRL value={price.totalPaid} className="text-white text-sm" animate />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="btn-ghost-pill-dark btn-lift text-xs uppercase tracking-widest"
          >
            Fechar Comparativo
          </button>
        </div>

      </div>
    </div>
  );
};

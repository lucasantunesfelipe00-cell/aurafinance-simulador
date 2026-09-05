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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-tight">Comparativo SAC vs PRICE</h2>
        </div>

        {/* Banner de Economia */}
        <div className="mb-6 p-4 border border-gold-500/30 bg-neutral-900 rounded-none flex items-center space-x-4">
          <div className="p-2.5 bg-gold-gradient-btn text-black font-medium text-sm sm:text-base shrink-0 rounded-[75px] px-4 font-mono">
            {formatPercent(percentageSavings, 1)}
          </div>
          <div>
            <p className="text-sm sm:text-base lg:text-lg text-neutral-300 font-light">
              Economia estimada de <FormattedBRL value={interestSavingsSAC} className="text-emerald-400 font-semibold text-base sm:text-xl lg:text-2xl" animate /> ao longo do contrato.
            </p>
          </div>
        </div>

        {/* Grade Lado a Lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          
          {/* Card SAC */}
          <MouseGlow size={140} className="p-5 sm:p-6 border border-gold-500/50 bg-black rounded-none flex flex-col justify-between shadow-winner-glow-gold">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-[75px] bg-gold-gradient-btn text-black text-[10px] sm:text-xs uppercase font-medium tracking-wider">
                  MAIOR ECONOMIA DE JUROS
                </span>
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
              </div>

              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider">SAC</h3>
                <span className="text-xs sm:text-sm text-neutral-400 font-light block mt-0.5">(Amortização fixa)</span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm border-t border-white/15 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 text-xs sm:text-sm lg:text-base uppercase tracking-wider">Primeira Parcela:</span>
                  <FormattedBRL value={sac.firstInstallment} className="font-medium text-white text-sm sm:text-base lg:text-lg" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 text-xs sm:text-sm lg:text-base uppercase tracking-wider">Última Parcela:</span>
                  <FormattedBRL value={sac.lastInstallment} className="font-medium text-white text-sm sm:text-base lg:text-lg" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 text-xs sm:text-sm lg:text-base uppercase tracking-wider">Total de Juros:</span>
                  <FormattedBRL value={sac.totalInterest} className="font-medium text-white text-sm sm:text-base lg:text-lg" />
                </div>
                <div className="flex justify-between items-center border-t border-white/15 pt-3 font-normal">
                  <span className="text-white text-xs sm:text-sm lg:text-base font-medium uppercase tracking-wider">Total Geral Pago:</span>
                  <FormattedBRL value={sac.totalPaid} className="text-white text-base sm:text-lg lg:text-xl font-medium" animate />
                </div>
              </div>
            </div>
          </MouseGlow>

          {/* Card PRICE */}
          <MouseGlow size={140} className="p-5 sm:p-6 border border-white/15 bg-black rounded-none flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 rounded-[75px] bg-neutral-800 text-neutral-300 text-[10px] sm:text-xs uppercase font-normal tracking-wider border border-white/10">
                  PARCELA INICIAL MENOR
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-wider">PRICE</h3>
                <span className="text-xs sm:text-sm text-neutral-400 font-light block mt-0.5">(Prestação fixa)</span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm border-t border-white/15 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 text-xs sm:text-sm lg:text-base uppercase tracking-wider">Primeira Parcela:</span>
                  <FormattedBRL value={price.firstInstallment} className="font-medium text-white text-sm sm:text-base lg:text-lg" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 text-xs sm:text-sm lg:text-base uppercase tracking-wider">Última Parcela:</span>
                  <FormattedBRL value={price.lastInstallment} className="font-medium text-white text-sm sm:text-base lg:text-lg" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 text-xs sm:text-sm lg:text-base uppercase tracking-wider">Total de Juros:</span>
                  <FormattedBRL value={price.totalInterest} className="font-medium text-neutral-300 text-sm sm:text-base lg:text-lg" />
                </div>
                <div className="flex justify-between items-center border-t border-white/15 pt-3 font-normal">
                  <span className="text-white text-xs sm:text-sm lg:text-base font-medium uppercase tracking-wider">Total Geral Pago:</span>
                  <FormattedBRL value={price.totalPaid} className="text-white text-base sm:text-lg lg:text-xl font-medium" animate />
                </div>
              </div>
            </div>
          </MouseGlow>

        </div>

        {/* Footer do Modal */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="btn-ghost-pill-dark btn-lift text-xs sm:text-sm uppercase tracking-widest px-6 py-2.5 rounded-full"
          >
            Fechar Comparativo
          </button>
        </div>

      </div>
    </div>
  );
};

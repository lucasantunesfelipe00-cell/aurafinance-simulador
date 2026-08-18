'use client';

import React from 'react';
import { ComparisonResult } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { X, CheckCircle2, Award } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian-950/85 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container com Rolar Vertical em Telas Pequenas */}
      <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gold-500/30 p-4 sm:p-6 md:p-8 relative shadow-gold-glow-lg">
        
        {/* Luz decorativa */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-white bg-obsidian-850 border border-gold-500/20 hover:border-gold-400 transition-all z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Título do Modal */}
        <div className="mb-5 sm:mb-6 pr-8">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-0.5">
            <Award className="w-3.5 h-3.5" />
            <span>Matriz de Decisão Financeira</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Comparativo SAC vs PRICE</h2>
          <p className="text-[11px] sm:text-xs text-gray-400">Análise de custos e economia entre os dois sistemas de amortização</p>
        </div>

        {/* Banner de Economia */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-gold-500/20 via-gold-600/10 to-obsidian-950 border border-gold-400/40 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gold-500 text-obsidian-950 font-black text-base sm:text-lg shrink-0">
            {formatPercent(percentageSavings, 1)}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">O Sistema SAC economiza juros significativos!</h4>
            <p className="text-[11px] text-amber-200">
              Economia estimada de <FormattedBRL value={interestSavingsSAC} className="text-white font-bold text-xs sm:text-sm" /> nos {sac.termMonths} meses.
            </p>
          </div>
        </div>

        {/* Grade Lado a Lado (1 Coluna em Celulares, 2 em Desktops) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          
          {/* Card SAC */}
          <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-850/80 border-2 border-gold-400/60 shadow-gold-glow-sm relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] font-bold border border-gold-500/40">
                  RECOMENDADO PARA ECONOMIA
                </span>
                <CheckCircle2 className="w-4 h-4 text-gold-400" />
              </div>

              <h3 className="text-lg font-bold text-white mb-3">SAC (Amortização Constante)</h3>

              <div className="space-y-2.5 text-xs border-t border-gold-500/20 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[11px]">Primeira Parcela:</span>
                  <FormattedBRL value={sac.firstInstallment} className="font-bold text-white" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[11px]">Última Parcela:</span>
                  <FormattedBRL value={sac.lastInstallment} className="font-bold text-emerald-400" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[11px]">Total de Juros:</span>
                  <FormattedBRL value={sac.totalInterest} className="font-bold text-gold-400" />
                </div>
                <div className="flex justify-between items-center border-t border-obsidian-700 pt-2 font-bold">
                  <span className="text-white text-[11px]">Total Geral Pago:</span>
                  <FormattedBRL value={sac.totalPaid} className="text-white text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Card PRICE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-950/60 border border-gold-500/20 relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-obsidian-800 text-gray-400 text-[10px] font-bold border border-obsidian-700">
                  PARCELA INICIAL MENOR
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3">PRICE (Prestação Fixa)</h3>

              <div className="space-y-2.5 text-xs border-t border-gold-500/20 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[11px]">Primeira Parcela:</span>
                  <FormattedBRL value={price.firstInstallment} className="font-bold text-white" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[11px]">Última Parcela:</span>
                  <FormattedBRL value={price.lastInstallment} className="font-bold text-white" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[11px]">Total de Juros:</span>
                  <FormattedBRL value={price.totalInterest} className="font-bold text-amber-500" />
                </div>
                <div className="flex justify-between items-center border-t border-obsidian-700 pt-2 font-bold">
                  <span className="text-white text-[11px]">Total Geral Pago:</span>
                  <FormattedBRL value={price.totalPaid} className="text-white text-sm" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="btn-gold-metallic py-2 px-5 rounded-xl text-xs font-bold w-full sm:w-auto"
          >
            Fechar Comparativo
          </button>
        </div>

      </div>
    </div>
  );
};
